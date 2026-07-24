export default function OfficerPerformance({ complaints = [] }) {
  const total = complaints.length;

  const resolved = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  const pending = complaints.filter(
    (c) => c.status !== "Resolved"
  ).length;

  const performance = total > 0 ? Math.round((resolved / total) * 100) : 100;

  return (
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
      }}
    >
      <h2 style={{ marginTop: 0, color: "#1e3a8a" }}>🏆 Officer Performance</h2>

      <div style={{ lineHeight: "2", fontSize: "16px", margin: "15px 0" }}>
        <p><strong>Total Assigned:</strong> {total}</p>
        <p><strong>Resolved:</strong> {resolved}</p>
        <p><strong>Active/Pending:</strong> {pending}</p>
        <p><strong>Resolution Performance:</strong> {performance}%</p>
      </div>

      <h3 style={{ margin: "20px 0 0 0", color: performance >= 80 ? "#16a34a" : performance >= 60 ? "#d97706" : "#dc2626" }}>
        {performance >= 80
          ? "⭐⭐⭐⭐⭐ Excellent"
          : performance >= 60
          ? "⭐⭐⭐⭐ Good"
          : "⭐⭐⭐ Average"}
      </h3>
    </div>
  );
}