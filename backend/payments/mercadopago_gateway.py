"""Pasarela Mercado Pago (Checkout Pro) en modo test/sandbox.

Usa el SDK oficial de mercadopago. Si no hay access token configurado,
lanza un error claro para que el frontend muestre el mensaje adecuado.
No expone el access token al frontend: toda la interacción con la API
de Mercado Pago ocurre acá.
"""
from __future__ import annotations

from config import Config
from payments.base import BasePaymentGateway


class MercadoPagoGateway(BasePaymentGateway):
    """Integración mínima con Mercado Pago Checkout Pro (sandbox)."""

    provider = "mercadopago"

    def __init__(self) -> None:
        self._sdk = None
        if Config.MERCADOPAGO_ACCESS_TOKEN:
            try:
                import mercadopago  # type: ignore
                self._sdk = mercadopago.SDK(Config.MERCADOPAGO_ACCESS_TOKEN)
            except Exception:  # pragma: no cover - SDK ausente
                self._sdk = None

    def _ensure_credentials(self) -> None:
        if not Config.MERCADOPAGO_ACCESS_TOKEN or self._sdk is None:
            raise RuntimeError(
                "Mercado Pago credentials are missing. Use PAYMENT_PROVIDER=mock "
                "or configure MERCADOPAGO_ACCESS_TOKEN."
            )

    def create_checkout(self, reservation: dict) -> dict:
        """Crea una preferencia de Checkout Pro y devuelve el init_point."""
        self._ensure_credentials()

        seats = reservation.get("selectedSeats", [])
        total = reservation.get("total", 0)
        title = f"Reserva Teatro Lavalleja · {len(seats)} butaca(s)"
        description = "; ".join(
            seat.get("displayLabel", seat.get("id", "")) for seat in seats
        )[:250]

        preference_data = {
            "items": [
                {
                    "title": title,
                    "description": description,
                    "quantity": 1,
                    "currency_id": "UYU",
                    "unit_price": float(total),
                }
            ],
            "external_reference": reservation.get("code") or reservation["id"],
            "back_urls": {
                "success": f"{Config.FRONTEND_BASE_URL.rstrip('/')}/reserva/pago/success?reservationId={reservation['id']}",
                "pending": f"{Config.FRONTEND_BASE_URL.rstrip('/')}/reserva/pago/pending?reservationId={reservation['id']}",
                "failure": f"{Config.FRONTEND_BASE_URL.rstrip('/')}/reserva/pago/failure?reservationId={reservation['id']}",
            },
            "notification_url": f"{Config.BACKEND_BASE_URL.rstrip('/')}/api/payments/webhook/mercadopago",
            "auto_return": "approved",
        }

        response = self._sdk.preference().create(preference_data)
        raw = response.get("response", {}) if isinstance(response, dict) else {}

        # En sandbox se usa sandbox_init_point; en producción init_point.
        checkout_url = raw.get("sandbox_init_point") or raw.get("init_point", "")
        provider_payment_id = str(raw.get("id", ""))

        return {
            "provider": self.provider,
            "providerPaymentId": provider_payment_id,
            "checkoutUrl": checkout_url,
            "raw": raw,
        }

    def verify_payment(self, payment_id: str) -> dict:
        """Consulta el estado de un pago en Mercado Pago."""
        self._ensure_credentials()
        response = self._sdk.payment().get(payment_id)
        raw = response.get("response", {}) if isinstance(response, dict) else {}
        status = str(raw.get("status", "")).lower()
        # Mapeo simple de estados de Mercado Pago a los nuestros.
        mapped = {
            "approved": "approved",
            "authorized": "approved",
            "pending": "pending",
            "in_process": "pending",
            "in_mediation": "pending",
            "rejected": "rejected",
            "cancelled": "failed",
            "refunded": "failed",
        }.get(status, "pending")
        return {
            "status": mapped,
            "providerPaymentId": str(raw.get("id", payment_id)),
            "raw": raw,
        }

    def handle_webhook(self, payload: dict) -> dict:
        """Procesa una notificación webhook de Mercado Pago.

        Mercado Pago envía {"type": "payment", "data": {"id": "12345"}}.
        Extraemos el id y verificamos el pago real antes de aprobar nada.
        """
        self._ensure_credentials()
        data = payload.get("data", {}) if isinstance(payload, dict) else {}
        payment_id = str(data.get("id", "") or payload.get("payment_id", ""))
        if not payment_id:
            return {
                "status": "pending",
                "providerPaymentId": "",
                "reservationCode": payload.get("external_reference"),
                "raw": payload,
            }
        verification = self.verify_payment(payment_id)
        return {
            "status": verification["status"],
            "providerPaymentId": verification["providerPaymentId"],
            "reservationCode": payload.get("external_reference"),
            "raw": verification["raw"],
        }