import { Link } from "react-router-dom";

const linkStyle = {
  color: "white",
  textDecoration: "none",
  padding: "12px 15px",
  borderRadius: "8px",
  marginBottom: "8px",
  display: "block",
  fontSize: "17px",
};

export default function OfficerSidebar() {
  return (
    <div
      style={{
        width: "250px",
        minHeight: "100vh",
        background: "#1E3A8A",
        color: "white",
      }}
    >
      <div
        style={{
          padding: "25px",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          textAlign: "center",
        }}
      >
        <h2>🏛 SPGMS</h2>
        <p>Officer Panel</p>
      </div>

      <div
        style={{
          padding: "20px",
        }}
      >
        <Link style={linkStyle} to="/officer/dashboard">
          📊 Dashboard
        </Link>

        <Link style={linkStyle} to="/officer/complaints">
          📋 Complaints
        </Link>

        <Link style={linkStyle} to="/officer/profile">
          👤 Profile
        </Link>

        <Link style={linkStyle} to="/officer/login">
          🚪 Logout
        </Link>
      </div>
    </div>
  );
}