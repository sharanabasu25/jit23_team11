import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "#1e293b" }}>
        Welcome, Citizen 👋
      </h1>

      <p style={{ color: "#64748b" }}>
        Manage your complaints and track their progress.
      </p>

      {/* Dashboard Cards */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
          gap: "20px",
          marginTop: "40px",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            textAlign: "center",
          }}
        >
          <h3>Total Complaints</h3>
          <h1 style={{ color: "#2563eb" }}>12</h1>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            textAlign: "center",
          }}
        >
          <h3>Pending</h3>
          <h1 style={{ color: "#f59e0b" }}>4</h1>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            textAlign: "center",
          }}
        >
          <h3>Resolved</h3>
          <h1 style={{ color: "#16a34a" }}>8</h1>
        </div>
      </div>

      {/* Quick Actions */}

      <h2 style={{ marginTop: "50px" }}>Quick Actions</h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        <button
          onClick={() => navigate("/submit-complaint")}
          style={{
            padding: "15px 25px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          ➕ Submit Complaint
        </button>

        <button
          onClick={() => navigate("/my-complaints")}
          style={{
            padding: "15px 25px",
            backgroundColor: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          📋 My Complaints
        </button>

        <button
          onClick={() => navigate("/profile")}
          style={{
            padding: "15px 25px",
            backgroundColor: "#475569",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          👤 Profile
        </button>
      </div>
    </div>
  );
}

export default Dashboard;