import { useLayoutEffect, useState, type RefObject } from 'react';

export interface FitToViewTransform {
  scale: number;
  positionX: number;
  positionY: number;
  key: string;
}

export interface FitToViewSize {
  width: number;
  height: number;
}

/**
 * Calcula el transform inicial para que un contenido SVG entre completo
 * dentro del viewport disponible, con un padding suave.
 */
export function useFitToViewTransform(
  viewportRef: RefObject<HTMLElement | null>,
  contentSize: FitToViewSize,
  paddingFactor = 0.96
): FitToViewTransform | null {
  const [fit, setFit] = useState<FitToViewTransform | null>(null);

  useLayoutEffect(() => {
    const element = viewportRef.current;
    if (!element) return;

    const update = () => {
      const viewportWidth = element.clientWidth;
      const viewportHeight = element.clientHeight;
      if (!viewportWidth || !viewportHeight) return;

      const fitScale =
        Math.min(viewportWidth / contentSize.width, viewportHeight / contentSize.height) *
        paddingFactor;

      const positionX = (viewportWidth - contentSize.width * fitScale) / 2;
      const positionY = (viewportHeight - contentSize.height * fitScale) / 2;

      const next: FitToViewTransform = {
        scale: fitScale,
        positionX,
        positionY,
        key: `${viewportWidth}x${viewportHeight}:${contentSize.width}x${contentSize.height}:${paddingFactor}`,
      };

      setFit((prev) =>
        prev &&
        prev.scale === next.scale &&
        prev.positionX === next.positionX &&
        prev.positionY === next.positionY &&
        prev.key === next.key
          ? prev
          : next
      );
    };

    update();

    if (typeof ResizeObserver === 'undefined') {
      const onResize = () => update();
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }

    const observer = new ResizeObserver(() => update());
    observer.observe(element);

    return () => observer.disconnect();
  }, [viewportRef, contentSize.width, contentSize.height, paddingFactor]);

  return fit;
}
