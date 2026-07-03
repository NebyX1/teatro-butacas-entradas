"""Servicio de reservas.

Encapsula la lógica de negocio: validación, cálculo de precios,
creación de checkout y aprobación/rechazo de pago. Los endpoints HTTP
llaman a estas funciones en vez de tocar la DB directamente.
"""
from __future__ import annotations

import logging
import uuid
from datetime import datetime, timedelta

from config import Config
import db
from payments import get_gateway

logger = logging.getLogger(__name__)


# ---------- validaciones ----------

def validate_create_payload(payload: dict) -> list[str]:
    """Valida el body de POST /api/reservations. Devuelve lista de errores."""
    errors: list[str] = []
    seats = payload.get("selectedSeats")
    if not isinstance(seats, list) or len(seats) == 0:
        errors.append("selectedSeats no puede estar vacío.")
        return errors
    if len(seats) > Config.MAX_SEATS:
        errors.append(f"No se pueden reservar más de {Config.MAX_SEATS} butacas.")
    for seat in seats:
        if not isinstance(seat, dict):
            errors.append("Cada butaca debe ser un objeto.")
            continue
        if not seat.get("id"):
            errors.append("Cada butaca debe tener id.")
        if not seat.get("sector"):
            errors.append("Cada butaca debe tener sector.")
        if "number" not in seat and "displayLabel" not in seat:
            errors.append("Cada butaca debe tener number o displayLabel.")

    # Validación opcional de contexto de espectáculo.
    # Si se envía show/performance, validamos campos mínimos. Si no se
    # envía, no bloqueamos la reserva (compatibilidad con flujos legacy).
    show = payload.get("show")
    if show is not None:
        if not isinstance(show, dict) or not show.get("id") or not show.get("title"):
            errors.append("show debe incluir al menos id y title.")
    performance = payload.get("performance")
    if performance is not None:
        if not isinstance(performance, dict) or not performance.get("id"):
            errors.append("performance debe incluir al menos id.")
    return errors


def validate_customer_payload(payload: dict) -> list[str]:
    """Valida el body de PATCH /api/reservations/<id>/customer."""
    errors: list[str] = []
    if not payload.get("firstName", "").strip():
        errors.append("firstName es obligatorio.")
    if not payload.get("lastName", "").strip():
        errors.append("lastName es obligatorio.")
    if not payload.get("documentNumber", "").strip():
        errors.append("documentNumber es obligatorio.")
    email = payload.get("email", "").strip()
    if not email:
        errors.append("email es obligatorio.")
    elif "@" not in email or "." not in email.split("@")[-1]:
        errors.append("email no tiene un formato válido.")
    return errors


# ---------- precios ----------
#
# El backend es la única fuente de verdad para los precios. El frontend
# puede enviar un `price` estimado al crear la reserva, pero se ignora:
# `get_seat_price` siempre resuelve el precio configurado por sector,
# salvo butacas de autoridad de Palco B (gratuitas por diseño).


def format_currency_uyu(amount: int) -> str:
    """Formatea un monto en pesos uruguayos: "$ 1.200"."""
    return f"$ {int(amount):,}".replace(",", ".")


def _is_authority_seat(seat: dict) -> bool:
    """Detecta butacas de autoridad de Palco B (gratuitas) por su etiqueta."""
    if seat.get("sector") != "palco_b":
        return False
    display_label = (seat.get("displayLabel") or "").lower()
    return "autoridad" in display_label


def get_seat_price(seat: dict) -> int:
    """Precio autoritativo de una butaca, según su sector.

    El backend nunca confía en el `price` que venga del cliente: siempre
    resuelve el valor configurado en `Config.SEAT_PRICES`. La única
    excepción son las butacas de autoridad de Palco B, que son gratuitas
    por diseño y devuelven 0.
    """
    if _is_authority_seat(seat):
        return 0
    sector = seat.get("sector", "")
    return int(Config.SEAT_PRICES.get(sector, 0))


