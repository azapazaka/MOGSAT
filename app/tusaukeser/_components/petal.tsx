/**
 * Гүл жапырағының суреті және оны орналастыруға керек кездейсоқ сандар.
 *
 * Кездейсоқ сандар `mulberry32` арқылы алынады: онда тек бүтін сандық амалдар
 * бар, сондықтан сервер мен браузер бірдей мәнді береді және React-те
 * гидратация қатесі шықпайды (`Math.random()` мұны бере алмайды).
 */

/** Жапырақ түстері — крем, шабдалы-қызғылт және алтын реңктер. */
export const PETAL_COLORS = [
  "#f4cbd0",
  "#e9aab3",
  "#d98b92",
  "#f8ded4",
  "#efd0a6",
  "#dfb274",
  "#fce9db",
] as const;

const PETAL_PATHS = [
  // Жалын тәрізді жапырақ: ұшы үшкір, түбі дөңгелек.
  "M12 1c5 5 8 10 8 13.5C20 19 16.4 22.5 12 22.5S4 19 4 14.5C4 11 7 6 12 1Z",
  // Сәл қисық, жұмсақ жапырақ.
  "M12.6 1.6c5.6 3.9 8.3 9.8 5.6 15-1.9 3.7-4.6 5.9-6.7 5.9-2.4 0-5.3-2.5-6.8-6.2C2.4 10.8 6 5 12.6 1.6Z",
] as const;

/** Бір жапырақ. Өлшемін сыртқы элемент белгілейді. */
export function PetalShape({ color, variant = 0 }: { color: string; variant?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
      style={{ display: "block", overflow: "visible" }}
    >
      <path d={PETAL_PATHS[variant % PETAL_PATHS.length]} fill={color} />
      {/* Жұмсақ жылтыр — жапырақ жалпақ көрінбеуі үшін. */}
      <ellipse
        cx="9.6"
        cy="9.2"
        rx="2.9"
        ry="4.8"
        fill="#ffffff"
        opacity="0.32"
        transform="rotate(-18 9.6 9.2)"
      />
    </svg>
  );
}

/**
 * mulberry32 — тек бүтін сандық амалдарға негізделген генератор.
 * Бір `seed` әрқашан бірдей тізбек береді.
 */
export function makeRandom(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
