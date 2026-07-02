/**
 * Constantes compartidas por los tres palcos (A, B, C).
 *
 * Su objetivo es garantizar que:
 *  - El ancho/alto de butaca, el radio de las mismas, el tamaño de la
 *    etiqueta y la separación interna sean los mismos para todos los palcos.
 *  - El viewBox de referencia (y por lo tanto el fit-to-view / minZoom) sea
 *    compartido, de modo que al hacer zoom mínimo las butacas se vean del
 *    mismo tamaño en pantalla en cualquiera de los tres palcos.
 *
 * Cada palco conserva su geometría local (segmentos, posiciones, etiquetas)
 * pero al renderizar se centra dentro de este viewBox común, de forma que
 * las butacas mantienen el mismo tamaño visual entre sectores.
 */

export interface PalcoViewBox {
  width: number;
  height: number;
}

/**
 * ViewBox común usado como referencia para el cálculo de fit-to-view de
 * los palcos. Se toma el palco más grande (Palco C) como referencia común
 * para que las butacas no crezcan artificialmente en los palcos más chicos.
 */
export const PALCO_VIEWBOX: PalcoViewBox = {
  width: 2000,
  height: 1500,
};

/**
 * Aliases explícitos para usar como "ancho/alto del canvas compartido"
 * en componentes y CSS. Son los mismos valores que `PALCO_VIEWBOX` pero
 * con un nombre que hace explícita la intención (canvas/artboard en vez
 * de ventana de coordenadas).
 */
export const PALCO_CANVAS_WIDTH = PALCO_VIEWBOX.width;
export const PALCO_CANVAS_HEIGHT = PALCO_VIEWBOX.height;

/**
 * Padding interno reservado dentro del canvas compartido para que el
 * contenido del palco no quede pegado al borde. Es un valor en unidades
 * de viewBox; el palco se centra restando este margen a las dimensiones
 * efectivas del rectángulo visible.
 */
export const PALCO_INNER_PADDING = 60;

/**
 * Dimensiones canónicas de butaca para todos los palcos.
 * Cualquier cambio aquí se refleja en los tres sectores.
 */
export const PALCO_SEAT_WIDTH = 38;
export const PALCO_SEAT_HEIGHT = 26;
export const PALCO_SEAT_RADIUS = 8;

/**
 * Tamaño de fuente del número de butaca (canónico y compartido).
 */
export const PALCO_SEAT_FONT_SIZE = 11;

/**
 * Separación mínima entre butacas adyacentes (canónica y compartida).
 */
export const PALCO_SEAT_GAP = 12;

/**
 * Calcula la traslación necesaria para centrar el contenido local de un
 * palco dentro del viewBox compartido, dejando un margen interno uniforme
 * (PALCO_INNER_PADDING) para que ninguna butaca o borde del palco quede
 * pegado al borde del canvas compartido.
 *
 * El contenido de cada palco ocupa un rectángulo
 *   [0..contentWidth] x [0..contentHeight]
 * en sus coordenadas locales; para que su centro coincida con el centro
 * del área interior del viewBox común (descontando el padding) hay que
 * desplazarlo por la mitad de la diferencia entre el área interior del
 * canvas y el contenido local.
 */
export function palcoCenterOffset(
  contentSize: PalcoViewBox
): { tx: number; ty: number } {
  const innerW = PALCO_VIEWBOX.width - PALCO_INNER_PADDING * 2;
  const innerH = PALCO_VIEWBOX.height - PALCO_INNER_PADDING * 2;
  return {
    tx: PALCO_INNER_PADDING + (innerW - contentSize.width) / 2,
    ty: PALCO_INNER_PADDING + (innerH - contentSize.height) / 2,
  };
}
