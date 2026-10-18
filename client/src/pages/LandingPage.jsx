import { useNavigate } from "react-router-dom";
import { FiUser, FiShield, FiCheck, FiArrowRight } from "react-icons/fi";

export default function LandingPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--vanilla-cream)",
        backgroundImage: "radial-gradient(circle at top right, rgba(232, 231, 245, 0.6) 0%, transparent 60%), radial-gradient(circle at bottom left, rgba(212, 168, 90, 0.08) 0%, transparent 50%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 20px",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1140px",
          textAlign: "center"
        }}
      >
        {/* Government Emblem & Header */}
        <div style={{ marginBottom: "25px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              backgroundColor: "var(--midnight-indigo)",
              border: "2.5px solid var(--warm-gold)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: "36px",
              boxShadow: "0 4px 15px rgba(25, 25, 112, 0.2)"
            }}
          >
            🏛
          </div>

          <div
            style={{
              display: "inline-block",
              backgroundColor: "var(--muted-lavender)",
              color: "var(--midnight-indigo)",
              padding: "4px 14px",
              borderRadius: "var(--radius-full)",
              fontSize: "13px",
              fontWeight: "700",
              letterSpacing: "0.5px",
              border: "1px solid rgba(25, 25, 112, 0.15)",
              marginBottom: "12px"
            }}
          >
            GOVERNMENT OF KARNATAKA
          </div>

          <h1
            style={{
              fontSize: "44px",
              fontWeight: "800",
              color: "var(--midnight-indigo)",
              lineHeight: "1.2",
              margin: "0 auto 12px",
              maxWidth: "850px"
            }}
          >
            Smart Public Grievance Management System
          </h1>

          <div
            style={{
              width: "80px",
              height: "4px",
              backgroundColor: "var(--warm-gold)",
              margin: "16px auto",
              borderRadius: "2px"
            }}
          />

          <p
            style={{
              fontSize: "19px",
              color: "var(--muted-grey)",
              maxWidth: "680px",
              margin: "0 auto 45px",
              lineHeight: "1.5"
            }}
          >
            Next-generation civic redressal powered by artificial intelligence, automated department triaging, and real-time field tracking.
          </p>
        </div>

        {/* Portal Cards Selection */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "30px",
            maxWidth: "960px",
            margin: "0 auto",
            alignItems: "stretch"
          }}
        >
          {/* ================= Citizen Portal ================= */}
          <div
            className="spgms-card spgms-card-hover"
            style={{
              textAlign: "left",
              padding: "36px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderTop: "5px solid var(--midnight-indigo)",
              position: "relative"
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "20px"
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--muted-lavender)",
                    color: "var(--midnight-indigo)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "26px"
                  }}
                >
                  <FiUser size={28} />
                </div>
                <span className="spgms-badge badge-seen">Public Access</span>
              </div>

              <h2
                style={{
                  color: "var(--midnight-indigo)",
                  fontSize: "26px",
                  fontWeight: "700",
                  marginBottom: "10px"
                }}
              >
                Citizen Portal
              </h2>

              <p style={{ color: "var(--muted-grey)", fontSize: "14px", lineHeight: "1.6", marginBottom: "22px" }}>
                Report potholes, water leaks, streetlight faults, and track resolution timelines with your verified citizen profile.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginBottom: "28px",
                  fontSize: "14px",
                  color: "var(--dark-charcoal)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "var(--success-green)", display: "flex" }}><FiCheck size={16} /></span>
                  <span>Instant AI Image Grievance Detection</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "var(--success-green)", display: "flex" }}><FiCheck size={16} /></span>
                  <span>GPS Geotagging & Automatic Address Pin</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "var(--success-green)", display: "flex" }}><FiCheck size={16} /></span>
                  <span>Real-Time Audit Timeline & Notifications</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "var(--success-green)", display: "flex" }}><FiCheck size={16} /></span>
                  <span>Direct Officer Resolution Accountability</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(token && user ? "/dashboard" : "/home")}
              className="spgms-btn spgms-btn-primary spgms-btn-lg"
              style={{ width: "100%", justifyContent: "center" }}
            >
              {token && user ? "Go to Dashboard" : "Enter Citizen Portal"} <FiArrowRight size={18} />
            </button>
          </div>

          {/* ================= Government Officer Portal ================= */}
          <div
            className="spgms-card spgms-card-hover"
            style={{
              textAlign: "left",
              padding: "36px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderTop: "5px solid var(--warm-gold)",
              position: "relative"
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "20px"
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "rgba(212, 168, 90, 0.15)",
                    color: "var(--deep-indigo)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "26px"
                  }}
                >
                  <FiShield size={28} />
                </div>
                <span className="spgms-badge" style={{ backgroundColor: "var(--warm-gold-light)", color: "#875f14", border: "1px solid rgba(212, 168, 90, 0.4)" }}>
                  Official Personnel
                </span>
              </div>

              <h2
                style={{
                  color: "var(--deep-indigo)",
                  fontSize: "26px",
                  fontWeight: "700",
                  marginBottom: "10px"
                }}
              >
                Officer Portal
              </h2>

              <p style={{ color: "var(--muted-grey)", fontSize: "14px", lineHeight: "1.6", marginBottom: "22px" }}>
                Restricted portal for municipal engineers, ward supervisors, and departmental heads to manage and resolve civic cases.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginBottom: "28px",
                  fontSize: "14px",
                  color: "var(--dark-charcoal)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "var(--warm-gold)", display: "flex" }}><FiCheck size={16} /></span>
                  <span>Departmental Grievance Worklist</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "var(--warm-gold)", display: "flex" }}><FiCheck size={16} /></span>
                  <span>Resolution Proof & Photo Upload</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "var(--warm-gold)", display: "flex" }}><FiCheck size={16} /></span>
                  <span>SLA Performance & Inspection Reports</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "var(--warm-gold)", display: "flex" }}><FiCheck size={16} /></span>
                  <span>Zone & Ward-Level Priority Dispatch</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/officer/login")}
              className="spgms-btn spgms-btn-secondary spgms-btn-lg"
              style={{ width: "100%", justifyContent: "center", borderColor: "var(--warm-gold)" }}
            >
              Government Officer Sign In <FiArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div style={{ marginTop: "45px", color: "var(--muted-grey)", fontSize: "13px" }}>
          <p style={{ margin: "0 0 6px" }}>
            © 2026 Smart Public Grievance Management System • Government of Karnataka
          </p>
          <p style={{ margin: 0 }}>
            Dedicated to responsive municipal governance, transparency, and public accountability.
          </p>
        </div>
      </div>
    </div>
  );
}