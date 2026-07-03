import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4 py-12">
      <span className="text-6xl font-bold text-primary">404</span>
      <h1 className="text-2xl font-semibold">Función no encontrada</h1>
      <p className="text-base-content/70 max-w-md">
        La página que buscás no existe o fue movida. Volvé al inicio para
        descubrir la programación del Teatro Lavalleja.
      </p>
      <Link to="/" className="btn btn-primary mt-2">
        Ir al inicio
      </Link>
    </div>
  );
}
