import { useNavigate } from "react-router-dom";
import { LuPlus, LuArrowRight, LuSparkles } from "react-icons/lu";
import hampiImage from "../assets/hampi-chariot.jpg";

export default function HampiBanner() {
  const navigate = useNavigate();

  return (
    <section className="cd-hampi-banner" aria-label="Submit Grievance Banner">
      {/* Background illustration on right */}
      <div className="cd-banner-image-container">
        <img 
          src={hampiImage} 
          alt="Hampi Stone Chariot at Vijayanagara Vittala Temple" 
          className="cd-banner-image"
        />
        <div className="cd-banner-image-overlay" />
      </div>

      {/* Organic Curved Wave Divider */}
      <svg 
        className="cd-banner-curve-svg" 
        viewBox="0 0 1000 200" 
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="curveGoldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E7B94F" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#F3DFA5" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {/* Midnight Indigo curved shape covering left portion */}
        <path 
          d="M0,0 L480,0 C540,25 585,85 520,140 C490,165 460,185 430,200 L0,200 Z" 
          fill="#19264B" 
        />
        {/* Subtle warm gold accent line along the curve */}
        <path 
          d="M480,0 C540,25 585,85 520,140 C490,165 460,185 430,200" 
          fill="none" 
          stroke="url(#curveGoldStroke)" 
          strokeWidth="2.5" 
        />
        {/* Flowing bottom golden swoosh ribbon */}
        <path 
          d="M380,200 C450,185 520,180 620,190 C720,200 850,175 1000,165 L1000,200 Z" 
          fill="rgba(231, 185, 79, 0.22)" 
        />
      </svg>

      {/* Decorative Heritage Caption on Right Top */}
      <div className="cd-banner-heritage-watermark">
        <span>HERITAGE</span>
        <span>PEOPLE</span>
        <span>PROGRESSING</span>
        <span>TOGETHER</span>
      </div>

      {/* Left content block */}
      <div className="cd-banner-content">
        <div className="cd-banner-badge">
          <span>YOUR VOICE MATTERS</span>
          <div className="cd-banner-badge-icon">
            <LuSparkles size={11} />
          </div>
        </div>

        <h2 className="cd-banner-title">Report Civic Issues</h2>
        
        <p className="cd-banner-description">
          Help us build cleaner, safer and better communities across Karnataka.
        </p>

        <button 
          type="button" 
          className="cd-banner-submit-btn"
          onClick={() => navigate("/submit-complaint")}
        >
          <LuPlus size={16} strokeWidth={2.8} />
          <span>Submit a Grievance</span>
          <LuArrowRight size={16} strokeWidth={2.8} />
        </button>
      </div>
    </section>
  );
}
