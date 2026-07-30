import complaints from "../data/complaintsData";

export default function OfficerPerformance() {

  const total = complaints.length;

  const resolved = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  const pending = complaints.filter(
    (c) => c.status === "Pending"
  ).length;

  const performance = Math.round((resolved / total) * 100);

  return (
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "10px",
        marginTop: "30px",
      }}
    >
      <h2>🏆 Officer Performance</h2>

      <p>Total Complaints : {total}</p>

      <p>Resolved : {resolved}</p>

      <p>Pending : {pending}</p>

      <p>Performance : {performance}%</p>

      <h3>
        {performance >= 80
          ? "⭐⭐⭐⭐⭐ Excellent"
          : performance >= 60
          ? "⭐⭐⭐⭐ Good"
          : "⭐⭐⭐ Average"}
      </h3>
    </div>
  );
}