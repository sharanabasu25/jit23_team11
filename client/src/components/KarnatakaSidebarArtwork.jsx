export default function KarnatakaSidebarArtwork() {
  return (
    <div className="op-sidebar-artwork" aria-hidden="true">
      <svg
        viewBox="0 0 250 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%" }}
      >
        <g stroke="#66B3A8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
          {/* Base lines */}
          <line x1="10" y1="170" x2="240" y2="170" strokeWidth="1.5" />
          <line x1="20" y1="165" x2="230" y2="165" />
          <line x1="30" y1="160" x2="220" y2="160" />

          {/* Central Dome */}
          <path d="M 100 80 C 100 45, 150 45, 150 80 Z" fill="rgba(255,255,255,0.06)" />
          <line x1="125" y1="45" x2="125" y2="30" strokeWidth="1.5" />
          <circle cx="125" cy="28" r="2.5" fill="#66B3A8" />
          <path d="M 125 45 Q 112 60 108 80" fill="none" />
          <path d="M 125 45 Q 138 60 142 80" fill="none" />

          {/* Pediment & Pillars */}
          <polygon points="90,115 160,115 125,95" fill="rgba(255,255,255,0.08)" />
          <line x1="98" y1="115" x2="98" y2="160" strokeWidth="1.5" />
          <line x1="110" y1="115" x2="110" y2="160" strokeWidth="1.5" />
          <line x1="125" y1="115" x2="125" y2="160" strokeWidth="1.5" />
          <line x1="140" y1="115" x2="140" y2="160" strokeWidth="1.5" />
          <line x1="152" y1="115" x2="152" y2="160" strokeWidth="1.5" />

          {/* Left Wing */}
          <rect x="25" y="125" width="65" height="35" fill="rgba(255,255,255,0.04)" />
          <path d="M 35 132 A 4 4 0 0 1 43 132 V 146 H 35 Z" fill="none" />
          <path d="M 50 132 A 4 4 0 0 1 58 132 V 146 H 50 Z" fill="none" />
          <path d="M 65 132 A 4 4 0 0 1 73 132 V 146 H 65 Z" fill="none" />
          <path d="M 22 125 Q 40 100 58 125 Z" fill="rgba(255,255,255,0.06)" />

          {/* Right Wing */}
          <rect x="160" y="125" width="65" height="35" fill="rgba(255,255,255,0.04)" />
          <path d="M 172 132 A 4 4 0 0 1 180 132 V 146 H 172 Z" fill="none" />
          <path d="M 187 132 A 4 4 0 0 1 195 132 V 146 H 187 Z" fill="none" />
          <path d="M 202 132 A 4 4 0 0 1 210 132 V 146 H 202 Z" fill="none" />
          <path d="M 192 125 Q 210 100 228 125 Z" fill="rgba(255,255,255,0.06)" />
        </g>
      </svg>
    </div>
  );
}
