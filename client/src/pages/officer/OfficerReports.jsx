import OfficerSidebar from "../../components/OfficerSidebar";
import OfficerTopbar from "../../components/OfficerTopbar";
import ComplaintChart from "../../components/ComplaintChart";
import complaints from "../../data/complaintsData";

export default function OfficerReports() {
  const total = complaints.length;

  const pending = complaints.filter(
    (c) => c.status === "Pending"
  ).length;

  const resolved = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  const progress = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;

  const downloadCSV = () => {
    const headers = [
      "Complaint ID",
      "Citizen",
      "Category",
      "Location",
      "Priority",
      "Status",
    ];

    const rows = complaints.map((c) => [
      c.id,
      c.citizen,
      c.category,
      c.location,
      c.priority,
      c.status,
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
    link.download = "Complaint_Report.csv";
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
              title="Pending"
              value={pending}
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
            pending={pending}
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
            <h2>📄 Monthly Performance</h2>

            <p>
              Total Complaints Received : <b>{total}</b>
            </p>

            <p>
              Pending Complaints : <b>{pending}</b>
            </p>

            <p>
              Resolved Complaints : <b>{resolved}</b>
            </p>

            <p>
              Complaints In Progress : <b>{progress}</b>
            </p>

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
        }}
      >
        {value}
      </h1>
    </div>
  );
}