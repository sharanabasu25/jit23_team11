import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserPlus,
  RefreshCw,
  Check,
  AlertTriangle,
  FileText,
  Clock,
  Search,
  SlidersHorizontal,
  MoreVertical,
  Settings,
  CheckCheck
} from "lucide-react";
import OfficerLayout from "../../components/OfficerLayout";
import KarnatakaArchitecturalBanner from "../../components/KarnatakaArchitecturalBanner";
import { sampleNotifications } from "../../data/officerSampleData";

export default function OfficerNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Tab definitions matching Screenshot 4
  const tabs = [
    { id: "all", label: "All" },
    { id: "assigned", label: "Assigned to Me", icon: UserPlus },
    { id: "update", label: "Updates", icon: RefreshCw },
    { id: "resolved", label: "Resolved", icon: Check },
    { id: "system", label: "System", icon: Settings },
  ];

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Tab filter
      let matchesTab = true;
      if (activeTab === "assigned") matchesTab = item.type === "assigned";
      else if (activeTab === "update") matchesTab = item.type === "update";
      else if (activeTab === "resolved") matchesTab = item.type === "resolved";
      else if (activeTab === "system") matchesTab = item.type === "system";

      // Search filter
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        (item.tag && item.tag.toLowerCase().includes(term)) ||
        (item.complaintId && item.complaintId.toLowerCase().includes(term));

      return matchesTab && matchesSearch;
    });
  }, [notifications, activeTab, searchTerm]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const toggleReadStatus = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
    setActiveMenuId(null);
  };

  // Helper to get notification icon
  const getAvatarIcon = (item) => {
    switch (item.badgeType) {
      case "assignment":
        return <UserPlus size={22} color="#008F83" strokeWidth={2.4} />;
      case "update":
        return <RefreshCw size={22} color="#0284C7" strokeWidth={2.4} />;
      case "resolved":
        return <Check size={22} color="#059669" strokeWidth={2.6} />;
      case "priority":
        return <AlertTriangle size={22} color="#EF4444" strokeWidth={2.4} />;
      case "comment":
      default:
        return <FileText size={22} color="#8B5CF6" strokeWidth={2.4} />;
    }
  };

  const getAvatarBg = (item) => {
    switch (item.badgeType) {
      case "assignment":
        return "#D5F1EC";
      case "update":
        return "#E0F2FE";
      case "resolved":
        return "#D1FAE5";
      case "priority":
        return "#FEE2E2";
      case "comment":
      default:
        return "#EDE9FE";
    }
  };

  return (
    <OfficerLayout>
      {/* Page Header Container matching Screenshot 4 */}
      <div className="op-page-header-container">
        <div className="op-page-header-text">
          <nav className="op-breadcrumb" aria-label="Breadcrumb">
            <Link to="/officer/dashboard">Home</Link>
            <span className="op-breadcrumb-separator">&gt;</span>
            <span className="op-breadcrumb-current">Notifications</span>
          </nav>

          <h1 className="op-page-title">Notifications</h1>
          <p className="op-page-subtitle">
            Stay updated with the latest grievance activities and assignments.
          </p>
        </div>

        {/* Delicate Architectural Banner Illustration */}
        <KarnatakaArchitecturalBanner />
      </div>

      {/* Filter Tabs & Search Bar matching Screenshot 4 */}
      <div className="op-notif-tabs-row">
        <div className="op-notif-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`op-notif-tab ${isActive ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {Icon && <Icon size={15} />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="op-notif-actions">
          <div className="op-notif-search">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="op-notif-btn-icon"
            onClick={markAllRead}
            title="Mark all as read"
          >
            <CheckCheck size={18} color="var(--op-primary)" />
          </button>

          <button
            type="button"
            className="op-notif-btn-icon"
            onClick={() => alert("Notification settings configured for Government Officers of Karnataka.")}
            title="Notification Filters"
          >
            <SlidersHorizontal size={17} />
          </button>
        </div>
      </div>

      {/* Notification Cards List matching Screenshot 4 */}
      <div className="op-notif-list">
        {filteredNotifications.length === 0 ? (
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "48px",
              textAlign: "center",
              border: "1px solid #D8EEE9",
              color: "var(--op-muted)"
            }}
          >
            No notifications found under this filter.
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              className={`op-notif-card ${item.unread ? "unread" : ""}`}
            >
              {/* Circular Avatar Icon */}
              <div
                className="op-notif-avatar"
                style={{ backgroundColor: getAvatarBg(item) }}
              >
                {getAvatarIcon(item)}
              </div>

              {/* Central Details */}
              <div className="op-notif-content">
                <h3 className="op-notif-title">{item.title}</h3>
                <p className="op-notif-desc">{item.description}</p>

                <div className="op-notif-meta">
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={13} />
                    {item.time}
                  </span>

                  {item.tag && (
                    <span
                      className="op-notif-tag"
                      style={{
                        backgroundColor: item.tagBg || "#FFF7ED",
                        color: item.tagColor || "#F97316"
                      }}
                    >
                      🏷 {item.tag}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Badges & Options */}
              <div className="op-notif-right">
                <span
                  className="op-notif-badge"
                  style={{
                    backgroundColor: getAvatarBg(item),
                    color: item.dotColor || "#008F83"
                  }}
                >
                  {item.badge}
                </span>

                {/* Dot indicator */}
                <div
                  className="op-notif-unread-dot"
                  style={{
                    backgroundColor: item.dotColor || "#10B981",
                    opacity: item.unread ? 1 : 0.3
                  }}
                  title={item.unread ? "Unread" : "Read"}
                />

                {/* 3-dots action menu */}
                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    className="op-table-btn-more"
                    onClick={() =>
                      setActiveMenuId(activeMenuId === item.id ? null : item.id)
                    }
                    aria-label="Notification Options"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {activeMenuId === item.id && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "calc(100% + 4px)",
                        background: "#FFFFFF",
                        borderRadius: "8px",
                        border: "1px solid #D8EEE9",
                        boxShadow: "0 8px 20px rgba(0, 76, 73, 0.12)",
                        zIndex: 10,
                        minWidth: "150px",
                        padding: "6px"
                      }}
                    >
                      {item.complaintId && (
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            navigate(`/officer/complaint/${item.complaintId}`);
                          }}
                          style={{
                            display: "block",
                            width: "100%",
                            textAlign: "left",
                            padding: "8px 10px",
                            fontSize: "12.5px",
                            border: "none",
                            background: "transparent",
                            borderRadius: "4px",
                            cursor: "pointer",
                            color: "#102D45"
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#EAF9F6")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          View Complaint
                        </button>
                      )}

                      <button
                        onClick={() => toggleReadStatus(item.id)}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "8px 10px",
                          fontSize: "12.5px",
                          border: "none",
                          background: "transparent",
                          borderRadius: "4px",
                          cursor: "pointer",
                          color: "#102D45"
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#EAF9F6")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        {item.unread ? "Mark as Read" : "Mark as Unread"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </OfficerLayout>
  );
}