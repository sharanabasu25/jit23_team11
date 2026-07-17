import { useNavigate } from "react-router-dom";
import OfficerSidebar from "../../components/OfficerSidebar";
import OfficerTopbar from "../../components/OfficerTopbar";
import complaints from "../../data/complaintsData";

export default function OfficerDashboard() {
  const navigate = useNavigate();

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (c) => c.status === "Pending"
  ).length;

  const resolvedComplaints = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  const inProgressComplaints = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;

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
          <h1>Government Officer Dashboard</h1>

          <p
            style={{
              color: "#555",
              marginBottom: "30px",
            }}
          >
            Welcome back! Manage and monitor public grievances efficiently.
          </p>

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
              onClick={() =>
                navigate("/officer/complaints?status=pending")
              }
            />

            <Card
              title="Resolved"
              value={resolvedComplaints}
              onClick={() =>
                navigate("/officer/complaints?status=resolved")
              }
            />

            <Card
              title="In Progress"
              value={inProgressComplaints}
              onClick={() =>
                navigate("/officer/complaints?status=in-progress")
              }
            />
          </div>

          <div
            style={{
              marginTop: "40px",
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <h2>Quick Actions</h2>

            <div
              style={{
                display: "flex",
                gap: "20px",
                marginTop: "20px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => navigate("/officer/complaints")}
                style={buttonStyle}
              >
                View Complaints
              </button>

              <button
                onClick={() =>
                  navigate("/officer/complaints?status=pending")
                }
                style={buttonStyle}
              >
                Pending Cases
              </button>

              <button
                onClick={() =>
                  navigate("/officer/complaints?status=resolved")
                }
                style={buttonStyle}
              >
                Resolved Cases
              </button>

              <button
                onClick={() => alert("Reports module will be added in Day 6.")}
                style={buttonStyle}
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "10px",
        textAlign: "center",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h3>{title}</h3>

      <h1>{value}</h1>
    </div>
  );
}

const buttonStyle = {
  padding: "10px 18px",
  border: "none",
  borderRadius: "6px",
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
};