import type { CSSProperties, ReactNode } from "react";

import styles from "../invite.module.css";
import { makeRandom, PetalShape, PETAL_COLORS } from "./petal";

type RingShape = "oval" | "heart";

/**
 * Мәтінді айнала тұратын гүл жапырақтарының шоғыры — сопақ не жүрек пішінді.
 *
 * Жапырақтар доғаның ұзындығы бойынша бірдей қашықтықта қойылады, сондықтан
 * жүректің ұшында үйіліп қалмайды. Нүктелердің бәрі екі ондыққа дейін
 * дөңгелектенеді — сервер мен браузердегі мән бірдей болады.
 */
export function PetalRing({
  shape = "oval",
  count = 30,
  seed = 1110,
  className,
  children,
}: {
  shape?: RingShape;
  count?: number;
  seed?: number;
  className?: string;
  children: ReactNode;
}) {
  const random = makeRandom(seed);
  const points = shape === "heart" ? heartPoints(count) : ovalPoints(count);

  return (
    <div
      className={[
        styles.ring,
        shape === "heart" ? styles.ringHeart : styles.ringOval,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div aria-hidden="true">
        {points.map((point, index) => {
          const size = 7 + random() * 5;
          const color = PETAL_COLORS[Math.floor(random() * PETAL_COLORS.length)];
          const variant = Math.floor(random() * 2);

          return (
            <span
              key={index}
              className={styles.ringPetal}
              style={
                {
                  "--px": `${point.x}%`,
                  "--py": `${point.y}%`,
                  "--psize": `${size.toFixed(2)}%`,
                  "--prot": `${point.rotation}deg`,
                  animationDelay: `${(index * 0.12).toFixed(2)}s`,
                } as CSSProperties
              }
            >
              <PetalShape color={color} variant={variant} />
            </span>
          );
        })}
      </div>
      <div className={styles.ringContent}>{children}</div>
    </div>
  );
}

type RingPoint = { x: string; y: string; rotation: string };

/** Нүктені пайызға айналдырып, жапырақты сырт жаққа қаратады. */
function toRingPoint(x: number, y: number): RingPoint {
  const dx = x - 50;
  const dy = y - 50;
  // Жапырақтың ұшы жоғары қарайды, сондықтан сыртқа бағыттау үшін осы бұрыш.
  const rotation = (Math.atan2(dx, -dy) * 180) / Math.PI;

  return { x: x.toFixed(2), y: y.toFixed(2), rotation: rotation.toFixed(2) };
}

function ovalPoints(count: number): RingPoint[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2 - Math.PI / 2;
    return toRingPoint(50 + 44 * Math.cos(angle), 50 + 44 * Math.sin(angle));
  });
}

function heartPoints(count: number): RingPoint[] {
  const SAMPLES = 720;
  const curve: { x: number; y: number }[] = [];

  for (let i = 0; i <= SAMPLES; i += 1) {
    const t = (i / SAMPLES) * Math.PI * 2;
    curve.push({
      x: 16 * Math.sin(t) ** 3,
      y:
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t),
    });
  }

  // Доға ұзындығы бойынша бірдей аралықпен бөлу.
  const lengths = [0];
  for (let i = 1; i < curve.length; i += 1) {
    const dx = curve[i].x - curve[i - 1].x;
    const dy = curve[i].y - curve[i - 1].y;
    lengths.push(lengths[i - 1] + Math.hypot(dx, dy));
  }
  const total = lengths[lengths.length - 1];

  const xs = curve.map((p) => p.x);
  const ys = curve.map((p) => p.y);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);

  return Array.from({ length: count }, (_, index) => {
    const target = (index / count) * total;

    let i = 1;
    while (i < lengths.length - 1 && lengths[i] < target) i += 1;

    const span = lengths[i] - lengths[i - 1];
    const ratio = span === 0 ? 0 : (target - lengths[i - 1]) / span;
    const x = curve[i - 1].x + (curve[i].x - curve[i - 1].x) * ratio;
    const y = curve[i - 1].y + (curve[i].y - curve[i - 1].y) * ratio;

    // Математикалық y жоғары өседі, CSS-те — төмен. Сондықтан аударамыз.
    return toRingPoint(
      6 + ((x - xMin) / (xMax - xMin)) * 88,
      6 + ((yMax - y) / (yMax - yMin)) * 88,
    );
  });
}
