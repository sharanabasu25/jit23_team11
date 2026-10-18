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
        top: "60px",
        right: "20px",
        width: "360px",
        maxWidth: "calc(100vw - 40px)",
        background: "var(--soft-ivory)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-xl)",
        border: "1px solid var(--soft-border)",
        borderTop: "3px solid var(--warm-gold)",
        zIndex: 1050,
        overflow: "hidden",
        animation: "slideUp 200ms ease"
      }}
      role="region"
      aria-label="Notifications panel"
    >
      <div
        style={{
          padding: "16px 20px",
          background: "var(--deep-indigo)",
          color: "var(--vanilla-cream)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FiBell style={{ color: "var(--warm-gold)" }} />
          <h4 style={{ margin: 0, color: "var(--vanilla-cream)", fontSize: "16px", fontWeight: "600" }}>
            Civic Alerts & Updates
          </h4>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={markAllRead}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--warm-gold)",
              fontSize: "12px",
              cursor: "pointer",
              padding: "2px 6px"
            }}
          >
            Mark all read
          </button>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--muted-lavender)",
              cursor: "pointer",
              padding: "2px",
              display: "flex",
              alignItems: "center"
            }}
            aria-label="Close notifications"
          >
            <FiX size={18} />
          </button>
        </div>
      </div>

      <div style={{ maxHeight: "380px", overflowY: "auto", padding: "10px 0" }}>
        {loading ? (
          <div style={{ padding: "30px", textAlign: "center", color: "var(--muted-grey)", fontSize: "14px" }}>
            Checking grievance updates...
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--muted-grey)" }}>
            <p style={{ margin: 0, fontWeight: "500", fontSize: "14px" }}>No new notifications</p>
            <p style={{ margin: "5px 0 0", fontSize: "12px" }}>You are up to date on all civic updates.</p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              style={{
                padding: "12px 18px",
                borderBottom: "1px solid var(--soft-border)",
                cursor: item.complaintId ? "pointer" : "default",
                backgroundColor: item.unread ? "var(--muted-lavender)" : "transparent",
                transition: "background-color 150ms ease",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start"
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  marginTop: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  backgroundColor:
                    item.type === "resolved"
                      ? "var(--success-bg)"
                      : item.type === "progress"
                      ? "var(--warning-bg)"
                      : "var(--soft-ivory)",
                  color:
                    item.type === "resolved"
                      ? "var(--success-green)"
                      : item.type === "progress"
                      ? "var(--warning-amber)"
                      : "var(--midnight-indigo)"
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h5 style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "var(--dark-charcoal)" }}>
                    {item.title}
                  </h5>
                  <span style={{ fontSize: "11px", color: "var(--muted-grey)" }}>{item.time}</span>
                </div>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: "12px",
                    color: "var(--muted-grey)",
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
                      fontSize: "11px",
                      color: "var(--midnight-indigo)",
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

      <div
        style={{
          padding: "10px 18px",
          background: "var(--soft-ivory)",
          borderTop: "1px solid var(--soft-border)",
          textAlign: "center"
        }}
      >
        <span style={{ fontSize: "11px", color: "var(--muted-grey)" }}>
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
