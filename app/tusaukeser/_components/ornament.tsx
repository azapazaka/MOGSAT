/**
 * Ұлттық өрнек және ұсақ белгішелер.
 *
 * Өрнектің негізі — «қошқар мүйіз»: қазақ оюындағы ең таныс мотив. Мұнда ол
 * қарапайым, заманауи сызықпен берілген. Бәрі `currentColor` арқылы боялады,
 * сондықтан түсі әрқашан маңайындағы мәтінмен үйлеседі.
 */

/** Бөлімдерді бөліп тұратын ою. */
export function OrnamentDivider({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 44" className={className} aria-hidden="true" focusable="false">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 22h86" opacity="0.45" />
        <path d="M148 22h86" opacity="0.45" />
        <g transform="translate(120 22)">
          <path d="M0 3C0-8 9-13.5 15.5-10 22-6.5 19 2 12 1.5 7.5 1.2 7-3.5 10.5-5" />
          <path d="M0 3C0-8-9-13.5-15.5-10-22-6.5-19 2-12 1.5-7.5 1.2-7-3.5-10.5-5" />
          <path d="M0 5.5l3.6 4.2L0 14l-3.6-4.3z" />
        </g>
      </g>
    </svg>
  );
}

/** Есімдердің арасына қойылатын кішкентай ою. */
export function OrnamentMini({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 20" className={className} aria-hidden="true" focusable="false">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 15C16 6 21 2.5 25 5s1.5 8-3 7" />
        <path d="M16 15C16 6 11 2.5 7 5s-1.5 8 3 7" />
        <path d="M16 15.5l2.4 2.8-2.4 2.8-2.4-2.8z" transform="translate(0 -4)" />
      </g>
    </svg>
  );
}

type IconProps = { className?: string; size?: number };

function icon(path: React.ReactNode) {
  return function Icon({ className, size = 20 }: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        {path}
      </svg>
    );
  };
}

export const IconPin = icon(
  <>
    <path d="M20 10c0 5.2-6.4 11-8 11s-8-5.8-8-11a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="2.8" />
  </>,
);

export const IconCalendar = icon(
  <>
    <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
    <path d="M3.5 10h17M8.5 3v4M15.5 3v4" />
  </>,
);

export const IconClock = icon(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 1.9" />
  </>,
);

export const IconArrow = icon(<path d="M8 16 16 8M9.5 8H16v6.5" />);

export const IconNote = icon(
  <>
    <path d="M9.5 18V6.2l9-1.7V16" />
    <circle cx="7" cy="18" r="2.6" />
    <circle cx="16" cy="16" r="2.6" />
  </>,
);
