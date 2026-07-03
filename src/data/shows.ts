/**
 * Modelo de datos de espectáculos y funciones (mock dataset local).
 *
 * Las imágenes se sirven localmente desde /show-assets/ (descargadas
 * desde Wikimedia Commons, licencias abiertas). TODO: reemplazar con
 * datos reales cuando exista un CMS o API de programación del teatro.
 */

export type ShowStatus = 'current' | 'upcoming' | 'premiere' | 'featured';
export type ShowCategory = 'teatro' | 'musica' | 'familia' | 'danza' | 'especial';
export type PerformanceStatus = 'available' | 'sold_out' | 'soon' | 'cancelled';

export interface Performance {
  id: string;
  showId: string;
  date: string; // ISO date (YYYY-MM-DD)
  time: string; // HH:mm
  datetime: string; // ISO datetime
  label: string; // texto legible: "Sábado 18 de julio · 21:00"
  availabilityStatus: PerformanceStatus;
  availableSeats: number;
  totalSeats: number;
  priceFrom: number;
  isPremiere: boolean;
}

export interface Show {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: ShowCategory;
  genre: string;
  status: ShowStatus;
  shortDescription: string;
  longDescription: string;
  cast: string[];
  director: string;
  durationMinutes: number;
  ageRating: string;
  /** Ruta local de la imagen de portada (poster). */
  image: string;
  /** Ruta local de la imagen hero (panorámica). */
  heroImage: string;
  /** Color de acento para chips, bordes y glows. */
  accentColor: string;
  /** Clave del crédito de imagen (ver imageCredits.ts). */
  imageCreditKey: string;
  tags: string[];
  venue: string;
  performances: Performance[];
}

const VENUE = 'Teatro Lavalleja';

// --- helpers de fechas (mock, relativas a 2026) ---

function perf(
  showId: string,
  date: string,
  time: string,
  label: string,
  opts: Partial<Performance> = {}
): Performance {
  const totalSeats = 411;
  const availableSeats = opts.availableSeats ?? Math.floor(totalSeats * 0.7);
  const status: PerformanceStatus = opts.availabilityStatus ?? 'available';
  return {
    id: `${showId}-${date}-${time.replace(':', '')}`,
    showId,
    date,
    time,
    datetime: `${date}T${time}:00`,
    label,
    availabilityStatus: status,
    availableSeats: status === 'sold_out' ? 0 : availableSeats,
    totalSeats,
    priceFrom: opts.priceFrom ?? 850,
    isPremiere: opts.isPremiere ?? false,
  };
}

// --- dataset de espectáculos ---

