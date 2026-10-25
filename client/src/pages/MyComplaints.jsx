import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LuFileText,
  LuClock,
  LuRefreshCw,
  LuCheck,
  LuChevronRight,
  LuChevronLeft,
  LuSearch,
  LuCirclePlus,
  LuCopy,
  LuMapPin,
  LuCalendar,
  LuConstruction,
  LuDroplets,
  LuLightbulb,
  LuArrowRight,
  LuChevronDown,
} from "react-icons/lu";

import CitizenHeader from "../components/CitizenHeader";
import CitizenSidebar from "../components/CitizenSidebar";
import TrackModal from "../components/TrackModal";
import NotificationDrawer from "../components/NotificationDrawer";
import HelpSupportModal from "../components/HelpSupportModal";
import { getStoredUser } from "../utils/userUtils";

import thumbStreetlight from "../assets/thumb-streetlight.jpg";
import thumbWater from "../assets/thumb-water.jpg";
import thumbPothole from "../assets/thumb-pothole.jpg";

import "../citizenDashboard.css";

// Exact default reference records from the specification screenshot
const defaultGrievances = [
  {
    id: "CDC4E8",
    displayId: "#CDC4E8",
    rawId: "CDC4E8",
    category: "Pothole",
    location: "8th Cross Road, Malleshwaram, Bengaluru",
    department: "Road Department",
    priority: "HIGH PRIORITY",
    filedDate: "25/10/2026",
    status: "IN PROGRESS",
    type: "road",
    image: thumbPothole,
    fallbackImage: "/thumb-pothole.jpg",
  },
  {
    id: "CDC4EA",
    displayId: "#CDC4EA",
    rawId: "CDC4EA",
    category: "Water Leakage",
    location: "5th Block, Koramangala, Bengaluru",
    department: "Water Department",
    priority: "MEDIUM",
    filedDate: "25/10/2026",
    status: "RESOLVED",
    type: "water",
    image: thumbWater,
    fallbackImage: "/thumb-water.jpg",
  },
  {
    id: "CDC4E9",
    displayId: "#CDC4E9",
    rawId: "CDC4E9",
    category: "Electricity Problem",
    location: "100ft Road, HAL 2nd Stage, Indiranagar",
    department: "Electrical Department",
    priority: "HIGH PRIORITY",
    filedDate: "25/10/2026",
    status: "PENDING REVIEW",
    type: "light",
    image: thumbStreetlight,
    fallbackImage: "/thumb-streetlight.jpg",
  },
];

