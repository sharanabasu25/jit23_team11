import { Link } from "react-router-dom";

export default function OfficerSidebar() {
  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        background: "#1e3a8a",
        color: "white",
        padding: "20px",
      }}
    >
      <h2 style={{ marginBottom: "30px" }}>SPGMS</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Link to="/officer/dashboard" style={linkStyle}>
          Dashboard
        </Link>

        <Link to="/officer/complaints" style={linkStyle}>
          Complaints
        </Link>

        <Link to="/officer/profile" style={linkStyle}>
          Profile
        </Link>

        <Link to="/officer/login" style={linkStyle}>
          Logout
        </Link>
      </nav>
    </div>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "18px",
};