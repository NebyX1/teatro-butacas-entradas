/**
 * Script para descargar las imágenes demo de espectáculos desde Wikimedia Commons.
 *
 * Las imágenes son de licencia abierta (CC0, CC BY, CC BY-SA) y se usan como
 * assets locales para evitar hotlinks en runtime.
 *
 * Uso:
 *   node scripts/download-show-assets.mjs
 *
 * O via package.json:
 *   npm run download:show-assets
 *
 * Si un archivo ya existe, se saltea (idempotente).
 */
import { createWriteStream, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from 'node:stream/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = join(__dirname, '..', 'public', 'show-assets');

/**
 * @typedef {Object} AssetDef
 * @property {string} filename
 * @property {string} url
 * @property {string} description
 */
const ASSETS = [
  {
    filename: 'hero-theater-interior.jpg',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Everyman_Palace_Theatre_-_MacCurtain_Street_(5745077424).jpg?width=2200',
    description: 'Hero theater interior (CC BY-SA 2.0)',
  },
  {
    filename: 'hero-stage-audience.jpg',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/The_stage_and_audience_areas_of_Kodak_Theatre..jpg?width=2200',
    description: 'Stage and audience areas (CC BY 2.0)',
  },
  {
    filename: 'bernarda-alba-stage.jpg',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/The_House_Of_Bernarda_Alba_by_Hamazkayin_Arek.jpg?width=1800',
    description: 'La Casa de Bernarda Alba stage production (CC BY-SA 4.0)',
  },
  {
    filename: 'hero-theater-curtain.jpg',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Curtain-939464.jpg?width=1800',
    description: 'Hero theater curtain / theatrical mood (CC0)',
  },
  {
    filename: 'theater-show.jpg',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Theater_Show.jpg?width=1800',
    description: 'General theater performance (CC0)',
  },
  {
    filename: 'theater-stage-premium.jpg',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/La_Fenice_Opera_House_from_the_stage.jpg?width=1800',
    description: 'Premium theater stage / venue (CC BY-SA 4.0)',
  },
  {
    filename: 'concert-hall.jpg',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/WD_concert_hall_stage.jpg?width=1600',
    description: 'Concert hall (CC BY 2.0)',
  },
  {
    filename: 'orchestra.jpg',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/RT%C3%89_Concert_Orchestra_NCH_2.jpg?width=1600',
    description: 'Orchestra performance (CC BY-SA 3.0)',
  },
  {
    filename: 'drama-stage.jpg',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Stage_play_by_students_01.jpg?width=1600',
    description: 'Drama stage (CC BY-SA 4.0)',
  },
  {
    filename: 'ballet-grand-jete.jpg',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ballet_dancer_performing_grand_jet%C3%A9_on_stage.jpg?width=1600',
    description: 'Ballet grand jeté (CC0)',
  },
  {
    filename: 'contemporary-dance-motion.jpg',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Munich_-_Two_dancers_captured_in_blurred_movement_-_7773.jpg?width=1800',
    description: 'Contemporary dance blurred movement (CC0)',
  },
  {
    filename: 'tango-show.jpg',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tango-Show-Buenos-Aires-01.jpg?width=1800',
    description: 'Tango show (CC BY 2.0)',
  },
  {
    filename: 'tango-orchestra.jpg',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/TangoArgentino-Orquesta.jpg?width=1800',
    description: 'Tango orchestra (CC BY 2.0)',
  },
];

async function downloadAsset(asset) {
  const dest = join(ASSETS_DIR, asset.filename);
  if (existsSync(dest)) {
    console.log(`SKIP  ${asset.filename} (ya existe)`);
    return;
  }

  console.log(`DOWN  ${asset.filename} ...`);
  try {
    const res = await fetch(asset.url, {
      headers: { 'User-Agent': 'TeatroLavalleja/0.1 (demo asset downloader)' },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    if (!res.body) {
      throw new Error('Respuesta sin body');
    }
    await pipeline(res.body, createWriteStream(dest));
    console.log(`OK    ${asset.filename}`);
  } catch (err) {
    console.error(`FAIL  ${asset.filename}: ${err.message}`);
    console.error(`      URL: ${asset.url}`);
  }
}

async function main() {
  console.log(`\nDescargando assets de espectáculos a: ${ASSETS_DIR}\n`);
  if (!existsSync(ASSETS_DIR)) {
    mkdirSync(ASSETS_DIR, { recursive: true });
  }
  for (const asset of ASSETS) {
    await downloadAsset(asset);
    // Pequeña pausa para no saturar Wikimedia Commons.
    await new Promise((r) => setTimeout(r, 2000));
  }
  console.log('\nListo. Si alguna descarga falló, volvé a ejecutar el script.');
}

main().catch((err) => {
  console.error('Error fatal:', err);
  process.exit(1);
});