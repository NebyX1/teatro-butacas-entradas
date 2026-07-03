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
import logging
from datetime import datetime

import db
from config import Config
from services.reservations import get_ticket_final_price

logger = logging.getLogger(__name__)

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
    show = reservation.get("show", {}) or {}
    performance = reservation.get("performance", {}) or {}

    validation_url = (
        f"{Config.BACKEND_BASE_URL.rstrip('/')}"
        f"/api/tickets/{ticket['ticketCode']}/validate"
    )

    qr_png = generate_ticket_qr_png_bytes(validation_url)

    buyer_full_name = f"{customer.get('firstName', '')} {customer.get('lastName', '')}".strip()
    if not buyer_full_name:
        buyer_full_name = customer.get("email") or "Titular de reserva"

    price_info = get_ticket_final_price(reservation, ticket)

    # --- Datos de la función para el PDF (con fallbacks robustos) ---
    # show_title: prioriza show.title, luego performance.showTitle,
    # finalmente "Función a confirmar".
    show_title = (
        show.get("title")
        or performance.get("showTitle")
        or "Función a confirmar"
    )

    # performance_datetime: prioriza performance.label (texto legible),
    # luego datetime formateado, luego date+time combinados,
    # finalmente "Fecha y hora a confirmar".
    perf_label = performance.get("label") or ""
    if perf_label:
        performance_datetime = perf_label
    elif performance.get("datetime"):
        performance_datetime = _format_date(performance.get("datetime"))
    elif performance.get("date") and performance.get("time"):
        performance_datetime = _format_date(
            f"{performance['date']}T{performance['time']}:00"
        )
    else:
        performance_datetime = "Fecha y hora a confirmar"

    venue = show.get("venue") or "Teatro Lavalleja"

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
        "priceBase": price_info["basePrice"],
        "priceServiceFeeShare": price_info["serviceFeeShare"],
        "priceAmount": price_info["finalPrice"],
        "priceLabel": price_info["finalLabel"],
        "isAuthoritySeat": price_info["isAuthority"],
        "issuedAt": _format_date(ticket.get("createdAt")),
        "validationUrl": validation_url,
        "qrPng": qr_png,
        "showTitle": show_title,
        "performanceDateTime": performance_datetime,
        "venue": venue,
    }


# ---------- colores (paleta institucional) ----------

COL_BG = (11 / 255, 16 / 255, 43 / 255)        # #0B102B — fondo principal
COL_GOLD = (212 / 255, 175 / 255, 55 / 255)    # #D4AF37 — dorado
COL_MINT = (110 / 255, 231 / 255, 183 / 255)   # #6EE7B7 — mint
COL_WHITE = (1.0, 1.0, 1.0)
COL_MUTED = (148 / 255, 163 / 255, 184 / 255)  # slate-400
COL_STUB_BG = (248 / 255, 250 / 255, 252 / 255)  # #F8FAFC — fondo del stub

# ---------- grilla de layout (todo en mm, convertido a puntos) ----------

MM = 72 / 25.4


def mm(value: float) -> float:
    return value * MM


TICKET_W = mm(180)
TICKET_H = mm(80)
PAGE_MARGIN = mm(15)
TICKET_GAP = mm(10)

STUB_W = mm(62)
PAD = mm(10)
COL_GAP = mm(6)

TITLE_SIZE = 17
SUBTITLE_SIZE = 8.5
LABEL_SIZE = 7
VALUE_SIZE = 10.5
FIELD_STEP = mm(9)  # distancia vertical mínima entre un campo y el siguiente
WRAP_LINE_GAP = mm(4.3)  # separación entre líneas cuando un valor ocupa 2 líneas
NOTE_GAP = mm(3.4)  # separación para la nota secundaria bajo el precio


# ---------- helpers de dibujo ----------

def fit_text(canvas, text: str, max_width: float, font_name: str, font_size: float) -> str:
    """Trunca `text` con elipsis si no entra en `max_width` puntos."""
    text = str(text or "")
    if canvas.stringWidth(text, font_name, font_size) <= max_width:
        return text
    ellipsis = "…"
    for i in range(len(text), 0, -1):
        candidate = text[:i].rstrip() + ellipsis
        if canvas.stringWidth(candidate, font_name, font_size) <= max_width:
            return candidate
    return ellipsis


