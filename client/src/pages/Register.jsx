import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiArrowRight, 
  FiShield 
} from "react-icons/fi";
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please ensure both passwords are identical.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        fullName,
        email,
        phoneNumber,
        password
      });

      setSuccess("Citizen account registered successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="citizen-page"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "45px 20px"
      }}
    >
      <div className="citizen-container-sm" style={{ maxWidth: "520px" }}>
        {/* Government Portal Header */}
        <div style={{ textAlign: "center", marginBottom: "22px" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: "var(--midnight-indigo)",
              border: "2px solid var(--warm-gold)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 10px",
              fontSize: "22px",
              boxShadow: "var(--shadow-md)"
            }}
          >
            🏛
          </div>
          <span
            style={{
              display: "inline-block",
              fontSize: "12px",
              fontWeight: "700",
              color: "var(--midnight-indigo)",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              backgroundColor: "var(--muted-lavender)",
              padding: "3px 12px",
              borderRadius: "var(--radius-full)",
              marginBottom: "6px"
            }}
          >
            Official Civic Registration
          </span>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "var(--midnight-indigo)", margin: "4px 0" }}>
            Register as a Citizen
          </h2>
          <p style={{ color: "var(--muted-grey)", fontSize: "14px", margin: 0 }}>
            Create an official profile to submit grievances and receive live SMS / email resolution alerts
          </p>
        </div>

        {/* Form Card */}
        <div
          className="spgms-card"
          style={{
            borderTop: "4px solid var(--warm-gold)",
            boxShadow: "var(--shadow-lg)",
            padding: "32px 28px"
          }}
        >
          {error && (
            <div className="spgms-alert spgms-alert-error" role="alert">
              <FiAlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>{error}</div>
            </div>
          )}

          {success && (
            <div className="spgms-alert spgms-alert-success" role="alert">
              <FiCheckCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>{success}</div>
            </div>
          )}

          <form onSubmit={handleRegister}>
            {/* Full Name */}
            <div className="spgms-form-group">
              <label className="spgms-label" htmlFor="reg-name">
                Full Legal Name
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="reg-name"
                  type="text"
                  name="fullName"
                  className="spgms-input"
                  style={{ paddingLeft: "38px" }}
                  placeholder="e.g. Ramesh Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <FiUser
                  size={16}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--muted-grey)"
                  }}
                />
              </div>
            </div>

            {/* Email & Phone Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div className="spgms-form-group">
                <label className="spgms-label" htmlFor="reg-email">
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="reg-email"
                    type="email"
                    name="email"
                    className="spgms-input"
                    style={{ paddingLeft: "36px" }}
                    placeholder="name@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <FiMail
                    size={15}
                    style={{
                      position: "absolute",
                      left: "11px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--muted-grey)"
                    }}
                  />
                </div>
              </div>

              <div className="spgms-form-group">
                <label className="spgms-label" htmlFor="reg-phone">
                  Mobile Number
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="reg-phone"
                    type="tel"
                    name="phone"
                    className="spgms-input"
                    style={{ paddingLeft: "36px" }}
                    placeholder="9876543210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <FiPhone
                    size={15}
                    style={{
                      position: "absolute",
                      left: "11px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--muted-grey)"
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div className="spgms-form-group">
                <label className="spgms-label" htmlFor="reg-password">
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="spgms-input"
                    style={{ paddingLeft: "36px", paddingRight: "34px" }}
                    placeholder="Min 6 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <FiLock
                    size={15}
                    style={{
                      position: "absolute",
                      left: "11px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--muted-grey)"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--muted-grey)",
                      padding: "2px"
                    }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
              </div>

              <div className="spgms-form-group">
                <label className="spgms-label" htmlFor="reg-confirm">
                  Confirm Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="reg-confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="spgms-input"
                    style={{ paddingLeft: "36px", paddingRight: "34px" }}
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <FiLock
                    size={15}
                    style={{
                      position: "absolute",
                      left: "11px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--muted-grey)"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--muted-grey)",
                      padding: "2px"
                    }}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms notice */}
            <p style={{ fontSize: "12px", color: "var(--muted-grey)", margin: "4px 0 16px", lineHeight: "1.5" }}>
              By registering, you agree to submit legitimate public complaints in accordance with Karnataka Municipal Grievance Redressal guidelines.
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="spgms-btn spgms-btn-primary"
              style={{
                width: "100%",
                padding: "13px",
                fontSize: "15px"
              }}
            >
              {loading ? "Creating Account..." : "Complete Citizen Registration"}
              {!loading && <FiArrowRight size={16} />}
            </button>
          </form>

          {/* Login Link */}
          <div
            style={{
              marginTop: "22px",
              paddingTop: "18px",
              borderTop: "1px solid var(--soft-border)",
              textAlign: "center",
              fontSize: "14px",
              color: "var(--dark-charcoal)"
            }}
          >
            Already have a registered account?{" "}
            <Link
              to="/login"
              style={{
                color: "var(--midnight-indigo)",
                fontWeight: "700",
                textDecoration: "none"
              }}
            >
              Sign In Here →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;