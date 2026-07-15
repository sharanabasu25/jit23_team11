import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import OfficerSidebar from "../../components/OfficerSidebar";
import OfficerTopbar from "../../components/OfficerTopbar";
import complaints from "../../data/complaintsData";

export default function OfficerComplaints() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const statusFilter = searchParams.get("status") || "all";
  const [search, setSearch] = useState("");

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.id.toLowerCase().includes(search.toLowerCase()) ||
      complaint.citizen.toLowerCase().includes(search.toLowerCase()) ||
      complaint.category.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      complaint.status.toLowerCase().replace(" ", "-") === statusFilter;

    return matchesSearch && matchesStatus;
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
          <h1>Complaints Management</h1>

          <input
            type="text"
            placeholder="Search Complaint ID, Citizen or Category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "350px",
              padding: "10px",
              marginTop: "20px",
              marginBottom: "20px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />

          <table
            style={{
              width: "100%",
              background: "white",
              borderCollapse: "collapse",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ background: "#1E3A8A", color: "white" }}>
                <th style={th}>Complaint ID</th>
                <th style={th}>Citizen</th>
                <th style={th}>Category</th>
                <th style={th}>Location</th>
                <th style={th}>Priority</th>
                <th style={th}>Status</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredComplaints.map((complaint) => (
                <tr key={complaint.id}>
                  <td style={td}>{complaint.id}</td>
                  <td style={td}>{complaint.citizen}</td>
                  <td style={td}>{complaint.category}</td>
                  <td style={td}>{complaint.location}</td>
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
                      onClick={() =>
                        navigate(`/officer/complaint/${complaint.id}`)
                      }
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