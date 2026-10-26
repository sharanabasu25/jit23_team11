import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiArrowRight,
  FiHome,
  FiGrid,
  FiPlusCircle,
  FiFileText,
  FiSearch,
  FiBell,
  FiChevronDown,
  FiLogOut,
  FiShield
} from "react-icons/fi";
import axios from "axios";
import VidhanaSoudhaArtwork from "../components/VidhanaSoudhaArtwork";
import TrackModal from "../components/TrackModal";
import NotificationDrawer from "../components/NotificationDrawer";
import { getStoredUser, getCitizenDisplayName, getCitizenInitial } from "../utils/userUtils";
import "../citizenLogin.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Check saved email from localStorage on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberCitizenEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const user = getStoredUser();
  const displayName = getCitizenDisplayName(user);
  const displayInitial = getCitizenInitial(user);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMessage("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: email.trim(),
        password
      });

      // Save token, user details, and citizen login session
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("citizenLoggedIn", "true");

      if (rememberMe) {
        localStorage.setItem("rememberCitizenEmail", email.trim());
      } else {
        localStorage.removeItem("rememberCitizenEmail");
      }

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please verify your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setInfoMessage(
      "Citizen credential security notice: For password resets, contact your municipal ward helpdesk or call the toll-free helpline at 1912."
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("citizenLoggedIn");
    navigate("/");
  };

  return (
    <div className="cl-page">
      {/* 1. Compact Midnight Indigo Header & Branding */}
      <header className="cl-navbar">
        {/* Brand */}
        <div className="cl-nav-brand" onClick={() => navigate("/")} title="SPGMS Home">
          <div className="cl-nav-logo-box">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 21h18" />
              <path d="M3 10h18" />
              <path d="M12 3l9 7H3l9-7z" />
              <path d="M6 10v8" />
              <path d="M10 10v8" />
              <path d="M14 10v8" />
              <path d="M18 10v8" />
            </svg>
          </div>
          <div className="cl-nav-title-group">
            <div className="cl-nav-brand-row">
              <span className="cl-nav-brand-title">SPGMS</span>
              <span className="cl-nav-citizen-badge">CITIZEN</span>
            </div>
            <span className="cl-nav-subtitle">Smart Public Grievance Management System</span>
          </div>
        </div>

        {/* Center / Right Nav Links */}
        <nav className="cl-nav-links" aria-label="Citizen portal navigation">
          <Link to="/" className="cl-nav-link active">
            <FiHome size={15} />
            <span>Home</span>
          </Link>

          <Link to="/dashboard" className="cl-nav-link">
            <FiGrid size={15} />
            <span>Dashboard</span>
          </Link>

          <Link to="/submit-complaint" className="cl-nav-link">
            <FiPlusCircle size={15} />
            <span>Lodge Grievance</span>
          </Link>

          <Link to="/my-complaints" className="cl-nav-link">
            <FiFileText size={15} />
            <span>My Grievances</span>
          </Link>

          <button
            type="button"
            className="cl-nav-link"
            onClick={() => setIsTrackOpen(true)}
            style={{ background: "none", border: "none" }}
          >
            <FiSearch size={15} />
            <span>Track Status</span>
          </button>

          <div className="cl-nav-divider" />

          {/* Notification Bell */}
          <button
            type="button"
            className="cl-nav-icon-btn"
            onClick={() => setIsNotifOpen((prev) => !prev)}
            title="Notifications"
            aria-label="View notifications"
          >
            <FiBell size={17} />
            <span className="cl-nav-notif-dot">0</span>
          </button>

          {/* User profile dropdown pill */}
          <div
            className="cl-nav-user-pill"
            onClick={() => navigate(user ? "/profile" : "/login")}
            title="Citizen Profile"
          >
            <div className="cl-nav-avatar-circle">{displayInitial}</div>
            <span>{displayName}</span>
            <FiChevronDown size={14} style={{ opacity: 0.8 }} />
          </div>

          {/* Logout button */}
          <button
            type="button"
            className="cl-nav-logout-btn"
            onClick={handleLogout}
            title="Sign out"
          >
            <FiLogOut size={14} />
            <span>Logout</span>
          </button>
        </nav>
      </header>

      {/* 2. Login Hero Stage with Vidhana Soudha Architectural Silhouette */}
      <main className="cl-hero-stage">
        <VidhanaSoudhaArtwork />

        {/* Center Container & Login Card */}
        <div className="cl-center-container">
          {/* Top Circular Civic Emblem */}
          <div className="cl-civic-emblem">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 21h18" />
              <path d="M3 10h18" />
              <path d="M12 3l9 7H3l9-7z" />
              <path d="M6 10v8" />
              <path d="M10 10v8" />
              <path d="M14 10v8" />
              <path d="M18 10v8" />
            </svg>
          </div>

          {/* Government of Karnataka Pill */}
          <div className="cl-gov-pill">GOVERNMENT OF KARNATAKA</div>

          {/* Main Heading */}
          <h1 className="cl-hero-title">Welcome back, Citizen</h1>
          <p className="cl-hero-subtitle">
            Sign in to lodge grievances and track resolution progress
          </p>

          {/* Soft Ivory Login Card */}
          <div className="cl-card">
            {error && (
              <div className="cl-alert cl-alert-error" role="alert">
                <FiAlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>{error}</div>
              </div>
            )}

            {infoMessage && (
              <div className="cl-alert cl-alert-info" role="status">
                <FiAlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>{infoMessage}</div>
              </div>
            )}

            <form onSubmit={handleLogin}>
              {/* Registered Email Address */}
              <div className="cl-form-group">
                <label className="cl-label" htmlFor="citizen-login-email">
                  Registered Email Address
                </label>
                <div className="cl-input-wrapper">
                  <FiMail className="cl-input-icon" />
                  <input
                    id="citizen-login-email"
                    type="email"
                    className="cl-input"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Account Password */}
              <div className="cl-form-group" style={{ marginBottom: "8px" }}>
                <label className="cl-label" htmlFor="citizen-login-password">
                  Account Password
                </label>
                <div className="cl-input-wrapper">
                  <FiLock className="cl-input-icon" />
                  <input
                    id="citizen-login-password"
                    type={showPassword ? "text" : "password"}
                    className="cl-input"
                    style={{ paddingRight: "42px" }}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="cl-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="cl-remember-row">
                <label className="cl-checkbox-label">
                  <input
                    type="checkbox"
                    className="cl-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  className="cl-forgot-link"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In Primary Button */}
              <button
                type="submit"
                disabled={loading}
                className="cl-submit-btn"
              >
                <span>{loading ? "Authenticating..." : "Sign In to Citizen Portal"}</span>
                {!loading && <FiArrowRight size={16} />}
              </button>
            </form>

            {/* Divider */}
            <div className="cl-divider-row">
              <div className="cl-divider-line" />
              <span className="cl-divider-text">
                Don't have a verified citizen account?
              </span>
              <div className="cl-divider-line" />
            </div>

            {/* Create an account Secondary Button */}
            <Link to="/register" className="cl-register-btn">
              <span>Create an account</span>
              <FiArrowRight size={15} />
            </Link>
          </div>

          {/* Officer Switcher & Security Notice below Card */}
          <div className="cl-officer-section">
            <div className="cl-secure-badge">
              <FiShield size={14} style={{ color: "var(--cl-action-blue, #263FD5)" }} />
              <span>Secure access to your civic services</span>
            </div>

            <p className="cl-officer-query">
              Are you a municipal engineer or department officer?
            </p>

            <Link to="/officer/login" className="cl-officer-link">
              <span>Go to Government Officer Login Portal</span>
              <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </main>

      {/* Global Modals for Track Status & Notifications */}
      <TrackModal
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
      />

      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
      />
    </div>
  );
}

export default Login;