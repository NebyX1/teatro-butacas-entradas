"""Configuración central del backend.

Lee variables de entorno con python-dotenv y expone settings simples.
No hay arquitectura pesada: solo constantes listas para usar en app.py.
"""
import os
from dotenv import load_dotenv

load_dotenv()


def _env(name: str, default: str = "") -> str:
    return os.environ.get(name, default)


def _env_int(name: str, default: int) -> int:
    try:
        return int(_env(name, str(default)))
    except (TypeError, ValueError):
        return default


class Config:
    FLASK_ENV = _env("FLASK_ENV", "development")
    SECRET_KEY = _env("SECRET_KEY", "dev-secret-change-me")
    DEBUG = FLASK_ENV == "development"

    FRONTEND_BASE_URL = _env("FRONTEND_BASE_URL", "http://localhost:5173")
    BACKEND_BASE_URL = _env("BACKEND_BASE_URL", "http://localhost:5000")

    # mock | mercadopago
    PAYMENT_PROVIDER = _env("PAYMENT_PROVIDER", "mock")

    MERCADOPAGO_ACCESS_TOKEN = _env("MERCADOPAGO_ACCESS_TOKEN", "")
    MERCADOPAGO_PUBLIC_KEY = _env("MERCADOPAGO_PUBLIC_KEY", "")

    RESERVATION_HOLD_MINUTES = _env_int("RESERVATION_HOLD_MINUTES", 15)

    # SQLite local. Se crea dentro de backend/storage/.
    DB_PATH = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "storage",
        "reservations.sqlite3",
    )

    # Precios por sector (backend es fuente de verdad).
    SEAT_PRICES = {
        "platea": 500,
        "palco_a": 700,
        "palco_b": 700,
        "palco_c": 650,
    }
    SERVICE_FEE_RATE = 0.05
    MAX_SEATS = 8