import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/api/complaints/history", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        setComplaints(response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Access Denied</h2>
        <p>Please log in to view the dashboard.</p>
        <button onClick={() => navigate("/login")} style={btnStyle}>Go to Login</button>
      </div>
    );
  }

  const total = complaints.length;
  const pending = complaints.filter(c => c.status !== "Resolved").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#f8fafc",
        minHeight: "80vh",
      }}
    >
      <h1 style={{ color: "#1e293b" }}>
        Welcome, {user.fullName} 👋
      </h1>

      <p style={{ color: "#64748b" }}>
        Manage your complaints and track their progress in real-time.
      </p>

      {/* Dashboard Cards */}
      {loading ? (
        <div style={{ marginTop: "30px" }}>Loading stats...</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
            gap: "20px",
            marginTop: "40px",
          }}
        >
          <div
            onClick={() => navigate("/my-complaints")}
            style={cardStyle}
          >
            <h3>Total Complaints</h3>
            <h1 style={{ color: "#2563eb", fontSize: "48px", margin: "10px 0 0 0" }}>{total}</h1>
          </div>

          <div
            onClick={() => navigate("/my-complaints")}
            style={cardStyle}
          >
            <h3>Pending / Active</h3>
            <h1 style={{ color: "#f59e0b", fontSize: "48px", margin: "10px 0 0 0" }}>{pending}</h1>
          </div>

          <div
            onClick={() => navigate("/my-complaints")}
            style={cardStyle}
          >
            <h3>Resolved Issues</h3>
            <h1 style={{ color: "#16a34a", fontSize: "48px", margin: "10px 0 0 0" }}>{resolved}</h1>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <h2 style={{ marginTop: "50px", color: "#1e293b" }}>Quick Actions</h2>

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
            fontWeight: "bold",
            fontSize: "15px"
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
            fontWeight: "bold",
            fontSize: "15px"
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
            fontWeight: "bold",
            fontSize: "15px"
          }}
        >
          👤 Profile
        </button>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#ffffff",
  padding: "25px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  textAlign: "center",
  cursor: "pointer",
  transition: "transform 0.2s",
  border: "1px solid #e2e8f0"
};

const btnStyle = {
  padding: "10px 20px",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "15px"
};

export default Dashboard;