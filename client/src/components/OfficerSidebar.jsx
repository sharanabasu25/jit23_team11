import { Link, useNavigate } from "react-router-dom";

const linkStyle = {
  color: "white",
  textDecoration: "none",
  padding: "12px 15px",
  borderRadius: "8px",
  marginBottom: "8px",
  display: "block",
  fontSize: "17px",
  background: "transparent",
  border: "none",
  width: "100%",
  textAlign: "left",
  cursor: "pointer"
};

export default function OfficerSidebar() {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("officerLoggedIn");
    navigate("/officer/login");
  };

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
        <Link style={{...linkStyle, cursor: "pointer"}} to="/officer/dashboard">
          📊 Dashboard
        </Link>

        <Link style={{...linkStyle, cursor: "pointer"}} to="/officer/complaints">
          📋 Complaints
        </Link>

        <Link style={{...linkStyle, cursor: "pointer"}} to="/officer/notifications">
          🔔 Notifications
        </Link>

        <Link style={{...linkStyle, cursor: "pointer"}} to="/officer/profile">
          👤 Profile
        </Link>

        <Link style={{...linkStyle, cursor: "pointer"}} to="/officer/reports">
          📈 Reports
        </Link>

        <a style={{...linkStyle, color: "#f87171"}} href="#logout" onClick={handleLogout}>
          🚪 Logout
        </a>
      </div>
    </div>
  );
}