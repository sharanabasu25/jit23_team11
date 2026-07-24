import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OfficerSidebar from "../../components/OfficerSidebar";
import OfficerTopbar from "../../components/OfficerTopbar";
import LiveClock from "../../components/LiveClock";
import CategoryStats from "../../components/CategoryStats";
import ProgressCard from "../../components/ProgressCard";
import OfficerPerformance from "../../components/OfficerPerformance";
import ActivityTimeline from "../../components/ActivityTimeline";

export default function OfficerDashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized access. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/api/officers/dashboard", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        setComplaints(response.data.complaints);
        setStats(response.data.stats);
      } catch (err) {
        console.error(err);
        setError("Failed to load officer dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <h3>Loading Officer Dashboard...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
        <h3>Access Denied / Error</h3>
        <p>{error}</p>
        <button onClick={() => navigate("/officer/login")} style={buttonStyle}>Go to Login</button>
      </div>
    );
  }

  const totalComplaints = stats.totalAssigned || 0;
  const pendingComplaints = (stats.pending || 0) + (stats.seen || 0); // Include Pending & Seen under Pending card
  const resolvedComplaints = stats.resolved || 0;
  const inProgressComplaints = stats.inProgress || 0;
  const highPriorityComplaints = complaints.filter((c) => c.priority === "High");

  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div style={{ display: "flex" }}>
      <OfficerSidebar />

      <div
        style={{
          flex: 1,
          background: "#f5f7fb",
          minHeight: "100vh",
        }}
      >
        <OfficerTopbar />

        <div style={{ padding: "30px" }}>

          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "30px",
              marginBottom: "35px",
            }}
          >
            <div style={{ flex: 1 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "34px",
                  fontWeight: "700",
                  color: "#111827",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Government Officer Dashboard
              </h1>

              <p
                style={{
                  marginTop: "12px",
                  fontSize: "18px",
                  color: "#6b7280",
                }}
              >
                Welcome back! Manage public grievances efficiently.
              </p>
            </div>

            <div
              style={{
                minWidth: "230px",
                background: "#ffffff",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "#2563eb",
                }}
              >
                📅 Today
              </h3>

              <p
                style={{
                  marginTop: "12px",
                  fontSize: "18px",
                  lineHeight: "1.6",
                }}
              >
                {currentDate}
              </p>
            </div>
          </div>

          {/* Dashboard Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "20px",
            }}
          >
            <Card
              title="Total Complaints"
              value={totalComplaints}
              onClick={() => navigate("/officer/complaints")}
            />

            <Card
              title="Pending"
              value={pendingComplaints}
              onClick={() => navigate("/officer/complaints")}
            />

            <Card
              title="Resolved"
              value={resolvedComplaints}
              onClick={() => navigate("/officer/complaints")}
            />

            <Card
              title="In Progress"
              value={inProgressComplaints}
              onClick={() => navigate("/officer/complaints")}
            />
          </div>

          {/* Live Clock + Performance */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginTop: "30px",
            }}
          >
            <LiveClock />

            <OfficerPerformance complaints={complaints} />
          </div>

          {/* Category Statistics */}
          <CategoryStats complaints={complaints} />

          {/* Progress Bars */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: "20px",
              marginTop: "30px",
            }}
          >
            <ProgressCard
              title="Pending"
              value={pendingComplaints}
              total={totalComplaints}
              color="#f59e0b"
            />

            <ProgressCard
              title="Resolved"
              value={resolvedComplaints}
              total={totalComplaints}
              color="#22c55e"
            />

            <ProgressCard
              title="In Progress"
              value={inProgressComplaints}
              total={totalComplaints}
              color="#3b82f6"
            />
          </div>

          {/* Today's Summary */}
          <div
            style={{
              marginTop: "35px",
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <h2>📊 Today's Summary</h2>

            <ul style={{ lineHeight: "2" }}>
              <li>Total Complaints : {totalComplaints}</li>
              <li>Pending Complaints : {pendingComplaints}</li>
              <li>Resolved Complaints : {resolvedComplaints}</li>
              <li>In Progress Complaints : {inProgressComplaints}</li>
              <li>High Priority Cases : {highPriorityComplaints.length}</li>
            </ul>
          </div>

          {/* Recent Complaints */}
          <div
            style={{
              marginTop: "35px",
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <h2>📝 Recent Complaints</h2>

            {complaints.length === 0 ? (
              <p>No complaints assigned to you.</p>
            ) : (
              <table
                style={{
                  width: "100%",
                  marginTop: "15px",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#1E3A8A",
                      color: "white",
                    }}
                  >
                    <th style={th}>Complaint ID</th>
                    <th style={th}>Citizen</th>
                    <th style={th}>Category</th>
                    <th style={th}>Priority</th>
                    <th style={th}>Status</th>
                    <th style={th}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {complaints.slice(0, 5).map((complaint) => (
                    <tr key={complaint._id}>
                      <td style={{ ...td, fontFamily: "monospace" }}>
                        {complaint._id.substring(18).toUpperCase()}
                      </td>
                      <td style={td}>{complaint.citizen?.fullName || "Anonymous"}</td>
                      <td style={td}>{complaint.complaintCategory}</td>
                      <td style={td}>
                        <span style={{
                          padding: "3px 8px",
                          borderRadius: "4px",
                          fontWeight: "bold",
                          fontSize: "12px",
                          color: complaint.priority === "High" ? "#dc2626" : complaint.priority === "Medium" ? "#d97706" : "#4b5563",
                          background: complaint.priority === "High" ? "#fee2e2" : complaint.priority === "Medium" ? "#fef3c7" : "#f3f4f6"
                        }}>
                          {complaint.priority}
                        </span>
                      </td>

                      <td style={td}>
                        <span
                          style={{
                            padding: "6px 12px",
                            borderRadius: "20px",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "12px",
                            background:
                              complaint.status === "Pending"
                                ? "#f59e0b"
                                : complaint.status === "Seen"
                                ? "#3b82f6"
                                : complaint.status === "Resolved"
                                ? "#22c55e"
                                : "#8b5cf6",
                          }}
                        >
                          {complaint.status}
                        </span>
                      </td>

                      <td style={td}>
                        <button
                          style={buttonStyle}
                          onClick={() =>
                            navigate(`/officer/complaint/${complaint._id}`)
                          }
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* High Priority Complaints */}
          <div
            style={{
              marginTop: "35px",
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <h2>⚠ High Priority Complaints</h2>

            {highPriorityComplaints.length === 0 ? (
              <p>No high priority complaints.</p>
            ) : (
              highPriorityComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "18px",
                    marginTop: "15px",
                    background: "#fef2f2"
                  }}
                >
                  <h3 style={{ marginTop: 0, fontFamily: "monospace" }}>
                    ID: {complaint._id.toUpperCase()}
                  </h3>

                  <p>
                    <strong>Citizen:</strong> {complaint.citizen?.fullName || "Anonymous"}
                  </p>

                  <p>
                    <strong>Category:</strong> {complaint.complaintCategory}
                  </p>

                  <p>
                    <strong>Location/Address:</strong> {complaint.address}
                  </p>

                  <p>
                    <strong>Status:</strong> {complaint.status}
                  </p>

                  <button
                    style={buttonStyle}
                    onClick={() =>
                      navigate(`/officer/complaint/${complaint._id}`)
                    }
                  >
                    View Details
                  </button>
                </div>
              ))
            )}

          </div>

          {/* Activity Timeline */}
          <ActivityTimeline />

        </div>
      </div>
    </div>
  );
}

/* Dashboard Card */
function Card({ title, value, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#ffffff",
        padding: "30px",
        borderRadius: "15px",
        textAlign: "center",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        transition: "0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow =
          "0 8px 18px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow =
          "0 4px 12px rgba(0,0,0,0.08)";
      }}
    >
      <h3
        style={{
          color: "#4b5563",
          marginBottom: "15px",
          fontSize: "22px",
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          fontSize: "56px",
          margin: 0,
          color: "#111827",
        }}
      >
        {value}
      </h1>
    </div>
  );
}

/* Common Styles */
const th = {
  padding: "15px",
  textAlign: "left",
  fontWeight: "600",
};

const td = {
  padding: "15px",
  borderBottom: "1px solid #e5e7eb",
};

const buttonStyle = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "8px 15px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "500",
};
