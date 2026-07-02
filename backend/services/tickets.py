"""Servicio de emisión de tickets.

Solo se emiten tickets después de que el pago fue aprobado por el backend
(mock approve endpoint o verificación de Mercado Pago). El frontend no
puede emitir tickets directamente.
"""
from __future__ import annotations

import uuid

import db


def _short_random() -> str:
    return uuid.uuid4().hex[:6].upper()


def issue_tickets(reservation_id: str) -> list[dict]:
    """Crea un ticket por cada butaca de la reserva y los persiste."""
    reservation = db.get_reservation(reservation_id)
    if not reservation:
        return []

    # Si ya existen tickets para esta reserva, no duplicamos.
    existing = db.list_tickets_by_reservation(reservation_id)
    if existing:
        return existing

    code = reservation["code"]
    seats = reservation.get("selectedSeats", [])
    now = db.now_iso()
    tickets: list[dict] = []
    for seat in seats:
        ticket = {
            "id": str(uuid.uuid4()),
            "reservationId": reservation_id,
            "ticketCode": f"TKT-{code}-{_short_random()}",
            "seat": seat,
            "createdAt": now,
        }
        tickets.append(ticket)

    if tickets:
        db.insert_tickets(tickets)

    return db.list_tickets_by_reservation(reservation_id)