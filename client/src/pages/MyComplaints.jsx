import { useNavigate } from "react-router-dom";

function MyComplaints() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1000px",
        margin: "auto",
      }}
    >
      <h1 style={{ color: "#2563eb", marginBottom: "20px" }}>
        My Complaints
      </h1>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "center",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#2563eb", color: "white" }}>
            <th style={{ padding: "12px" }}>Complaint ID</th>
            <th>Issue</th>
            <th>Department</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>101</td>
            <td>Pothole</td>
            <td>Road Department</td>
            <td>High</td>
            <td>Pending</td>
            <td>
              <button
                onClick={() => navigate("/complaint/101")}
                style={{
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "8px 15px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                View
              </button>
            </td>
          </tr>

          <tr>
            <td>102</td>
            <td>Garbage</td>
            <td>Municipality</td>
            <td>Medium</td>
            <td>Resolved</td>
            <td>
              <button
                onClick={() => navigate("/complaint/102")}
                style={{
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  padding: "8px 15px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                View
              </button>
            </td>
          </tr>

          <tr>
            <td>103</td>
            <td>Streetlight</td>
            <td>Electricity</td>
            <td>Low</td>
            <td>In Progress</td>
            <td>
              <button
                onClick={() => navigate("/complaint/103")}
                style={{
                  background: "#f59e0b",
                  color: "white",
                  border: "none",
                  padding: "8px 15px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default MyComplaints;