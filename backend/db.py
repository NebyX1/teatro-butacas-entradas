"""Capa de persistencia mínima con sqlite3 puro.

No usa ORM. Las tablas se crean automáticamente al arrancar la app.
Las funciones devuelven dicts/listas para que los servicios y la API
trabajen con tipos simples y serializables a JSON.
"""
import json
import os
import sqlite3
from datetime import datetime
from typing import Any, Iterable

from config import Config


def _connect() -> sqlite3.Connection:
    os.makedirs(os.path.dirname(Config.DB_PATH), exist_ok=True)
    conn = sqlite3.connect(Config.DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


SCHEMA = """
CREATE TABLE IF NOT EXISTS reservations (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL,
    customer_json TEXT NOT NULL DEFAULT '{}',
    selected_seats_json TEXT NOT NULL DEFAULT '[]',
    subtotal INTEGER NOT NULL DEFAULT 0,
    service_fee INTEGER NOT NULL DEFAULT 0,
    total INTEGER NOT NULL DEFAULT 0,
    payment_provider TEXT,
    payment_id TEXT,
    checkout_url TEXT,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    paid_at TEXT
);

CREATE TABLE IF NOT EXISTS tickets (
    id TEXT PRIMARY KEY,
    reservation_id TEXT NOT NULL,
    ticket_code TEXT UNIQUE NOT NULL,
    seat_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id)
);

CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    reservation_id TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_payment_id TEXT,
    status TEXT NOT NULL,
    raw_payload_json TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id)
);
"""


def init_db() -> None:
    """Crea las tablas si no existen. Idempotente."""
    conn = _connect()
    try:
        conn.executescript(SCHEMA)
        conn.commit()
    finally:
        conn.close()


# ---------- helpers ----------

def _now_iso() -> str:
    return datetime.utcnow().isoformat() + "Z"


def _parse_json(raw: str | None, default: Any) -> Any:
    if not raw:
        return default
    try:
        return json.loads(raw)
    except (TypeError, ValueError):
        return default


def _row_to_reservation(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "code": row["code"],
        "status": row["status"],
        "customer": _parse_json(row["customer_json"], {}),
        "selectedSeats": _parse_json(row["selected_seats_json"], []),
        "subtotal": row["subtotal"],
        "serviceFee": row["service_fee"],
        "total": row["total"],
        "paymentProvider": row["payment_provider"],
        "paymentId": row["payment_id"],
        "checkoutUrl": row["checkout_url"],
        "createdAt": row["created_at"],
        "expiresAt": row["expires_at"],
        "paidAt": row["paid_at"],
    }


def _row_to_ticket(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "reservationId": row["reservation_id"],
        "ticketCode": row["ticket_code"],
        "seat": _parse_json(row["seat_json"], {}),
        "createdAt": row["created_at"],
    }


def _row_to_payment(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "reservationId": row["reservation_id"],
        "provider": row["provider"],
        "providerPaymentId": row["provider_payment_id"],
        "status": row["status"],
        "rawPayload": _parse_json(row["raw_payload_json"], {}),
        "createdAt": row["created_at"],
    }


# ---------- reservations ----------

def insert_reservation(reservation: dict) -> None:
    conn = _connect()
    try:
        conn.execute(
            """
            INSERT INTO reservations (
                id, code, status, customer_json, selected_seats_json,
                subtotal, service_fee, total, payment_provider, payment_id,
                checkout_url, created_at, expires_at, paid_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                reservation["id"],
                reservation["code"],
                reservation["status"],
                json.dumps(reservation.get("customer", {}), ensure_ascii=False),
                json.dumps(reservation.get("selectedSeats", []), ensure_ascii=False),
                reservation.get("subtotal", 0),
                reservation.get("serviceFee", 0),
                reservation.get("total", 0),
                reservation.get("paymentProvider"),
                reservation.get("paymentId"),
                reservation.get("checkoutUrl"),
                reservation["createdAt"],
                reservation["expiresAt"],
                reservation.get("paidAt"),
            ),
        )
        conn.commit()
    finally:
        conn.close()


def update_reservation(reservation_id: str, fields: dict) -> None:
    """Actualiza campos sueltos de una reserva. Solo columnas conocidas."""
    allowed = {
        "status": "status",
        "customer_json": "customer_json",
        "selected_seats_json": "selected_seats_json",
        "subtotal": "subtotal",
        "service_fee": "service_fee",
        "total": "total",
        "payment_provider": "payment_provider",
        "payment_id": "payment_id",
        "checkout_url": "checkout_url",
        "paid_at": "paid_at",
    }
    sets = []
    values: list[Any] = []
    for key, value in fields.items():
        col = allowed.get(key)
        if not col:
            continue
        if key in ("customer_json", "selected_seats_json"):
            value = json.dumps(value, ensure_ascii=False)
        sets.append(f"{col} = ?")
        values.append(value)

    if not sets:
        return

    values.append(reservation_id)
    conn = _connect()
    try:
        conn.execute(
            f"UPDATE reservations SET {', '.join(sets)} WHERE id = ?",
            values,
        )
        conn.commit()
    finally:
        conn.close()


def get_reservation(reservation_id: str) -> dict | None:
    conn = _connect()
    try:
        row = conn.execute(
            "SELECT * FROM reservations WHERE id = ?", (reservation_id,)
        ).fetchone()
        return _row_to_reservation(row) if row else None
    finally:
        conn.close()


def get_reservation_by_code(code: str) -> dict | None:
    conn = _connect()
    try:
        row = conn.execute(
            "SELECT * FROM reservations WHERE code = ?", (code,)
        ).fetchone()
        return _row_to_reservation(row) if row else None
    finally:
        conn.close()


# ---------- tickets ----------

def insert_ticket(ticket: dict) -> None:
    conn = _connect()
    try:
        conn.execute(
            """
            INSERT INTO tickets (id, reservation_id, ticket_code, seat_json, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                ticket["id"],
                ticket["reservationId"],
                ticket["ticketCode"],
                json.dumps(ticket.get("seat", {}), ensure_ascii=False),
                ticket["createdAt"],
            ),
        )
        conn.commit()
    finally:
        conn.close()


def insert_tickets(tickets: Iterable[dict]) -> None:
    conn = _connect()
    try:
        conn.executemany(
            """
            INSERT INTO tickets (id, reservation_id, ticket_code, seat_json, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            [
                (
                    t["id"],
                    t["reservationId"],
                    t["ticketCode"],
                    json.dumps(t.get("seat", {}), ensure_ascii=False),
                    t["createdAt"],
                )
                for t in tickets
            ],
        )
        conn.commit()
    finally:
        conn.close()


def list_tickets_by_reservation(reservation_id: str) -> list[dict]:
    conn = _connect()
    try:
        rows = conn.execute(
            "SELECT * FROM tickets WHERE reservation_id = ? ORDER BY created_at ASC",
            (reservation_id,),
        ).fetchall()
        return [_row_to_ticket(r) for r in rows]
    finally:
        conn.close()


def get_ticket_by_code(ticket_code: str) -> dict | None:
    """Busca un ticket por su código único (para validación por QR)."""
    conn = _connect()
    try:
        row = conn.execute(
            "SELECT * FROM tickets WHERE ticket_code = ?", (ticket_code,)
        ).fetchone()
        return _row_to_ticket(row) if row else None
    finally:
        conn.close()


# ---------- payments ----------

def insert_payment(payment: dict) -> None:
    conn = _connect()
    try:
        conn.execute(
            """
            INSERT INTO payments (id, reservation_id, provider, provider_payment_id, status, raw_payload_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                payment["id"],
                payment["reservationId"],
                payment["provider"],
                payment.get("providerPaymentId"),
                payment["status"],
                json.dumps(payment.get("rawPayload", {}), ensure_ascii=False),
                payment["createdAt"],
            ),
        )
        conn.commit()
    finally:
        conn.close()


def list_payments_by_reservation(reservation_id: str) -> list[dict]:
    conn = _connect()
    try:
        rows = conn.execute(
            "SELECT * FROM payments WHERE reservation_id = ? ORDER BY created_at DESC",
            (reservation_id,),
        ).fetchall()
        return [_row_to_payment(r) for r in rows]
    finally:
        conn.close()


def now_iso() -> str:
    """Re-export para que los servicios no importen datetime directamente."""
    return _now_iso()