import { Link } from "react-router-dom";
import { FiPhone, FiMail, FiMapPin, FiShield, FiExternalLink } from "react-icons/fi";

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--deep-indigo)",
        color: "var(--vanilla-cream)",
        borderTop: "3px solid var(--warm-gold)",
        marginTop: "auto"
      }}
    >
      {/* Main Footer Content */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "50px 24px 30px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "35px"
        }}
      >
        {/* Column 1: Government Emblem & Mission */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <span style={{ fontSize: "28px" }}>🏛</span>
            <div>
              <h3 style={{ margin: 0, color: "var(--vanilla-cream)", fontSize: "18px", fontWeight: "700" }}>
                SPGMS Portal
              </h3>
              <p style={{ margin: 0, color: "var(--warm-gold)", fontSize: "12px", fontWeight: "600" }}>
                Government of Karnataka
              </p>
            </div>
          </div>
          <p
            style={{
              color: "#c8c7db",
              fontSize: "13px",
              lineHeight: "1.7",
              margin: "0 0 16px"
            }}
          >
            The Smart Public Grievance Management System enables citizens to report civic infrastructure issues directly to municipal departments with real-time AI classification and transparent officer accountability.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--warm-gold)" }}>
            <FiShield size={14} />
            <span>Official Government Civic Redressal Gateway</span>
          </div>
        </div>

        {/* Column 2: Citizen Quick Links */}
        <div>
          <h4
            style={{
              color: "var(--vanilla-cream)",
              fontSize: "15px",
              fontWeight: "700",
              borderBottom: "1px solid rgba(255,255,255,0.15)",
              paddingBottom: "10px",
              marginBottom: "15px"
            }}
          >
            Citizen Services
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "13px", lineHeight: "2.2" }}>
            <li>
              <Link to="/home" style={footerLinkStyle}>• Portal Home</Link>
            </li>
            <li>
              <Link to="/submit-complaint" style={footerLinkStyle}>• Lodge New Grievance</Link>
            </li>
            <li>
              <Link to="/my-complaints" style={footerLinkStyle}>• Grievance History & Status</Link>
            </li>
            <li>
              <Link to="/login" style={footerLinkStyle}>• Citizen Account Sign In</Link>
            </li>
            <li>
              <Link to="/register" style={footerLinkStyle}>• New Citizen Registration</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Civic Helplines */}
        <div>
          <h4
            style={{
              color: "var(--vanilla-cream)",
              fontSize: "15px",
              fontWeight: "700",
              borderBottom: "1px solid rgba(255,255,255,0.15)",
              paddingBottom: "10px",
              marginBottom: "15px"
            }}
          >
            Emergency Municipal Helplines
          </h4>
          <div style={{ fontSize: "13px", color: "#c8c7db", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <FiPhone style={{ color: "var(--warm-gold)", marginTop: "3px" }} />
              <div>
                <strong style={{ color: "var(--vanilla-cream)" }}>Municipal Control:</strong> 1533 / 1912
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <FiPhone style={{ color: "var(--warm-gold)", marginTop: "3px" }} />
              <div>
                <strong style={{ color: "var(--vanilla-cream)" }}>Water Supply & Leakage:</strong> 1916
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <FiMail style={{ color: "var(--warm-gold)", marginTop: "3px" }} />
              <div>
                <strong style={{ color: "var(--vanilla-cream)" }}>Citizen Support:</strong> grievances@karnataka.gov.in
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <FiMapPin style={{ color: "var(--warm-gold)", marginTop: "3px" }} />
              <div>Vidhana Soudha, Bengaluru, Karnataka — 560001</div>
            </div>
          </div>
        </div>

        {/* Column 4: Officer & Administration Gateway */}
        <div>
          <h4
            style={{
              color: "var(--vanilla-cream)",
              fontSize: "15px",
              fontWeight: "700",
              borderBottom: "1px solid rgba(255,255,255,0.15)",
              paddingBottom: "10px",
              marginBottom: "15px"
            }}
          >
            Government Officers
          </h4>
          <p style={{ color: "#c8c7db", fontSize: "13px", lineHeight: "1.6", margin: "0 0 16px" }}>
            Designated municipal engineers and ward officers can access grievance resolution tools and inspection reporting.
          </p>
          <Link
            to="/officer/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "rgba(212, 168, 90, 0.15)",
              color: "var(--warm-gold)",
              border: "1px solid var(--warm-gold)",
              padding: "8px 16px",
              borderRadius: "var(--radius-sm)",
              fontSize: "13px",
              fontWeight: "600",
              textDecoration: "none"
            }}
          >
            Officer Portal Login <FiExternalLink size={13} />
          </Link>
        </div>
      </div>

      {/* Bottom Sub-Footer Bar */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          backgroundColor: "#0b0e2b",
          padding: "16px 24px",
          fontSize: "12px",
          color: "#9f9db5",
          textAlign: "center"
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px"
          }}
        >
          <div>
            © 2026 Smart Public Grievance Management System (SPGMS). All rights reserved.
          </div>
          <div style={{ display: "flex", gap: "18px" }}>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Citizen Service</span>
            <span>•</span>
            <span>Accessibility Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

const footerLinkStyle = {
  color: "#c8c7db",
  textDecoration: "none",
  transition: "color 150ms ease"
};

export default Footer;