export const SHOWS: Show[] = [
  {
    id: 'show-bernarda-alba',
    slug: 'la-casa-de-bernarda-alba',
    title: 'La Casa de Bernarda Alba',
    subtitle: 'Drama · Federico García Lorca',
    category: 'teatro',
    genre: 'Drama',
    status: 'featured',
    shortDescription:
      'El clásico de Lorca en una puesta íntima y contemporánea. Cinco hermanas, una madre y el peso de una casa cerrada al mundo.',
    longDescription:
      'Tras la muerte del padre, Bernarda impone un luto de ocho años a sus cinco hijas. En esa casa sellada por el silencio y la rigidez, cada mujer busca —a su manera— una salida que el orden doméstico no permite. La puesta rescata la fuerza poética del texto original con un elenco femenino y una escenografía mínima que pone el cuerpo y la voz en el centro de la escena.',
    cast: ['Marta Echeverri', 'Lucía Sosa', 'Beatriz Ríos', 'Ana Ferrer', 'Carla Méndez'],
    director: 'Jorge Núñez',
    durationMinutes: 105,
    ageRating: '+14',
    image: '/show-assets/bernarda-alba-stage.jpg',
    heroImage: '/show-assets/bernarda-alba-stage.jpg',
    accentColor: '#C9A227',
    imageCreditKey: 'bernarda-alba-stage',
    tags: ['drama', 'clásico', 'elenco femenino'],
    venue: VENUE,
    performances: [
      perf('show-bernarda-alba', '2026-07-04', '21:00', 'Sábado 4 de julio · 21:00', { priceFrom: 850 }),
      perf('show-bernarda-alba', '2026-07-05', '20:00', 'Domingo 5 de julio · 20:00', { priceFrom: 850 }),
      perf('show-bernarda-alba', '2026-07-11', '21:00', 'Sábado 11 de julio · 21:00', { priceFrom: 900 }),
      perf('show-bernarda-alba', '2026-07-12', '20:00', 'Domingo 12 de julio · 20:00', { availableSeats: 12, priceFrom: 900 }),
      perf('show-bernarda-alba', '2026-07-18', '21:00', 'Sábado 18 de julio · 21:00', { availabilityStatus: 'sold_out', priceFrom: 900 }),
    ],
  },
  {
    id: 'show-ultimo-ensayo',
    slug: 'el-ultimo-ensayo',
    title: 'El Último Ensayo',
    subtitle: 'Teatro contemporáneo · Original',
    category: 'teatro',
    genre: 'Contemporáneo',
    status: 'current',
    shortDescription:
      'Una compañía ensaya su última función antes de disolverse. Memoria, amistad y el duelo de cerrar el telón.',
    longDescription:
      'Una compañía de teatro independiente se reúne por última vez en la sala que fue su hogar durante quince años. Entre réplicas, silencios y recuerdos, el ensayo se convierte en un acto de despedida. Una obra sobre el oficio, la persistencia y lo que queda cuando las luces se apagan.',
    cast: ['Diego Marín', 'Paula Castro', 'Renzo Aliaga', 'Sofía Lima'],
    director: 'Diego Marín',
    durationMinutes: 90,
    ageRating: '+13',
    image: '/show-assets/theater-show.jpg',
    heroImage: '/show-assets/theater-show.jpg',
    accentColor: '#4F46E5',
    imageCreditKey: 'theater-show',
    tags: ['contemporáneo', 'original', 'despedida'],
    venue: VENUE,
    performances: [
      perf('show-ultimo-ensayo', '2026-07-03', '20:30', 'Viernes 3 de julio · 20:30', { priceFrom: 700 }),
      perf('show-ultimo-ensayo', '2026-07-10', '20:30', 'Viernes 10 de julio · 20:30', { priceFrom: 700 }),
      perf('show-ultimo-ensayo', '2026-07-17', '20:30', 'Viernes 17 de julio · 20:30', { availableSeats: 40, priceFrom: 700 }),
    ],
  },
  {
    id: 'show-noche-camara',
    slug: 'noche-de-camara',
    title: 'Noche de Cámara',
    subtitle: 'Música clásica · Concierto',
    category: 'musica',
    genre: 'Música clásica',
    status: 'current',
    shortDescription:
      'Cuarteto de cuerdas y piano en un programa que recorre Schubert, Piazzolla y autores uruguayos.',
    longDescription:
      'Una velada íntima con el Cuarteto Lavalleja y la pianista Inés Duarte. El programa abre con el Quinto de Schubert, transita Piazzolla y cierra con obras de compositores uruguayos contemporáneos. Una experiencia de escucha atenta en la acústica natural de la sala.',
    cast: ['Cuarteto Lavalleja', 'Inés Duarte (piano)'],
    director: 'Inés Duarte',
    durationMinutes: 75,
    ageRating: 'APT',
    image: '/show-assets/concert-hall.jpg',
    heroImage: '/show-assets/concert-hall.jpg',
    accentColor: '#62E6C5',
    imageCreditKey: 'concert-hall',
    tags: ['música clásica', 'cuarteto', 'piano'],
    venue: VENUE,
    performances: [
      perf('show-noche-camara', '2026-07-06', '19:00', 'Lunes 6 de julio · 19:00', { priceFrom: 600 }),
      perf('show-noche-camara', '2026-07-13', '19:00', 'Lunes 13 de julio · 19:00', { priceFrom: 600 }),
    ],
  },
  {
    id: 'show-hamlet-minas',
    slug: 'hamlet-en-minas',
    title: 'Hamlet en Minas',
    subtitle: 'Estreno · Adaptación libre',
    category: 'teatro',
    genre: 'Tragedia',
    status: 'premiere',
    shortDescription:
      'Hamlet trasladado a un pueblo minero del interior. El príncipe es un joven que hereda una empresa y una culpa.',
    longDescription:
      'Adaptación libre de la tragedia de Shakespeare. El reino de Dinamarca es una empresa minera en declive; Hamlet, un joven que regresa del extranjero para encontrar a su padre muerto y a su madre casada con el nuevo gerente. La duda, la venganza y el peso del legado se reescriben en un lenguaje rural y contemporáneo.',
    cast: ['Tomás Vidal', 'Mariana Paz', 'Héctor Sosa', 'Lucía Ríos'],
    director: 'Mariana Paz',
    durationMinutes: 120,
    ageRating: '+16',
    image: '/show-assets/theater-show.jpg',
    heroImage: '/show-assets/theater-show.jpg',
    accentColor: '#A7B2FF',
    imageCreditKey: 'theater-show',
    tags: ['estreno', 'shakespeare', 'adaptación'],
    venue: VENUE,
    performances: [
      perf('show-hamlet-minas', '2026-07-25', '21:00', 'Sábado 25 de julio · 21:00 · ESTRENO', { isPremiere: true, priceFrom: 1000 }),
      perf('show-hamlet-minas', '2026-07-26', '20:00', 'Domingo 26 de julio · 20:00', { priceFrom: 950 }),
      perf('show-hamlet-minas', '2026-08-01', '21:00', 'Sábado 1 de agosto · 21:00', { priceFrom: 950 }),
    ],
  },
  {
    id: 'show-candombe-invierno',
    slug: 'candombe-de-invierno',
    title: 'Candombe de Invierno',
    subtitle: 'Estreno · Música afro-uruguaya',
    category: 'musica',
    genre: 'Candombe',
    status: 'premiere',
    shortDescription:
      'Tres cuerdas de tambores y voces femeninas celebran el candombe en su versión más íntima y nocturna.',
    longDescription:
      'Un espectáculo musical que reúne tres cuerdas de tambores y un coro de voces femeninas para una noche de candombe de invierno. El repertorio alterna llamadas, milongas y composiciones originales que dialogan con la tradición afro-uruguaya. Estreno absoluto en la sala.',
    cast: ['Cuerda Ansina', 'Cuerda Lonjas', 'Coro de Mujeres del Sur'],
    director: 'Edú Píriz',
    durationMinutes: 80,
    ageRating: 'APT',
    image: '/show-assets/tango-show.jpg',
    heroImage: '/show-assets/tango-show.jpg',
    accentColor: '#F472B6',
    imageCreditKey: 'tango-show',
    tags: ['estreno', 'candombe', 'música uruguaya'],
    venue: VENUE,
    performances: [
      perf('show-candombe-invierno', '2026-07-19', '20:00', 'Domingo 19 de julio · 20:00 · ESTRENO', { isPremiere: true, priceFrom: 800 }),
      perf('show-candombe-invierno', '2026-07-26', '19:00', 'Domingo 26 de julio · 19:00', { priceFrom: 800 }),
    ],
  },
  {
    id: 'show-pequeno-sombras',
    slug: 'pequeno-teatro-de-sombras',
    title: 'Pequeño Teatro de Sombras',
    subtitle: 'Familia · Teatro de sombras',
    category: 'familia',
    genre: 'Infantil',
    status: 'current',
    shortDescription:
      'Un viaje mágico con sombras, luz y música para toda la familia. A partir de 4 años.',
    longDescription:
      'Una compañía de teatro de sombras presenta tres cuentos breves donde la luz y la oscuridad son las verdaderas protagonistas. Un espectáculo pensado para que grandes y chicos compartan la misma butaca y el mismo asombro. Recomendado a partir de 4 años.',
    cast: ['Compañía Luz y Sombra'],
    director: 'Valeria Núñez',
    durationMinutes: 55,
    ageRating: '+4',
    image: '/show-assets/theater-show.jpg',
    heroImage: '/show-assets/theater-show.jpg',
    accentColor: '#38BDF8',
    imageCreditKey: 'theater-show',
    tags: ['familia', 'sombras', 'infantil'],
    venue: VENUE,
    performances: [
      perf('show-pequeno-sombras', '2026-07-05', '16:00', 'Domingo 5 de julio · 16:00', { priceFrom: 450 }),
      perf('show-pequeno-sombras', '2026-07-12', '16:00', 'Domingo 12 de julio · 16:00', { priceFrom: 450 }),
      perf('show-pequeno-sombras', '2026-07-19', '16:00', 'Domingo 19 de julio · 16:00', { priceFrom: 450 }),
    ],
  },
  {
    id: 'show-danza-piedra',
    slug: 'danza-sobre-piedra',
    title: 'Danza sobre Piedra',
    subtitle: 'Danza contemporánea',
    category: 'danza',
    genre: 'Contemporáneo',
    status: 'upcoming',
    shortDescription:
      'Seis bailarines y un escenario de piedra. Cuerpo, geología y tiempo en una pieza de danza site-specific.',
    longDescription:
      'Una pieza de danza contemporánea inspirada en el paisaje geológico de Minas. Seis intérpretes construyen una coreografía que dialoga con la piedra, el peso y la erosión. La obra propone una experiencia sensorial donde el cuerpo es paisaje y el paisaje es memoria.',
    cast: ['Colectivo Cuerpo de Piedra'],
    director: 'Micaela Domínguez',
    durationMinutes: 65,
    ageRating: '+12',
    image: '/show-assets/contemporary-dance-motion.jpg',
    heroImage: '/show-assets/contemporary-dance-motion.jpg',
    accentColor: '#8B5CF6',
    imageCreditKey: 'contemporary-dance-motion',
    tags: ['danza', 'contemporáneo', 'site-specific'],
    venue: VENUE,
    performances: [
      perf('show-danza-piedra', '2026-08-08', '20:00', 'Sábado 8 de agosto · 20:00', { availabilityStatus: 'soon', priceFrom: 750 }),
      perf('show-danza-piedra', '2026-08-09', '19:00', 'Domingo 9 de agosto · 19:00', { availabilityStatus: 'soon', priceFrom: 750 }),
    ],
  },
  {
    id: 'show-gala-lirica',
    slug: 'gala-lirica',
    title: 'Gala Lírica',
    subtitle: 'Ópera y lied · Gala',
    category: 'musica',
    genre: 'Ópera',
    status: 'upcoming',
    shortDescription:
      'Una gala de ópera con arias y lieder de Mozart, Puccini y Schubert. Voz solista y piano.',
    longDescription:
      'Una noche de gala con la soprano Elena Marín y el pianista Rodrigo Salas. El programa recorre arias de Mozart y Puccini, lieder de Schubert y un cierre con piezas latinoamericanas. Una oportunidad de escuchar la voz lírica en el formato íntimo de la sala Lavalleja.',
    cast: ['Elena Marín (soprano)', 'Rodrigo Salas (piano)'],
    director: 'Rodrigo Salas',
    durationMinutes: 85,
    ageRating: 'APT',
    image: '/show-assets/orchestra.jpg',
    heroImage: '/show-assets/orchestra.jpg',
    accentColor: '#F4B740',
    imageCreditKey: 'orchestra',
    tags: ['ópera', 'lied', 'gala'],
    venue: VENUE,
    performances: [
      perf('show-gala-lirica', '2026-08-15', '20:00', 'Sábado 15 de agosto · 20:00', { availabilityStatus: 'soon', priceFrom: 900 }),
      perf('show-gala-lirica', '2026-08-16', '19:00', 'Domingo 16 de agosto · 19:00', { availabilityStatus: 'soon', priceFrom: 900 }),
    ],
  },
  {
    id: 'show-luz-sala',
    slug: 'funcion-a-la-luz-de-la-sala',
    title: 'Función a la luz de la sala',
    subtitle: 'Especial · Experiencia de sala',
    category: 'especial',
    genre: 'Experiencia',
    status: 'current',
    shortDescription:
      'Una función especial que invita a descubrir la sala desde adentro: acústica, arquitectura y la magia del telón levantado.',
    longDescription:
      'Una experiencia única para conocer el Teatro Lavalleja desde el escenario. Un recorrido guiado por la acústica de la sala, la historia del edificio y los secretos del telón, cerrando con una breve función íntima. Pensado para quienes aman los detalles que hacen de un teatro un lugar mágico.',
    cast: ['Equipo del Teatro Lavalleja'],
    director: 'Coordinación cultural',
    durationMinutes: 70,
    ageRating: 'APT',
    image: '/show-assets/hero-stage-audience.jpg',
    heroImage: '/show-assets/hero-stage-audience.jpg',
    accentColor: '#F8C14A',
    imageCreditKey: 'hero-stage-audience',
    tags: ['especial', 'experiencia', 'sala'],
    venue: VENUE,
    performances: [
      perf('show-luz-sala', '2026-07-09', '18:00', 'Jueves 9 de julio · 18:00', { priceFrom: 550 }),
      perf('show-luz-sala', '2026-07-23', '18:00', 'Jueves 23 de julio · 18:00', { priceFrom: 550 }),
    ],
  },
];

