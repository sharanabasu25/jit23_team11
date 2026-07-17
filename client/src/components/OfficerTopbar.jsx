export default function OfficerTopbar() {
  return (
    <div
      style={{
        height: "70px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 30px",
        borderBottom: "1px solid #ddd",
        boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ color: "#1e3a8a", margin: 0 }}>
        Government Officer Portal
      </h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <span style={{ fontWeight: "bold" }}>👤 Officer</span>

        <button
          style={{
            background: "#dc2626",
            color: "white",
            border: "none",
            padding: "8px 15px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}