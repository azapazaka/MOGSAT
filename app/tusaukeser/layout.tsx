import type { Metadata, Viewport } from "next";
import { Comfortaa, Cormorant_Infant } from "next/font/google";

import { invite } from "./invite-config";
import styles from "./invite.module.css";

/**
 * Қаріптер.
 *
 * Екеуі де `cyrillic-ext` жиынын қамтиды — қазақ әліпбиіндегі ә, ғ, қ, ң, ө,
 * ү, һ әріптері дәл осы жиында тұр. Онсыз браузер бұл әріптерді басқа
 * қаріппен салып, мәтін ала-құла болып кетеді.
 *
 * Екеуі де айнымалы (variable) қаріп, сондықтан салмағын бөлек сұраудың қажеті
 * жоқ: бір файл барлық жуандықты береді.
 */
const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["cyrillic-ext", "cyrillic", "latin"],
  display: "swap",
});

const cormorantInfant = Cormorant_Infant({
  variable: "--font-cormorant",
  subsets: ["cyrillic-ext", "cyrillic", "latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const title = `${invite.childName} — ${invite.eventKind}`;
const description =
  `${invite.event.dateLabel} ${invite.event.year}, ${invite.event.time}. ` +
  `${invite.event.city}, ${invite.event.venue}. Сіздерді шақырамыз!`;

export const metadata: Metadata = {
  // `absolute` — түбірдегі «%s · MOGSAT» үлгісін айналып өту үшін: шақыруда
  // платформаның аты тұрмауы керек.
  title: { absolute: title },
  description,
  // WhatsApp пен Telegram-да сілтеме осылай көрінеді.
  openGraph: {
    title,
    description,
    type: "website",
    locale: "kk_KZ",
    images: [{ url: invite.heroPhoto.src, alt: invite.heroPhoto.alt }],
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf6ee",
};

export default function TusaukeserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      lang="kk"
      className={`${comfortaa.variable} ${cormorantInfant.variable} ${styles.root}`}
    >
      {children}
    </div>
  );
}
