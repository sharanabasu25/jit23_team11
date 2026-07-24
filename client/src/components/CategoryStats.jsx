export default function CategoryStats({ complaints = [] }) {
  const categories = {};

  complaints.forEach((c) => {
    const cat = c.complaintCategory || c.category || "Unknown";
    categories[cat] = (categories[cat] || 0) + 1;
  });

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        marginTop: "30px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
      }}
    >
      <h2>📊 Complaint Categories</h2>

      <table style={{ width: "100%", marginTop: "15px", borderCollapse: "collapse" }}>
        <tbody>
          {Object.entries(categories).map(([category, count]) => (
            <tr key={category} style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={{ padding: "12px", fontWeight: "500" }}>{category}</td>
              <td style={{ padding: "12px", textAlign: "right", fontWeight: "bold", color: "#2563eb" }}>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}