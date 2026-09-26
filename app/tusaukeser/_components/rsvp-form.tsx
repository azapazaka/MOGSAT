"use client";

import { useState, type FormEvent } from "react";

import styles from "../invite.module.css";
import { OrnamentMini } from "./ornament";

type Answer = "yes" | "no";

const CHOICES: { value: Answer; label: string }[] = [
  { value: "yes", label: "Иә, келемін" },
  { value: "no", label: "Өкінішке орай, келе алмаймын" },
];

const GUEST_COUNTS = ["1", "2", "3", "4", "5+"];

/**
 * Қонақтың жауабы.
 *
 * Жауап ешқайда жіберілмейді — бет серверсіз жұмыс істейді, сондықтан
 * толтырған адам бірден алғыс сөзін көреді.
 *
 * Жауаптарды шынымен алғыңыз келсе, төмендегі `handleSubmit` ішіндегі
 * белгіленген жерге бір жол қосу жеткілікті. Мысалы, WhatsApp арқылы:
 *
 *   const text = `${name} — ${answer === "yes" ? "келеді" : "келмейді"}`;
 *   window.open(`https://wa.me/77010000000?text=${encodeURIComponent(text)}`);
 *
 * (77010000000 — той иесінің нөмірі.)
 */
export function RsvpForm() {
  const [name, setName] = useState("");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [guests, setGuests] = useState("1");
  const [wish, setWish] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Есіміңізді жазыңыз.");
      return;
    }

    if (!answer) {
      setError("Келетін-келмейтініңізді белгілеңіз.");
      return;
    }

    setError(null);

    // ← Жауапты жіберу керек болса, дәл осы жерге қосыңыз.

    setSent(true);
  }

  function reset() {
    setSent(false);
    setError(null);
  }

  if (sent) {
    return (
      <div className={styles.thanks}>
        <OrnamentMini className={styles.hostDivider} />
        <p className={`${styles.script} ${styles.thanksTitle}`}>Рақмет!</p>
        <p className={styles.thanksText}>
          {answer === "yes" ? (
            <>
              {name.trim()}, жауабыңыз үшін рақмет. Сіздi ақ дастарқанымыздың
              төрінен күтеміз!
            </>
          ) : (
            <>
              {name.trim()}, хабарлағаныңыз үшін рақмет. Қуанышымызды алыстан
              болса да бөліскеніңіз үшін алғыс айтамыз.
            </>
          )}
        </p>
        {wish.trim() ? (
          <p className={styles.thanksText}>
            <em>«{wish.trim()}»</em>
          </p>
        ) : null}
        <button type="button" className={styles.linkButton} onClick={reset}>
          Жауапты өзгерту
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="rsvp-name">
          Есіміңіз
        </label>
        <input
          id="rsvp-name"
          className={styles.input}
          type="text"
          name="name"
          autoComplete="name"
          placeholder="Есіміңіз бен тегіңіз"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <fieldset className={styles.field} style={{ border: 0, margin: 0, padding: 0 }}>
        <legend className={styles.fieldLabel}>Тойға келесіз бе?</legend>
        <div className={styles.choices}>
          {CHOICES.map((choice) => (
            <label
              key={choice.value}
              className={`${styles.choice} ${
                answer === choice.value ? styles.choiceSelected : ""
              }`}
            >
              <input
                type="radio"
                name="answer"
                value={choice.value}
                checked={answer === choice.value}
                onChange={() => setAnswer(choice.value)}
              />
              <span className={styles.choiceDot} aria-hidden="true" />
              {choice.label}
            </label>
          ))}
        </div>
      </fieldset>

      {answer === "yes" ? (
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="rsvp-guests">
            Қанша адам боласыздар?
          </label>
          <select
            id="rsvp-guests"
            className={styles.select}
            value={guests}
            onChange={(event) => setGuests(event.target.value)}
          >
            {GUEST_COUNTS.map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="rsvp-wish">
          Ақ тілегіңіз <span style={{ textTransform: "none" }}>(қаласаңыз)</span>
        </label>
        <textarea
          id="rsvp-wish"
          className={styles.textarea}
          placeholder="Бір ауыз тілек жазып кетсеңіз..."
          value={wish}
          onChange={(event) => setWish(event.target.value)}
        />
      </div>

      {error ? (
        <p className={styles.formError} role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" className={styles.submit}>
        Жауапты жіберу
      </button>
    </form>
  );
}
