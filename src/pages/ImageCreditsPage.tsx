import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { IMAGE_CREDITS } from '../data/imageCredits';

export function ImageCreditsPage() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col gap-8 py-6 sm:py-10">
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-3"
      >
        <span className="text-xs uppercase tracking-[0.2em] text-accent/80">Atribución</span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Créditos de imágenes
        </h1>
        <p className="text-sm sm:text-base text-slate-300/80 max-w-2xl">
          Las imágenes utilizadas en este sitio son de licencia abierta
          (CC0, CC BY, CC BY-SA) y fueron descargadas desde Wikimedia Commons.
          A continuación se detalla la atribución correspondiente a cada una.
        </p>
      </motion.section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {IMAGE_CREDITS.map((credit, index) => (
          <motion.article
            key={credit.key}
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
            className="glass rounded-2xl p-5 flex flex-col gap-4"
          >
            <div className="flex gap-4">
              <div
                className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-white/10"
                style={{ background: '#0B102B' }}
              >
                <img
                  src={credit.localPath}
                  alt={credit.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <h2 className="text-sm font-semibold text-white leading-tight">{credit.title}</h2>
                <span className="text-xs text-slate-400">{credit.author}</span>
                <span
                  className="inline-flex w-fit rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-slate-300"
                >
                  {credit.license}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <a
                href={credit.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-slate-500">
                  <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Ver archivo fuente
              </a>
              <a
                href={credit.licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-slate-500">
                  <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Ver licencia
              </a>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}