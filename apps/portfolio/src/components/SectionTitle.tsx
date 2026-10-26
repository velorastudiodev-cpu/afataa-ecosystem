export default function SectionTitle({
  number,
  label,
  title,
  italic,
  children,
}: {
  number: string;
  label: string;
  title: string;
  italic: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="section-head">
      <p className="section-kicker mono" data-reveal>
        <span>{number}</span>{label}
      </p>
      <h2 data-reveal style={{ '--d': 1 } as React.CSSProperties}>
        {title} <em>{italic}</em>
      </h2>
      {children && <p className="section-intro" data-reveal style={{ '--d': 2 } as React.CSSProperties}>{children}</p>}
    </header>
  );
}
