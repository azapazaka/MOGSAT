"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { invite } from "../invite-config";
import styles from "../invite.module.css";
import { FallingPetals } from "./falling-petals";
import { IconNote } from "./ornament";
import { PetalRing } from "./petal-ring";

/**
 * Беттің сыртқы қабығы: ашатын экран, музыка және ұшып жүрген жапырақтар.
 *
 * Браузерлер дыбысты өз бетінше қоса алмайды — адам бір рет баспаса, ол
 * үнсіз қалады. Сондықтан бет «Шақыруды ашу» түймесінен басталады: сол басу
 * әрі шақыруды ашады, әрі әуенді қосады. Содан кейін оң жақ төменде кішкентай
 * түйме тұрады, әуенді кез келген сәтте тоқтатуға болады.
 */
export function InviteShell({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  /** Файл `public/music/` ішінде жоқ болса, түйме мүлде көрсетілмейді. */
  const [audioAvailable, setAudioAvailable] = useState(true);

  // Шақыру ашылғанша бет айналмайды.
  useEffect(() => {
    if (opened) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [opened]);

  async function startAudio() {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      await audio.play();
      setPlaying(true);
    } catch {
      // Файл жоқ немесе браузер рұқсат бермеді — шақыру бәрібір ашылады.
      setPlaying(false);
    }
  }

  function handleOpen() {
    setOpened(true);
    void startAudio();
  }

  function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      void startAudio();
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  const nameLines = invite.childNameLines ?? [invite.childName];

  return (
    <>
      {/* JS өшірулі болса, шақыру бәрібір оқылады. */}
      <noscript>
        <style>{`.${styles.gate}{display:none!important}.${styles.reveal}{opacity:1!important;transform:none!important}`}</style>
      </noscript>

      <audio
        ref={audioRef}
        src={invite.music.src}
        loop
        preload="none"
        onError={() => setAudioAvailable(false)}
      />

      <FallingPetals count={16} />

      <div
        className={`${styles.gate} ${opened ? styles.gateClosing : ""}`}
        aria-hidden={opened}
      >
        <div className={styles.gateInner}>
          <PetalRing count={26} seed={4411} className={styles.ringSmall}>
            <p className={styles.eyebrow}>{invite.eventKind}</p>
            {/* Беттің нағыз тақырыбы — бірінші экрандағы <h1>, мұнда қайталамаймыз. */}
            <p className={`${styles.script} ${styles.gateName}`}>
              {nameLines.map((line) => (
                <span key={line} className={styles.heroNameLine}>
                  {line}
                </span>
              ))}
            </p>
            <p className={styles.gateHint}>
              {invite.event.dateLabel} {invite.event.year}
            </p>
          </PetalRing>

          <button type="button" className={styles.gateButton} onClick={handleOpen}>
            <IconNote size={18} />
            Шақыруды ашу
          </button>
          <p className={styles.gateNote}>Әуенмен ашылады</p>
        </div>
      </div>

      <div className={styles.page}>{children}</div>

      {opened && audioAvailable ? (
        <button
          type="button"
          onClick={toggleAudio}
          className={`${styles.musicButton} ${playing ? styles.musicPlaying : ""}`}
          aria-pressed={playing}
          aria-label={playing ? "Әуенді тоқтату" : "Әуенді қосу"}
          title={invite.music.title}
        >
          <span className={styles.musicBars} aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
        </button>
      ) : null}
    </>
  );
}
