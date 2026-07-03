"""Aplicación Flask del backend de reservas del Teatro Lavalleja.

Endpoints:
  GET  /api/health
  POST /api/reservations
  PATCH /api/reservations/<id>/customer
  GET  /api/reservations/<id>
  POST /api/reservations/<id>/checkout
  POST /api/payments/mock/approve
  POST /api/payments/mock/reject
  POST /api/payments/webhook/mercadopago

Arranque:
  cd backend
  python -m venv .venv
  .venv\\Scripts\\activate        # Windows
  source .venv/bin/activate       # Linux/macOS
  pip install -r requirements.txt
  python app.py
"""
from __future__ import annotations

from flask import Flask, Response, jsonify, request
from flask_cors import CORS

import db
from config import Config
from services import reservations as reservations_service
from services import ticket_pdf as ticket_pdf_service


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    # CORS configurado para desarrollo (y listo para producción).
    # Permite el origen del frontend, todos los métodos de API, y expone
    # Content-Disposition para que el frontend pueda leer el nombre del PDF.
    CORS(
        app,
        resources={r"/api/*": {"origins": [Config.FRONTEND_BASE_URL]}},
        methods=["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
        expose_headers=["Content-Disposition", "Content-Type", "Content-Length"],
        supports_credentials=False,
        max_age=3600,
    )

    # Aseguramos que la DB y las tablas existan antes de atender requests.
    db.init_db()

    # Hook global: garantiza que toda respuesta /api/* incluya las cabeceras
    # CORS necesarias, incluso si flask-cors no las setea en algún caso
    # límite (respuestas de error, preflight manual, etc.).
    @app.after_request
    def _ensure_cors_headers(response: Response):
        origin = request.headers.get("Origin")
        if origin and origin == Config.FRONTEND_BASE_URL:
            response.headers.setdefault("Access-Control-Allow-Origin", origin)
            response.headers.setdefault(
                "Access-Control-Allow-Methods",
                "GET, POST, PATCH, PUT, DELETE, OPTIONS",
            )
            response.headers.setdefault(
                "Access-Control-Allow-Headers",
                "Content-Type, Authorization, X-Requested-With",
            )
            response.headers.setdefault(
                "Access-Control-Expose-Headers",
                "Content-Disposition, Content-Type, Content-Length",
            )
            response.headers.setdefault("Vary", "Origin")
        return response

    # Respuesta explícita para preflight OPTIONS en todas las rutas /api/.
    # flask-cors normalmente las intercepta, pero esto garantiza que no
    # queden colgadas si algo falla.
    @app.route("/api/<path:rest>", methods=["OPTIONS"])
    def api_preflight(rest: str):
        return Response(status=204)

    # ---------- health ----------
    @app.get("/api/health")
    def health():
        return jsonify({"ok": True, "service": "theater-reservation-backend"})

    # ---------- crear reserva ----------
    @app.post("/api/reservations")
    def create_reservation():
        payload = request.get_json(silent=True) or {}
        errors = reservations_service.validate_create_payload(payload)
        if errors:
            return jsonify({"errors": errors}), 400

        reservation = reservations_service.create_reservation(payload)
        return jsonify({
            "reservationId": reservation["id"],
            "reservationCode": reservation["code"],
            "status": reservation["status"],
            "expiresAt": reservation["expiresAt"],
            "total": reservation["total"],
            "subtotal": reservation["subtotal"],
            "serviceFee": reservation["serviceFee"],
            "selectedSeats": reservation["selectedSeats"],
        }), 201

    # ---------- actualizar cliente ----------
    @app.patch("/api/reservations/<reservation_id>/customer")
    def update_customer(reservation_id: str):
        payload = request.get_json(silent=True) or {}
        errors = reservations_service.validate_customer_payload(payload)
        if errors:
            return jsonify({"errors": errors}), 400

        reservation = reservations_service.update_customer(reservation_id, payload)
        if not reservation:
            return jsonify({"error": "Reserva no encontrada."}), 404
        return jsonify(_summarize_reservation(reservation))

    # ---------- obtener reserva ----------
    @app.get("/api/reservations/<reservation_id>")
    def get_reservation(reservation_id: str):
        reservation = db.get_reservation(reservation_id)
        if not reservation:
            return jsonify({"error": "Reserva no encontrada."}), 404
        tickets = db.list_tickets_by_reservation(reservation_id)
        return jsonify(_summarize_reservation(reservation, tickets))

    # ---------- checkout ----------
    @app.post("/api/reservations/<reservation_id>/checkout")
    def create_checkout(reservation_id: str):
        result = reservations_service.create_checkout(reservation_id)
        if result.get("status") == 404:
            return jsonify({"error": result["error"]}), 404
        if result.get("error"):
            return jsonify({"error": result["error"]}), 400
        return jsonify(result)

    # ---------- mock approve ----------
    @app.post("/api/payments/mock/approve")
    def mock_approve():
        payload = request.get_json(silent=True) or {}
        reservation_id = payload.get("reservationId")
        if not reservation_id:
            return jsonify({"error": "reservationId es obligatorio."}), 400
        result = reservations_service.approve_payment(reservation_id)
        if result.get("status") == 404:
            return jsonify({"error": result["error"]}), 404
        return jsonify({
            "status": "approved",
            "reservation": _summarize_reservation(result["reservation"]),
            "tickets": result["tickets"],
        })

    # ---------- mock reject ----------
    @app.post("/api/payments/mock/reject")
    def mock_reject():
        payload = request.get_json(silent=True) or {}
        reservation_id = payload.get("reservationId")
        if not reservation_id:
            return jsonify({"error": "reservationId es obligatorio."}), 400
        result = reservations_service.reject_payment(reservation_id)
        if result.get("status") == 404:
            return jsonify({"error": result["error"]}), 404
        return jsonify({
            "status": "rejected",
            "reservation": _summarize_reservation(result["reservation"]),
        })

    # ---------- webhook Mercado Pago ----------
    @app.post("/api/payments/webhook/mercadopago")
    def mercadopago_webhook():
        payload = request.get_json(silent=True) or {}
        try:
            result = reservations_service.handle_mercadopago_webhook(payload)
        except RuntimeError as exc:
            return jsonify({"error": str(exc)}), 500
        return jsonify({"received": True, "result": result})

    # ---------- descargar PDF de tickets ----------
    @app.get("/api/reservations/<reservation_id>/tickets.pdf")
    def download_tickets_pdf(reservation_id: str):
        result = ticket_pdf_service.render_tickets_pdf(reservation_id)
        if isinstance(result, dict):
            status = result.get("status", 400)
            return jsonify({"error": result["error"]}), status
        pdf_bytes, filename = result
        return Response(
            pdf_bytes,
            mimetype="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Content-Type": "application/pdf",
            },
        )

    # ---------- validar ticket por código (QR) ----------
    @app.get("/api/tickets/<ticket_code>/validate")
    def validate_ticket(ticket_code: str):
        ticket = db.get_ticket_by_code(ticket_code)
        if not ticket:
            return jsonify({"valid": False}), 200
        reservation = db.get_reservation(ticket["reservationId"])
        if not reservation:
            return jsonify({"valid": False}), 200
        seat = ticket.get("seat", {})
        customer = reservation.get("customer", {})
        return jsonify({
            "valid": True,
            "ticketCode": ticket["ticketCode"],
            "reservationCode": reservation["code"],
            "seat": seat,
            "buyer": {
                "firstName": customer.get("firstName", ""),
                "lastName": customer.get("lastName", ""),
            },
            "status": "valid",
        })

    # ---------- error handlers ----------
    @app.errorhandler(400)
    def bad_request(_err):
        return jsonify({"error": "Solicitud inválida."}), 400

    # Captura cualquier excepción no manejada (por ejemplo, fallos al
    # generar el PDF) y la convierte en una respuesta JSON normal. Esto es indispensable para CORS: si una excepción escapa sin
    # ser manejada, Flask (en modo debug) devuelve la página HTML del
    # debugger interactivo SIN cabeceras CORS, y el navegador reporta el
    # fallo como un bloqueo de CORS en vez de mostrar el error real.
    # Al registrar un handler explícito, la respuesta pasa por el flujo
    # normal de after_request/flask-cors y siempre incluye las cabeceras.
    @app.errorhandler(Exception)
    def handle_unexpected_error(err):
        app.logger.exception("Error no controlado procesando la solicitud")
        return jsonify({"error": "Error interno del servidor."}), 500

    return app


def _summarize_reservation(reservation: dict, tickets: list[dict] | None = None) -> dict:
    """Convierte una reserva (dict interno) al formato de respuesta de la API."""
    summary = {
        "reservationId": reservation["id"],
        "reservationCode": reservation["code"],
        "status": reservation["status"],
        "customer": reservation.get("customer", {}),
        "selectedSeats": reservation.get("selectedSeats", []),
        "subtotal": reservation.get("subtotal", 0),
        "serviceFee": reservation.get("serviceFee", 0),
        "total": reservation.get("total", 0),
        "paymentProvider": reservation.get("paymentProvider"),
        "checkoutUrl": reservation.get("checkoutUrl"),
        "createdAt": reservation.get("createdAt"),
        "expiresAt": reservation.get("expiresAt"),
        "paidAt": reservation.get("paidAt"),
        "show": reservation.get("show", {}) or {},
        "performance": reservation.get("performance", {}) or {},
    }
    if tickets is not None:
        summary["tickets"] = tickets
    return summary


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=Config.DEBUG)