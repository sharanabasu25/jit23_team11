import { useNavigate } from "react-router-dom";
import { LuDroplets, LuZap } from "react-icons/lu";
import civicBannerImg from "../assets/civic-banner.jpg";

export default function CivicBanner() {
  const navigate = useNavigate();

  return (
    <section className="cd-civic-hero-banner" aria-label="Report Civic Issues Banner">
      {/* Background civic landscape image */}
      <div className="cd-banner-image-wrapper">
        <img
          src={civicBannerImg}
          alt="Civic Infrastructure with water pipelines, power transmission, and road maintenance"
          className="cd-banner-bg-img"
        />
      </div>

      {/* Dark navy curve on the left with gold border line */}
      <svg
        className="cd-banner-curve-overlay"
        viewBox="0 0 1000 150"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="bannerGoldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="bannerNavyFill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#081424" />
            <stop offset="65%" stopColor="#0b1f3a" />
            <stop offset="100%" stopColor="#0f2647" />
          </linearGradient>
        </defs>

        {/* Navy curved shape covering left portion */}
        <path
          d="M0,0 L350,0 C400,25 415,75 375,115 C355,135 325,145 295,150 L0,150 Z"
          fill="url(#bannerNavyFill)"
        />

        {/* Golden contour line along the curve */}
        <path
          d="M350,0 C400,25 415,75 375,115 C355,135 325,145 295,150"
          fill="none"
          stroke="url(#bannerGoldStroke)"
          strokeWidth="2.5"
        />

        {/* Flowing golden wave accent at the bottom */}
        <path
          d="M250,150 C310,140 370,143 450,150 L0,150 Z"
          fill="rgba(245, 158, 11, 0.18)"
        />
      </svg>

      {/* Left Text Block */}
      <div className="cd-banner-text-overlay">
        <div className="cd-banner-voice-tag">
          <span className="cd-megaphone-icon">📣</span>
          <span className="cd-voice-tag-text">YOUR VOICE MATTERS</span>
          <span className="cd-voice-line" />
        </div>

        <h2 className="cd-banner-main-title">
          Report <span className="cd-civic-gold">Civic</span> Issues
        </h2>

        <p className="cd-banner-sub-categories">
          Water &nbsp;•&nbsp; Electricity &nbsp;•&nbsp; Roads
        </p>
      </div>

      {/* Floating Infrastructure Category Pills matching screenshot */}
      <div className="cd-banner-action-pills">
        <button
          type="button"
          className="cd-banner-pill"
          onClick={() => navigate("/submit-complaint?category=Water%20Leakage")}
          title="Report water issues"
        >
          <div className="cd-pill-badge blue-badge">
            <LuDroplets size={13} strokeWidth={2.5} />
          </div>
          <span>Water</span>
        </button>

        <button
          type="button"
          className="cd-banner-pill"
          onClick={() => navigate("/submit-complaint?category=Electricity%20Problem")}
          title="Report electricity issues"
        >
          <div className="cd-pill-badge yellow-badge">
            <LuZap size={13} strokeWidth={2.5} />
          </div>
          <span>Electricity</span>
        </button>

        <button
          type="button"
          className="cd-banner-pill"
          onClick={() => navigate("/submit-complaint?category=Pothole")}
          title="Report road and pothole issues"
        >
          <div className="cd-pill-badge gold-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 22L8 2H10L8 22H4ZM14 22L16 2H18L14 22H14ZM11 5H13V8H11V5ZM11 11H13V14H11V11ZM11 17H13V20H11V17Z" />
            </svg>
          </div>
          <span>Roads</span>
        </button>
      </div>
    </section>
  );
}
