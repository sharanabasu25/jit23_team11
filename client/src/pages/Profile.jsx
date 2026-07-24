import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
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
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Access Denied</h2>
        <p>Please log in to view your profile details.</p>
        <button onClick={() => navigate("/login")} style={btnStyle}>Go to Login</button>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "30px",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <h1
        style={{
          color: "#2563eb",
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        Citizen Profile
      </h1>

      <div style={{ lineHeight: "2.5", fontSize: "16px" }}>
        <p><strong>Name:</strong> {user.fullName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phoneNumber}</p>
        <p><strong>Account Role:</strong> {user.role}</p>
      </div>

      <div style={{ display: "flex", gap: "15px", marginTop: "30px" }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            flex: 1,
            padding: "12px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          Go to Dashboard
        </button>

        <button
          onClick={handleLogout}
          style={{
            flex: 1,
            padding: "12px",
            backgroundColor: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

const btnStyle = {
  padding: "10px 20px",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "15px"
};

export default Profile;