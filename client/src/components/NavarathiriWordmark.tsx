type NavarathiriWordmarkProps = { compact?: boolean; showEdition?: boolean };

export default function NavarathiriWordmark({ compact = false, showEdition = true }: NavarathiriWordmarkProps) {
  return (
    <span className={`navarathiri-lockup ${compact ? "lockup-compact" : "lockup-display"}`}>
      <span className="wordmark-lettering" aria-label="Navarathiri">
        <span className="wordmark-first">Nava</span>
        <span className="wordmark-second">rathiri</span>
      </span>
      <svg className="wordmark-sash" viewBox="0 0 240 20" fill="none" aria-hidden="true">
        <path d="M4 13c34-5 59 1 89-3s55 1 78-3 38-2 52-1" stroke="#E3447A" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M10 17c43-3 79 1 116-2s66-4 99-7" stroke="#12836F" strokeWidth="1.5" strokeLinecap="round" />
        <path d="m214 3 10 13m-2-14-11 13" stroke="#2557C8" strokeWidth="2.3" strokeLinecap="round" />
        <circle cx="204" cy="6" r="1.7" fill="#F2B830" />
      </svg>
      {showEdition && <span className="wordmark-edition">SNS × NIAT</span>}
    </span>
  );
}
