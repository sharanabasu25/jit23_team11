import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MyComplaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view your complaints.");
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
        console.error(err);
        setError("Failed to fetch complaints list.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center", padding: "50px" }}><h3>Loading your complaints...</h3></div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => navigate("/login")} style={btnStyle}>Go to Login</button>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1000px",
        margin: "auto",
        minHeight: "80vh"
      }}
    >
      <h1 style={{ color: "#2563eb", marginBottom: "25px" }}>
        My Complaints
      </h1>

      {complaints.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", background: "white", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <p style={{ fontSize: "16px", color: "#6b7280" }}>You haven't filed any complaints yet.</p>
          <button 
            onClick={() => navigate("/submit-complaint")} 
            style={{ ...btnStyle, marginTop: "15px" }}
          >
            ➕ Submit First Complaint
          </button>
        </div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            background: "white",
            borderRadius: "8px",
            overflow: "hidden"
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#2563eb", color: "white" }}>
              <th style={{ padding: "15px" }}>Complaint ID</th>
              <th>Issue</th>
              <th>Department</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint._id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "15px", fontFamily: "monospace" }}>
                  {complaint._id.substring(18).toUpperCase()}
                </td>
                <td>{complaint.complaintCategory}</td>
                <td>{complaint.department}</td>
                <td>
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
                <td>
                  <span style={{
                    padding: "5px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: 
                      complaint.status === "Pending" ? "#f59e0b" : 
                      complaint.status === "Seen" ? "#3b82f6" : 
                      complaint.status === "In Progress" ? "#8b5cf6" : "#10b981"
                  }}>
                    {complaint.status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => navigate(`/complaint/${complaint._id}`)}
                    style={{
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      padding: "8px 15px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontWeight: "bold"
                    }}
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
  );
}

const btnStyle = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px"
};

export default MyComplaints;