export default function MyComplaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [user, setUser] = useState(() => getStoredUser());

  // Modals state
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        console.warn("Using offline reference grievance dossier:", err.message);
      }
    };

    fetchGrievances();
  }, [token]);

  // Copy ID with user feedback
  const handleCopyId = (e, id) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Convert real backend complaints or fallback to reference grievances
  const allGrievances = useMemo(() => {
    if (complaints.length > 0) {
      return complaints.map((c) => {
        const shortHex = (c._id || "").slice(-6).toUpperCase();
        const displayId = `#${shortHex}`;
        const cat = c.complaintCategory || "Civic Grievance";
        let type = "road";
        let image = thumbPothole;

        const catLower = cat.toLowerCase();
        if (catLower.includes("water") || catLower.includes("drainage") || catLower.includes("sewage")) {
          type = "water";
          image = thumbWater;
        } else if (catLower.includes("electric") || catLower.includes("light") || catLower.includes("power")) {
          type = "light";
          image = thumbStreetlight;
        }

        let formattedPriority = "MEDIUM";
        if (c.priority === "High" || c.priority === "Urgent" || c.priority === "Emergency") {
          formattedPriority = "HIGH PRIORITY";
        } else if (c.priority === "Low") {
          formattedPriority = "LOW";
        }

        let formattedStatus = "PENDING REVIEW";
        if (c.status === "In Progress") {
          formattedStatus = "IN PROGRESS";
        } else if (c.status === "Resolved") {
          formattedStatus = "RESOLVED";
        } else if (c.status === "Pending" || c.status === "Seen") {
          formattedStatus = "PENDING REVIEW";
        }

        const dateObj = new Date(c.createdAt || Date.now());
        const day = String(dateObj.getDate()).padStart(2, "0");
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const year = dateObj.getFullYear();
        const filedDate = `${day}/${month}/${year}`;

        return {
          id: shortHex,
          displayId,
          rawId: c._id,
          category: cat,
          location: c.address || "Bengaluru Ward Office",
          department: c.department || "Municipal Department",
          priority: formattedPriority,
          filedDate,
          status: formattedStatus,
          type,
          image: c.photoUrl || image,
          fallbackImage: image,
        };
      });
    }

    return defaultGrievances;
  }, [complaints]);

  // Derived counts for summary cards and filter tabs
  const counts = useMemo(() => {
    const total = allGrievances.length;
    const pending = allGrievances.filter((g) => g.status.includes("PENDING")).length;
    const inProgress = allGrievances.filter((g) => g.status.includes("PROGRESS")).length;
    const resolved = allGrievances.filter((g) => g.status.includes("RESOLVED")).length;

    return { total, pending, inProgress, resolved };
  }, [allGrievances]);

  // Summary cards configuration matching dashboard
  const summaryCards = [
    { label: "Total Grievances", value: counts.total, trend: `▲ +${counts.total} this month`, kind: "total", Icon: LuFileText },
    { label: "Pending", value: counts.pending, trend: "▲ +0 this month", kind: "pending", Icon: LuClock },
    { label: "In Progress", value: counts.inProgress, trend: "▲ +0 this month", kind: "progress", Icon: LuRefreshCw },
    { label: "Resolved", value: counts.resolved, trend: `▲ +${counts.resolved} this month`, kind: "resolved", Icon: LuCheck },
  ];

  // Filter complaints based on active filter tab and search queries
  const filteredGrievances = useMemo(() => {
    return allGrievances.filter((item) => {
      // Tab filter
      if (filterStatus === "Pending" && !item.status.includes("PENDING")) return false;
      if (filterStatus === "In Progress" && !item.status.includes("PROGRESS")) return false;
      if (filterStatus === "Resolved" && !item.status.includes("RESOLVED")) return false;

      // Local search query
      const localQuery = searchQuery.trim().toLowerCase();
      if (localQuery) {
        const text = `${item.displayId} ${item.category} ${item.location} ${item.department} ${item.status} ${item.priority}`.toLowerCase();
        if (!text.includes(localQuery)) return false;
      }

      // Global header search query
      const gQuery = globalSearch.trim().toLowerCase();
      if (gQuery) {
        const text = `${item.displayId} ${item.category} ${item.location} ${item.department} ${item.status}`.toLowerCase();
        if (!text.includes(gQuery)) return false;
      }

      return true;
    });
  }, [allGrievances, filterStatus, searchQuery, globalSearch]);

  const renderCategoryIcon = (type) => {
    if (type === "water") {
      return (
        <div className="gh-category-badge gh-badge-water">
          <LuDroplets size={14} strokeWidth={2.4} />
        </div>
      );
    }
    if (type === "light") {
      return (
        <div className="gh-category-badge gh-badge-light">
          <LuLightbulb size={14} strokeWidth={2.4} />
        </div>
      );
    }
    return (
      <div className="gh-category-badge gh-badge-road">
        <LuConstruction size={14} strokeWidth={2.4} />
      </div>
    );
  };

  const renderPriorityBadge = (priority) => {
    if (priority.includes("HIGH") || priority.includes("URGENT")) {
      return <span className="gh-priority-pill gh-priority-high">HIGH PRIORITY</span>;
    }
    if (priority.includes("MEDIUM")) {
      return <span className="gh-priority-pill gh-priority-medium">MEDIUM</span>;
    }
    return <span className="gh-priority-pill gh-priority-low">{priority}</span>;
  };

  const renderStatusBadge = (status) => {
    if (status.includes("PROGRESS")) {
      return <span className="gh-status-pill gh-status-in-progress">IN PROGRESS</span>;
    }
    if (status.includes("RESOLVED")) {
      return <span className="gh-status-pill gh-status-resolved">RESOLVED</span>;
    }
    return <span className="gh-status-pill gh-status-pending">PENDING REVIEW</span>;
  };

  return (
    <div className="cd-app-shell">
      {/* 1. Dark Navy Top Navigation Bar */}
      <CitizenHeader
        user={user}
        onOpenSidebar={() => setMobileMenuOpen(true)}
        onOpenNotifications={() => setIsNotifOpen(true)}
        unreadCount={2}
        searchTerm={globalSearch}
        onSearchChange={setGlobalSearch}
      />

      {/* 2. Main Dashboard Layout (Sidebar + Content) */}
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
        <main className="cd-main-content gh-main-content">
          {/* Breadcrumb */}
          <nav className="gh-breadcrumb" aria-label="Breadcrumb">
            <button
              type="button"
              className="gh-breadcrumb-btn"
              onClick={() => navigate("/dashboard")}
            >
              <LuChevronLeft size={13} /> Home
            </button>
            <span className="gh-breadcrumb-sep">&gt;</span>
            <span className="gh-breadcrumb-current">My Grievances</span>
          </nav>

          {/* Page Heading & Action Button Row */}
          <section className="gh-header-row">
            <div>
              <h1>My Grievance History</h1>
              <p>Track all civic complaints lodged under your citizen account</p>
            </div>

            <button
              type="button"
              className="gh-lodge-btn"
              onClick={() => navigate("/submit-complaint")}
            >
              <LuCirclePlus size={15} strokeWidth={2.4} />
              <span>Lodge New Grievance</span>
            </button>
          </section>

          {/* Four Horizontally Aligned Summary Cards */}
          <section className="cd-stats-row gh-stats-row" aria-label="Grievance overview">
            {summaryCards.map(({ label, value, trend, kind, Icon }) => (
              <article className={`cd-stat-card gh-stat-card cd-stat-${kind}`} key={label}>
                <div className="cd-stat-icon">
                  <Icon size={19} strokeWidth={kind === "resolved" ? 2.8 : 2} />
                </div>

                <div className="cd-stat-info">
                  <span className="cd-stat-label">{label}</span>
                  <strong>{value}</strong>
                  <span className="cd-stat-note">{trend}</span>
                </div>

                <button
                  className="cd-stat-arrow"
                  type="button"
                  aria-label={`Filter by ${label}`}
                  onClick={() => {
                    if (kind === "pending") setFilterStatus("Pending");
                    else if (kind === "progress") setFilterStatus("In Progress");
                    else if (kind === "resolved") setFilterStatus("Resolved");
                    else setFilterStatus("All");
                  }}
                >
                  <LuChevronRight size={12} strokeWidth={2.4} />
                </button>
              </article>
            ))}
          </section>

          {/* Filter Tabs and Search Input (Exact Reference Row) */}
          <section className="gh-controls-row">
            {/* Filter Buttons */}
            <div className="gh-filter-tabs">
              <button
                type="button"
                className={`gh-filter-tab ${filterStatus === "All" ? "active" : ""}`}
                onClick={() => setFilterStatus("All")}
              >
                All ({counts.total})
              </button>
              <button
                type="button"
                className={`gh-filter-tab ${filterStatus === "Pending" ? "active" : ""}`}
                onClick={() => setFilterStatus("Pending")}
              >
                Pending ({counts.pending})
              </button>
              <button
                type="button"
                className={`gh-filter-tab ${filterStatus === "In Progress" ? "active" : ""}`}
                onClick={() => setFilterStatus("In Progress")}
              >
                In Progress ({counts.inProgress})
              </button>
              <button
                type="button"
                className={`gh-filter-tab ${filterStatus === "Resolved" ? "active" : ""}`}
                onClick={() => setFilterStatus("Resolved")}
              >
                Resolved ({counts.resolved})
              </button>
            </div>

            {/* Search Input on the right */}
            <div className="gh-search-box">
              <LuSearch size={14} className="gh-search-icon" />
              <input
                type="search"
                className="gh-search-input"
                placeholder="Search by ID, category, area, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search grievances"
              />
            </div>
          </section>

          {/* Professional Grievance Table */}
          <section className="gh-table-container">
            <div className="gh-table-scroll">
              <table className="gh-table">
                <colgroup>
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "35%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "11%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>REF ID</th>
                    <th>GRIEVANCE DETAILS</th>
                    <th>DEPARTMENT</th>
                    <th>PRIORITY</th>
                    <th>FILED DATE</th>
                    <th>STATUS</th>
                    <th style={{ textAlign: "right" }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGrievances.length > 0 ? (
                    filteredGrievances.map((item) => (
                      <tr key={item.id}>
                        {/* REF ID Column */}
                        <td>
                          <div className="gh-ref-cell">
                            <span>{item.displayId}</span>
                            <button
                              type="button"
                              className={`gh-copy-btn ${copiedId === item.displayId ? "copied" : ""}`}
                              onClick={(e) => handleCopyId(e, item.displayId)}
                              title="Copy Reference ID"
                              aria-label="Copy Reference ID"
                            >
                              {copiedId === item.displayId ? (
                                <LuCheck size={13} />
                              ) : (
                                <LuCopy size={13} />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Grievance Details Column */}
                        <td>
                          <div className="gh-details-cell">
                            <img
                              className="gh-thumb"
                              src={item.image}
                              alt=""
                              onError={(e) => {
                                if (item.fallbackImage) {
                                  e.currentTarget.src = item.fallbackImage;
                                }
                              }}
                            />

                            {renderCategoryIcon(item.type)}

                            <div className="gh-text-info">
                              <strong>{item.category}</strong>
                              <span className="gh-location">
                                <LuMapPin size={11} />
                                {item.location}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Department Column */}
                        <td>
                          <span className="gh-dept">{item.department}</span>
                        </td>

                        {/* Priority Column */}
                        <td>{renderPriorityBadge(item.priority)}</td>

                        {/* Filed Date Column */}
                        <td>
                          <div className="gh-date-cell">
                            <LuCalendar size={13} />
                            <span>{item.filedDate}</span>
                          </div>
                        </td>

                        {/* Status Column */}
                        <td>{renderStatusBadge(item.status)}</td>

                        {/* Action Column */}
                        <td style={{ textAlign: "right" }}>
                          <button
                            type="button"
                            className="gh-action-btn"
                            onClick={() => {
                              if (item.rawId && item.rawId.length > 8) {
                                navigate(`/complaint/${item.rawId}`);
                              } else {
                                navigate(`/complaint/${item.id}`);
                              }
                            }}
                          >
                            <span>Track & View</span>
                            <LuArrowRight size={13} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="gh-empty-table">
                        No grievances match your current search and filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer: Rows per page + Pagination */}
            <div className="gh-pagination">
              <span>Rows per page:</span>
              <div className="gh-rows-dropdown">
                <span>10</span>
                <LuChevronDown size={12} />
              </div>

              <span>
                {filteredGrievances.length > 0
                  ? `1–${filteredGrievances.length} of ${filteredGrievances.length}`
                  : "0–0 of 0"}
              </span>

              <div className="gh-page-nav">
                <button
                  type="button"
                  className="gh-nav-btn"
                  disabled
                  aria-label="Previous page"
                >
                  <LuChevronLeft size={13} />
                </button>
                <button
                  type="button"
                  className="gh-nav-btn"
                  disabled
                  aria-label="Next page"
                >
                  <LuChevronRight size={13} />
                </button>
              </div>
            </div>
          </section>
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