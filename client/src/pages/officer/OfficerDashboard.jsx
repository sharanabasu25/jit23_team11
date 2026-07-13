import { useNavigate } from "react-router-dom";
import OfficerSidebar from "../../components/OfficerSidebar";
import OfficerTopbar from "../../components/OfficerTopbar";

export default function OfficerDashboard() {
  const navigate = useNavigate();

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
            <Card title="Total Complaints" value="120" />
            <Card title="Pending" value="45" />
            <Card title="Resolved" value="60" />
            <Card title="In Progress" value="15" />
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
                onClick={() => navigate("/officer/complaints")}
                style={buttonStyle}
              >
                Pending Cases
              </button>

              <button
                onClick={() => navigate("/officer/complaints")}
                style={buttonStyle}
              >
                Resolved Cases
              </button>

              <button
                onClick={() =>
                  alert("Reports module will be added in the next phase.")
                }
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

function Card({ title, value }) {
  return (
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "10px",
        textAlign: "center",
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
  fontSize: "15px",
};