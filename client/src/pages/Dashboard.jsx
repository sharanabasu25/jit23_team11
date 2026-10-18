import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LuFileText,
  LuClock,
  LuRefreshCw,
  LuCircleCheck,
  LuSearch,
  LuChevronRight,
  LuLayoutGrid,
  LuPlus,
  LuBell,
  LuUser,
  LuHeadphones,
  LuConstruction,
  LuDroplets,
  LuLightbulb,
  LuTrash2
} from "react-icons/lu";

import CitizenHeader from "../components/CitizenHeader";
import CitizenSidebar from "../components/CitizenSidebar";
import HampiBanner from "../components/HampiBanner";
import TrackModal from "../components/TrackModal";
import NotificationDrawer from "../components/NotificationDrawer";
import HelpSupportModal from "../components/HelpSupportModal";
import { getStoredUser, getCitizenDisplayName, getCitizenInitial } from "../utils/userUtils";
import "../citizenDashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Authenticated citizen state
  const [user, setUser] = useState(() => getStoredUser());
  const displayName = useMemo(() => getCitizenDisplayName(user), [user]);
  const displayInitial = useMemo(() => getCitizenInitial(user), [user]);

  // Modal & Drawer visibility
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchGrievances = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("http://localhost:5000/api/complaints/history", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setComplaints(response.data || []);

        // Hydrate stored user with fresh profile data from DB if available
        if (Array.isArray(response.data) && response.data.length > 0) {
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
        console.error("Failed to fetch citizen grievances:", err);
        setError("Unable to retrieve grievances from municipal server.");
      } finally {
        setLoading(false);
      }
    };

    fetchGrievances();
  }, [token, navigate]);

  // Derived real backend statistics
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(
    (c) => c.status === "Pending" || c.status === "Seen"
  ).length;
  const inProgressCount = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;
  const resolvedCount = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  // Month-over-month trend calculation from real data
  const { thisMonthNewCount, thisMonthResolvedCount } = useMemo(() => {
    const now = new Date();
    const currMonth = now.getMonth();
    const currYear = now.getFullYear();

    let newCount = 0;
    let resCount = 0;

    complaints.forEach((c) => {
      if (c.createdAt) {
        const d = new Date(c.createdAt);
        if (d.getMonth() === currMonth && d.getFullYear() === currYear) {
          newCount++;
        }
      }
      if (c.status === "Resolved") {
        const d = new Date(c.updatedAt || c.createdAt);
        if (d.getMonth() === currMonth && d.getFullYear() === currYear) {
          resCount++;
        }
      }
    });

    return {
      thisMonthNewCount: newCount,
      thisMonthResolvedCount: resCount
    };
  }, [complaints]);

  // Unread notifications count
  const unreadCount = useMemo(() => {
    return complaints.filter((c) => c.status === "Resolved" || c.status === "In Progress").length;
  }, [complaints]);

  // Format reference ID nicely matching screenshot: ID: SPGMS-2026-1024
  const formatReferenceId = (complaint) => {
    if (complaint.referenceId) return complaint.referenceId;
    const year = complaint.createdAt ? new Date(complaint.createdAt).getFullYear() : 2026;
    const suffix = complaint._id ? complaint._id.slice(-4).toUpperCase() : "1001";
    return `SPGMS-${year}-${suffix}`;
  };

  // Format date: e.g. "17 Oct 2026"
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } catch {
      return "";
    }
  };

  // Map category to a human-friendly display title
  const getCategoryTitle = (category, description) => {
    if (category === "Pothole") return "Road Maintenance Request";
    if (category === "Water Leakage") return "Water Supply Issue";
    if (category === "Electricity Problem") return "Street Light Not Working";
    if (description && description.trim()) {
      return description.length > 36 ? description.substring(0, 36) + "..." : description;
    }
    return category || "Civic Grievance";
  };

  // Category appropriate icon & colors
  const getCategoryVisuals = (category) => {
    switch (category) {
      case "Pothole":
        return {
          bg: "rgba(231, 185, 79, 0.16)",
          color: "#B48312",
          icon: <LuConstruction size={20} strokeWidth={2.2} />
        };
      case "Water Leakage":
        return {
          bg: "rgba(22, 115, 213, 0.14)",
          color: "#1673D5",
          icon: <LuDroplets size={20} strokeWidth={2.2} />
        };
      case "Electricity Problem":
        return {
          bg: "rgba(109, 90, 209, 0.14)",
          color: "#6D5AD1",
          icon: <LuLightbulb size={20} strokeWidth={2.2} />
        };
      default:
        return {
          bg: "rgba(25, 38, 75, 0.10)",
          color: "#19264B",
          icon: <LuFileText size={20} strokeWidth={2.2} />
        };
    }
  };

  // Filter complaints according to real search query
  const filteredComplaints = useMemo(() => {
    if (!searchTerm.trim()) {
      return complaints;
    }
    const q = searchTerm.toLowerCase().trim();
    return complaints.filter((c) => {
      const refId = formatReferenceId(c).toLowerCase();
      const rawId = (c._id || "").toLowerCase();
      const category = (c.complaintCategory || "").toLowerCase();
      const desc = (c.manualDescription || "").toLowerCase();
      const aiDesc = (c.aiGeneratedDescription || "").toLowerCase();
      const addr = (c.address || "").toLowerCase();
      const dept = (c.department || "").toLowerCase();
      const status = (c.status || "").toLowerCase();

      return (
        refId.includes(q) ||
        rawId.includes(q) ||
        category.includes(q) ||
        desc.includes(q) ||
        aiDesc.includes(q) ||
        addr.includes(q) ||
        dept.includes(q) ||
        status.includes(q)
      );
    });
  }, [complaints, searchTerm]);

  // Recent grievances: sorted latest first, capped at 5
  const recentGrievances = useMemo(() => {
    return [...filteredComplaints]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);
  }, [filteredComplaints]);

  const renderStatusBadge = (status) => {
    switch (status) {
      case "Pending":
      case "Seen":
        return <span className="cd-badge pending">Pending</span>;
      case "In Progress":
        return <span className="cd-badge progress">In Progress</span>;
      case "Resolved":
        return <span className="cd-badge resolved">Resolved</span>;
      default:
        return <span className="cd-badge pending">{status || "Pending"}</span>;
    }
  };

  return (
    <div className="cd-page-viewport">
      {/* 2. Top Navigation Bar (Midnight Indigo #19264B) */}
      <CitizenHeader
        user={user}
        onOpenSidebar={() => setIsMobileSidebarOpen(true)}
        onOpenNotifications={() => setIsNotifOpen(true)}
        onOpenTrack={() => setIsTrackModalOpen(true)}
        unreadCount={unreadCount}
      />

      {/* Main Layout containing Left Sidebar & Right Content */}
      <div className="cd-dashboard-layout">
        {/* 3. Left Sidebar (Vanilla Cream #F8F3E8, ~200px) */}
        <CitizenSidebar
          user={user}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          onOpenTrack={() => setIsTrackModalOpen(true)}
          onOpenNotifications={() => setIsNotifOpen(true)}
          unreadCount={unreadCount}
        />

        {/* 4. Main Content Area */}
        <main className="cd-main-content">
          {/* Welcome Header & Search Row */}
          <section className="cd-welcome-row" aria-label="Welcome section">
            <div className="cd-welcome-text-block">
              <h1 className="cd-welcome-heading">Welcome back, {displayName}! 👋</h1>
              <p className="cd-welcome-subtext">
                Here's your civic overview. Report issues, track progress, and help build a better Karnataka.
              </p>
            </div>

            {/* Functional Search Bar */}
            <div className="cd-search-container" role="search">
              <LuSearch size={17} className="cd-search-icon" />
              <input
                type="text"
                className="cd-search-input"
                placeholder="Search grievances, ID, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search grievances, reference ID, or location"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--cd-secondary-text)",
                    cursor: "pointer",
                    fontSize: "12px",
                    padding: "2px"
                  }}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </section>

          {/* 5. Four Statistics Cards in One Row */}
          <section className="cd-stats-row" aria-label="Civic Statistics">
            {/* Card 1: Total Grievances */}
            <div
              className="cd-stat-card"
              onClick={() => navigate("/my-complaints")}
              title="View all filed grievances"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate("/my-complaints")}
            >
              <div className="cd-stat-icon-wrapper total">
                <LuFileText size={22} strokeWidth={2.2} />
              </div>
              <div className="cd-stat-info">
                <span className="cd-stat-label">Total Grievances</span>
                <span className="cd-stat-number">{loading ? "..." : totalCount}</span>
                <span className="cd-stat-trend trend-green">
                  ▲ +{thisMonthNewCount > 0 ? thisMonthNewCount : totalCount > 0 ? totalCount : 0} this month
                </span>
              </div>
            </div>

            {/* Card 2: Pending */}
            <div
              className="cd-stat-card"
              onClick={() => navigate("/my-complaints")}
              title="View pending grievances"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate("/my-complaints")}
            >
              <div className="cd-stat-icon-wrapper pending">
                <LuClock size={22} strokeWidth={2.2} />
              </div>
              <div className="cd-stat-info">
                <span className="cd-stat-label">Pending</span>
                <span className="cd-stat-number">{loading ? "..." : pendingCount}</span>
                <span className="cd-stat-trend trend-amber">
                  · Requires attention
                </span>
              </div>
            </div>

            {/* Card 3: In Progress */}
            <div
              className="cd-stat-card"
              onClick={() => navigate("/my-complaints")}
              title="View grievances currently being resolved"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate("/my-complaints")}
            >
              <div className="cd-stat-icon-wrapper progress">
                <LuRefreshCw size={22} strokeWidth={2.2} />
              </div>
              <div className="cd-stat-info">
                <span className="cd-stat-label">In Progress</span>
                <span className="cd-stat-number">{loading ? "..." : inProgressCount}</span>
                <span className="cd-stat-trend trend-blue">
                  Being resolved
                </span>
              </div>
            </div>

            {/* Card 4: Resolved */}
            <div
              className="cd-stat-card"
              onClick={() => navigate("/my-complaints")}
              title="View successfully resolved grievances"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate("/my-complaints")}
            >
              <div className="cd-stat-icon-wrapper resolved">
                <LuCircleCheck size={22} strokeWidth={2.2} />
              </div>
              <div className="cd-stat-info">
                <span className="cd-stat-label">Resolved</span>
                <span className="cd-stat-number">{loading ? "..." : resolvedCount}</span>
                <span className="cd-stat-trend trend-green">
                  ▲ +{thisMonthResolvedCount > 0 ? thisMonthResolvedCount : resolvedCount > 0 ? resolvedCount : 0} this month
                </span>
              </div>
            </div>
          </section>

          {/* 6. Main Hampi Heritage Banner */}
          <HampiBanner />

          {/* 7. Lower Dashboard Sections (Recent Grievances & Quick Actions) */}
          <section className="cd-lower-grid" aria-label="Dashboard Details">
            {/* Left Panel: Recent Grievances */}
            <div className="cd-section-panel">
              <div className="cd-panel-header">
                <div className="cd-panel-title-block">
                  <LuFileText size={20} className="cd-panel-title-icon" strokeWidth={2.2} />
                  <h2 className="cd-panel-heading">Recent Grievances</h2>
                </div>
                <button
                  type="button"
                  className="cd-view-all-btn"
                  onClick={() => navigate("/my-complaints")}
                >
                  View All →
                </button>
              </div>

              <div className="cd-grievances-list">
                {loading ? (
                  <div className="cd-empty-box">
                    <p>Loading real grievances from municipal database...</p>
                  </div>
                ) : error ? (
                  <div className="cd-empty-box">
                    <p style={{ color: "#B42335" }}>{error}</p>
                    <button
                      type="button"
                      className="cd-empty-action-btn"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </button>
                  </div>
                ) : recentGrievances.length === 0 ? (
                  <div className="cd-empty-box">
                    <p>
                      {searchTerm
                        ? `No grievances match "${searchTerm}".`
                        : "No grievances filed yet."}
                    </p>
                    <button
                      type="button"
                      className="cd-empty-action-btn"
                      onClick={() => navigate("/submit-complaint")}
                    >
                      + Submit First Grievance
                    </button>
                  </div>
                ) : (
                  recentGrievances.map((c) => {
                    const visuals = getCategoryVisuals(c.complaintCategory);
                    const refId = formatReferenceId(c);
                    const dateFormatted = formatDate(c.createdAt);
                    const displayTitle = getCategoryTitle(c.complaintCategory, c.manualDescription);

                    return (
                      <div
                        key={c._id}
                        className="cd-grievance-row"
                        onClick={() => navigate(`/complaint/${c._id}`)}
                        role="button"
                        tabIndex={0}
                        title={`View complaint details for ${refId}`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            navigate(`/complaint/${c._id}`);
                          }
                        }}
                      >
                        <div className="cd-grievance-info-left">
                          {/* Circular category icon badge */}
                          <div
                            className="cd-category-icon-circle"
                            style={{
                              backgroundColor: visuals.bg,
                              color: visuals.color
                            }}
                          >
                            {visuals.icon}
                          </div>

                          <div className="cd-grievance-details">
                            <span className="cd-grievance-title-text">
                              {displayTitle}
                            </span>
                            <span className="cd-grievance-meta-text">
                              ID: {refId} &nbsp;·&nbsp; {dateFormatted || "Recent"}
                            </span>
                          </div>
                        </div>

                        <div className="cd-grievance-status-right">
                          {renderStatusBadge(c.status)}
                          <LuChevronRight size={18} className="cd-chevron-right" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Panel: Quick Actions (6 Cards in 2x3 Grid) */}
            <div className="cd-section-panel">
              <div className="cd-panel-header">
                <div className="cd-panel-title-block">
                  <LuLayoutGrid size={20} className="cd-panel-title-icon" strokeWidth={2.2} />
                  <h2 className="cd-panel-heading">Quick Actions</h2>
                </div>
              </div>

              <div className="cd-quick-actions-grid">
                {/* 1. Submit Grievance */}
                <div
                  className="cd-quick-action-card"
                  onClick={() => navigate("/submit-complaint")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate("/submit-complaint")}
                >
                  <div className="cd-quick-action-icon-circle">
                    <LuPlus size={19} strokeWidth={2.5} />
                  </div>
                  <div className="cd-quick-action-text">
                    <span className="cd-quick-action-title">Submit Grievance</span>
                    <span className="cd-quick-action-desc">Report a new issue in your area</span>
                  </div>
                </div>

                {/* 2. Track Status */}
                <div
                  className="cd-quick-action-card"
                  onClick={() => setIsTrackModalOpen(true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setIsTrackModalOpen(true)}
                >
                  <div className="cd-quick-action-icon-circle">
                    <LuSearch size={18} strokeWidth={2.2} />
                  </div>
                  <div className="cd-quick-action-text">
                    <span className="cd-quick-action-title">Track Status</span>
                    <span className="cd-quick-action-desc">Enter complaint ID to check progress</span>
                  </div>
                </div>

                {/* 3. My Grievances */}
                <div
                  className="cd-quick-action-card"
                  onClick={() => navigate("/my-complaints")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate("/my-complaints")}
                >
                  <div className="cd-quick-action-icon-circle">
                    <LuFileText size={18} strokeWidth={2.2} />
                  </div>
                  <div className="cd-quick-action-text">
                    <span className="cd-quick-action-title">My Grievances</span>
                    <span className="cd-quick-action-desc">View and manage your complaints</span>
                  </div>
                </div>

                {/* 4. Notifications */}
                <div
                  className="cd-quick-action-card"
                  onClick={() => setIsNotifOpen(true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setIsNotifOpen(true)}
                >
                  <div className="cd-quick-action-icon-circle">
                    <LuBell size={18} strokeWidth={2.2} />
                  </div>
                  <div className="cd-quick-action-text">
                    <span className="cd-quick-action-title">Notifications</span>
                    <span className="cd-quick-action-desc">Stay updated on your grievances</span>
                  </div>
                </div>

                {/* 5. Profile */}
                <div
                  className="cd-quick-action-card"
                  onClick={() => navigate("/profile")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate("/profile")}
                >
                  <div className="cd-quick-action-icon-circle">
                    <LuUser size={18} strokeWidth={2.2} />
                  </div>
                  <div className="cd-quick-action-text">
                    <span className="cd-quick-action-title">Profile</span>
                    <span className="cd-quick-action-desc">Manage your account details</span>
                  </div>
                </div>

                {/* 6. Help & Support */}
                <div
                  className="cd-quick-action-card"
                  onClick={() => setIsHelpOpen(true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setIsHelpOpen(true)}
                >
                  <div className="cd-quick-action-icon-circle">
                    <LuHeadphones size={18} strokeWidth={2.2} />
                  </div>
                  <div className="cd-quick-action-text">
                    <span className="cd-quick-action-title">Help & Support</span>
                    <span className="cd-quick-action-desc">Get assistance and FAQs</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Global Interactive Modals */}
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

export default Dashboard;