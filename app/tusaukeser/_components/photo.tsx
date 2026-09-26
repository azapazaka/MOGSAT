"use client";

import { useState } from "react";

import styles from "../invite.module.css";
import { OrnamentMini } from "./ornament";

/**
 * Сурет — ашылмай қалса, орнында өрнекті орын тұрады.
 *
 * Суреттер Unsplash-тен алынған, ал ондай сілтеме уақыт өте жойылуы мүмкін.
 * Сондықтан қате шыққанда бет бұзылмай, өрнекті жұмсақ фон көрінеді.
 *
 * `next/image` емес, қарапайым `<img>` қолданылады: сыртқы суреттер үшін
 * `next.config.ts` ішіне домен қосудың қажеті болмасын деп.
 */
export function Photo({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <span className={[styles.photoWrap, className].filter(Boolean).join(" ")}>
      {failed ? (
        <span className={styles.photoFallback}>
          <OrnamentMini />
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={styles.photoImg}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
