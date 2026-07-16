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
<div style={{ padding: "30px" }}>
      <div
        style={{
          flex: 1,
          background: "#f5f7fb",
          minHeight: "100vh",
        }}
      >
        <OfficerTopbar />
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
        fontSize: "52px",
        fontWeight: "700",
        color: "#111827",
        whiteSpace: "nowrap",
      }}
    >
      Government Officer Dashboard
    </h1>

    <p
      style={{
        marginTop: "15px",
        fontSize: "20px",
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
              <li>In Progress : {inProgressComplaints}</li>
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
                  <th style={th}>Status</th>
                  <th style={th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {complaints.slice(0, 3).map((complaint) => (
                  <tr key={complaint.id}>
                    <td style={td}>{complaint.id}</td>
                    <td style={td}>{complaint.citizen}</td>
                    <td style={td}>{complaint.status}</td>

                    <td style={td}>
                      <button
                        onClick={() =>
                          navigate(`/officer/complaint/${complaint.id}`)
                        }
                        style={buttonStyle}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* High Priority */}

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

            {highPriorityComplaints.map((complaint) => (
              <div
                key={complaint.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "15px",
                  marginTop: "15px",
                }}
              >
                <h3>{complaint.id}</h3>

                <p>
                  <strong>Citizen:</strong> {complaint.citizen}
                </p>

                <p>
                  <strong>Category:</strong> {complaint.category}
                </p>

                <p>
                  <strong>Location:</strong> {complaint.location}
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
            ))}
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
        background: "#ffffff",
        padding: "30px",
        borderRadius: "15px",
        textAlign: "center",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        transition: "0.3s",
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
const th = {
  padding: "15px",
};

const td = {
  padding: "15px",
  borderBottom: "1px solid #ddd",
};

const buttonStyle = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "5px",
  cursor: "pointer",
};