def wrap_text(
    canvas,
    text: str,
    max_width: float,
    font_name: str,
    font_size: float,
    max_lines: int = 2,
) -> list[str]:
    """Envuelve `text` en como máximo `max_lines` líneas que entren en
    `max_width`. Si el texto no alcanza en `max_lines` líneas, la última
    línea se trunca con elipsis (nunca se pierde contenido silenciosamente
    para textos de longitud normal, como una etiqueta de butaca).
    """
    words = str(text or "").split()
    if not words:
        return [""]

    lines: list[str] = []
    current = words[0]
    idx = 1
    while idx < len(words):
        word = words[idx]
        candidate = f"{current} {word}"
        if canvas.stringWidth(candidate, font_name, font_size) <= max_width:
            current = candidate
            idx += 1
            continue
        lines.append(current)
        current = word
        idx += 1
        if len(lines) == max_lines - 1:
            break

    # Si quedaron palabras sin procesar (cortamos por límite de líneas),
    # se agregan a la línea final, que se trunca con elipsis si no entra.
    if idx < len(words):
        current = current + " " + " ".join(words[idx:])
    lines.append(current)

    if len(lines) > max_lines:
        lines = lines[:max_lines]
    lines[-1] = fit_text(canvas, lines[-1], max_width, font_name, font_size)
    return lines


def draw_ticket_background(canvas, x: float, y: float, w: float, h: float) -> None:
    """Dibuja el fondo redondeado y el borde dorado del ticket."""
    from reportlab.lib.colors import Color

    corner = mm(6)
    canvas.setFillColor(Color(*COL_BG))
    canvas.roundRect(x, y, w, h, corner, fill=1, stroke=0)
    canvas.setStrokeColor(Color(*COL_GOLD, alpha=0.35))
    canvas.setLineWidth(0.6)
    canvas.roundRect(x, y, w, h, corner, fill=0, stroke=1)


def draw_ticket_header(canvas, x: float, top_y: float, max_width: float) -> float:
    """Dibuja título + subtítulo + línea de acento.

    Devuelve el y (absoluto, en puntos) donde debe posicionarse el label
    del primer campo del cuerpo.
    """
    from reportlab.lib.colors import Color

    canvas.setFillColor(Color(*COL_GOLD))
    canvas.setFont("Helvetica-Bold", TITLE_SIZE)
    canvas.drawString(x, top_y - mm(7), fit_text(canvas, "Teatro Lavalleja", max_width, "Helvetica-Bold", TITLE_SIZE))

    canvas.setFillColor(Color(*COL_MINT))
    canvas.setFont("Helvetica", SUBTITLE_SIZE)
    canvas.drawString(x, top_y - mm(12.5), "Reserva de butacas")

    divider_y = top_y - mm(16)
    canvas.setStrokeColor(Color(*COL_GOLD, alpha=0.5))
    canvas.setLineWidth(0.5)
    canvas.line(x, divider_y, x + mm(50), divider_y)

    return divider_y - mm(6)


def draw_field(canvas, label: str, value: str, x: float, y: float, max_width: float) -> float:
    """Dibuja un campo de una sola línea (label arriba, value abajo).

    Devuelve el y del label del próximo campo (y - FIELD_STEP).
    """
    from reportlab.lib.colors import Color

    canvas.setFillColor(Color(*COL_MUTED))
    canvas.setFont("Helvetica", LABEL_SIZE)
    canvas.drawString(x, y, label.upper())

    value_y = y - mm(4)
    value_text = fit_text(canvas, value, max_width, "Helvetica-Bold", VALUE_SIZE)
    canvas.setFillColor(Color(*COL_WHITE))
    canvas.setFont("Helvetica-Bold", VALUE_SIZE)
    canvas.drawString(x, value_y, value_text)

    return y - FIELD_STEP


def draw_wrapped_field(
    canvas,
    label: str,
    value: str,
    x: float,
    y: float,
    max_width: float,
    max_lines: int = 2,
) -> float:
    """Dibuja un campo cuyo valor puede envolver hasta `max_lines` líneas.

    No trunca con elipsis salvo que el texto sea demasiado largo incluso
    para `max_lines` líneas completas (ver `wrap_text`). Devuelve el y del
    label del próximo campo, incrementando el espacio consumido si el
    valor ocupó más de una línea, para que los campos siguientes se
    desplacen hacia abajo y nunca se solapen.
    """
    from reportlab.lib.colors import Color

    canvas.setFillColor(Color(*COL_MUTED))
    canvas.setFont("Helvetica", LABEL_SIZE)
    canvas.drawString(x, y, label.upper())

    lines = wrap_text(canvas, value, max_width, "Helvetica-Bold", VALUE_SIZE, max_lines)
    canvas.setFillColor(Color(*COL_WHITE))
    canvas.setFont("Helvetica-Bold", VALUE_SIZE)
    line_y = y - mm(4)
    for line in lines:
        canvas.drawString(x, line_y, line)
        line_y -= WRAP_LINE_GAP

    extra_lines = max(0, len(lines) - 1)
    return y - FIELD_STEP - extra_lines * WRAP_LINE_GAP


