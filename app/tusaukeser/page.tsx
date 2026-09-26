import { Countdown } from "./_components/countdown";
import { InviteShell } from "./_components/invite-shell";
import {
  IconArrow,
  IconCalendar,
  IconClock,
  IconPin,
  OrnamentDivider,
  OrnamentMini,
} from "./_components/ornament";
import { PetalRing } from "./_components/petal-ring";
import { Photo } from "./_components/photo";
import { Reveal } from "./_components/reveal";
import { RsvpForm } from "./_components/rsvp-form";
import { invite } from "./invite-config";
import styles from "./invite.module.css";

const { event, greeting, hosts, maps, photos, heroPhoto } = invite;

const nameLines = invite.childNameLines ?? [invite.childName];

const details = [
  {
    icon: IconPin,
    label: "Өтетін орны",
    value: event.venue,
    meta: event.city,
  },
  {
    icon: IconCalendar,
    label: "Күні",
    value: event.dateLabel,
    meta: `${event.year} жыл, ${event.weekday}`,
  },
  {
    icon: IconClock,
    label: "Уақыты",
    value: event.time,
    meta: "Ақ дастарқан басталуы",
  },
];

export default function TusaukeserPage() {
  return (
    <InviteShell>
      {/* ---------------------------------------------------------------- */}
      {/* Бірінші экран                                                     */}
      {/* ---------------------------------------------------------------- */}
      <section className={styles.hero}>
        <p className={styles.eyebrow}>{invite.eventKind}</p>

        <div className={styles.heroFrame}>
          <Photo
            src={heroPhoto.src}
            alt={heroPhoto.alt}
            className={styles.heroPhoto}
            priority
          />
        </div>

        <h1 className={`${styles.script} ${styles.heroName}`}>
          {nameLines.map((line) => (
            <span key={line} className={styles.heroNameLine}>
              {line}
            </span>
          ))}
        </h1>

        <OrnamentDivider className={styles.ornament} />

        <p className={styles.heroDate}>
          {event.dateLabel} {event.year} · {event.time}
        </p>

        <p className={styles.scrollCue} aria-hidden="true">
          <span>Төмен қарай</span>
          <span />
        </p>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Шақыру сөзі                                                       */}
      {/* ---------------------------------------------------------------- */}
      <section className={styles.section} aria-labelledby="invite-greeting">
        <div className={styles.inner}>
          <Reveal>
            <PetalRing count={32} seed={7788}>
              <p className={styles.eyebrow} id="invite-greeting">
                Шақыру
              </p>
              <p className={`${styles.script} ${styles.ringName}`}>
                {nameLines.join(" ")}
              </p>
              <p className={styles.ringText}>{greeting.salutation}</p>
            </PetalRing>
          </Reveal>

          <Reveal delay={120}>
            <p className={styles.lead}>{greeting.body}</p>
            <OrnamentDivider className={styles.ornament} />
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Кері санақ                                                        */}
      {/* ---------------------------------------------------------------- */}
      <section className={styles.section} aria-labelledby="invite-countdown">
        <div className={styles.inner}>
          <h2 className={styles.eyebrow} id="invite-countdown">
            Мерекеге дейін
          </h2>

          <Reveal>
            <PetalRing shape="heart" count={36} seed={9090}>
              <p className={styles.dateBadge}>{event.dateNumeric}</p>
              <p className={styles.startsAt}>
                басталуы <b>{event.time}</b>
              </p>
              <Countdown startsAt={event.startsAt} />
            </PetalRing>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Мереке мәліметтері                                                */}
      {/* ---------------------------------------------------------------- */}
      <section className={styles.section} aria-labelledby="invite-details">
        <div className={styles.innerWide}>
          <Reveal>
            <h2 className={styles.eyebrow} id="invite-details">
              Мереке мәліметтері
            </h2>

            <div className={styles.cardGrid}>
              {details.map(({ icon: Icon, label, value, meta }) => (
                <div key={label} className={styles.card}>
                  <span className={styles.cardIcon}>
                    <Icon size={21} />
                  </span>
                  <div>
                    <p className={styles.cardLabel}>{label}</p>
                    <p className={styles.cardValue}>{value}</p>
                    <p className={styles.cardMeta}>{meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Той иелері                                                        */}
      {/* ---------------------------------------------------------------- */}
      <section className={styles.section} aria-labelledby="invite-hosts">
        <div className={styles.inner}>
          <Reveal>
            <h2 className={styles.eyebrow} id="invite-hosts">
              Той иелері
            </h2>

            <div className={styles.hostList}>
              {hosts.map((host, index) => (
                <div key={host.role}>
                  {index > 0 ? <OrnamentMini className={styles.hostDivider} /> : null}
                  <p className={styles.hostRole}>{host.role}</p>
                  <p className={`${styles.script} ${styles.hostNames}`}>{host.names}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Суреттер                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className={styles.section} aria-labelledby="invite-photos">
        <div className={styles.innerWide}>
          <Reveal>
            <h2 className={styles.eyebrow} id="invite-photos">
              Қуанышты сәттер
            </h2>

            <div className={styles.gallery}>
              {photos.map((photo) => (
                <figure key={photo.src} className={styles.galleryItem}>
                  <Photo
                    src={photo.src}
                    alt={photo.alt}
                    className={styles.galleryPhoto}
                  />
                  <figcaption className={styles.galleryCaption}>
                    {photo.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Карта                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className={styles.section} aria-labelledby="invite-map">
        <div className={styles.inner}>
          <Reveal>
            <h2 className={styles.eyebrow} id="invite-map">
              Той өтетін орын
            </h2>

            <p className={styles.address}>{event.venue}</p>
            <p className={styles.addressCity}>{event.city}</p>

            <div className={styles.mapButtons}>
              <a
                className={styles.mapButton}
                href={maps.twogis}
                target="_blank"
                rel="noreferrer noopener"
              >
                <IconPin size={18} />
                2ГИС-пен ашу
                <IconArrow size={16} />
              </a>
              <a
                className={`${styles.mapButton} ${styles.mapButtonGhost}`}
                href={maps.google}
                target="_blank"
                rel="noreferrer noopener"
              >
                <IconPin size={18} />
                Google Maps
                <IconArrow size={16} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Қатысуды растау                                                   */}
      {/* ---------------------------------------------------------------- */}
      <section className={styles.section} aria-labelledby="invite-rsvp">
        <div className={styles.inner}>
          <Reveal>
            <h2 className={styles.eyebrow} id="invite-rsvp">
              Қатысуыңызды растаңыз
            </h2>
            <p className={styles.lead}>
              Дастарқан басын дайындап қою үшін келе алатыныңызды білдірсеңіз
              деп өтінеміз.
            </p>

            <RsvpForm />
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Аяқталуы                                                          */}
      {/* ---------------------------------------------------------------- */}
      <footer className={styles.footer}>
        <Reveal>
          <OrnamentDivider className={styles.ornament} />
          <p className={styles.lead}>Сіздерді ақ дастарқанымыздың төрінен күтеміз!</p>
          <p className={`${styles.script} ${styles.footerName}`}>
            {nameLines.join(" ")}
          </p>
          <p className={styles.footerNote}>
            {event.dateLabel} {event.year} · {event.city}
          </p>
        </Reveal>
      </footer>
    </InviteShell>
  );
}
