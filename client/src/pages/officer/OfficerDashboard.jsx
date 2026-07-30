import { useNavigate } from "react-router-dom";
import OfficerSidebar from "../../components/OfficerSidebar";
import OfficerTopbar from "../../components/OfficerTopbar";
import complaints from "../../data/complaintsData";
import LiveClock from "../../components/LiveClock";
import CategoryStats from "../../components/CategoryStats";
import ProgressCard from "../../components/ProgressCard";
import OfficerPerformance from "../../components/OfficerPerformance";
import ActivityTimeline from "../../components/ActivityTimeline";

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

  const highPriorityComplaints = complaints.filter(
    (c) => c.priority === "High"
  );

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

            <OfficerPerformance />
          </div>

          {/* Category Statistics */}

          <CategoryStats />

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
                  <tr key={complaint.id}>
                    <td style={td}>{complaint.id}</td>
                    <td style={td}>{complaint.citizen}</td>
                    <td style={td}>{complaint.category}</td>
                    <td style={td}>{complaint.priority}</td>

                    <td style={td}>
                      <span
                        style={{
                          padding: "6px 12px",
                          borderRadius: "20px",
                          color: "white",
                          background:
                            complaint.status === "Pending"
                              ? "#f59e0b"
                              : complaint.status === "Resolved"
                              ? "#22c55e"
                              : "#3b82f6",
                        }}
                      >
                        {complaint.status}
                      </span>
                    </td>

                    <td style={td}>
                      <button
                        style={buttonStyle}
                        onClick={() =>
                          navigate(`/officer/complaint/${complaint.id}`)
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                  key={complaint.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "18px",
                    marginTop: "15px",
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>
                    {complaint.id}
                  </h3>

                  <p>
                    <strong>Citizen:</strong> {complaint.citizen}
                  </p>

                  <p>
                    <strong>Category:</strong> {complaint.category}
                  </p>

                  <p>
                    <strong>Location:</strong> {complaint.location}
                  </p>

                  <p>
                    <strong>Status:</strong> {complaint.status}
                  </p>

                  <button
                    style={buttonStyle}
                    onClick={() =>
                      navigate(`/officer/complaint/${complaint.id}`)
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