def normalize_seats_pricing(seats: list[dict]) -> list[dict]:
    """Devuelve una copia de `seats` con `price` fijado al valor autoritativo.

    Se llama al crear la reserva para que `selectedSeats` quede persistido
    con el precio real de cada butaca, sin importar qué haya mandado el
    frontend.
    """
    normalized = []
    for seat in seats:
        seat_copy = dict(seat)
        seat_copy["price"] = get_seat_price(seat)
        normalized.append(seat_copy)
    return normalized


def calculate_totals(seats: list[dict]) -> dict:
    """Calcula subtotal, service fee y total a partir de las butacas.

    Asume que `seats` ya viene normalizado por `normalize_seats_pricing`,
    pero igualmente resuelve el precio autoritativo por las dudas.
    """
    subtotal = sum(
        seat["price"] if isinstance(seat.get("price"), (int, float))
        else get_seat_price(seat)
        for seat in seats
    )
    subtotal = int(subtotal)
    service_fee = round(subtotal * Config.SERVICE_FEE_RATE)
    total = subtotal + service_fee
    return {"subtotal": subtotal, "serviceFee": service_fee, "total": total}


def get_reservation_seat_price(reservation: dict, seat_id: str) -> int:
    """Precio autoritativo de una butaca dentro de una reserva ya creada.

    Busca la butaca en `reservation.selectedSeats` por id y devuelve su
    precio persistido (ya normalizado al crear la reserva). Si por algún
    motivo no está presente, recalcula con `get_seat_price`. Nunca
    devuelve un fallback ajeno a la reserva.
    """
    for seat in reservation.get("selectedSeats", []) or []:
        if seat.get("id") == seat_id:
            price = seat.get("price")
            if isinstance(price, (int, float)) and (price > 0 or _is_authority_seat(seat)):
                return int(price)
            return get_seat_price(seat)
    return 0


def get_ticket_price(reservation: dict, ticket: dict) -> dict:
    """Determina el precio correcto de la butaca de un ticket.

    Prioridad:
      1. Precio de la butaca correspondiente en `reservation.selectedSeats`
         (matcheando por id) — la fuente autoritativa persistida.
      2. `price` dentro de `ticket.seat` (snapshot guardado al emitir el
         ticket), por si el ticket es más nuevo que la normalización.
      3. Precio configurado por sector (`get_seat_price`).

    Nunca devuelve un fallback hardcodeado ajeno a la reserva. Solo las
    butacas de autoridad de Palco B pueden mostrar $0, y se marcan
    explícitamente como tales.
    """
    ticket_seat = ticket.get("seat", {}) or {}
    seat_id = ticket_seat.get("id")

    amount = get_reservation_seat_price(reservation, seat_id) if seat_id else 0
    if amount <= 0 and not _is_authority_seat(ticket_seat):
        amount = get_seat_price(ticket_seat)

    is_authority = _is_authority_seat(ticket_seat)
    is_free_authority = is_authority and amount <= 0

    return {
        "amount": int(amount),
        "isAuthority": is_free_authority,
        "formatted": (
            "Butaca de autoridad" if is_free_authority else format_currency_uyu(amount)
        ),
    }


