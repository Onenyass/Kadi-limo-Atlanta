import type { VehicleCategory } from "@/content/types";

/**
 * Stylised side-profile illustrations of black vehicles.
 * These are deliberately generic line drawings (no badges or brand details)
 * and are always shown with a visible "Illustration" label, so they cannot be
 * mistaken for photos of Kadi's actual vehicles.
 */

type Shape = {
  body: string;
  glass: string;
  pillars: string[];
  beltline: string;
  wheels: [number, number];
};

const GROUND = 122;
const arch = (cx: number) => `L${cx + 25} ${GROUND} A25 25 0 0 0 ${cx - 25} ${GROUND}`;

const shapes: Record<VehicleCategory, Shape> = {
  suv: {
    wheels: [92, 306],
    body: `M28 ${GROUND} L26 92 Q27 82 40 80 L112 76 L144 51 Q148 48 156 48 L334 47 Q352 48 360 55 L368 74 L370 ${GROUND} ${arch(306)} ${arch(92)} Z`,
    glass: "M122 76 L150 55 L334 54 Q346 55 351 61 L356 78 Z",
    pillars: ["M212 54 L210 78", "M276 54 L276 78"],
    beltline: "M40 90 L366 88",
  },
  sedan: {
    wheels: [96, 304],
    body: `M28 ${GROUND} L26 106 Q28 98 42 96 L132 89 L176 64 Q182 61 190 61 L268 60 Q280 61 290 68 L326 88 L366 92 Q372 96 372 106 L371 ${GROUND} ${arch(304)} ${arch(96)} Z`,
    glass: "M146 88 L182 67 Q186 65 192 65 L266 64 Q276 65 284 71 L310 88 Z",
    pillars: ["M232 64 L230 88"],
    beltline: "M42 100 L368 98",
  },
  limousine: {
    wheels: [58, 346],
    body: `M10 ${GROUND} L9 106 Q10 99 20 97 L74 91 L102 70 Q106 67 112 67 L322 66 Q332 67 340 72 L362 90 L386 93 Q392 97 392 106 L391 ${GROUND} ${arch(346)} ${arch(58)} Z`,
    glass: "M86 90 L108 72 Q110 70 114 70 L320 70 Q328 71 334 76 L350 90 Z",
    pillars: ["M136 70 L136 90", "M186 70 L186 90", "M236 70 L236 90", "M286 70 L286 90"],
    beltline: "M20 100 L388 98",
  },
  luxury: {
    wheels: [98, 306],
    body: `M30 ${GROUND} L29 92 Q30 86 38 85 L150 80 L186 58 Q192 55 200 55 L284 55 Q296 56 304 62 L340 86 L370 89 Q376 93 376 104 L375 ${GROUND} ${arch(306)} ${arch(98)} Z`,
    glass: "M162 80 L192 60 Q196 59 202 59 L282 59 Q292 60 298 66 L322 82 Z",
    pillars: ["M244 59 L242 81"],
    beltline: "M38 96 L372 94",
  },
};

export function VehicleArt({
  category,
  title,
}: {
  category: VehicleCategory;
  title: string;
}) {
  const s = shapes[category];
  const id = `va-${category}`;
  return (
    <svg viewBox="0 30 400 130" role="img" aria-label={title}>
      <title>{title}</title>
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#46534d" />
          <stop offset="0.38" stopColor="#1a221f" />
          <stop offset="1" stopColor="#070908" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5d6b64" />
          <stop offset="1" stopColor="#1c2522" />
        </linearGradient>
        <radialGradient id={`${id}-shadow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.7" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="200" cy={GROUND + 24} rx="196" ry="10" fill={`url(#${id}-shadow)`} />
      <path d={s.body} fill={`url(#${id}-body)`} stroke="#d8c4a0" strokeOpacity="0.5" strokeWidth="1" />
      <path d={s.glass} fill={`url(#${id}-glass)`} />
      {s.pillars.map((d) => (
        <path key={d} d={d} stroke="#0b100e" strokeWidth="5" />
      ))}
      <path d={s.beltline} stroke="#d8c4a0" strokeOpacity="0.45" strokeWidth="1" />
      {s.wheels.map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={GROUND + 2} r="20" fill="#070908" />
          <circle cx={cx} cy={GROUND + 2} r="12" fill="none" stroke="#c2a677" strokeOpacity="0.55" strokeWidth="1.2" />
          <circle cx={cx} cy={GROUND + 2} r="3" fill="#c2a677" fillOpacity="0.6" />
        </g>
      ))}
    </svg>
  );
}