def draw_price_field(canvas, ticket_vm: dict, x: float, y: float, max_width: float) -> float:
    """Dibuja el campo Precio con el monto final (base + cargo por servicio).

    Si la butaca es de autoridad, muestra la etiqueta especial sin nota.
    Si el ticket tiene un cargo por servicio asignado, agrega una nota
    secundaria pequeña debajo ("Incluye cargo por servicio") y el layout
    devuelve el y ajustado para que el siguiente campo no se solape.
    """
    from reportlab.lib.colors import Color

    canvas.setFillColor(Color(*COL_MUTED))
    canvas.setFont("Helvetica", LABEL_SIZE)
    canvas.drawString(x, y, "PRECIO")

    value_y = y - mm(4)
    value_text = fit_text(canvas, ticket_vm["priceLabel"], max_width, "Helvetica-Bold", VALUE_SIZE)
    canvas.setFillColor(Color(*COL_GOLD) if not ticket_vm["isAuthoritySeat"] else Color(*COL_WHITE))
    canvas.setFont("Helvetica-Bold", VALUE_SIZE)
    canvas.drawString(x, value_y, value_text)

    has_service_fee = (
        not ticket_vm["isAuthoritySeat"] and ticket_vm["priceServiceFeeShare"] > 0
    )
    if has_service_fee:
        note_y = value_y - NOTE_GAP
        canvas.setFillColor(Color(*COL_MUTED))
        canvas.setFont("Helvetica-Oblique", 6)
        note = fit_text(canvas, "Incluye cargo por servicio", max_width, "Helvetica-Oblique", 6)
        canvas.drawString(x, note_y, note)
        return y - FIELD_STEP - NOTE_GAP

    return y - FIELD_STEP


def draw_qr_stub(canvas, ticket_vm: dict, stub_x: float, y: float, stub_w: float, h: float) -> None:
    """Dibuja el área derecha del ticket: QR sobre fondo blanco, código y estado."""
    from reportlab.lib.colors import Color
    from reportlab.lib.utils import ImageReader

    pad = PAD
    qr_box_size = mm(40)
    qr_x = stub_x + (stub_w - qr_box_size) / 2
    qr_y = y + h - pad - qr_box_size - mm(4)

    canvas.setFillColor(Color(*COL_STUB_BG))
    canvas.roundRect(qr_x - 4, qr_y - 4, qr_box_size + 8, qr_box_size + 8, 3, fill=1, stroke=0)

    qr_img = ImageReader(io.BytesIO(ticket_vm["qrPng"]))
    canvas.drawImage(qr_img, qr_x, qr_y, width=qr_box_size, height=qr_box_size, mask=None)

    canvas.setFillColor(Color(*COL_BG))
    canvas.setFont("Helvetica-Bold", 8)
    code_text = ticket_vm["ticketCode"]
    code_w = canvas.stringWidth(code_text, "Helvetica-Bold", 8)
    canvas.drawString(stub_x + (stub_w - code_w) / 2, qr_y - mm(4), code_text)

    canvas.setFillColor(Color(*COL_MINT))
    canvas.setFont("Helvetica-Bold", 9)
    status_text = "VÁLIDO"
    status_w = canvas.stringWidth(status_text, "Helvetica-Bold", 9)
    canvas.drawString(stub_x + (stub_w - status_w) / 2, qr_y - mm(8.5), status_text)

    canvas.setFillColor(Color(*COL_MUTED))
    canvas.setFont("Helvetica", 6.5)
    hint_text = "Presentar este código al ingresar"
    hint_text = fit_text(canvas, hint_text, stub_w - mm(6), "Helvetica", 6.5)
    hint_w = canvas.stringWidth(hint_text, "Helvetica", 6.5)
    canvas.drawString(stub_x + (stub_w - hint_w) / 2, qr_y - mm(13), hint_text)


# ---------- dibujo del ticket ----------

