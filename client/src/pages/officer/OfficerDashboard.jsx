import OfficerSidebar from "../../components/OfficerSidebar";

export default function OfficerDashboard() {
  return (
    <div style={{ display: "flex" }}>
      <OfficerSidebar />

      <div
        style={{
          flex: 1,
          padding: "30px",
          background: "#f5f7fb",
          minHeight: "100vh",
        }}
      >
        <h1>Government Officer Dashboard</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <Card title="Total Complaints" value="120" />
          <Card title="Pending" value="45" />
          <Card title="Resolved" value="60" />
          <Card title="In Progress" value="15" />
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
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h3>{title}</h3>
      <h1>{value}</h1>
    </div>
  );
}