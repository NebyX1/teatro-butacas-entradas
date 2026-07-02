# Backend — Teatro Lavalleja · Reservas

Backend mínimo en Flask para simular el flujo completo de reserva y pago
de butacas del Teatro Lavalleja. Está pensado para desarrollo local y para
ser fácil de reemplazar luego por una integración real con Mercado Pago.

## Requisitos

- Python 3.10+
- pip

## Instalación y arranque

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Linux/macOS
.venv\Scripts\activate      # Windows
pip install -r requirements.txt
python app.py
```

El backend arranca por defecto en **http://localhost:5000**.

La base SQLite se crea automáticamente en `backend/storage/reservations.sqlite3`
al primer arranque. No hace falta inicializarla a mano.

## Variables de entorno

Copiá `.env.example` a `.env` y ajustá los valores:

```bash
cp .env.example .env
```

| Variable | Descripción | Default |
|---|---|---|
| `FLASK_ENV` | Entorno de Flask | `development` |
| `SECRET_KEY` | Clave de sesión | `dev-secret-change-me` |
| `FRONTEND_BASE_URL` | URL del frontend (Vite) | `http://localhost:5173` |
| `BACKEND_BASE_URL` | URL del backend (Flask) | `http://localhost:5000` |
| `PAYMENT_PROVIDER` | `mock` o `mercadopago` | `mock` |
| `MERCADOPAGO_ACCESS_TOKEN` | Token de Mercado Pago (sandbox) | vacío |
| `MERCADOPAGO_PUBLIC_KEY` | Public key de Mercado Pago | vacío |
| `RESERVATION_HOLD_MINUTES` | Minutos de vigencia de la reserva | `15` |

> **Importante:** no commitear credenciales reales. Usá `PAYMENT_PROVIDER=mock`
> para desarrollo sin credenciales.

## Modos de pago

### Mock (default)

`PAYMENT_PROVIDER=mock` usa `MockPaymentGateway`. No llama a ningún servicio
externo. El checkout apunta a la página de demo del frontend
(`/reserva/demo-pago`) y el pago se aprueba/rechaza manualmente desde ahí.

### Mercado Pago (sandbox)

`PAYMENT_PROVIDER=mercadopago` usa `MercadoPagoGateway` con el SDK oficial.
Requiere `MERCADOPAGO_ACCESS_TOKEN` configurado. Si falta, el backend
devuelve un error claro y no bloquea la app (cambiá a `mock` para seguir
trabajando).

La integración usa Checkout Pro con `back_urls` y `notification_url`
configurados. El webhook verifica el pago antes de aprobarlo.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/reservations` | Crea reserva temporal |
| PATCH | `/api/reservations/<id>/customer` | Actualiza datos del comprador |
| GET | `/api/reservations/<id>` | Obtiene reserva + tickets |
| POST | `/api/reservations/<id>/checkout` | Crea checkout (mock o MP) |
| POST | `/api/payments/mock/approve` | Aprueba pago mock + emite tickets |
| POST | `/api/payments/mock/reject` | Rechaza pago mock |
| POST | `/api/payments/webhook/mercadopago` | Webhook de Mercado Pago |
| GET | `/api/reservations/<id>/tickets.pdf` | Descarga PDF de boletos (solo si está pagado) |
| GET | `/api/tickets/<ticket_code>/validate` | Valida un ticket por su código (QR) |

## Seguridad

- **El frontend no emite tickets.** Solo el backend, después de verificar
  el pago (mock approve o webhook de Mercado Pago).
- **No confiar en el redirect de éxito del frontend.** La página
  `/reserva/pago/success` consulta el estado real al backend.
- **No exponer el access token** al frontend. Toda la interacción con
  Mercado Pago ocurre en el backend.
- **PDF solo para reservas pagadas.** El endpoint `/tickets.pdf` valida
  que el status sea `paid` o `ticket_issued` antes de generar el PDF.

## PDF de boletos

Después de que el pago es aprobado y los tickets son emitidos, el usuario
puede descargar un PDF con sus boletos desde la página de confirmación.

- **Endpoint:** `GET /api/reservations/<id>/tickets.pdf`
- **Generación:** ReportLab dibuja el PDF directamente (sin HTML ni dependencias nativas).
- **QR:** Cada ticket tiene un código QR que apunta a
  `GET /api/tickets/<ticket_code>/validate`.
- **Diseño:** A4 portrait, 2 tickets por página, estética oscura con
  acentos dorados y cyan, consistente con la UI del teatro.
- **Validación:** El QR se puede escanear para validar el ticket contra
  el backend.

## Estructura

```
backend/
  app.py              # Endpoints Flask
  config.py           # Configuración desde .env
  db.py               # SQLite (sqlite3 puro, sin ORM)
  requirements.txt
  .env.example
  payments/
    __init__.py       # Fábrica get_gateway()
    base.py           # Interfaz BasePaymentGateway
    mock_gateway.py   # MockPaymentGateway
    mercadopago_gateway.py  # MercadoPagoGateway
  services/
    __init__.py
    reservations.py   # Lógica de reservas y checkout
    tickets.py        # Emisión de tickets
    ticket_pdf.py     # Generación de PDF con ReportLab + QR
  static/
    ticket-assets/
      teatro-logo.svg # Logo del teatro para el PDF
  storage/
    .gitkeep          # La DB se crea acá
```