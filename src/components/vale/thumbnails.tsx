import { cn } from "@/lib/utils";
import type { ValeThumbKind } from "@/lib/vale";

/** Original mock thumbnails for the Vale dashboard — lightweight inline SVG
 *  illustrations (portfolio art, no external assets). Authored at 16:9 and
 *  cover-cropped into whatever box the caller sizes, so row heights never
 *  change. */

function Keyboard() {
  return (
    <svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" className="block size-full">
      <defs>
        <linearGradient id="vt-kb-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c1510" />
          <stop offset="1" stopColor="#0b0806" />
        </linearGradient>
        <radialGradient id="vt-kb-lamp" cx="0.2" cy="0.1" r="0.7">
          <stop offset="0" stopColor="#f9a03c" stopOpacity="0.35" />
          <stop offset="1" stopColor="#f9a03c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="vt-kb-rgb" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#06b6d4" />
          <stop offset="0.5" stopColor="#a855f7" />
          <stop offset="1" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <rect width="160" height="90" fill="url(#vt-kb-bg)" />
      <rect width="160" height="90" fill="url(#vt-kb-lamp)" />
      <rect y="60" width="160" height="30" fill="#221709" />
      <rect x="26" y="70" width="108" height="4" rx="2" fill="url(#vt-kb-rgb)" opacity="0.55" />
      <rect x="24" y="42" width="112" height="30" rx="4" fill="#26262c" />
      <rect x="24" y="42" width="112" height="3" rx="1.5" fill="#3c3c46" />
      {[0, 1, 2].map(row =>
        Array.from({ length: 13 }, (_, i) => (
          <rect
            key={`${row}-${i}`}
            x={29 + i * 8}
            y={47 + row * 8}
            width="6.4"
            height="6"
            rx="1.2"
            fill={row === 0 ? "#43434d" : "#38383f"}
          />
        ))
      )}
      <rect x="29" y="47" width="6.4" height="6" rx="1.2" fill="#5a4632" />
      <rect x="125" y="63" width="10.4" height="6" rx="1.2" fill="#5a4632" />
    </svg>
  );
}

function Desk() {
  return (
    <svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" className="block size-full">
      <defs>
        <linearGradient id="vt-desk-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eceae5" />
          <stop offset="1" stopColor="#dcdad4" />
        </linearGradient>
      </defs>
      <rect width="160" height="90" fill="url(#vt-desk-wall)" />
      <rect y="62" width="160" height="28" fill="#f6f5f2" />
      <rect y="61" width="160" height="2" fill="#cfcdc7" />
      <ellipse cx="80" cy="63" rx="30" ry="2.5" fill="#000" opacity="0.06" />
      <rect x="58" y="20" width="44" height="28" rx="2.5" fill="#17171a" />
      <rect x="60" y="22" width="40" height="24" rx="1.5" fill="#2b2b31" />
      <rect x="78" y="48" width="4" height="8" fill="#b9b7b1" />
      <rect x="70" y="56" width="20" height="3" rx="1.5" fill="#b9b7b1" />
      <path d="M112 62 L140 62 L136 50 L116 50 Z" fill="#d8d6d0" />
      <rect x="116" y="50" width="20" height="1.5" fill="#9a9892" />
      <ellipse cx="36" cy="44" rx="7" ry="9" fill="#4a7c59" />
      <ellipse cx="30" cy="48" rx="5" ry="7" fill="#5b8d68" />
      <ellipse cx="41" cy="49" rx="4.5" ry="6" fill="#3d6b4c" />
      <path d="M30 54 L42 54 L40 64 L32 64 Z" fill="#c96f4a" />
    </svg>
  );
}

