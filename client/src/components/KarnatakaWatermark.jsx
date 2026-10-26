export default function KarnatakaWatermark() {
  return (
    <div className="op-profile-watermark" aria-hidden="true">
      <svg
        viewBox="0 0 500 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%" }}
      >
        <g stroke="#008F83" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6">
          {/* Base lines */}
          <line x1="50" y1="520" x2="480" y2="520" strokeWidth="2" />
          <line x1="80" y1="505" x2="450" y2="505" />
          <line x1="110" y1="490" x2="420" y2="490" />

          {/* Central Dome */}
          <rect x="220" y="240" width="120" height="15" rx="2" fill="#D7F3ED" />
          <path d="M 210 240 C 210 120, 350 120, 350 240 Z" fill="#D7F3ED" fillOpacity="0.5" />
          <line x1="280" y1="120" x2="280" y2="80" strokeWidth="2" />
          <circle cx="280" cy="76" r="4" fill="#008F83" />
          <path d="M 280 120 Q 240 180, 230 240" fill="none" />
          <path d="M 280 120 Q 320 180, 330 240" fill="none" />

          {/* Pediment & Pillars */}
          <polygon points="190,300 370,300 280,250" fill="#E0F4F0" />
          <line x1="205" y1="300" x2="205" y2="490" strokeWidth="2.5" />
          <line x1="235" y1="300" x2="235" y2="490" strokeWidth="2.5" />
          <line x1="265" y1="300" x2="265" y2="490" strokeWidth="2.5" />
          <line x1="295" y1="300" x2="295" y2="490" strokeWidth="2.5" />
          <line x1="325" y1="300" x2="325" y2="490" strokeWidth="2.5" />
          <line x1="355" y1="300" x2="355" y2="490" strokeWidth="2.5" />

          {/* Left Wing */}
          <rect x="70" y="330" width="125" height="150" fill="#E8F8F5" fillOpacity="0.4" />
          <path d="M 90 360 A 8 8 0 0 1 106 360 V 400 H 90 Z" fill="#CCEBE5" />
          <path d="M 120 360 A 8 8 0 0 1 136 360 V 400 H 120 Z" fill="#CCEBE5" />
          <path d="M 150 360 A 8 8 0 0 1 166 360 V 400 H 150 Z" fill="#CCEBE5" />
          <path d="M 60 330 Q 95 270 130 330 Z" fill="#D7F3ED" />

          {/* Right Wing */}
          <rect x="365" y="330" width="125" height="150" fill="#E8F8F5" fillOpacity="0.4" />
          <path d="M 385 360 A 8 8 0 0 1 401 360 V 400 H 385 Z" fill="#CCEBE5" />
          <path d="M 415 360 A 8 8 0 0 1 431 360 V 400 H 415 Z" fill="#CCEBE5" />
          <path d="M 445 360 A 8 8 0 0 1 461 360 V 400 H 445 Z" fill="#CCEBE5" />
          <path d="M 430 330 Q 465 270 500 330 Z" fill="#D7F3ED" />

          {/* Flying birds */}
          <path d="M 120 180 Q 130 170 140 180 Q 150 170 160 180" fill="none" />
          <path d="M 160 210 Q 168 202 176 210 Q 184 202 192 210" fill="none" />
        </g>
      </svg>
    </div>
  );
}
