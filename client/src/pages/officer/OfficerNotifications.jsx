import OfficerSidebar from "../../components/OfficerSidebar";
import OfficerTopbar from "../../components/OfficerTopbar";

const notifications = [
  {
    id: 1,
    title: "New Complaint Assigned",
    message: "Road Damage complaint has been assigned to you.",
    time: "10 minutes ago",
  },
  {
    id: 2,
    title: "Complaint Updated",
    message: "Garbage complaint status changed to In Progress.",
    time: "1 hour ago",
  },
  {
    id: 3,
    title: "Complaint Resolved",
    message: "Water Supply complaint has been successfully resolved.",
    time: "Yesterday",
  },
];

export default function OfficerNotifications() {
  return (
    <div style={{ display: "flex" }}>
      <OfficerSidebar />

      <div style={{ flex: 1, background: "#f5f7fb", minHeight: "100vh" }}>
        <OfficerTopbar />

        <div style={{ padding: "30px" }}>
          <h1>Notifications</h1>

          {notifications.map((item) => (
            <div
              key={item.id}
              style={{
                background: "white",
                padding: "20px",
                marginTop: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <h3>{item.title}</h3>

              <p>{item.message}</p>

              <small>{item.time}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}