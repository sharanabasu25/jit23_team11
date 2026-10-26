import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiBell, FiCheckCircle, FiClock, FiAlertTriangle, FiX } from "react-icons/fi";
import axios from "axios";

export default function NotificationDrawer({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setNotifications(defaultAnnouncements);
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/complaints/history", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const list = [];
        const complaints = res.data || [];

        // Build notifications based on complaints
        complaints.forEach((c) => {
          const shortId = c._id.substring(18).toUpperCase();
          if (c.status === "Resolved") {
            list.push({
              id: `${c._id}-res`,
              complaintId: c._id,
              title: `Grievance #${shortId} Resolved`,
              message: `Your grievance regarding ${c.complaintCategory} has been marked as Resolved by the department.`,
              time: new Date(c.updatedAt || c.createdAt).toLocaleDateString("en-IN"),
              type: "resolved",
              unread: true
            });
          } else if (c.status === "In Progress") {
            list.push({
              id: `${c._id}-prog`,
              complaintId: c._id,
              title: `Grievance #${shortId} In Progress`,
              message: `Work crew has been dispatched for ${c.complaintCategory} at ${c.address || "reported location"}.`,
              time: new Date(c.updatedAt || c.createdAt).toLocaleDateString("en-IN"),
              type: "progress",
              unread: true
            });
          } else if (c.assignedOfficer) {
            list.push({
              id: `${c._id}-assign`,
              complaintId: c._id,
              title: `Officer Assigned to #${shortId}`,
              message: `${c.assignedOfficer?.user?.fullName || "A municipal officer"} from ${c.department} is reviewing your case.`,
              time: new Date(c.updatedAt || c.createdAt).toLocaleDateString("en-IN"),
              type: "assigned",
              unread: false
            });
          }
        });

        // Add general civic alerts
        list.push(...defaultAnnouncements);

        setNotifications(list.slice(0, 8));
      } catch (e) {
        setNotifications(defaultAnnouncements);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNotificationClick = (item) => {
    onClose();
    if (item.complaintId) {
      navigate(`/complaint/${item.complaintId}`);
    }
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "64px",
        right: "20px",
        width: "370px",
        maxWidth: "calc(100vw - 32px)",
        maxHeight: "calc(100vh - 84px)",
        background: "#FFFFFF",
        borderRadius: "14px",
        boxShadow: "0 12px 36px rgba(16, 39, 72, 0.16), 0 2px 8px rgba(16, 39, 72, 0.06)",
        border: "1px solid #E2EAF5",
        zIndex: 1050,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        animation: "slideUp 200ms ease"
      }}
      role="region"
      aria-label="Civic Alerts & Updates panel"
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 18px",
          background: "#102748",
          color: "#FFFFFF",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FiBell style={{ color: "#FFD15A", fontSize: "17px" }} />
          <h4 style={{ margin: 0, color: "#FFFFFF", fontSize: "15px", fontWeight: "700", letterSpacing: "0.2px" }}>
            Civic Alerts & Updates
          </h4>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={markAllRead}
            type="button"
            style={{
              background: "transparent",
              border: "none",
              color: "#FFD15A",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              padding: "3px 6px",
              borderRadius: "4px",
              transition: "opacity 0.15s ease"
            }}
            title="Mark all notifications as read"
          >
            Mark all read
          </button>
          <button
            onClick={onClose}
            type="button"
            style={{
              background: "transparent",
              border: "none",
              color: "#8EA4C2",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              borderRadius: "4px",
              transition: "color 0.15s ease"
            }}
            aria-label="Close notifications popup"
            onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#8EA4C2")}
          >
            <FiX size={18} />
          </button>
        </div>
      </div>

      {/* Notifications list */}
      <div style={{ flex: 1, maxHeight: "360px", overflowY: "auto", padding: "0" }}>
        {loading ? (
          <div style={{ padding: "30px", textAlign: "center", color: "#7183AD", fontSize: "13.5px" }}>
            Checking grievance updates...
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: "36px 20px", textAlign: "center", color: "#7183AD" }}>
            <p style={{ margin: 0, fontWeight: "600", fontSize: "14px", color: "#14284A" }}>No new notifications</p>
            <p style={{ margin: "4px 0 0", fontSize: "12px" }}>You are up to date on all civic updates.</p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid #E2EAF5",
                cursor: item.complaintId ? "pointer" : "default",
                backgroundColor: item.unread ? "#F4F7FC" : "#FFFFFF",
                borderLeft: item.unread ? "3px solid #263FD5" : "3px solid transparent",
                transition: "background-color 150ms ease",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start"
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  marginTop: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  backgroundColor:
                    item.type === "resolved"
                      ? "#D7F5ED"
                      : item.type === "progress"
                      ? "#DDEBFF"
                      : "#E9EAFE",
                  color:
                    item.type === "resolved"
                      ? "#0B806B"
                      : item.type === "progress"
                      ? "#263FD5"
                      : "#102748"
                }}
              >
                {item.type === "resolved" ? (
                  <FiCheckCircle size={15} />
                ) : item.type === "progress" ? (
                  <FiClock size={15} />
                ) : (
                  <FiAlertTriangle size={15} />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
                  <h5 style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#14284A" }}>
                    {item.title}
                  </h5>
                  <span style={{ fontSize: "11px", color: "#7183AD", whiteSpace: "nowrap" }}>{item.time}</span>
                </div>
                <p
                  style={{
                    margin: "3px 0 0",
                    fontSize: "12px",
                    color: "#7183AD",
                    lineHeight: "1.4"
                  }}
                >
                  {item.message}
                </p>
                {item.complaintId && (
                  <span
                    style={{
                      display: "inline-block",
                      marginTop: "5px",
                      fontSize: "11.5px",
                      color: "#263FD5",
                      fontWeight: "600"
                    }}
                  >
                    View Status Details →
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "9px 16px",
          background: "#F4F7FC",
          borderTop: "1px solid #E2EAF5",
          textAlign: "center"
        }}
      >
        <span style={{ fontSize: "11px", color: "#7183AD", fontWeight: "500" }}>
          Official alerts from Karnataka Municipal Services
        </span>
      </div>
    </div>
  );
}

const defaultAnnouncements = [
  {
    id: "ann-1",
    title: "Karnataka Civic Portal Active",
    message: "Report potholes, streetlights, or drainage issues 24/7 with instant AI triaging.",
    time: "Today",
    type: "info",
    unread: false
  },
  {
    id: "ann-2",
    title: "Helpline 1912 Active",
    message: "For emergency water or electricity hazards, call municipal emergency services immediately.",
    time: "Ongoing",
    type: "info",
    unread: false
  }
];
