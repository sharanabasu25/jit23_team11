import { useNavigate } from "react-router-dom";

export default function OfficerTopbar() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("officerLoggedIn");
    navigate("/officer/login");
  };

  return (
    <div
      style={{
        height: "70px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 30px",
        borderBottom: "1px solid #ddd",
        boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ color: "#1e3a8a", margin: 0 }}>
        Government Officer Portal
      </h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <span style={{ fontWeight: "bold", color: "#1e3a8a" }}>
          👤 {user ? user.fullName : "Officer"}
        </span>

        <button
          onClick={handleLogout}
          style={{
            background: "#dc2626",
            color: "white",
            border: "none",
            padding: "8px 15px",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}