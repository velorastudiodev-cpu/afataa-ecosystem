/**
 * AAKLogo — Geometric monogram mark for Ahmad Afataa Kusdianto.
 *
 * Design language: two overlapping "A" shapes share a spine,
 * with a "K" arm slicing through — all constructed from the same
 * stroke weight. A single gold accent dot anchors the composition.
 * Scalable via `size` prop (default 32).
 */
export default function AAKLogo({
  size = 32,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  // All values are on a 40×40 grid
  const s = size / 40;
  const scale = `scale(${s})`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="AAK monogram"
      className={className}
    >
      {/* ── Background shield / container ── */}
      <rect
        x="1" y="1" width="38" height="38"
        rx="10"
        fill="#1e3a5f"
      />

      {/* ── Left "A" — stroke only, open bottom ── */}
      {/* Left leg */}
      <line x1="7" y1="31" x2="13.5" y2="11" stroke="#e8f0f8" strokeWidth="2.2" strokeLinecap="round" />
      {/* Right leg */}
      <line x1="13.5" y1="11" x2="20" y2="31" stroke="#e8f0f8" strokeWidth="2.2" strokeLinecap="round" />
      {/* Crossbar */}
      <line x1="9.5" y1="23.5" x2="17.5" y2="23.5" stroke="#e8f0f8" strokeWidth="2.2" strokeLinecap="round" />

      {/* ── K — shares vertical spine with right A-leg ── */}
      {/* Spine (shared with right leg of A / left of K) */}
      <line x1="20" y1="11" x2="20" y2="31" stroke="#e8f0f8" strokeWidth="2.2" strokeLinecap="round" />
      {/* K upper arm */}
      <line x1="20" y1="20.5" x2="27" y2="11" stroke="#e8f0f8" strokeWidth="2.2" strokeLinecap="round" />
      {/* K lower arm */}
      <line x1="20" y1="20.5" x2="28" y2="31" stroke="#e8f0f8" strokeWidth="2.2" strokeLinecap="round" />

      {/* ── Gold accent dot — top right corner of K ── */}
      <circle cx="30.5" cy="9.5" r="3" fill="#d4af6a" />
    </svg>
  );
}
