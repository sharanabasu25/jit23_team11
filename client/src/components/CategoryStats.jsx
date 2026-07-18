import complaints from "../data/complaintsData";

export default function CategoryStats() {

  const categories = {};

  complaints.forEach((c) => {
    categories[c.category] = (categories[c.category] || 0) + 1;
  });

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        marginTop: "30px",
      }}
    >
      <h2>📊 Complaint Categories</h2>

      <table style={{ width: "100%", marginTop: "15px" }}>
        <tbody>
          {Object.entries(categories).map(([category, count]) => (
            <tr key={category}>
              <td style={{ padding: "10px" }}>{category}</td>
              <td style={{ padding: "10px" }}>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}