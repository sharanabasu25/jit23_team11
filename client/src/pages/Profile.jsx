import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiShield, 
  FiCheckCircle, 
  FiLogOut, 
  FiGrid, 
  FiFileText, 
  FiBell, 
  FiLock,
  FiArrowRight
} from "react-icons/fi";

function Profile() {
  const navigate = useNavigate();
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("citizenLoggedIn");
    navigate("/");
  };

  if (!user) {
    return (
      <div className="citizen-page" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="spgms-card" style={{ maxWidth: "420px", textAlign: "center", padding: "40px 28px" }}>
          <div style={{ fontSize: "40px", marginBottom: "15px" }}>🔒</div>
          <h2 style={{ fontSize: "22px", color: "var(--midnight-indigo)", margin: "0 0 10px" }}>
            Citizen Profile Restricted
          </h2>
          <p style={{ color: "var(--muted-grey)", fontSize: "14px", marginBottom: "25px" }}>
            Please log in to manage your citizen profile, contact details, and notification preferences.
          </p>
          <button onClick={() => navigate("/login")} className="spgms-btn spgms-btn-primary" style={{ width: "100%" }}>
            Go to Citizen Login
          </button>
        </div>
      </div>
    );
  }

  const initial = user.fullName ? user.fullName.charAt(0).toUpperCase() : "C";

  return (
    <div className="citizen-page">
      <div className="citizen-container-narrow">
        {/* Profile Identity Card */}
        <div
          className="spgms-card"
          style={{
            background: "linear-gradient(135deg, var(--deep-indigo) 0%, var(--midnight-indigo) 100%)",
            color: "var(--vanilla-cream)",
            padding: "36px 30px",
            border: "1px solid var(--warm-gold)",
            marginBottom: "26px",
            display: "flex",
            alignItems: "center",
            gap: "24px",
            flexWrap: "wrap"
          }}
        >
          <div
            style={{
              width: "76px",
              height: "76px",
              borderRadius: "50%",
              backgroundColor: "var(--warm-gold)",
              color: "var(--deep-indigo)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "34px",
              fontWeight: "800",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              flexShrink: 0
            }}
          >
            {initial}
          </div>

          <div style={{ flex: 1, minWidth: "220px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span
                style={{
                  backgroundColor: "var(--warm-gold)",
                  color: "var(--deep-indigo)",
                  fontSize: "11px",
                  fontWeight: "800",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  textTransform: "uppercase"
                }}
              >
                Verified Citizen Account
              </span>
              <span style={{ fontSize: "12px", color: "var(--muted-lavender)" }}>
                Karnataka Public Registry
              </span>
            </div>

            <h1 style={{ color: "var(--vanilla-cream)", fontSize: "28px", fontWeight: "800", margin: "2px 0 6px" }}>
              {user.fullName}
            </h1>

            <p style={{ margin: 0, fontSize: "14px", color: "#d5d4e6" }}>
              Registered User ID: <span style={{ fontFamily: "monospace" }}>{user._id || "SPGMS-CITIZEN"}</span>
            </p>
          </div>
        </div>

        {/* Profile Particulars Card */}
        <div className="spgms-card" style={{ marginBottom: "26px", borderTop: "4px solid var(--midnight-indigo)" }}>
          <h3 style={{ fontSize: "18px", margin: "0 0 18px", borderBottom: "1px solid var(--soft-border)", paddingBottom: "10px" }}>
            Verified Contact & Personal Details
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <span className="spgms-label" style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--muted-grey)" }}>
                <FiUser size={14} /> Full Legal Name
              </span>
              <div style={{ fontSize: "16px", fontWeight: "600", color: "var(--dark-charcoal)" }}>
                {user.fullName}
              </div>
            </div>

            <div>
              <span className="spgms-label" style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--muted-grey)" }}>
                <FiMail size={14} /> Registered Email Address
              </span>
              <div style={{ fontSize: "16px", fontWeight: "600", color: "var(--dark-charcoal)" }}>
                {user.email}
              </div>
            </div>

            <div>
              <span className="spgms-label" style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--muted-grey)" }}>
                <FiPhone size={14} /> Mobile Phone Number
              </span>
              <div style={{ fontSize: "16px", fontWeight: "600", color: "var(--dark-charcoal)" }}>
                {user.phoneNumber || "Not provided"}
              </div>
            </div>

            <div>
              <span className="spgms-label" style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--muted-grey)" }}>
                <FiShield size={14} /> Portal Role Authorization
              </span>
              <span className="spgms-badge badge-resolved" style={{ marginTop: "2px" }}>
                <FiCheckCircle size={12} /> {user.role || "Citizen"}
              </span>
            </div>
          </div>
        </div>

        {/* Civic Alert Preferences Card */}
        <div className="spgms-card" style={{ marginBottom: "26px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <FiBell size={18} style={{ color: "var(--midnight-indigo)" }} />
            <h3 style={{ margin: 0, fontSize: "18px" }}>Notification & Alert Preferences</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <label
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--vanilla-cream)",
                border: "1px solid var(--soft-border)",
                cursor: "pointer"
              }}
            >
              <div>
                <strong style={{ fontSize: "14px", color: "var(--dark-charcoal)" }}>
                  SMS Resolution Alerts
                </strong>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--muted-grey)" }}>
                  Receive mobile alerts when an officer is assigned or repairs complete
                </p>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                style={{ width: "18px", height: "18px", accentColor: "var(--midnight-indigo)", cursor: "pointer" }}
              />
            </label>

            <label
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--vanilla-cream)",
                border: "1px solid var(--soft-border)",
                cursor: "pointer"
              }}
            >
              <div>
                <strong style={{ fontSize: "14px", color: "var(--dark-charcoal)" }}>
                  Email Audit Summary
                </strong>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--muted-grey)" }}>
                  Get automated PDF receipts and resolution proof snapshots in your inbox
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                style={{ width: "18px", height: "18px", accentColor: "var(--midnight-indigo)", cursor: "pointer" }}
              />
            </label>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/dashboard")}
            className="spgms-btn spgms-btn-primary"
            style={{ flex: 1, minWidth: "160px" }}
          >
            <FiGrid size={16} /> Return to Dashboard
          </button>

          <button
            onClick={() => navigate("/my-complaints")}
            className="spgms-btn spgms-btn-secondary"
            style={{ flex: 1, minWidth: "160px" }}
          >
            <FiFileText size={16} /> My Grievances
          </button>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="spgms-btn spgms-btn-danger"
            style={{ minWidth: "130px" }}
          >
            <FiLogOut size={16} /> Logout
          </button>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="spgms-modal-backdrop" onClick={() => setShowLogoutConfirm(false)}>
            <div className="spgms-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "420px" }}>
              <h3 style={{ fontSize: "19px", color: "var(--midnight-indigo)", margin: "0 0 10px" }}>
                Confirm Sign Out
              </h3>
              <p style={{ color: "var(--muted-grey)", fontSize: "14px", margin: "0 0 24px", lineHeight: "1.5" }}>
                Are you sure you want to end your current citizen session on the Karnataka Grievance Management System?
              </p>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="spgms-btn spgms-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="spgms-btn spgms-btn-danger"
                >
                  Confirm Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;