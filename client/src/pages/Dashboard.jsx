import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LuFileText,
  LuClock,
  LuRefreshCw,
  LuCheck,
  LuChevronRight,
  LuLayoutGrid,
  LuPlus,
  LuBell,
  LuUserRound,
  LuHeadphones,
  LuLightbulb,
  LuDroplets,
  LuConstruction,
  LuArrowRight,
} from "react-icons/lu";

import CitizenHeader from "../components/CitizenHeader";
import CitizenSidebar from "../components/CitizenSidebar";
import CivicBanner from "../components/CivicBanner";
import TrackModal from "../components/TrackModal";
import NotificationDrawer from "../components/NotificationDrawer";
import HelpSupportModal from "../components/HelpSupportModal";
import { getStoredUser, getCitizenDisplayName } from "../utils/userUtils";

import thumbStreetlight from "../assets/thumb-streetlight.jpg";
import thumbWater from "../assets/thumb-water.jpg";
import thumbPothole from "../assets/thumb-pothole.jpg";

import "../citizenDashboard.css";

// Default reference grievances matching the design specification
const defaultGrievances = [
  {
    id: "SPGMS-2026-3406",
    rawId: "SPGMS-2026-3406",
    title: "Street Light Not Working",
    date: "18 Oct 2026",
    status: "Pending",
    type: "light",
    image: thumbStreetlight,
    fallbackImage: "/thumb-streetlight.jpg",
  },
  {
    id: "SPGMS-2026-3407",
    rawId: "SPGMS-2026-3407",
    title: "Water Supply Issue",
    date: "18 Oct 2026",
    status: "Resolved",
    type: "water",
    image: thumbWater,
    fallbackImage: "/thumb-water.jpg",
  },
  {
    id: "SPGMS-2026-3405",
    rawId: "SPGMS-2026-3405",
    title: "Road Maintenance Request",
    date: "18 Oct 2026",
    status: "In Progress",
    type: "road",
    image: thumbPothole,
    fallbackImage: "/thumb-pothole.jpg",
  },
];

function StatusPill({ status }) {
  const norm = (status || "Pending").toLowerCase().replace(/\s+/g, "-");
  return (
    <span className={`cd-status cd-status-${norm}`}>
      {status}
    </span>
  );
}

