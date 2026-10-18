import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiAlertCircle, 
  FiMapPin, 
  FiCpu, 
  FiFileText, 
  FiCamera, 
  FiTrendingUp, 
  FiBell, 
  FiArrowRight, 
  FiCheckCircle, 
  FiSearch,
  FiShield
} from "react-icons/fi";
import TrackModal from "../components/TrackModal";

function Home() {
  const navigate = useNavigate();
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const token = localStorage.getItem("token");

  return (
    <div className="citizen-page" style={{ padding: "0 0 60px" }}>
      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(180deg, rgba(232, 231, 245, 0.5) 0%, var(--vanilla-cream) 100%)",
          padding: "70px 20px 60px",
          textAlign: "center",
          borderBottom: "1px solid var(--soft-border)"
        }}
      >
        <div className="citizen-container">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "var(--soft-ivory)",
              border: "1px solid var(--soft-border)",
              padding: "6px 16px",
              borderRadius: "var(--radius-full)",
              fontSize: "13px",
              fontWeight: "600",
              color: "var(--midnight-indigo)",
              boxShadow: "var(--shadow-sm)",
              marginBottom: "20px"
            }}
          >
            <span style={{ color: "var(--warm-gold)" }}>★</span>
            <span>Government of Karnataka • Unified Grievance Redressal</span>
          </div>

          <h1
            style={{
              fontSize: "48px",
              fontWeight: "800",
              color: "var(--midnight-indigo)",
              maxWidth: "920px",
              margin: "0 auto 18px",
              lineHeight: "1.2"
            }}
          >
            Smart Public Grievance Management System
          </h1>

          <p
            style={{
              fontSize: "20px",
              color: "var(--dark-charcoal)",
              maxWidth: "800px",
              margin: "0 auto 16px",
              fontWeight: "500",
              lineHeight: "1.5"
            }}
          >
            Empowering citizens to report civic infrastructure issues with artificial intelligence, verified GPS geotagging, and guaranteed municipal accountability.
          </p>

          <p
            style={{
              fontSize: "15px",
              color: "var(--muted-grey)",
              maxWidth: "760px",
              margin: "0 auto 35px",
              lineHeight: "1.6"
            }}
          >
            Report potholes, drainage leaks, streetlight outages, and water contamination directly to designated municipal engineers across Karnataka.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "15px",
              flexWrap: "wrap"
            }}
          >
            <button
              onClick={() => navigate(token ? "/submit-complaint" : "/login")}
              className="spgms-btn spgms-btn-primary spgms-btn-lg"
            >
              <FiAlertCircle size={18} /> Lodge a Grievance
            </button>

            <button
              onClick={() => setIsTrackOpen(true)}
              className="spgms-btn spgms-btn-secondary spgms-btn-lg"
            >
              <FiSearch size={18} style={{ color: "var(--warm-gold)" }} /> Track Status by ID
            </button>

            {token && (
              <button
                onClick={() => navigate("/dashboard")}
                className="spgms-btn spgms-btn-ghost spgms-btn-lg"
              >
                Go to Citizen Dashboard →
              </button>
            )}
          </div>

          {/* Quick Metrics Banner */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginTop: "55px",
              maxWidth: "880px",
              marginRight: "auto",
              marginLeft: "auto"
            }}
          >
            <div className="spgms-card" style={{ padding: "18px", textAlign: "center" }}>
              <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--midnight-indigo)" }}>
                &lt; 24h
              </div>
              <div style={{ fontSize: "13px", color: "var(--muted-grey)", marginTop: "4px" }}>
                Average Officer Assignment
              </div>
            </div>

            <div className="spgms-card" style={{ padding: "18px", textAlign: "center" }}>
              <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--success-green)" }}>
                AI-Verified
              </div>
              <div style={{ fontSize: "13px", color: "var(--muted-grey)", marginTop: "4px" }}>
                Automatic Department Routing
              </div>
            </div>

            <div className="spgms-card" style={{ padding: "18px", textAlign: "center" }}>
              <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--warning-amber)" }}>
                100%
              </div>
              <div style={{ fontSize: "13px", color: "var(--muted-grey)", marginTop: "4px" }}>
                Transparent Public Audit Trail
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: "65px 20px 45px" }}>
        <div className="citizen-container">
          <div style={{ textAlign: "center", marginBottom: "45px" }}>
            <span className="spgms-badge badge-seen" style={{ marginBottom: "10px" }}>
              CIVIC REDRESSAL WORKFLOW
            </span>
            <h2 style={{ fontSize: "34px", fontWeight: "800", color: "var(--midnight-indigo)", margin: "8px 0" }}>
              How SPGMS Works
            </h2>
            <p style={{ color: "var(--muted-grey)", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>
              Simple 4-stage transparent grievance management from initial report to field resolution.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "24px"
            }}
          >
            <div className="spgms-card" style={{ position: "relative", padding: "26px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: "var(--muted-lavender)",
                  color: "var(--midnight-indigo)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "800",
                  fontSize: "18px",
                  marginBottom: "16px"
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>Snap & Report</h3>
              <p style={{ color: "var(--muted-grey)", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                Upload a photo of the civic defect. GPS coordinates and address are automatically pinned.
              </p>
            </div>

            <div className="spgms-card" style={{ position: "relative", padding: "26px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: "var(--muted-lavender)",
                  color: "var(--midnight-indigo)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "800",
                  fontSize: "18px",
                  marginBottom: "16px"
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>AI Triage</h3>
              <p style={{ color: "var(--muted-grey)", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                AI analyzes defect severity, computes priority, and routes the complaint to the correct department.
              </p>
            </div>

            <div className="spgms-card" style={{ position: "relative", padding: "26px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: "var(--muted-lavender)",
                  color: "var(--midnight-indigo)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "800",
                  fontSize: "18px",
                  marginBottom: "16px"
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>Field Inspection</h3>
              <p style={{ color: "var(--muted-grey)", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                Assigned ward engineer visits site, conducts maintenance work, and updates the public timeline.
              </p>
            </div>

            <div className="spgms-card" style={{ position: "relative", padding: "26px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: "var(--success-bg)",
                  color: "var(--success-green)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "800",
                  fontSize: "18px",
                  marginBottom: "16px"
                }}
              >
                4
              </div>
              <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>Verified Resolution</h3>
              <p style={{ color: "var(--muted-grey)", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                Officer uploads post-repair photograph. Citizen verifies the fix and submits satisfaction feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section style={{ padding: "40px 20px" }}>
        <div className="citizen-container">
          <div style={{ textAlign: "center", marginBottom: "45px" }}>
            <span className="spgms-badge" style={{ backgroundColor: "var(--warm-gold-light)", color: "#875f14", marginBottom: "10px" }}>
              INTELLIGENT CAPABILITIES
            </span>
            <h2 style={{ fontSize: "34px", fontWeight: "800", color: "var(--midnight-indigo)", margin: "8px 0" }}>
              Engineered for Transparent Public Service
            </h2>
            <p style={{ color: "var(--muted-grey)", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>
              Modern technologies working together for a cleaner, safer Karnataka.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px"
            }}
          >
            <div className="spgms-card spgms-card-hover">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={iconBoxStyle}><FiMapPin size={22} /></div>
                <h3 style={{ margin: 0, fontSize: "18px" }}>GPS Geotagging</h3>
              </div>
              <p style={{ color: "var(--muted-grey)", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                High-precision browser geotagging pinpoints the exact latitude and longitude of the issue, converting it into a verified street address.
              </p>
            </div>

            <div className="spgms-card spgms-card-hover">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={iconBoxStyle}><FiCpu size={22} /></div>
                <h3 style={{ margin: 0, fontSize: "18px" }}>Computer Vision AI</h3>
              </div>
              <p style={{ color: "var(--muted-grey)", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                Our deep learning models inspect uploaded images in real-time, categorizing potholes, electric hazards, and water leakages within milliseconds.
              </p>
            </div>

            <div className="spgms-card spgms-card-hover">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={iconBoxStyle}><FiFileText size={22} /></div>
                <h3 style={{ margin: 0, fontSize: "18px" }}>Auto-Generated Summary</h3>
              </div>
              <p style={{ color: "var(--muted-grey)", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                AI assists citizens by generating technical issue descriptions, severity estimates, and suggested repair schedules automatically.
              </p>
            </div>

            <div className="spgms-card spgms-card-hover">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={iconBoxStyle}><FiCamera size={22} /></div>
                <h3 style={{ margin: 0, fontSize: "18px" }}>Before & After Proof</h3>
              </div>
              <p style={{ color: "var(--muted-grey)", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                Every resolved grievance is backed by mandatory photographic resolution evidence uploaded by the designated government engineer.
              </p>
            </div>

            <div className="spgms-card spgms-card-hover">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={iconBoxStyle}><FiTrendingUp size={22} /></div>
                <h3 style={{ margin: 0, fontSize: "18px" }}>Live Milestone Tracker</h3>
              </div>
              <p style={{ color: "var(--muted-grey)", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                Follow every step of your grievance with an interactive status timeline showing when it was logged, assigned, inspected, and closed.
              </p>
            </div>

            <div className="spgms-card spgms-card-hover">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={iconBoxStyle}><FiShield size={22} /></div>
                <h3 style={{ margin: 0, fontSize: "18px" }}>Direct Officer Accountability</h3>
              </div>
              <p style={{ color: "var(--muted-grey)", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                View the name, designation, department, and direct remarks of the official assigned to your ward for complete administrative transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section style={{ padding: "40px 20px 20px" }}>
        <div
          className="citizen-container"
          style={{
            backgroundColor: "var(--deep-indigo)",
            borderRadius: "var(--radius-xl)",
            padding: "45px 35px",
            color: "var(--vanilla-cream)",
            textAlign: "center",
            border: "1px solid var(--warm-gold)",
            boxShadow: "var(--shadow-lg)"
          }}
        >
          <h2 style={{ color: "var(--vanilla-cream)", fontSize: "32px", fontWeight: "800", marginBottom: "12px" }}>
            Witness a Civic Issue in Your Neighbourhood?
          </h2>
          <p style={{ color: "#d2d1e2", fontSize: "16px", maxWidth: "600px", margin: "0 auto 28px", lineHeight: "1.6" }}>
            Submit an official grievance in less than 2 minutes. Our AI system will route it to the responsible municipal department immediately.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate(token ? "/submit-complaint" : "/login")}
              className="spgms-btn spgms-btn-gold spgms-btn-lg"
            >
              Report a Civic Issue Now <FiArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate("/register")}
              className="spgms-btn spgms-btn-secondary spgms-btn-lg"
              style={{ backgroundColor: "transparent", color: "var(--vanilla-cream)", borderColor: "rgba(255,255,255,0.3)" }}
            >
              Create Citizen Account
            </button>
          </div>
        </div>
      </section>

      <TrackModal
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
      />
    </div>
  );
}

const iconBoxStyle = {
  width: "42px",
  height: "42px",
  borderRadius: "var(--radius-md)",
  backgroundColor: "var(--muted-lavender)",
  color: "var(--midnight-indigo)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0
};

export default Home;