function Camera() {
  return (
    <svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" className="block size-full">
      <defs>
        <linearGradient id="vt-cam-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#101016" />
          <stop offset="1" stopColor="#050507" />
        </linearGradient>
        <radialGradient id="vt-cam-spot" cx="0.75" cy="0.15" r="0.8">
          <stop offset="0" stopColor="#5a78c8" stopOpacity="0.16" />
          <stop offset="1" stopColor="#5a78c8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="160" height="90" fill="url(#vt-cam-bg)" />
      <rect width="160" height="90" fill="url(#vt-cam-spot)" />
      <rect x="44" y="30" width="48" height="32" rx="4" fill="#1c1c22" />
      <rect x="44" y="30" width="48" height="2.5" rx="1.2" fill="#4a4e5c" />
      <rect x="52" y="23" width="18" height="7" rx="1.5" fill="#191920" />
      <circle cx="52" cy="36" r="2" fill="#ef4444" />
      <rect x="76" y="36" width="12" height="8" rx="1" fill="#26262e" />
      <circle cx="110" cy="46" r="17" fill="#0b0b0e" />
      <circle cx="110" cy="46" r="17" fill="none" stroke="#3a3e4a" strokeWidth="2.5" />
      <circle cx="110" cy="46" r="9.5" fill="#141419" />
      <circle cx="110" cy="46" r="4.5" fill="#1f2545" />
      <path d="M101 38 A 12 12 0 0 1 112 34" fill="none" stroke="#8fa3d8" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
      <rect x="40" y="64" width="56" height="2" rx="1" fill="#2a2a32" />
    </svg>
  );
}

function Code() {
  const lines: [number, number, string][] = [
    [30, 34, "#3b82f6"],
    [38, 52, "#64748b"],
    [38, 28, "#22c55e"],
    [46, 44, "#a78bfa"],
    [30, 24, "#64748b"],
    [38, 58, "#3b82f6"],
    [46, 30, "#22c55e"],
    [30, 40, "#a78bfa"],
  ];
  return (
    <svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" className="block size-full">
      <rect width="160" height="90" fill="#0d1420" />
      <rect width="160" height="11" fill="#111b2c" />
      <circle cx="7" cy="5.5" r="1.8" fill="#ef4444" />
      <circle cx="13" cy="5.5" r="1.8" fill="#eab308" />
      <circle cx="19" cy="5.5" r="1.8" fill="#22c55e" />
      <rect y="11" width="24" height="61" fill="#0a101b" />
      {[18, 26, 34, 42].map(y => (
        <rect key={y} x="5" y={y} width="14" height="3" rx="1.5" fill="#1e293b" />
      ))}
      {lines.map(([x, w, c], i) => (
        <rect key={i} x={x} y={17 + i * 6.5} width={w} height="3.2" rx="1.6" fill={c} opacity="0.9" />
      ))}
      <rect y="72" width="160" height="18" fill="#050a12" />
      <rect x="6" y="78" width="5" height="4" fill="#22c55e" />
      <rect x="14" y="78.5" width="42" height="3" rx="1.5" fill="#334155" />
      <rect x="58" y="78.5" width="3" height="3" fill="#22c55e" />
    </svg>
  );
}

function Mountains() {
  return (
    <svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" className="block size-full">
      <defs>
        <linearGradient id="vt-mtn-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9b8dd" />
          <stop offset="0.7" stopColor="#f2c185" />
          <stop offset="1" stopColor="#f4a95c" />
        </linearGradient>
      </defs>
      <rect width="160" height="90" fill="url(#vt-mtn-sky)" />
      <circle cx="98" cy="40" r="12" fill="#f9dd8f" opacity="0.5" />
      <circle cx="98" cy="40" r="7" fill="#fbe7a5" />
      <path d="M0 58 L34 30 L62 52 L92 26 L122 50 L160 34 L160 90 L0 90 Z" fill="#8e9cc0" />
      <path d="M0 68 L28 48 L58 66 L96 42 L128 62 L160 52 L160 90 L0 90 Z" fill="#5e6c94" />
      <path d="M0 90 L0 74 L40 64 L90 76 L160 66 L160 90 Z" fill="#37415f" />
      {[18, 34, 52, 116, 132, 146].map((x, i) => (
        <path key={x} d={`M${x} ${76 + (i % 2) * 2} L${x + 4} ${64 + (i % 2) * 2} L${x + 8} ${76 + (i % 2) * 2} Z`} fill="#232b45" />
      ))}
      <path d="M78 90 C 82 82, 74 78, 80 72" fill="none" stroke="#d8c9a8" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

function Retro() {
  return (
    <svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" className="block size-full">
      <defs>
        <linearGradient id="vt-retro-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d8c7a6" />
          <stop offset="1" stopColor="#bfae8d" />
        </linearGradient>
      </defs>
      <rect width="160" height="90" fill="url(#vt-retro-bg)" />
      <ellipse cx="80" cy="66" rx="40" ry="4" fill="#000" opacity="0.14" />
      <rect x="46" y="12" width="68" height="50" rx="5" fill="#e8ddc2" />
      <rect x="46" y="12" width="68" height="50" rx="5" fill="none" stroke="#c4b795" strokeWidth="1.5" />
      <rect x="54" y="18" width="52" height="36" rx="2" fill="#0f2a1d" />
      {[24, 30, 36, 42].map((y, i) => (
        <rect key={y} x="58" y={y} width={i === 3 ? 14 : 30 - i * 6} height="2.5" rx="1" fill="#35d07a" opacity={0.9 - i * 0.15} />
      ))}
      <path d="M54 18 L74 18 L58 54 L54 54 Z" fill="#ffffff" opacity="0.06" />
      {[84, 90, 96].map(x => (
        <rect key={x} x={x} y="57" width="8" height="1.5" rx="0.75" fill="#b3a688" />
      ))}
      <rect x="42" y="68" width="76" height="11" rx="2.5" fill="#e2d7ba" />
      {[0, 1].map(row =>
        Array.from({ length: 16 }, (_, i) => (
          <rect key={`${row}-${i}`} x={45 + i * 4.4} y={70 + row * 4} width="3.4" height="3" rx="0.8" fill="#c8bc9c" />
        ))
      )}
    </svg>
  );
}

const THUMBS: Record<ValeThumbKind, () => React.ReactNode> = {
  keyboard: Keyboard,
  desk: Desk,
  camera: Camera,
  code: Code,
  mountains: Mountains,
  retro: Retro,
};

export function ValeThumb({ kind, className }: { kind: ValeThumbKind; className?: string }) {
  const Art = THUMBS[kind];
  return (
    <div aria-hidden className={cn("overflow-hidden", className)}>
      <Art />
    </div>
  );
}
