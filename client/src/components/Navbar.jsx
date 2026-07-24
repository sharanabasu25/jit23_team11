import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("citizenLoggedIn");
    navigate("/");
  };

  return (
    <nav
      style={{
        background: "#2563eb",
        color: "white",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2>SPGMS</h2>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Home
        </Link>

        {token && user ? (
          <>
            <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>
              Dashboard
            </Link>
            <Link to="/my-complaints" style={{ color: "white", textDecoration: "none" }}>
              My Complaints
            </Link>
            <Link to="/profile" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>
              👤 {user.fullName.split(' ')[0]}
            </Link>
            <button 
              onClick={handleLogout} 
              style={{
                background: "transparent",
                color: "white",
                border: "1px solid white",
                padding: "5px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
              Login
            </Link>
            <Link to="/register" style={{ color: "white", textDecoration: "none" }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;