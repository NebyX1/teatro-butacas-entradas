# Teatro Lavalleja · Reservas

Aplicación de reserva de butacas para el Teatro Lavalleja, con frontend en
React + TypeScript + Vite y backend mínimo en Flask para simular el flujo
completo de reserva y pago.

## Arranque rápido

### Frontend (http://localhost:5173)

```bash
npm install
npm run dev
```

Creá un `.env` a partir de `.env.example`:

```
VITE_API_BASE_URL=http://localhost:5000
```

### Backend (http://localhost:5000)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
source .venv/bin/activate       # Linux/macOS
pip install -r requirements.txt
cp .env.example .env
python app.py
```

Ver [`backend/README.md`](backend/README.md) para más detalles del backend.

## Flujo de reserva

1. Selección de butacas (`/reserva`)
2. Datos del comprador (`/reserva/datos`)
3. Revisión (`/reserva/revision`)
4. Pre-pago (`/reserva/pre-pago`)
5. Pasarela de pago:
   - Mock: `/reserva/demo-pago` (simula aprobación/rechazo)
   - Mercado Pago: redirect a Checkout Pro → `/reserva/pago/success|pending|failure`
6. Confirmación (`/reserva/confirmada`) o error (`/reserva/error-pago`)

## Modos de pago

- **Mock** (default): simulación local, sin credenciales.
- **Mercado Pago**: sandbox con `MERCADOPAGO_ACCESS_TOKEN`.

## Estructura

```
teatro/
  backend/           # Flask + SQLite + pasarelas de pago
  src/               # Frontend React
    lib/api.ts        # Cliente HTTP del backend
    store/            # Zustand (estado de reserva)
    routes/reservation/  # Páginas del flujo de reserva
    components/seat-map/ # Mapas de butacas (Platea, Palcos A/B/C)
```

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
