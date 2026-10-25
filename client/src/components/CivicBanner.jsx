import { useNavigate } from "react-router-dom";
import { LuDroplets, LuZap } from "react-icons/lu";
import civicBannerImg from "../assets/civic-banner.jpg";

export default function CivicBanner() {
  const navigate = useNavigate();

  return (
    <section 
      className="cd-civic-hero-banner" 
      aria-label="Report Civic Issues Banner"
    >
      {/* Background civic landscape image */}
      <div className="cd-banner-image-wrapper">
        <img
          src={civicBannerImg}
          alt="Civic Infrastructure with water pipelines, power transmission, and road maintenance"
          className="cd-banner-bg-img"
          onError={(e) => {
            // Safe fallback to public path if asset bundle fails
            e.currentTarget.src = "/civic-banner.jpg";
          }}
        />
      </div>

      {/* Dark navy curve on the left with gold border line */}
      <svg
        className="cd-banner-curve-overlay"
        viewBox="0 0 1000 140"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="bannerGoldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#FFD15A" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="bannerNavyFill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#081424" />
            <stop offset="70%" stopColor="#0B1E38" />
            <stop offset="100%" stopColor="#0F284B" />
          </linearGradient>
        </defs>

        {/* Navy curved shape covering left portion */}
        <path
          d="M0,0 L420,0 C475,25 490,70 450,105 C428,124 395,134 360,140 L0,140 Z"
          fill="url(#bannerNavyFill)"
        />

        {/* Golden contour line along the curve */}
        <path
          d="M420,0 C475,25 490,70 450,105 C428,124 395,134 360,140"
          fill="none"
          stroke="url(#bannerGoldStroke)"
          strokeWidth="2.5"
        />

        {/* Flowing golden wave accent at the bottom */}
        <path
          d="M300,140 C370,132 440,135 520,140 L0,140 Z"
          fill="rgba(255, 209, 90, 0.15)"
        />
      </svg>

      {/* Left Text Block */}
      <div 
        className="cd-banner-copy"
        onClick={() => navigate("/submit-complaint")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && navigate("/submit-complaint")}
        title="Click to report a civic grievance"
      >
        <div className="cd-banner-eyebrow">
          <span>📣</span>
          YOUR VOICE MATTERS
          <span />
        </div>

        <h2>
          Report <em>Civic Issues</em>
        </h2>

        <p>Water • Electricity • Roads</p>
      </div>

      {/* Floating Infrastructure Category Pills matching screenshot */}
      <div className="cd-banner-actions">
        <button
          type="button"
          className="cd-banner-pill-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/submit-complaint?category=Water%20Leakage");
          }}
          title="Report water issues"
        >
          <div className="cd-pill-circle water">
            <LuDroplets size={11} strokeWidth={2.6} />
          </div>
          <span>Water</span>
        </button>

        <button
          type="button"
          className="cd-banner-pill-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/submit-complaint?category=Electricity%20Problem");
          }}
          title="Report electricity issues"
        >
          <div className="cd-pill-circle electricity">
            <LuZap size={11} strokeWidth={2.6} />
          </div>
          <span>Electricity</span>
        </button>

        <button
          type="button"
          className="cd-banner-pill-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/submit-complaint?category=Pothole");
          }}
          title="Report road and pothole issues"
        >
          <div className="cd-pill-circle roads">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 22L8 2H10L8 22H4ZM14 22L16 2H18L14 22H14ZM11 5H13V8H11V5ZM11 11H13V14H11V11ZM11 17H13V20H11V17Z" />
            </svg>
          </div>
          <span>Roads</span>
        </button>
      </div>
    </section>
  );
}