def get_ticket_final_price(reservation: dict, ticket: dict) -> dict:
    """Calcula el precio final de un ticket, incluyendo su porción
    proporcional del cargo por servicio de la reserva.

    Regla:
      - Si la reserva tiene 1 sola butaca, el ticket debe reflejar el total
        de la reserva (base + 100% del cargo por servicio).
      - Si tiene varias butacas, el cargo por servicio se reparte en
        proporción al precio base de cada butaca respecto del subtotal
        (no en partes iguales, salvo que todas las butacas valgan igual).
      - Las butacas de autoridad (gratuitas) nunca llevan cargo por
        servicio y se marcan explícitamente.

    Devuelve: basePrice, serviceFeeShare, finalPrice, isAuthority,
    finalLabel (string listo para mostrar en el PDF).
    """
    ticket_seat = ticket.get("seat", {}) or {}
    seat_id = ticket_seat.get("id")
    is_authority = _is_authority_seat(ticket_seat)

    if is_authority:
        return {
            "basePrice": 0,
            "serviceFeeShare": 0,
            "finalPrice": 0,
            "isAuthority": True,
            "finalLabel": "Butaca de autoridad",
        }

    base_price = get_reservation_seat_price(reservation, seat_id) if seat_id else 0
    if base_price <= 0:
        base_price = get_seat_price(ticket_seat)

    seats = reservation.get("selectedSeats", []) or []
    subtotal = reservation.get("subtotal")
    if not isinstance(subtotal, (int, float)) or subtotal <= 0:
        subtotal = sum(
            get_reservation_seat_price(reservation, s.get("id")) for s in seats
        )
    service_fee = reservation.get("serviceFee", 0) or 0

    if subtotal > 0 and base_price > 0:
        service_fee_share = round(service_fee * (base_price / subtotal))
    else:
        service_fee_share = 0

    final_price = int(base_price) + int(service_fee_share)

    return {
        "basePrice": int(base_price),
        "serviceFeeShare": int(service_fee_share),
        "finalPrice": final_price,
        "isAuthority": False,
        "finalLabel": format_currency_uyu(final_price),
    }


# ---------- creación ----------

def generate_reservation_code() -> str:
    """Genera un código legible tipo TL-2026-XXXXXX."""
    year = datetime.utcnow().year
    chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    suffix = "".join(chars[(uuid.uuid4().int >> (i * 5)) % len(chars)] for i in range(6))
    return f"TL-{year}-{suffix}"


def create_reservation(payload: dict) -> dict:
    """Crea una reserva temporal con status 'held'."""
    raw_seats = payload.get("selectedSeats", [])
    seats = normalize_seats_pricing(raw_seats)
    customer = payload.get("customer", {}) or {}
    totals = calculate_totals(seats)

    # Snapshot inmutable del espectáculo y la función seleccionada.
    # Se almacena como JSON para no depender de tablas externas de shows.
    show = payload.get("show") or {}
    performance = payload.get("performance") or {}

    now = datetime.utcnow()
    expires_at = now + timedelta(minutes=Config.RESERVATION_HOLD_MINUTES)

    reservation = {
        "id": str(uuid.uuid4()),
        "code": generate_reservation_code(),
        "status": "held",
        "customer": customer,
        "selectedSeats": seats,
        "subtotal": totals["subtotal"],
        "serviceFee": totals["serviceFee"],
        "total": totals["total"],
        "paymentProvider": None,
        "paymentId": None,
        "checkoutUrl": None,
        "createdAt": now.isoformat() + "Z",
        "expiresAt": expires_at.isoformat() + "Z",
        "paidAt": None,
        "show": show,
        "performance": performance,
    }
    db.insert_reservation(reservation)

    logger.debug(
        "Reserva creada: code=%s seats=%s subtotal=%s serviceFee=%s total=%s",
        reservation["code"],
        [(s.get("id"), s.get("sector"), s.get("price")) for s in seats],
        totals["subtotal"],
        totals["serviceFee"],
        totals["total"],
    )

    return reservation


def update_customer(reservation_id: str, customer: dict) -> dict | None:
    """Actualiza los datos del comprador de una reserva."""
    reservation = db.get_reservation(reservation_id)
    if not reservation:
        return None
    db.update_reservation(reservation_id, {"customer_json": customer})
    reservation["customer"] = customer
    return reservation


# ---------- checkout ----------

