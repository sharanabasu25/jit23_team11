import { useNavigate, useSearchParams } from "react-router-dom";
import OfficerSidebar from "../../components/OfficerSidebar";
import OfficerTopbar from "../../components/OfficerTopbar";
import { useState } from "react";

export default function OfficerComplaints() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const statusFilter = searchParams.get("status") || "all";
  const [search, setSearch] = useState("");

  const complaints = [
    {
      id: "CMP001",
      citizen: "Ravi Kumar",
      category: "Road Damage",
      status: "Pending",
    },
    {
      id: "CMP002",
      citizen: "Priya",
      category: "Water Supply",
      status: "Resolved",
    },
    {
      id: "CMP003",
      citizen: "Arun",
      category: "Garbage",
      status: "In Progress",
    },
    {
      id: "CMP004",
      citizen: "Megha",
      category: "Street Light",
      status: "Pending",
    },
  ];

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.id.toLowerCase().includes(search.toLowerCase()) ||
      complaint.citizen.toLowerCase().includes(search.toLowerCase());

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
            placeholder="Search by Complaint ID or Citizen Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "350px",
              padding: "10px",
              margin: "20px 0",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "white",
            }}
          >
            <thead>
              <tr style={{ background: "#1E3A8A", color: "white" }}>
                <th style={th}>Complaint ID</th>
                <th style={th}>Citizen</th>
                <th style={th}>Category</th>
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

                  <td style={td}>
                    <span
                      style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
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
            </tbody>
          </table>
        </div>
      </div>
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