function GrievanceTypeIcon({ type }) {
  if (type === "water") {
    return <LuDroplets size={16} strokeWidth={2.2} />;
  }
  if (type === "road") {
    return <LuConstruction size={16} strokeWidth={2.2} />;
  }
  return <LuLightbulb size={16} strokeWidth={2.2} />;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(() => getStoredUser());

  // Modals state
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get citizen display name with fallback to "Suresh" as requested
  const rawDisplayName = useMemo(() => getCitizenDisplayName(user), [user]);
  const displayName = rawDisplayName === "Citizen" ? "Suresh" : rawDisplayName;

  const token = localStorage.getItem("token");

  // Fetch real grievances from backend if user is authenticated
  useEffect(() => {
    if (!token) return;

    const fetchGrievances = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/complaints/history", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (Array.isArray(response.data) && response.data.length > 0) {
          setComplaints(response.data);

          // Update user from complaint citizen profile if available
          const citizenDb = response.data[0]?.citizen;
          if (citizenDb && citizenDb.fullName) {
            setUser((prev) => {
              const updated = { ...(prev || {}), ...citizenDb };
              localStorage.setItem("user", JSON.stringify(updated));
              return updated;
            });
          }
        }
      } catch (err) {
        // Safe fallback - development or offline mode uses default reference data
        console.warn("Using offline reference grievances:", err.message);
      }
    };

    fetchGrievances();
  }, [token]);

  // Derived counts: if real backend complaints exist, calculate actual statistics;
  // otherwise default to exact reference values (3, 1, 1, 1).
  const stats = useMemo(() => {
    if (complaints.length > 0) {
      const total = complaints.length;
      const pending = complaints.filter(
        (c) => c.status === "Pending" || c.status === "Seen"
      ).length;
      const progress = complaints.filter(
        (c) => c.status === "In Progress"
      ).length;
      const resolved = complaints.filter(
        (c) => c.status === "Resolved"
      ).length;

      return [
        { label: "Total Grievances", value: total, trend: `▲ +${total} this month`, kind: "total", Icon: LuFileText },
        { label: "Pending", value: pending, trend: "▲ +0 this month", kind: "pending", Icon: LuClock },
        { label: "In Progress", value: progress, trend: "▲ +0 this month", kind: "progress", Icon: LuRefreshCw },
        { label: "Resolved", value: resolved, trend: `▲ +${resolved} this month`, kind: "resolved", Icon: LuCheck },
      ];
    }

    return [
      { label: "Total Grievances", value: 3, trend: "▲ +3 this month", kind: "total", Icon: LuFileText },
      { label: "Pending", value: 1, trend: "▲ +0 this month", kind: "pending", Icon: LuClock },
      { label: "In Progress", value: 1, trend: "▲ +0 this month", kind: "progress", Icon: LuRefreshCw },
      { label: "Resolved", value: 1, trend: "▲ +1 this month", kind: "resolved", Icon: LuCheck },
    ];
  }, [complaints]);

  // Merge real grievances with default reference items
  const grievancesList = useMemo(() => {
    if (complaints.length > 0) {
      return complaints.map((c) => {
        const shortId = `SPGMS-${new Date(c.createdAt || Date.now()).getFullYear()}-${(c._id || "").slice(-4).toUpperCase()}`;
        let type = "light";
        let image = thumbStreetlight;
        const cat = (c.complaintCategory || "").toLowerCase();

        if (cat.includes("water") || cat.includes("drainage") || cat.includes("sewage")) {
          type = "water";
          image = thumbWater;
        } else if (cat.includes("road") || cat.includes("pothole")) {
          type = "road";
          image = thumbPothole;
        }

        const dateStr = new Date(c.createdAt || Date.now()).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        });

        return {
          id: shortId,
          rawId: c._id,
          title: c.title || `${c.complaintCategory || "Civic Issue"} Report`,
          date: dateStr,
          status: c.status || "Pending",
          type,
          image: c.photoUrl || image,
          fallbackImage: image,
        };
      });
    }

    return defaultGrievances;
  }, [complaints]);

  // Search filter
  const filteredGrievances = useMemo(() => {
    if (!searchTerm.trim()) return grievancesList.slice(0, 3);
    const term = searchTerm.toLowerCase();
    return grievancesList.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        item.id.toLowerCase().includes(term) ||
        item.status.toLowerCase().includes(term)
    );
  }, [grievancesList, searchTerm]);

  // Quick action items matching specification
  const quickActions = [
    {
      title: "Track Status",
      subtitle: "Enter complaint ID to check progress",
      Icon: LuPlus,
      action: () => setIsTrackModalOpen(true),
    },
    {
      title: "My Grievances",
      subtitle: "View and manage your complaints",
      Icon: LuFileText,
      action: () => navigate("/my-complaints"),
    },
    {
      title: "Notifications",
      subtitle: "Stay updated on your grievances",
      Icon: LuBell,
      badge: 2,
      action: () => setIsNotifOpen(true),
    },
    {
      title: "Profile",
      subtitle: "Manage your account details",
      Icon: LuUserRound,
      action: () => navigate("/profile"),
    },
    {
      title: "Help & Support",
      subtitle: "Get assistance and FAQs",
      Icon: LuHeadphones,
      action: () => setIsHelpOpen(true),
    },
  ];

  return (
    <div className="cd-app-shell">
      {/* 1. Dark Navy Top Navigation Bar */}
      <CitizenHeader
        user={user}
        onOpenSidebar={() => setMobileMenuOpen(true)}
        onOpenNotifications={() => setIsNotifOpen(true)}
        unreadCount={2}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* 2. Main Dashboard Layout */}
      <div className="cd-dashboard-layout">
        {/* Left Slim Sidebar */}
        <CitizenSidebar
          user={user}
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          onOpenTrack={() => setIsTrackModalOpen(true)}
          onOpenNotifications={() => setIsNotifOpen(true)}
          unreadCount={2}
        />

        {/* Main Content Area */}
        <main className="cd-main-content">
          {/* Welcome Section */}
          <section className="cd-welcome-row">
            <h1>
              Welcome back, {displayName}! <span className="cd-wave">👋</span>
            </h1>
            <p>
              Here's your civic overview. Report issues, track progress, and help build a better Karnataka.
            </p>
          </section>

          {/* Four Statistics Cards */}
          <section className="cd-stats-row" aria-label="Grievance summary">
            {stats.map(({ label, value, trend, kind, Icon }) => (
              <article className={`cd-stat-card cd-stat-${kind}`} key={label}>
                <div className="cd-stat-icon">
                  <Icon size={22} strokeWidth={kind === "resolved" ? 2.8 : 2} />
                </div>

                <div className="cd-stat-info">
                  <span className="cd-stat-label">{label}</span>
                  <strong>{value}</strong>
                  <span className="cd-stat-note">{trend}</span>
                </div>

                <button
                  className="cd-stat-arrow"
                  type="button"
                  aria-label={`View ${label}`}
                  onClick={() => navigate("/my-complaints")}
                >
                  <LuChevronRight size={13} strokeWidth={2.4} />
                </button>
              </article>
            ))}
          </section>

          {/* Large Civic-Issues Banner */}
          <CivicBanner />

          {/* Bottom Grid: Recent Grievances (Left) + Quick Actions (Right) */}
          <div className="cd-lower-grid">
            {/* Left Card: Recent Grievances */}
            <section className="cd-panel cd-recent-panel">
              <div className="cd-panel-heading">
                <h2>
                  <LuFileText size={18} strokeWidth={2.2} />
                  Recent Grievances
                </h2>

                <button
                  className="cd-view-all"
                  type="button"
                  onClick={() => navigate("/my-complaints")}
                >
                  View All
                  <LuArrowRight size={13} strokeWidth={2.4} />
                </button>
              </div>

              <div className="cd-grievance-list">
                {filteredGrievances.length > 0 ? (
                  filteredGrievances.map((item) => (
                    <article
                      className="cd-grievance-row"
                      key={item.id}
                      onClick={() => {
                        if (item.rawId && item.rawId.length > 10) {
                          navigate(`/complaint/${item.rawId}`);
                        } else {
                          navigate("/my-complaints");
                        }
                      }}
                      title={`View details for ${item.title}`}
                    >
                      <img
                        className="cd-grievance-thumb"
                        src={item.image}
                        alt=""
                        onError={(e) => {
                          if (item.fallbackImage) {
                            e.currentTarget.src = item.fallbackImage;
                          }
                        }}
                      />

                      <div className={`cd-grievance-type cd-type-${item.type}`}>
                        <GrievanceTypeIcon type={item.type} />
                      </div>

                      <div className="cd-grievance-details">
                        <strong>{item.title}</strong>
                        <div className="cd-grievance-meta">
                          <span>ID: {item.id}</span>
                          <span>•</span>
                          <span>{item.date}</span>
                        </div>
                      </div>

                      <StatusPill status={item.status} />

                      <button
                        className="cd-row-arrow"
                        type="button"
                        aria-label={`Open ${item.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.rawId && item.rawId.length > 10) {
                            navigate(`/complaint/${item.rawId}`);
                          } else {
                            navigate("/my-complaints");
                          }
                        }}
                      >
                        <LuChevronRight size={16} strokeWidth={2} />
                      </button>
                    </article>
                  ))
                ) : (
                  <div className="cd-empty-state">
                    No grievances match "{searchTerm}".
                  </div>
                )}
              </div>
            </section>

            {/* Right Card: Quick Actions */}
            <section className="cd-panel cd-quick-panel">
              <div className="cd-panel-heading">
                <h2>
                  <LuLayoutGrid size={18} strokeWidth={2.2} />
                  Quick Actions
                </h2>
              </div>

              <div className="cd-quick-actions-grid">
                {quickActions.map(({ title, subtitle, Icon, action, badge }) => (
                  <button
                    className="cd-quick-action"
                    key={title}
                    type="button"
                    onClick={action}
                  >
                    <span className="cd-quick-icon">
                      <Icon size={18} strokeWidth={2.2} />
                      {badge && <i>{badge}</i>}
                    </span>

                    <span className="cd-quick-copy">
                      <strong>{title}</strong>
                      <small>{subtitle}</small>
                    </span>

                    <LuChevronRight
                      className="cd-quick-chevron"
                      size={14}
                      strokeWidth={2.4}
                    />
                  </button>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Modals & Drawers */}
      <TrackModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
      />

      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
      />

      <HelpSupportModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