def create_checkout(reservation_id: str) -> dict:
    """Crea el checkout con la pasarela configurada."""
    reservation = db.get_reservation(reservation_id)
    if not reservation:
        return {"error": "Reserva no encontrada.", "status": 404}

    gateway = get_gateway()
    result = gateway.create_checkout(reservation)

    db.update_reservation(reservation_id, {
        "status": "payment_pending",
        "payment_provider": result["provider"],
        "payment_id": result["providerPaymentId"],
        "checkout_url": result["checkoutUrl"],
    })

    # Registramos un payment pendiente.
    db.insert_payment({
        "id": str(uuid.uuid4()),
        "reservationId": reservation_id,
        "provider": result["provider"],
        "providerPaymentId": result["providerPaymentId"],
        "status": "pending",
        "rawPayload": result.get("raw", {}),
        "createdAt": db.now_iso(),
    })

    return {
        "reservationId": reservation_id,
        "reservationCode": reservation["code"],
        "checkoutUrl": result["checkoutUrl"],
        "provider": result["provider"],
    }


# ---------- aprobación / rechazo (mock + webhook) ----------

def approve_payment(reservation_id: str, provider_payment_id: str | None = None) -> dict:
    """Marca el pago como aprobado, la reserva como paid y emite tickets."""
    from services.tickets import issue_tickets

    reservation = db.get_reservation(reservation_id)
    if not reservation:
        return {"error": "Reserva no encontrada.", "status": 404}

    db.update_reservation(reservation_id, {
        "status": "paid",
        "paid_at": db.now_iso(),
        "payment_id": provider_payment_id or reservation.get("paymentId"),
    })

    # Actualizamos el último payment pendiente a approved.
    payments = db.list_payments_by_reservation(reservation_id)
    if payments:
        db.insert_payment({
            "id": str(uuid.uuid4()),
            "reservationId": reservation_id,
            "provider": reservation.get("paymentProvider") or "mock",
            "providerPaymentId": provider_payment_id or reservation.get("paymentId"),
            "status": "approved",
            "rawPayload": {"source": "approve_payment"},
            "createdAt": db.now_iso(),
        })

    tickets = issue_tickets(reservation_id)
    db.update_reservation(reservation_id, {"status": "ticket_issued"})
    return {"reservation": db.get_reservation(reservation_id), "tickets": tickets}


def reject_payment(reservation_id: str, provider_payment_id: str | None = None) -> dict:
    """Marca el pago como rechazado y la reserva como payment_failed."""
    reservation = db.get_reservation(reservation_id)
    if not reservation:
        return {"error": "Reserva no encontrada.", "status": 404}

    db.update_reservation(reservation_id, {
        "status": "payment_failed",
        "payment_id": provider_payment_id or reservation.get("paymentId"),
    })
    db.insert_payment({
        "id": str(uuid.uuid4()),
        "reservationId": reservation_id,
        "provider": reservation.get("paymentProvider") or "mock",
        "providerPaymentId": provider_payment_id or reservation.get("paymentId"),
        "status": "rejected",
        "rawPayload": {"source": "reject_payment"},
        "createdAt": db.now_iso(),
    })
    return {"reservation": db.get_reservation(reservation_id)}


def handle_mercadopago_webhook(payload: dict) -> dict:
    """Procesa webhook de Mercado Pago. Verifica antes de aprobar."""
    gateway = get_gateway("mercadopago")
    try:
        result = gateway.handle_webhook(payload)
    except RuntimeError:
        # Sin credenciales: no podemos verificar. Registramos y devolvemos.
        return {"status": "pending", "raw": payload}

    status = result["status"]
    reservation_code = result.get("reservationCode")
    reservation = None
    if reservation_code:
        reservation = db.get_reservation_by_code(reservation_code)
    if not reservation:
        return {"status": "pending", "raw": result.get("raw", {})}

    if status == "approved":
        approve_payment(reservation["id"], result.get("providerPaymentId"))
    elif status in ("rejected", "failed"):
        reject_payment(reservation["id"], result.get("providerPaymentId"))

    return {"status": status, "reservationId": reservation["id"]}