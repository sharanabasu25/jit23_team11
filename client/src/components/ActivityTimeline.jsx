export default function ActivityTimeline() {

  const activities = [
    "Complaint CMP001 resolved",
    "Complaint CMP004 assigned",
    "Report downloaded",
    "Profile updated",
    "Officer logged in",
  ];

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        marginTop: "30px",
      }}
    >
      <h2>📝 Recent Activities</h2>

      <ul>
        {activities.map((activity, index) => (
          <li
            key={index}
            style={{
              margin: "15px 0",
            }}
          >
            ✅ {activity}
          </li>
        ))}
      </ul>
    </div>
  );
}