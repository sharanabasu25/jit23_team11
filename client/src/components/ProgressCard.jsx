export default function ProgressCard({
  title,
  value,
  total,
  color,
}) {
  const percent = Math.round((value / total) * 100);

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        marginTop: "20px",
      }}
    >
      <h3>{title}</h3>

      <div
        style={{
          height: "15px",
          background: "#ddd",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "15px",
            background: color,
            borderRadius: "10px",
          }}
        />
      </div>

      <p>{percent}%</p>
    </div>
  );
}