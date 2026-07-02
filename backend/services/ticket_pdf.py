"""Servicio de generación de PDF de tickets con ReportLab.

Genera un PDF A4 portrait con hasta 2 tickets por página. Cada ticket es
horizontal, con fondo navy/violeta, acentos dorados y mint/cyan, y un área
de QR con fondo blanco a la derecha.

El PDF solo se genera para reservas con status 'paid' o 'ticket_issued'.

Flujo:
  1. render_tickets_pdf(reservation_id) carga la reserva y los tickets.
  2. Construye un view model por ticket con todos los datos legibles.
  3. Dibuja el PDF con ReportLab directamente (sin HTML ni WeasyPrint).
  4. Devuelve los bytes del PDF.
"""
from __future__ import annotations

import io
from datetime import datetime

import db
from config import Config

# ReportLab se importa de forma diferida para que el backend pueda arrancar
# aunque no esté instalado (solo fallará al intentar generar el PDF).


# ---------- mapeo de sectores ----------

SECTOR_LABELS = {
    "platea": "Platea",
    "palco_a": "Palco A",
    "palco_b": "Palco B",
    "palco_c": "Palco C",
}


def _sector_label(seat: dict) -> str:
    sector = seat.get("sector", "")
    return seat.get("sectorLabel") or SECTOR_LABELS.get(sector, sector)


def _seat_display_label(seat: dict) -> str:
    if seat.get("displayLabel"):
        return seat["displayLabel"]
    parts: list[str] = []
    sector = _sector_label(seat)
    if sector:
        parts.append(sector)
    if seat.get("side"):
        side = seat["side"]
        if side == "izquierda":
            parts.append("Izquierda")
        elif side == "derecha":
            parts.append("Derecha")
        else:
            parts.append(str(side).capitalize())
    if seat.get("row"):
        parts.append(f"Fila {seat['row']}")
    if seat.get("number"):
        parts.append(f"Butaca {seat['number']}")
    return " · ".join(parts) if parts else "Butaca"


def _seat_badge_parts(seat: dict) -> dict:
    return {
        "sectorLabel": _sector_label(seat),
        "sideLabel": (
            "Izquierda" if seat.get("side") == "izquierda"
            else "Derecha" if seat.get("side") == "derecha"
            else None
        ),
        "rowLabel": f"Fila {seat['row']}" if seat.get("row") else None,
        "seatNumber": seat.get("number"),
        "displayLabel": _seat_display_label(seat),
    }


def _format_date(iso_str: str | None) -> str:
    if not iso_str:
        return "—"
    try:
        clean = iso_str.replace("Z", "+00:00")
        dt = datetime.fromisoformat(clean)
        return dt.strftime("%d/%m/%Y %H:%M")
    except (ValueError, TypeError):
        return iso_str


# ---------- QR ----------

