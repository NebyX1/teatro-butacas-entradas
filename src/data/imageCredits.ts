/**
 * Créditos de imágenes demo usadas en el sitio.
 *
 * Todas las imágenes son de licencia abierta (CC0, CC BY, CC BY-SA)
 * descargadas desde Wikimedia Commons a `public/show-assets/`.
 * Los créditos son necesarios porque varias licencias requieren atribución.
 */

export interface ImageCredit {
  key: string;
  title: string;
  author: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
  localPath: string;
}

export const IMAGE_CREDITS: ImageCredit[] = [
  {
    key: 'hero-theater-interior',
    title: 'Everyman Palace Theatre, MacCurtain Street',
    author: 'William Murphy',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Everyman_Palace_Theatre_-_MacCurtain_Street_(5745077424).jpg',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
    localPath: '/show-assets/hero-theater-interior.jpg',
  },
  {
    key: 'hero-stage-audience',
    title: 'The stage and audience areas of Kodak Theatre',
    author: 'Los Angeles',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:The_stage_and_audience_areas_of_Kodak_Theatre..jpg',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    localPath: '/show-assets/hero-stage-audience.jpg',
  },
  {
    key: 'bernarda-alba-stage',
    title: 'The House of Bernarda Alba by Hamazkayin Arek',
    author: 'Hamazkayin Arek',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:The_House_Of_Bernarda_Alba_by_Hamazkayin_Arek.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    localPath: '/show-assets/bernarda-alba-stage.jpg',
  },
  {
    key: 'hero-theater-curtain',
    title: 'Curtain',
    author: 'Anónimo (Pixabay)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Curtain-939464.jpg',
    license: 'CC0 1.0 (dominio público)',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    localPath: '/show-assets/hero-theater-curtain.jpg',
  },
  {
    key: 'theater-show',
    title: 'Theater Show',
    author: 'Anónimo (Pixabay)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Theater_Show.jpg',
    license: 'CC0 1.0 (dominio público)',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    localPath: '/show-assets/theater-show.jpg',
  },
  {
    key: 'theater-stage-premium',
    title: 'La Fenice Opera House from the stage',
    author: 'Andreas F. Borchert',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:La_Fenice_Opera_House_from_the_stage.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    localPath: '/show-assets/theater-stage-premium.jpg',
  },
  {
    key: 'concert-hall',
    title: 'WD concert hall stage',
    author: 'Wolfgang Staudt',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:WD_concert_hall_stage.jpg',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    localPath: '/show-assets/concert-hall.jpg',
  },
  {
    key: 'orchestra',
    title: 'RTÉ Concert Orchestra NCH 2',
    author: 'William Murphy',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:RT%C3%89_Concert_Orchestra_NCH_2.jpg',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    localPath: '/show-assets/orchestra.jpg',
  },
  {
    key: 'drama-stage',
    title: 'Stage play by students 01',
    author: 'Marek Ślusarczyk',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Stage_play_by_students_01.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    localPath: '/show-assets/drama-stage.jpg',
  },
  {
    key: 'ballet-grand-jete',
    title: 'Ballet dancer performing grand jeté on stage',
    author: 'Anónimo',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ballet_dancer_performing_grand_jet%C3%A9_on_stage.jpg',
    license: 'CC0 1.0 (dominio público)',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    localPath: '/show-assets/ballet-grand-jete.jpg',
  },
  {
    key: 'contemporary-dance-motion',
    title: 'Munich - Two dancers captured in blurred movement',
    author: 'Anónimo',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Munich_-_Two_dancers_captured_in_blurred_movement_-_7773.jpg',
    license: 'CC0 1.0 (dominio público)',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    localPath: '/show-assets/contemporary-dance-motion.jpg',
  },
  {
    key: 'tango-show',
    title: 'Tango Show Buenos Aires 01',
    author: 'Cmichel67',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tango-Show-Buenos-Aires-01.jpg',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    localPath: '/show-assets/tango-show.jpg',
  },
  {
    key: 'tango-orchestra',
    title: 'Tango Argentino Orquesta',
    author: 'Anónimo',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:TangoArgentino-Orquesta.jpg',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    localPath: '/show-assets/tango-orchestra.jpg',
  },
];

export function getCreditByKey(key: string): ImageCredit | undefined {
  return IMAGE_CREDITS.find((c) => c.key === key);
}