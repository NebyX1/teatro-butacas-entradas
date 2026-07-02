"""Paquete de pasarelas de pago.

Expone una fábrica `get_gateway(provider)` que devuelve la instancia
adecuada según la configuración. Las pasarelas implementan la interfaz
definida en `payments/base.py`.
"""
from __future__ import annotations

from typing import Protocol

from config import Config


class PaymentGateway(Protocol):
    """Interfaz conceptual que implementan MockPaymentGateway y
    MercadoPagoGateway. No se hereda obligatoriamente, pero ambas clases
    cumplen este contrato para que sean intercambiables."""

    def create_checkout(self, reservation: dict) -> dict: ...
    def verify_payment(self, payment_id: str) -> dict: ...
    def handle_webhook(self, payload: dict) -> dict: ...


def get_gateway(provider: str | None = None) -> PaymentGateway:
    """Devuelve la pasarela configurada. Por defecto usa Config.PAYMENT_PROVIDER."""
    from payments.mock_gateway import MockPaymentGateway
    from payments.mercadopago_gateway import MercadoPagoGateway

    name = (provider or Config.PAYMENT_PROVIDER or "mock").lower()
    if name == "mercadopago":
        return MercadoPagoGateway()
    return MockPaymentGateway()