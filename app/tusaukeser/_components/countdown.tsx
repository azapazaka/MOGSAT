"use client";

import { useEffect, useState } from "react";

import styles from "../invite.module.css";

const UNITS = [
  { key: "days", label: "күн" },
  { key: "hours", label: "сағат" },
  { key: "minutes", label: "минут" },
  { key: "seconds", label: "секунд" },
] as const;

/**
 * Мерекеге дейінгі кері санақ.
 *
 * Бірінші көрсетілімде (серверде) санақ нөлден басталады да, браузер
 * жүктелген бойда нақты уақытқа ауысады. Себебі серверде уақыт басқа болуы
 * мүмкін, ал React екі жақтың нәтижесі бірдей болғанын талап етеді.
 */
export function Countdown({ startsAt }: { startsAt: string }) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date(startsAt).getTime();

    const tick = () => setRemaining(Math.max(0, target - Date.now()));
    tick();

    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [startsAt]);

  if (remaining === 0) {
    return <p className={styles.countdownDone}>Мереке басталды. Қош келдіңіздер!</p>;
  }

  const left = remaining ?? 0;
  const values = {
    days: Math.floor(left / 86_400_000),
    hours: Math.floor(left / 3_600_000) % 24,
    minutes: Math.floor(left / 60_000) % 60,
    seconds: Math.floor(left / 1000) % 60,
  };

  return (
    <div
      className={styles.countdown}
      role="timer"
      aria-live="off"
      aria-label="Мерекеге дейін қалған уақыт"
    >
      {UNITS.map((unit) => (
        <div key={unit.key} className={styles.cdCell}>
          <span className={styles.cdNumber}>{values[unit.key]}</span>
          <span className={styles.cdLabel}>{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
