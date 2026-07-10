/**
 * Film grain: tiling SVG turbulence at 3% opacity, fixed above the color
 * layers but below content (§3.5, §210). Pure CSS — zero JS cost.
 */
const GRAIN_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="256" height="256" filter="url(#n)"/></svg>`,
);

export function GrainOverlay() {
  return (
    <div
      aria-hidden
      data-fx-layer
      /* Above the aurora (-z-10), below content (§3.5 layer order) — so grain
         textures the ambient backdrop without sitting on top of text. */
      className="pointer-events-none fixed inset-0 -z-[5]"
      style={{
        backgroundImage: `url("data:image/svg+xml,${GRAIN_SVG}")`,
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
        opacity: 0.03,
      }}
    />
  );
}
