"""Pasarela de pago simulada para desarrollo local.

No llama a ningún servicio externo. Genera una URL de checkout que apunta
a la página de demo del frontend y permite aprobar/rechazar manualmente.
"""
from __future__ import annotations

import uuid

from config import Config
from payments.base import BasePaymentGateway


class MockPaymentGateway(BasePaymentGateway):
    """Pasarela local de demostración."""

    provider = "mock"

    def create_checkout(self, reservation: dict) -> dict:
        """Crea un checkout simulado.

        La URL apunta a la página de demo de pago del frontend, pasando el
        reservationId como query string. El "payment_id" es un UUID local.
        """
        payment_id = f"mock-{uuid.uuid4().hex[:12]}"
        checkout_url = (
            f"{Config.FRONTEND_BASE_URL.rstrip('/')}"
            f"/reserva/demo-pago?reservationId={reservation['id']}"
        )
        return {
            "provider": self.provider,
            "providerPaymentId": payment_id,
            "checkoutUrl": checkout_url,
            "raw": {"simulated": True},
        }

    def verify_payment(self, payment_id: str) -> dict:
        """En modo mock, la verificación siempre devuelve pending hasta que
        el frontend llama explícitamente a /api/payments/mock/approve|reject.
        """
        return {
            "status": "pending",
            "providerPaymentId": payment_id,
            "raw": {"simulated": True},
        }

    def handle_webhook(self, payload: dict) -> dict:
        """El mock no recibe webhooks reales; devolvemos pending."""
        return {
            "status": "pending",
            "providerPaymentId": payload.get("payment_id"),
            "reservationCode": payload.get("external_reference"),
            "raw": payload,
        }