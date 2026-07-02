"""Punto de entrada WSGI para el backend de Teatro Lavalleja.

Permite arrancar el backend con:

    cd backend
    python wsgi.py

El servidor de desarrollo de Flask escucha en 0.0.0.0:5000 con debug
habilitado solo cuando FLASK_ENV=development.
"""
from app import create_app
from config import Config

app = create_app()


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=Config.DEBUG,
    )