def generate_ticket_qr_png_bytes(validation_url: str) -> bytes:
    """Genera un código QR como PNG en bytes para embeber en el PDF."""
    import qrcode  # type: ignore
    from qrcode.constants import ERROR_CORRECT_M  # type: ignore

    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_M,
        box_size=10,
        border=4,
    )
    qr.add_data(validation_url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#0B102B", back_color="white")
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    return buffer.getvalue()


# ---------- view model ----------

def build_ticket_view_model(reservation: dict, ticket: dict) -> dict:
    seat = ticket.get("seat", {})
    customer = reservation.get("customer", {})
    badge = _seat_badge_parts(seat)

    validation_url = (
        f"{Config.BACKEND_BASE_URL.rstrip('/')}"
        f"/api/tickets/{ticket['ticketCode']}/validate"
    )

    qr_png = generate_ticket_qr_png_bytes(validation_url)

    buyer_full_name = f"{customer.get('firstName', '')} {customer.get('lastName', '')}".strip()
    if not buyer_full_name:
        buyer_full_name = customer.get("email") or "Titular de reserva"

    price = seat.get("price")
    if not isinstance(price, (int, float)) or price <= 0:
        price = Config.SEAT_PRICES.get(seat.get("sector", ""), 0)

    return {
        "ticketCode": ticket["ticketCode"],
        "reservationCode": reservation["code"],
        "buyerFullName": buyer_full_name,
        "buyerEmail": customer.get("email", "—"),
        "sectorLabel": badge["sectorLabel"] or "—",
        "sideLabel": badge["sideLabel"],
        "rowLabel": badge["rowLabel"],
        "seatNumber": badge["seatNumber"],
        "displayLabel": badge["displayLabel"],
        "price": int(price),
        "issuedAt": _format_date(ticket.get("createdAt")),
        "validationUrl": validation_url,
        "qrPng": qr_png,
    }


# ---------- colores (paleta institucional) ----------

COL_BG = (11 / 255, 16 / 255, 43 / 255)        # #0B102B — fondo principal
COL_GOLD = (212 / 255, 175 / 255, 55 / 255)    # #D4AF37 — dorado
COL_MINT = (110 / 255, 231 / 255, 183 / 255)   # #6EE7B7 — mint
COL_WHITE = (1.0, 1.0, 1.0)
COL_MUTED = (148 / 255, 163 / 255, 184 / 255)  # slate-400
COL_STUB_BG = (248 / 255, 250 / 255, 252 / 255)  # #F8FAFC — fondo del stub


# ---------- dibujo del ticket ----------

def _draw_ticket(canvas, ticket_vm: dict, x: float, y: float, w: float, h: float):
    """Dibuja un ticket individual en el canvas de ReportLab.

    (x, y) es la esquina inferior izquierda del ticket, en puntos.
    """
    from reportlab.lib.colors import Color
    from reportlab.lib.utils import ImageReader

    mm = 72 / 25.4

    canvas.saveState()

    # --- Fondo principal (redondeado) ---
    canvas.setFillColor(Color(*COL_BG))
    canvas.roundRect(x, y, w, h, 6 * mm, fill=1, stroke=0)

    # --- Borde sutil dorado ---
    canvas.setStrokeColor(Color(*COL_GOLD, alpha=0.35))
    canvas.setLineWidth(0.6)
    canvas.roundRect(x, y, w, h, 6 * mm, fill=0, stroke=1)

    # --- Línea separadora vertical entre área principal y stub ---
    stub_w = 62 * mm
    main_w = w - stub_w
    sep_x = x + main_w
    canvas.setStrokeColor(Color(*COL_GOLD, alpha=0.25))
    canvas.setLineWidth(0.4)
    canvas.setDash(2, 2)
    canvas.line(sep_x, y + 6, sep_x, y + h - 6)
    canvas.setDash()

    # --- Área principal (izquierda) ---
    pad = 10 * mm
    text_x = x + pad
    text_top = y + h - pad

    # Título: Teatro Lavalleja
    canvas.setFillColor(Color(*COL_GOLD))
    canvas.setFont("Helvetica-Bold", 15)
    canvas.drawString(text_x, text_top - 14, "Teatro Lavalleja")

    # Subtítulo
    canvas.setFillColor(Color(*COL_MINT))
    canvas.setFont("Helvetica", 8.5)
    canvas.drawString(text_x, text_top - 26, "Reserva de butacas")

    # Línea de acento
    canvas.setStrokeColor(Color(*COL_GOLD, alpha=0.5))
    canvas.setLineWidth(0.5)
    canvas.line(text_x, text_top - 32, text_x + 50 * mm, text_top - 32)

    # --- Datos del ticket ---
    label_font = "Helvetica"
    label_size = 7.5
    value_font = "Helvetica-Bold"
    value_size = 9.5
    line_h = 13

    rows = [
        ("Código de reserva", ticket_vm["reservationCode"]),
        ("Comprador", ticket_vm["buyerFullName"]),
        ("Email", ticket_vm["buyerEmail"]),
        ("Sector", ticket_vm["sectorLabel"]),
    ]

    seat_detail_parts = []
    if ticket_vm.get("rowLabel"):
        seat_detail_parts.append(ticket_vm["rowLabel"])
    if ticket_vm.get("sideLabel"):
        seat_detail_parts.append(ticket_vm["sideLabel"])
    if seat_detail_parts:
        rows.append(("Ubicación", " · ".join(seat_detail_parts)))

    rows.append(("Butaca", ticket_vm["displayLabel"]))
    rows.append(("Precio", f"$ {ticket_vm['price']}"))
    rows.append(("Emisión", ticket_vm["issuedAt"]))

    cur_y = text_top - 44
    for label, value in rows:
        canvas.setFillColor(Color(*COL_MUTED))
        canvas.setFont(label_font, label_size)
        canvas.drawString(text_x, cur_y, label.upper())
        canvas.setFillColor(Color(*COL_WHITE))
        canvas.setFont(value_font, value_size)
        canvas.drawString(text_x, cur_y - 11, str(value))
        cur_y -= line_h

    # --- Stub derecho (área QR) ---
    stub_pad = 8 * mm
    stub_x = sep_x

    # Fondo blanco para el QR
    qr_box_size = 42 * mm
    qr_x = stub_x + (stub_w - qr_box_size) / 2
    qr_y = y + h - pad - qr_box_size - 4

    canvas.setFillColor(Color(*COL_STUB_BG))
    canvas.roundRect(qr_x - 4, qr_y - 4, qr_box_size + 8, qr_box_size + 8, 3, fill=1, stroke=0)

    # QR
    qr_img = ImageReader(io.BytesIO(ticket_vm["qrPng"]))
    canvas.drawImage(qr_img, qr_x, qr_y, width=qr_box_size, height=qr_box_size, mask=None)

    # Código del ticket debajo del QR
    canvas.setFillColor(Color(*COL_BG))
    canvas.setFont("Helvetica-Bold", 8)
    code_text = ticket_vm["ticketCode"]
    code_w = canvas.stringWidth(code_text, "Helvetica-Bold", 8)
    canvas.drawString(stub_x + (stub_w - code_w) / 2, qr_y - 12, code_text)

    # Estado: VÁLIDO
    canvas.setFillColor(Color(*COL_MINT))
    canvas.setFont("Helvetica-Bold", 9)
    status_text = "VÁLIDO"
    status_w = canvas.stringWidth(status_text, "Helvetica-Bold", 9)
    canvas.drawString(stub_x + (stub_w - status_w) / 2, qr_y - 24, status_text)

    # Texto: Presentar este código al ingresar
    canvas.setFillColor(Color(*COL_MUTED))
    canvas.setFont("Helvetica", 6.5)
    hint_text = "Presentar este código"
    hint_text2 = "al ingresar"
    hint_w = canvas.stringWidth(hint_text, "Helvetica", 6.5)
    hint_w2 = canvas.stringWidth(hint_text2, "Helvetica", 6.5)
    canvas.drawString(stub_x + (stub_w - hint_w) / 2, qr_y - 34, hint_text)
    canvas.drawString(stub_x + (stub_w - hint_w2) / 2, qr_y - 42, hint_text2)

    canvas.restoreState()


# ---------- render PDF ----------

def generate_tickets_pdf(reservation: dict, tickets: list[dict]) -> bytes:
    """Genera el PDF de tickets usando ReportLab. Devuelve los bytes del PDF."""
    from reportlab.lib.pagesizes import A4
    from reportlab.pdfgen.canvas import Canvas

    ticket_vms = [build_ticket_view_model(reservation, t) for t in tickets]

    buffer = io.BytesIO()
    canvas = Canvas(buffer, pagesize=A4)
    page_w, page_h = A4

    mm = 72 / 25.4
    margin = 15 * mm
    ticket_w = 180 * mm
    ticket_h = 80 * mm
    gap = 10 * mm

    # 2 tickets por página
    tickets_per_page = 2
    usable_h = page_h - 2 * margin
    if 2 * ticket_h + gap > usable_h:
        tickets_per_page = 1

    for i, tvm in enumerate(ticket_vms):
        slot_index = i % tickets_per_page

        if slot_index == 0:
            if i > 0:
                canvas.showPage()
            y = page_h - margin - ticket_h
        else:
            y = page_h - margin - ticket_h - (ticket_h + gap) * slot_index

        x = (page_w - ticket_w) / 2
        _draw_ticket(canvas, tvm, x, y, ticket_w, ticket_h)

    canvas.save()
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes


def render_tickets_pdf(reservation_id: str) -> tuple[bytes, str] | dict:
    """Genera el PDF de tickets para una reserva.

    Devuelve (pdf_bytes, filename) si todo OK, o {"error": ..., "status": N}
    si la reserva no existe o no está pagada.
    """
    reservation = db.get_reservation(reservation_id)
    if not reservation:
        return {"error": "Reserva no encontrada.", "status": 404}

    status = reservation.get("status", "")
    if status not in ("paid", "ticket_issued"):
        return {
            "error": "Los boletos todavía no están disponibles. El pago debe estar confirmado.",
            "status": 403,
        }

    tickets = db.list_tickets_by_reservation(reservation_id)
    if not tickets:
        from services.tickets import issue_tickets
        tickets = issue_tickets(reservation_id)

    if not tickets:
        return {"error": "No hay tickets para esta reserva.", "status": 404}

    pdf_bytes = generate_tickets_pdf(reservation, tickets)
    filename = f"teatro-lavalleja-reserva-{reservation['code']}.pdf"
    return (pdf_bytes, filename)