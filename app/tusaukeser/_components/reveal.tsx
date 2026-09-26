"use client";

import { useCallback, useState, type ReactNode } from "react";

import styles from "../invite.module.css";

/**
 * Бөлім экранға кіргенде жұмсақ шығып келеді.
 *
 * `IntersectionObserver` жоқ ескі браузерде мазмұн бірден көрінеді — ештеңе
 * жасырын қалмайды. Жүйеде «қозғалысты азайту» қосулы болса, ауысу лезде
 * өтеді (globals.css-тегі ереже).
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  // Бақылаушы `ref` арқылы жалғанады: элемент пайда болған сәтте қосылып,
  // жойылғанда өшеді. Сол себепті `useEffect` керек емес.
  const observe = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={observe}
      className={[styles.reveal, visible ? styles.revealVisible : "", className]
        .filter(Boolean)
        .join(" ")}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