// --- selectores / helpers ---

export function getShowBySlug(slug: string): Show | undefined {
  return SHOWS.find((s) => s.slug === slug);
}

export function getShowById(id: string): Show | undefined {
  return SHOWS.find((s) => s.id === id);
}

export function getPerformanceById(performanceId: string): { show: Show; performance: Performance } | undefined {
  for (const show of SHOWS) {
    const performance = show.performances.find((p) => p.id === performanceId);
    if (performance) return { show, performance };
  }
  return undefined;
}

export function getFeaturedShow(): Show {
  return SHOWS.find((s) => s.status === 'featured') ?? SHOWS[0];
}

export function getCurrentShows(): Show[] {
  return SHOWS.filter((s) => s.status === 'current' || s.status === 'featured');
}

export function getPremieres(): Show[] {
  return SHOWS.filter((s) => s.status === 'premiere');
}

export function getUpcomingShows(): Show[] {
  return SHOWS.filter((s) => s.status === 'upcoming');
}

export interface AgendaItem {
  show: Show;
  performance: Performance;
}

export function getUpcomingAgenda(limit = 6): AgendaItem[] {
  const items: AgendaItem[] = [];
  for (const show of SHOWS) {
    for (const performance of show.performances) {
      if (performance.availabilityStatus === 'cancelled') continue;
      items.push({ show, performance });
    }
  }
  items.sort((a, b) => a.performance.datetime.localeCompare(b.performance.datetime));
  return items.slice(0, limit);
}

export function getNextPerformance(show: Show): Performance | undefined {
  const now = '2026-07-02T00:00:00';
  return show.performances
    .filter((p) => p.availabilityStatus !== 'cancelled' && p.datetime >= now)
    .sort((a, b) => a.datetime.localeCompare(b.datetime))[0];
}

export function getMinPriceFrom(show: Show): number {
  if (show.performances.length === 0) return 0;
  return Math.min(...show.performances.map((p) => p.priceFrom));
}

export const CATEGORY_LABELS: Record<ShowCategory, string> = {
  teatro: 'Teatro',
  musica: 'Música',
  familia: 'Familia',
  danza: 'Danza',
  especial: 'Especial',
};

export const STATUS_LABELS: Record<ShowStatus, string> = {
  current: 'En cartelera',
  upcoming: 'Próximamente',
  premiere: 'Estreno',
  featured: 'Destacada',
};