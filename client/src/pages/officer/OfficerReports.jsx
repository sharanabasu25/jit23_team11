import { useState, useEffect } from "react";
import axios from "axios";
import OfficerSidebar from "../../components/OfficerSidebar";
import OfficerTopbar from "../../components/OfficerTopbar";
import ComplaintChart from "../../components/ComplaintChart";

export default function OfficerReports() {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized access. Please log in.");
          setLoading(false);
          return;
        }

        // Fetch aggregate statistics
        const statsRes = await axios.get("http://localhost:5000/api/officers/stats", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        // Fetch detailed complaint records for CSV export
        const complaintsRes = await axios.get("http://localhost:5000/api/complaints", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        setStats(statsRes.data);
        setComplaints(complaintsRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load statistics and reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReportsData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <h3>Generating reports and fetching statistics...</h3>
      </div>
    );
  }

  const pending = stats?.byStatus?.Pending || 0;
  const seen = stats?.byStatus?.Seen || 0;
  const progress = stats?.byStatus?.["In Progress"] || 0;
  const resolved = stats?.byStatus?.Resolved || 0;
  const total = pending + seen + progress + resolved;

  const downloadCSV = () => {
    const headers = [
      "Complaint ID",
      "Citizen Name",
      "Category",
      "Department",
      "Priority",
      "Status",
      "Address",
      "Coordinates",
      "Officer Remarks"
    ];

    const rows = complaints.map((c) => [
      c._id,
      c.citizen?.fullName || "Anonymous",
      c.complaintCategory,
      c.department,
      c.priority,
      c.status,
      `"${c.address.replace(/"/g, '""')}"`,
      `"${c.latitude}, ${c.longitude}"`,
      `"${(c.officerRemarks || "").replace(/"/g, '""')}"`
    ]);

    const csv =
      [
        headers.join(","),
        ...rows.map((r) => r.join(",")),
      ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `SPGMS_Complaint_Report_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

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
          <h1>📈 Complaint Reports</h1>

          {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: "20px",
              marginTop: "25px",
            }}
          >
            <ReportCard
              title="Total Complaints"
              value={total}
            />

            <ReportCard
              title="Pending/New"
              value={pending + seen}
            />

            <ReportCard
              title="Resolved"
              value={resolved}
            />

            <ReportCard
              title="In Progress"
              value={progress}
            />
          </div>

          <ComplaintChart
            pending={pending + seen}
            resolved={resolved}
            progress={progress}
          />

          <div
            style={{
              background: "white",
              marginTop: "35px",
              padding: "25px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <h2>📄 Performance Breakdown</h2>

            <div style={{ lineHeight: "2.2", fontSize: "16px", margin: "20px 0" }}>
              <p>Total Complaints Received: <b>{total}</b></p>
              <p>Pending / Unseen Complaints: <b>{pending}</b></p>
              <p>Seen / Assigned Complaints: <b>{seen}</b></p>
              <p>Complaints In Progress: <b>{progress}</b></p>
              <p>Resolved Complaints: <b>{resolved}</b></p>
            </div>

            <button
              onClick={downloadCSV}
              style={{
                marginTop: "20px",
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "12px 20px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold"
              }}
            >
              ⬇ Download CSV Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportCard({ title, value }) {
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

      <h1
        style={{
          color: "#2563eb",
          fontSize: "42px",
          margin: "10px 0 0 0"
        }}
      >
        {value}
      </h1>
    </div>
  );
}