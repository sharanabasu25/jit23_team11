import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import OfficerSidebar from "../../components/OfficerSidebar";
import OfficerTopbar from "../../components/OfficerTopbar";

export default function OfficerComplaints() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const dashboardStatus = searchParams.get("status") || "all";

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(dashboardStatus);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized access. Please log in.");
          setLoading(false);
          return;
        }

        // Fetch all complaints from the database for management
        const response = await axios.get("http://localhost:5000/api/complaints", {
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

    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint._id.toLowerCase().includes(search.toLowerCase()) ||
      (complaint.citizen?.fullName || "Anonymous").toLowerCase().includes(search.toLowerCase()) ||
      complaint.complaintCategory.toLowerCase().includes(search.toLowerCase());

    const complaintStatus = complaint.status
      .toLowerCase()
      .replace(/\s/g, "-");

    const matchesStatus =
      statusFilter === "all" || complaintStatus === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <h3>Loading complaints records...</h3>
      </div>
    );
  }

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
          <h1>Complaints Management</h1>

          {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

          <p
            style={{
              color: "#666",
              marginBottom: "20px",
            }}
          >
            Total Complaints: <b>{filteredComplaints.length}</b>
          </p>

          <div
            style={{
              display: "flex",
              gap: "15px",
              marginBottom: "25px",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              placeholder="Search Complaint ID, Citizen or Category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "350px",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="seen">Seen</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
              style={{
                background: "#ef4444",
                color: "white",
                border: "none",
                padding: "10px 18px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Clear Filters
            </button>
          </div>

          <table
            style={{
              width: "100%",
              background: "white",
              borderCollapse: "collapse",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}
          >
            <thead>
              <tr style={{ background: "#1E3A8A", color: "white" }}>
                <th style={th}>Complaint ID</th>
                <th style={th}>Citizen</th>
                <th style={th}>Category</th>
                <th style={th}>Location/Address</th>
                <th style={th}>Priority</th>
                <th style={th}>Status</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredComplaints.map((complaint) => (
                <tr key={complaint._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ ...td, fontFamily: "monospace" }}>{complaint._id.substring(18).toUpperCase()}</td>
                  <td style={td}>{complaint.citizen?.fullName || "Anonymous"}</td>
                  <td style={td}>{complaint.complaintCategory}</td>
                  <td style={td}>{complaint.address}</td>
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
                      onClick={() =>
                        navigate(`/officer/complaint/${complaint._id}`)
                      }
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

              {filteredComplaints.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No complaints found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const th = {
  padding: "15px",
  textAlign: "left",
};

const td = {
  padding: "15px",
  borderBottom: "1px solid #ddd",
};