/* 签名元素:等高线纹样 —— 呼应「人格地貌」的测绘意象 */
export default function TopoMark({
  size = 120,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
        <path
          d="M60 12c24 0 44 17 46 38 2 22-13 42-34 48-20 6-44-2-54-19C8 62 13 38 28 25 38 16 49 12 60 12Z"
          opacity=".22"
        />
        <path
          d="M60 25c17 0 31 12 33 27 2 17-9 31-24 35-15 4-32-1-39-14-8-12-5-29 5-39 7-6 16-9 25-9Z"
          opacity=".4"
        />
        <path
          d="M61 38c11 0 20 7 22 17 2 10-5 20-15 23-10 3-21-1-26-9-5-9-3-19 4-25 4-4 9-6 15-6Z"
          opacity=".62"
        />
        <path d="M61 52c6 0 11 4 12 9 1 6-3 11-9 13-5 1-11-1-14-5-2-4-1-10 4-13 2-2 4-4 7-4Z" />
        <circle cx="61" cy="61" r="2.2" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}
