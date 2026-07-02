"""Servicio de reservas.

Encapsula la lógica de negocio: validación, cálculo de precios,
creación de checkout y aprobación/rechazo de pago. Los endpoints HTTP
llaman a estas funciones en vez de tocar la DB directamente.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timedelta
from typing import Any

from config import Config
import db
from payments import get_gateway


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

def calculate_totals(seats: list[dict]) -> dict:
    """Calcula subtotal, service fee y total a partir de las butacas.

    El backend es la fuente de verdad: usa Config.SEAT_PRICES por sector
    salvo que la butaca traiga `price` explícito (y se respeta).
    """
    subtotal = 0
    for seat in seats:
        sector = seat.get("sector", "")
        price = seat.get("price")
        if not isinstance(price, (int, float)) or price <= 0:
            price = Config.SEAT_PRICES.get(sector, 0)
        subtotal += int(price)
    service_fee = round(subtotal * Config.SERVICE_FEE_RATE)
    total = subtotal + service_fee
    return {"subtotal": subtotal, "serviceFee": service_fee, "total": total}


# ---------- creación ----------

def generate_reservation_code() -> str:
    """Genera un código legible tipo TL-2026-XXXXXX."""
    year = datetime.utcnow().year
    chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    suffix = "".join(chars[(uuid.uuid4().int >> (i * 5)) % len(chars)] for i in range(6))
    return f"TL-{year}-{suffix}"


def create_reservation(payload: dict) -> dict:
    """Crea una reserva temporal con status 'held'."""
    seats = payload.get("selectedSeats", [])
    customer = payload.get("customer", {}) or {}
    totals = calculate_totals(seats)

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
    }
    db.insert_reservation(reservation)
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