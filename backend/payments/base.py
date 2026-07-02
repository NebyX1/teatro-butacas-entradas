"""Interfaz base para las pasarelas de pago.

Las pasarelas concretas (MockPaymentGateway, MercadoPagoGateway) cumplen
este contrato. No se hereda obligatoriamente: alcanza con implementar
los mismos métodos con las mismas firmas.
"""
from __future__ import annotations

from abc import ABC, abstractmethod


class BasePaymentGateway(ABC):
    """Contrato mínimo de una pasarela de pago.

    Métodos:
      - create_checkout(reservation): crea la intención/checkout y devuelve
        {"provider", "providerPaymentId", "checkoutUrl", "raw"}.
      - verify_payment(payment_id): consulta el estado real del pago en la
        pasarela y devuelve {"status", "providerPaymentId", "raw"}.
      - handle_webhook(payload): procesa una notificación entrante y devuelve
        {"status", "providerPaymentId", "reservationCode", "raw"}.
    """

    @abstractmethod
    def create_checkout(self, reservation: dict) -> dict:
        raise NotImplementedError

    @abstractmethod
    def verify_payment(self, payment_id: str) -> dict:
        raise NotImplementedError

    @abstractmethod
    def handle_webhook(self, payload: dict) -> dict:
        raise NotImplementedError