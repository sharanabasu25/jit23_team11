import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Info,
  ShieldCheck,
  Bell,
  ChevronDown,
  LogOut,
  Home,
  LayoutDashboard,
  ClipboardList,
  BarChart3
} from "lucide-react";
import { sampleOfficer } from "../../data/officerSampleData";
import "../../officerTheme.css";
import loginBgImg from "../../assets/officer-login-bg.jpg";

export default function OfficerLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("officer@spgms.org");
  const [password, setPassword] = useState("officer123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // 1. Attempt official backend authentication
      try {
        const response = await axios.post("http://localhost:5000/api/auth/login", {
          email: email.trim().toLowerCase(),
          password
        }, { timeout: 3500 });

        if (response.data.role !== "Officer" && response.data.role !== "Admin") {
          throw new Error("Access Denied - This portal is restricted to Government Officers.");
        }

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("officerLoggedIn", "true");

        navigate("/officer/dashboard");
        return;
      } catch (apiErr) {
        // If server actively returned a 401 or role error, check message
        if (apiErr.response?.data?.message) {
          // If server is running but password or email was wrong
          throw new Error(apiErr.response.data.message);
        }

        // If backend connection timed out or is offline, support seamless demo session
        console.warn("[Officer Login] Backend offline or unreachable. Falling back to officer session for demo exploration.");
        
        const demoUser = {
          ...sampleOfficer,
          email: email || sampleOfficer.email
        };

        localStorage.setItem("token", "demo-officer-session-token-" + Date.now());
        localStorage.setItem("user", JSON.stringify(demoUser));
        localStorage.setItem("officerLoggedIn", "true");

        navigate("/officer/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Invalid Officer Email or Password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="op-login-page">
      {/* Background Graphic Asset with gentle overlay */}
      <img
        src={loginBgImg}
        alt="Vidhana Soudha Civic Palace Promenade"
        className="op-login-bg-img"
        onError={(e) => {
          e.currentTarget.src = "/officer-login-bg.jpg";
        }}
      />
      <div className="op-login-overlay" />

      {/* Top Header matching Screenshot 1 */}
      <header className="op-top-header" style={{ position: "relative", zIndex: 20 }}>
        <div className="op-header-left">
          <Link to="/" className="op-brand-box">
            <div className="op-brand-logo-sq">
              <Building2 size={24} strokeWidth={2.2} />
            </div>
            <div className="op-brand-text">
              <div className="op-brand-title-row">
                <span className="op-brand-title">SPGMS</span>
                <span className="op-officer-pill">OFFICER</span>
              </div>
              <span className="op-brand-subtitle">Smart Public Grievance Management System</span>
            </div>
          </Link>
        </div>

        {/* Top Navigation Links from Screenshot 1 */}
        <nav className="op-header-nav-links">
          <Link to="/home" className="op-header-nav-link active">
            <Home size={16} />
            <span>Home</span>
          </Link>
          <Link to="/officer/dashboard" className="op-header-nav-link">
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </Link>
          <Link to="/officer/complaints" className="op-header-nav-link">
            <ClipboardList size={16} />
            <span>Complaints</span>
          </Link>
          <Link to="/officer/reports" className="op-header-nav-link">
            <BarChart3 size={16} />
            <span>Reports</span>
          </Link>
        </nav>

        {/* Right Header Icons */}
        <div className="op-header-right">
          <button className="op-bell-btn" title="3 Notifications">
            <Bell size={20} />
            <span className="op-bell-badge">3</span>
          </button>

          <div className="op-officer-profile-btn">
            <div className="op-officer-avatar-circle">R</div>
            <span className="op-officer-name">Officer</span>
            <ChevronDown size={16} />
          </div>

          <button
            className="op-logout-btn"
            onClick={() => navigate("/login")}
            title="Citizen Portal"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Centered Translucent Government Login Card */}
      <main className="op-login-content">
        <div className="op-login-card">
          <div className="op-login-badge-icon">
            <Building2 size={26} strokeWidth={2.2} />
          </div>

          <h1 className="op-login-title">Government Officer Login</h1>
          <p className="op-login-subtitle">GOVERNMENT OF KARNATAKA</p>

          <form onSubmit={handleLogin} className="op-login-form">
            {/* Official Email */}
            <div className="op-form-group">
              <label className="op-form-label">Official Email</label>
              <div className="op-input-icon-wrap">
                <Mail size={18} className="op-input-icon-left" />
                <input
                  type="email"
                  className="op-input-control"
                  placeholder="officer@spgms.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password with Eye Toggle */}
            <div className="op-form-group">
              <label className="op-form-label">Password</label>
              <div className="op-input-icon-wrap">
                <Lock size={18} className="op-input-icon-left" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="op-input-control"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="op-input-icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Options Row */}
            <div className="op-login-options-row">
              <label className="op-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: "var(--op-primary)", width: "16px", height: "16px" }}
                />
                <span>Remember me</span>
              </label>

              <a
                href="#forgot"
                className="op-forgot-link"
                onClick={(e) => {
                  e.preventDefault();
                  alert("For password reset, please contact your District Nodal Grievance IT Administrator.");
                }}
              >
                Forgot password?
              </a>
            </div>

            {error && (
              <div style={{ color: "#DC2626", fontSize: "13px", fontWeight: "600", padding: "6px 0" }}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="op-btn-login-submit"
            >
              <span>{submitting ? "Authenticating..." : "Login"}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Demo Officer Credentials Notice */}
          <div className="op-demo-creds-box">
            <Info size={19} className="op-demo-creds-icon" />
            <div>
              <p className="op-demo-creds-title">Demo Officer Credentials</p>
              <p className="op-demo-creds-desc">
                Create an officer account in the database (or use your test script details) to authenticate.
              </p>
            </div>
          </div>

          {/* Security & Citizen Portal Link */}
          <div className="op-login-footer-security">
            <ShieldCheck size={16} />
            <span>Secure access to government services</span>
          </div>

          <div className="op-citizen-link-row">
            <span>Are you a citizen? </span>
            <Link to="/login" className="op-citizen-link">
              Go to Citizen Login Portal
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}