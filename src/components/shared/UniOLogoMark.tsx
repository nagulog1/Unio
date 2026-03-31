type UniOLogoMarkProps = {
  className?: string;
};

export default function UniOLogoMark({ className }: UniOLogoMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 18 L12 14 L12 28" />
        <path d="M80 18 L88 14 L88 28" />
        <path d="M50 42 L50 50 M50 42 L43 38 M50 42 L57 38" />
        <path d="M20 62 L12 58 L12 46" />
        <path d="M80 62 L88 58 L88 46" />
        <path d="M50 70 L50 78 M50 78 L43 74 M50 78 L57 74" />
      </g>
    </svg>
  );
}