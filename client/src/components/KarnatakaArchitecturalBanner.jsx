export default function KarnatakaArchitecturalBanner({ className = "op-architectural-banner-wrapper" }) {
  return (
    <div className={className} aria-hidden="true">
      <svg
        viewBox="0 0 450 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id="bannerTealFade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#008F83" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#008F83" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#00665F" stopOpacity="0.55" />
          </linearGradient>
        </defs>

        {/* Birds in sky */}
        <g stroke="#008F83" strokeWidth="1.2" strokeLinecap="round" opacity="0.6">
          <path d="M 60 25 Q 65 20 70 25 Q 75 20 80 25" fill="none" />
          <path d="M 95 18 Q 98 14 102 18 Q 106 14 110 18" fill="none" />
          <path d="M 125 30 Q 128 27 132 30 Q 136 27 140 30" fill="none" />
          <path d="M 330 20 Q 334 16 338 20 Q 342 16 346 20" fill="none" />
          <path d="M 355 28 Q 358 25 362 28 Q 366 25 370 28" fill="none" />
        </g>

        {/* Soft Background Silhouette */}
        <g fill="#CEEBE5" opacity="0.4">
          <rect x="30" y="70" width="390" height="35" rx="2" />
          <rect x="70" y="55" width="310" height="30" rx="2" />
        </g>

        {/* Main Architectural Line Work (Vidhana Soudha in Teal Line Art) */}
        <g stroke="#00796B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.75">
          {/* Base terrace */}
          <line x1="20" y1="102" x2="430" y2="102" strokeWidth="1.5" />
          <line x1="40" y1="98" x2="410" y2="98" />
          <line x1="60" y1="94" x2="390" y2="94" />

          {/* Central Grand Portico Pillars */}
          <rect x="190" y="60" width="70" height="34" fill="#E8F8F5" fillOpacity="0.6" />
          {/* Triangular pediment */}
          <polygon points="185,60 265,60 225,44" fill="#E0F4F0" fillOpacity="0.8" />

          {/* Columns */}
          <line x1="196" y1="60" x2="196" y2="94" strokeWidth="1.5" />
          <line x1="206" y1="60" x2="206" y2="94" strokeWidth="1.5" />
          <line x1="216" y1="60" x2="216" y2="94" strokeWidth="1.5" />
          <line x1="234" y1="60" x2="234" y2="94" strokeWidth="1.5" />
          <line x1="244" y1="60" x2="244" y2="94" strokeWidth="1.5" />
          <line x1="254" y1="60" x2="254" y2="94" strokeWidth="1.5" />

          {/* Grand Central Dome */}
          <rect x="204" y="36" width="42" height="8" rx="1" fill="#E0F4F0" />
          <path d="M 202 36 C 202 12, 248 12, 248 36 Z" fill="#D7F3ED" fillOpacity="0.8" />
          {/* Dome ribs */}
          <path d="M 225 12 Q 215 24 212 36" fill="none" />
          <path d="M 225 12 Q 235 24 238 36" fill="none" />
          {/* Finial / Stupa Kalasa */}
          <line x1="225" y1="12" x2="225" y2="3" strokeWidth="1.5" />
          <circle cx="225" cy="3" r="1.5" fill="#00796B" />

          {/* Left Wing Facade */}
          <rect x="80" y="65" width="105" height="29" fill="#E8F8F5" fillOpacity="0.4" />
          <line x1="80" y1="62" x2="185" y2="62" />
          {/* Left Arched Windows */}
          <path d="M 90 73 A 4 4 0 0 1 98 73 V 86 H 90 Z" fill="#CCEBE5" />
          <path d="M 104 73 A 4 4 0 0 1 112 73 V 86 H 104 Z" fill="#CCEBE5" />
          <path d="M 118 73 A 4 4 0 0 1 126 73 V 86 H 118 Z" fill="#CCEBE5" />
          <path d="M 132 73 A 4 4 0 0 1 140 73 V 86 H 132 Z" fill="#CCEBE5" />
          <path d="M 146 73 A 4 4 0 0 1 154 73 V 86 H 146 Z" fill="#CCEBE5" />
          <path d="M 160 73 A 4 4 0 0 1 168 73 V 86 H 160 Z" fill="#CCEBE5" />
          <path d="M 174 73 A 4 4 0 0 1 182 73 V 86 H 174 Z" fill="#CCEBE5" />

          {/* Left Pavilion / Chhatri */}
          <rect x="74" y="52" width="22" height="13" rx="1" fill="#E0F4F0" />
          <path d="M 72 52 Q 85 36 98 52 Z" fill="#D7F3ED" />
          <line x1="85" y1="36" x2="85" y2="31" />
          <circle cx="85" cy="31" r="1.2" fill="#00796B" />

          {/* Left End Tower */}
          <rect x="42" y="60" width="32" height="34" fill="#E8F8F5" fillOpacity="0.4" />
          <path d="M 46 72 A 3 3 0 0 1 52 72 V 84 H 46 Z" fill="#CCEBE5" />
          <path d="M 58 72 A 3 3 0 0 1 64 72 V 84 H 58 Z" fill="#CCEBE5" />
          <path d="M 40 60 Q 58 42 76 60 Z" fill="#D7F3ED" />
          <line x1="58" y1="42" x2="58" y2="36" />
          <circle cx="58" cy="36" r="1.2" fill="#00796B" />

          {/* Right Wing Facade */}
          <rect x="265" y="65" width="105" height="29" fill="#E8F8F5" fillOpacity="0.4" />
          <line x1="265" y1="62" x2="370" y2="62" />
          {/* Right Arched Windows */}
          <path d="M 272 73 A 4 4 0 0 1 280 73 V 86 H 272 Z" fill="#CCEBE5" />
          <path d="M 286 73 A 4 4 0 0 1 294 73 V 86 H 286 Z" fill="#CCEBE5" />
          <path d="M 300 73 A 4 4 0 0 1 308 73 V 86 H 300 Z" fill="#CCEBE5" />
          <path d="M 314 73 A 4 4 0 0 1 322 73 V 86 H 314 Z" fill="#CCEBE5" />
          <path d="M 328 73 A 4 4 0 0 1 336 73 V 86 H 328 Z" fill="#CCEBE5" />
          <path d="M 342 73 A 4 4 0 0 1 350 73 V 86 H 342 Z" fill="#CCEBE5" />
          <path d="M 356 73 A 4 4 0 0 1 364 73 V 86 H 356 Z" fill="#CCEBE5" />

          {/* Right Pavilion / Chhatri */}
          <rect x="354" y="52" width="22" height="13" rx="1" fill="#E0F4F0" />
          <path d="M 352 52 Q 365 36 378 52 Z" fill="#D7F3ED" />
          <line x1="365" y1="36" x2="365" y2="31" />
          <circle cx="365" cy="31" r="1.2" fill="#00796B" />

          {/* Right End Tower */}
          <rect x="376" y="60" width="32" height="34" fill="#E8F8F5" fillOpacity="0.4" />
          <path d="M 382 72 A 3 3 0 0 1 388 72 V 84 H 382 Z" fill="#CCEBE5" />
          <path d="M 394 72 A 3 3 0 0 1 400 72 V 84 H 394 Z" fill="#CCEBE5" />
          <path d="M 374 60 Q 392 42 410 60 Z" fill="#D7F3ED" />
          <line x1="392" y1="42" x2="392" y2="36" />
          <circle cx="392" cy="36" r="1.2" fill="#00796B" />

          {/* Garden Foliage / Trees in foreground */}
          <path d="M 15 102 Q 22 88 32 94 Q 38 85 45 92 Q 52 86 58 102 Z" fill="#BFE3DC" fillOpacity="0.7" />
          <path d="M 395 102 Q 402 88 410 92 Q 418 84 425 90 Q 432 86 438 102 Z" fill="#BFE3DC" fillOpacity="0.7" />
        </g>
      </svg>
    </div>
  );
}