def _draw_ticket(canvas, ticket_vm: dict, x: float, y: float, w: float, h: float) -> None:
    """Dibuja un ticket individual siguiendo una grilla fija de dos columnas.

    (x, y) es la esquina inferior izquierda del ticket, en puntos.
    """
    from reportlab.lib.colors import Color

    canvas.saveState()

    draw_ticket_background(canvas, x, y, w, h)

    # Línea separadora vertical entre el área principal y el stub del QR.
    main_w = w - STUB_W
    sep_x = x + main_w
    canvas.setStrokeColor(Color(*COL_GOLD, alpha=0.25))
    canvas.setLineWidth(0.4)
    canvas.setDash(2, 2)
    canvas.line(sep_x, y + 6, sep_x, y + h - 6)
    canvas.setDash()

    # --- Área principal (izquierda), en grilla de 2 columnas ---
    text_x = x + PAD
    text_top = y + h - PAD
    available_w = (sep_x - mm(4)) - text_x
    col_w = (available_w - COL_GAP) / 2
    col1_x = text_x
    col2_x = text_x + col_w + COL_GAP

    first_field_y = draw_ticket_header(canvas, text_x, text_top, available_w)

    # Columna 1: OBRA y FUNCIÓN al tope (lo más importante del ticket),
    # luego identificación del comprador. "Obra" y "Función" pueden envolver
    # hasta 2 líneas; los campos siguientes se desplazan automáticamente.
    cy = first_field_y
    cy = draw_wrapped_field(canvas, "Obra", ticket_vm["showTitle"], col1_x, cy, col_w)
    cy = draw_wrapped_field(canvas, "Función", ticket_vm["performanceDateTime"], col1_x, cy, col_w)
    cy = draw_field(canvas, "Código de reserva", ticket_vm["reservationCode"], col1_x, cy, col_w)
    cy = draw_field(canvas, "Comprador", ticket_vm["buyerFullName"], col1_x, cy, col_w)
    cy = draw_field(canvas, "Email", ticket_vm["buyerEmail"], col1_x, cy, col_w)

    # Columna 2: datos de la butaca. "Butaca" es de altura variable (envuelve
    # hasta 2 líneas para no truncar la etiqueta completa) y "Precio" también
    # es de altura variable (agrega una nota si hay cargo por servicio). Los
    # campos siguientes se desplazan automáticamente según lo que consuman.
    cy = first_field_y
    cy = draw_field(canvas, "Sector", ticket_vm["sectorLabel"], col2_x, cy, col_w)
    cy = draw_wrapped_field(canvas, "Butaca", ticket_vm["displayLabel"], col2_x, cy, col_w)
    cy = draw_price_field(canvas, ticket_vm, col2_x, cy, col_w)
    cy = draw_field(canvas, "Emisión", ticket_vm["issuedAt"], col2_x, cy, col_w)

    # --- Stub derecho (área QR) ---
    draw_qr_stub(canvas, ticket_vm, sep_x, y, STUB_W, h)

    canvas.restoreState()


# ---------- render PDF ----------

def generate_tickets_pdf(reservation: dict, tickets: list[dict]) -> bytes:
    """Genera el PDF de tickets usando ReportLab. Devuelve los bytes del PDF."""
    from reportlab.lib.pagesizes import A4
    from reportlab.pdfgen.canvas import Canvas

    ticket_vms = [build_ticket_view_model(reservation, t) for t in tickets]

    logger.debug(
        "PDF reserva=%s total=%s tickets=%d precios=%s",
        reservation.get("code"),
        reservation.get("total"),
        len(ticket_vms),
        [(tvm["displayLabel"], tvm["priceAmount"]) for tvm in ticket_vms],
    )

    buffer = io.BytesIO()
    canvas = Canvas(buffer, pagesize=A4)
    page_w, page_h = A4

    ticket_w = TICKET_W
    ticket_h = TICKET_H
    gap = TICKET_GAP
    margin = PAGE_MARGIN

    # 2 tickets por página si entran, si no 1 por página.
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

    logger.debug(
        "Generando PDF: reserva=%s total=%s tickets=%d seat_ids=%s",
        reservation.get("code"),
        reservation.get("total"),
        len(tickets),
        [t.get("seat", {}).get("id") for t in tickets],
    )

    pdf_bytes = generate_tickets_pdf(reservation, tickets)
    filename = f"teatro-lavalleja-reserva-{reservation['code']}.pdf"
    return (pdf_bytes, filename)