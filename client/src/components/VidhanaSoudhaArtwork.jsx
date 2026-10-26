export default function VidhanaSoudhaArtwork() {
  return (
    <div className="cl-bg-decorations" aria-hidden="true">
      {/* Left Typographic Motto */}
      <div className="cl-motto-left">
        <div>CLEAN</div>
        <div>CITIES</div>
        <div>STRONGER</div>
        <div>COMMUNITIES</div>
        <div className="cl-motto-line" />
      </div>

      {/* Right Typographic Motto */}
      <div className="cl-motto-right">
        <div>YOUR</div>
        <div>VOICE</div>
        <div>A BETTER</div>
        <div>KARNATAKA</div>
        <div className="cl-motto-line" />
      </div>

      {/* Flying Birds in Sky */}
      <svg
        style={{
          position: "absolute",
          top: "12%",
          left: "18%",
          width: "120px",
          height: "60px",
          opacity: 0.55
        }}
        viewBox="0 0 100 50"
      >
        <path
          d="M10 20 Q16 14 22 20 Q28 14 34 20"
          fill="none"
          stroke="#8EA4C2"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M45 12 Q50 7 55 12 Q60 7 65 12"
          fill="none"
          stroke="#8EA4C2"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M72 26 Q76 22 80 26 Q84 22 88 26"
          fill="none"
          stroke="#8EA4C2"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>

      <svg
        style={{
          position: "absolute",
          top: "16%",
          right: "22%",
          width: "90px",
          height: "50px",
          opacity: 0.5
        }}
        viewBox="0 0 80 40"
      >
        <path
          d="M12 18 Q17 13 22 18 Q27 13 32 18"
          fill="none"
          stroke="#8EA4C2"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M48 10 Q52 6 56 10 Q60 6 64 10"
          fill="none"
          stroke="#8EA4C2"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>

      {/* Left Architectural Silhouette — Vidhana Soudha Palace */}
      <svg
        className="cl-bg-palace-left"
        viewBox="0 0 500 400"
        fill="none"
        preserveAspectRatio="xMinYMax meet"
      >
        {/* Soft Slate-Blue Silhouette Gradients & Paths */}
        <g fill="#CAD8EC" opacity="0.6">
          {/* Base terrace */}
          <rect x="0" y="340" width="500" height="60" rx="3" />
          <rect x="20" y="325" width="460" height="18" rx="2" />
          <rect x="40" y="310" width="420" height="18" rx="2" />

          {/* Grand Stairs */}
          <polygon points="130,340 230,340 215,310 145,310" opacity="0.9" />

          {/* Left Wing Facade */}
          <rect x="30" y="220" width="120" height="92" />
          {/* Wing Balustrade */}
          <rect x="25" y="212" width="130" height="9" />
          {/* Wing Arched Windows */}
          <rect x="42" y="235" width="14" height="26" rx="7" fill="#BACEE6" />
          <rect x="68" y="235" width="14" height="26" rx="7" fill="#BACEE6" />
          <rect x="94" y="235" width="14" height="26" rx="7" fill="#BACEE6" />
          <rect x="120" y="235" width="14" height="26" rx="7" fill="#BACEE6" />

          <rect x="42" y="272" width="14" height="28" rx="7" fill="#BACEE6" />
          <rect x="68" y="272" width="14" height="28" rx="7" fill="#BACEE6" />
          <rect x="94" y="272" width="14" height="28" rx="7" fill="#BACEE6" />
          <rect x="120" y="272" width="14" height="28" rx="7" fill="#BACEE6" />

          {/* Left Corner Pavilion / Chhatri */}
          <rect x="28" y="180" width="30" height="34" />
          <rect x="24" y="174" width="38" height="6" />
          <path d="M25 174 Q43 140 61 174 Z" />
          <rect x="41" y="132" width="4" height="10" />
          <circle cx="43" cy="130" r="3" />

          {/* Central Grand Portico Columns */}
          <rect x="140" y="185" width="100" height="126" />
          <polygon points="135,185 245,185 190,145" />

          {/* Pillars */}
          <rect x="146" y="187" width="8" height="123" fill="#BACEE6" />
          <rect x="162" y="187" width="8" height="123" fill="#BACEE6" />
          <rect x="178" y="187" width="8" height="123" fill="#BACEE6" />
          <rect x="194" y="187" width="8" height="123" fill="#BACEE6" />
          <rect x="210" y="187" width="8" height="123" fill="#BACEE6" />
          <rect x="226" y="187" width="8" height="123" fill="#BACEE6" />

          {/* Grand Central Dome of Vidhana Soudha */}
          <rect x="155" y="125" width="70" height="24" rx="2" />
          {/* Main Dome Arch */}
          <path d="M152 125 C152 75, 228 75, 228 125 Z" />
          {/* Dome Ribs */}
          <path d="M190 75 Q175 100 170 125" stroke="#A6BEDA" strokeWidth="2" fill="none" />
          <path d="M190 75 Q205 100 210 125" stroke="#A6BEDA" strokeWidth="2" fill="none" />
          {/* Finial / Stupa Kalasa */}
          <rect x="187" y="58" width="6" height="18" />
          <polygon points="190,44 195,58 185,58" />
          <circle cx="190" cy="42" r="3" />

          {/* Right Flanking Wing of Left Palace */}
          <rect x="240" y="220" width="140" height="92" />
          <rect x="238" y="212" width="144" height="9" />
          <rect x="252" y="235" width="14" height="26" rx="7" fill="#BACEE6" />
          <rect x="278" y="235" width="14" height="26" rx="7" fill="#BACEE6" />
          <rect x="304" y="235" width="14" height="26" rx="7" fill="#BACEE6" />
          <rect x="330" y="235" width="14" height="26" rx="7" fill="#BACEE6" />

          <rect x="252" y="272" width="14" height="28" rx="7" fill="#BACEE6" />
          <rect x="278" y="272" width="14" height="28" rx="7" fill="#BACEE6" />
          <rect x="304" y="272" width="14" height="28" rx="7" fill="#BACEE6" />
          <rect x="330" y="272" width="14" height="28" rx="7" fill="#BACEE6" />

          {/* Right Cupola Chhatri */}
          <rect x="360" y="180" width="30" height="34" />
          <path d="M358 174 Q375 140 392 174 Z" />
          <circle cx="375" cy="132" r="3" />

          {/* Foliage / Landscape Trees on Left */}
          <path d="M-10 340 Q5 260 30 280 Q55 240 70 300 Q80 340 70 340 Z" fill="#D6E2F2" opacity="0.8" />
          <path d="M15 340 Q35 270 50 290 Q65 260 85 340 Z" fill="#CAD8EC" opacity="0.75" />
          <path d="M390 340 Q410 280 430 300 Q450 270 470 340 Z" fill="#D6E2F2" opacity="0.7" />
        </g>

        {/* Rolling Sand Wave Dunes in Foreground */}
        <path
          d="M0 365 C120 345, 260 380, 500 355 L500 400 L0 400 Z"
          fill="#E2ECF8"
          opacity="0.8"
        />
        <path
          d="M0 380 C150 360, 320 395, 500 370 L500 400 L0 400 Z"
          fill="#D4E2F4"
          opacity="0.85"
        />
      </svg>

      {/* Right Architectural Silhouette — Symmetrical Vidhana Soudha Palace */}
      <svg
        className="cl-bg-palace-right"
        viewBox="0 0 500 400"
        fill="none"
        preserveAspectRatio="xMaxYMax meet"
      >
        <g fill="#CAD8EC" opacity="0.6" transform="translate(500,0) scale(-1,1)">
          {/* Base terrace */}
          <rect x="0" y="340" width="500" height="60" rx="3" />
          <rect x="20" y="325" width="460" height="18" rx="2" />
          <rect x="40" y="310" width="420" height="18" rx="2" />

          {/* Grand Stairs */}
          <polygon points="130,340 230,340 215,310 145,310" opacity="0.9" />

          {/* Wing Facade */}
          <rect x="30" y="220" width="120" height="92" />
          <rect x="25" y="212" width="130" height="9" />
          <rect x="42" y="235" width="14" height="26" rx="7" fill="#BACEE6" />
          <rect x="68" y="235" width="14" height="26" rx="7" fill="#BACEE6" />
          <rect x="94" y="235" width="14" height="26" rx="7" fill="#BACEE6" />
          <rect x="120" y="235" width="14" height="26" rx="7" fill="#BACEE6" />

          <rect x="42" y="272" width="14" height="28" rx="7" fill="#BACEE6" />
          <rect x="68" y="272" width="14" height="28" rx="7" fill="#BACEE6" />
          <rect x="94" y="272" width="14" height="28" rx="7" fill="#BACEE6" />
          <rect x="120" y="272" width="14" height="28" rx="7" fill="#BACEE6" />

          {/* Corner Pavilion Chhatri */}
          <rect x="28" y="180" width="30" height="34" />
          <rect x="24" y="174" width="38" height="6" />
          <path d="M25 174 Q43 140 61 174 Z" />
          <rect x="41" y="132" width="4" height="10" />
          <circle cx="43" cy="130" r="3" />

          {/* Central Grand Portico */}
          <rect x="140" y="185" width="100" height="126" />
          <polygon points="135,185 245,185 190,145" />

          {/* Columns */}
          <rect x="146" y="187" width="8" height="123" fill="#BACEE6" />
          <rect x="162" y="187" width="8" height="123" fill="#BACEE6" />
          <rect x="178" y="187" width="8" height="123" fill="#BACEE6" />
          <rect x="194" y="187" width="8" height="123" fill="#BACEE6" />
          <rect x="210" y="187" width="8" height="123" fill="#BACEE6" />
          <rect x="226" y="187" width="8" height="123" fill="#BACEE6" />

          {/* Grand Central Dome */}
          <rect x="155" y="125" width="70" height="24" rx="2" />
          <path d="M152 125 C152 75, 228 75, 228 125 Z" />
          <path d="M190 75 Q175 100 170 125" stroke="#A6BEDA" strokeWidth="2" fill="none" />
          <path d="M190 75 Q205 100 210 125" stroke="#A6BEDA" strokeWidth="2" fill="none" />
          <rect x="187" y="58" width="6" height="18" />
          <polygon points="190,44 195,58 185,58" />
          <circle cx="190" cy="42" r="3" />

          {/* Flanking Wing */}
          <rect x="240" y="220" width="140" height="92" />
          <rect x="238" y="212" width="144" height="9" />
          <rect x="252" y="235" width="14" height="26" rx="7" fill="#BACEE6" />
          <rect x="278" y="235" width="14" height="26" rx="7" fill="#BACEE6" />
          <rect x="304" y="235" width="14" height="26" rx="7" fill="#BACEE6" />
          <rect x="330" y="235" width="14" height="26" rx="7" fill="#BACEE6" />

          <rect x="252" y="272" width="14" height="28" rx="7" fill="#BACEE6" />
          <rect x="278" y="272" width="14" height="28" rx="7" fill="#BACEE6" />
          <rect x="304" y="272" width="14" height="28" rx="7" fill="#BACEE6" />
          <rect x="330" y="272" width="14" height="28" rx="7" fill="#BACEE6" />

          {/* Cupola Chhatri */}
          <rect x="360" y="180" width="30" height="34" />
          <path d="M358 174 Q375 140 392 174 Z" />
          <circle cx="375" cy="132" r="3" />

          {/* Trees on Right */}
          <path d="M-10 340 Q5 260 30 280 Q55 240 70 300 Q80 340 70 340 Z" fill="#D6E2F2" opacity="0.8" />
          <path d="M15 340 Q35 270 50 290 Q65 260 85 340 Z" fill="#CAD8EC" opacity="0.75" />
          <path d="M390 340 Q410 280 430 300 Q450 270 470 340 Z" fill="#D6E2F2" opacity="0.7" />
        </g>

        {/* Dunes */}
        <path
          d="M500 365 C380 345, 240 380, 0 355 L0 400 L500 400 Z"
          fill="#E2ECF8"
          opacity="0.8"
        />
        <path
          d="M500 380 C350 360, 180 395, 0 370 L0 400 L500 400 Z"
          fill="#D4E2F4"
          opacity="0.85"
        />
      </svg>
    </div>
  );
}
