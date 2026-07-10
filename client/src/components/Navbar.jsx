import { Link } from "react-router-dom";

function Navbar() {
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

      <div style={{ display: "flex", gap: "20px" }}>
  <Link to="/" style={{ color: "white", textDecoration: "none" }}>
    Home
  </Link>

  <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>
    Dashboard
  </Link>

  <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
    Login
  </Link>

  <Link to="/register" style={{ color: "white", textDecoration: "none" }}>
    Register
  </Link>
  <Link to="/my-complaints" style={{ color: "white", textDecoration: "none" }}>
  My Complaints
</Link>

<Link to="/profile" style={{ color: "white", textDecoration: "none" }}>
  Profile
</Link>
</div>
    </nav>
  );
}

export default Navbar;