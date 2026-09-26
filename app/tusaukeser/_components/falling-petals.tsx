import type { CSSProperties } from "react";

import styles from "../invite.module.css";
import { makeRandom, PetalShape, PETAL_COLORS } from "./petal";

/**
 * Бет бойынша үздіксіз ұшып жүретін жапырақтар.
 *
 * Үш қабат қозғалыс бір-біріне қосылады: сыртқы элемент төмен түседі,
 * ортаңғысы солға-оңға тербеледі, ішкісі айналады. Барлығы `transform` арқылы
 * жасалады, сондықтан браузер оны GPU-да салады — телефонда да жеңіл.
 *
 * Анимация `position: fixed` қабатта жүреді және `pointer-events: none`,
 * сондықтан басуға кедергі келтірмейді. Пайдаланушы жүйесінде «қозғалысты
 * азайту» қосулы болса, жапырақтар тоқтап қалады (globals.css-тегі
 * `prefers-reduced-motion` ережесі).
 */
export function FallingPetals({ count = 16, seed = 20261011 }: { count?: number; seed?: number }) {
  const random = makeRandom(seed);

  const petals = Array.from({ length: count }, (_, index) => {
    const size = 13 + random() * 21;
    const left = random() * 100;
    const fallDuration = 14 + random() * 13;
    const fallDelay = -random() * 27;
    const swayDuration = 3 + random() * 3.2;
    const spinDuration = 7 + random() * 9;
    const spinFrom = random() * 360;
    const spinTurn = random() > 0.5 ? 360 : -360;
    // Әдейі солғын: жапырақ мәтіннің үстінен өткенде оқуға кедергі болмауы керек.
    const opacity = 0.3 + random() * 0.35;
    const color = PETAL_COLORS[Math.floor(random() * PETAL_COLORS.length)];
    const variant = Math.floor(random() * 2);

    return {
      key: index,
      color,
      variant,
      style: {
        "--x": `${left.toFixed(2)}%`,
        "--size": `${size.toFixed(2)}px`,
        "--op": opacity.toFixed(2),
        "--rot-from": `${spinFrom.toFixed(2)}deg`,
        "--rot-to": `${(spinFrom + spinTurn).toFixed(2)}deg`,
        animationDuration: `${fallDuration.toFixed(2)}s`,
        animationDelay: `${fallDelay.toFixed(2)}s`,
      } as CSSProperties,
      swayStyle: {
        animationDuration: `${swayDuration.toFixed(2)}s`,
        animationDelay: `${fallDelay.toFixed(2)}s`,
      } as CSSProperties,
      spinStyle: {
        animationDuration: `${spinDuration.toFixed(2)}s`,
        animationDelay: `${fallDelay.toFixed(2)}s`,
      } as CSSProperties,
    };
  });

  return (
    <div className={styles.petalLayer} aria-hidden="true">
      {petals.map((petal) => (
        <span key={petal.key} className={styles.petal} style={petal.style}>
          <span className={styles.petalSway} style={petal.swayStyle}>
            <span className={styles.petalSpin} style={petal.spinStyle}>
              <PetalShape color={petal.color} variant={petal.variant} />
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}
