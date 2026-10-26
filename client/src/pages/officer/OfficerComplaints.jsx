import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  FileText,
  Clock,
  RefreshCw,
  Check,
  Search,
  FilterX,
  MapPin,
  Eye,
  MoreVertical,
  ChevronRight
} from "lucide-react";
import OfficerLayout from "../../components/OfficerLayout";
import KarnatakaArchitecturalBanner from "../../components/KarnatakaArchitecturalBanner";
import TodayDateCard from "../../components/TodayDateCard";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";
import PriorityBadge from "../../components/PriorityBadge";
import CategoryBadge from "../../components/CategoryBadge";
import { sampleComplaints, sampleStats } from "../../data/officerSampleData";

export default function OfficerComplaints() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get("status") || "all";

  const [complaints, setComplaints] = useState(sampleComplaints);
  const [loading, setLoading] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Fetch live complaints if available
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:5000/api/complaints", {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 2500
        });

        if (Array.isArray(response.data) && response.data.length > 0) {
          // Normalize complaints from backend
          const formatted = response.data.map((c, index) => ({
            ...c,
            _id: c._id ? (c._id.length > 6 ? c._id.substring(18).toUpperCase() : c._id) : `CMP00${index + 1}`,
            formattedDate: c.createdAt
              ? new Date(c.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })
              : "26 Oct 2026 10:00 AM",
            citizen: c.citizen || {
              fullName: "Suresh Kumar",
              phoneNumber: "+91 98765 43210"
            }
          }));
          setComplaints(formatted);
        }
      } catch (err) {
        // Retain sample complaints on offline/demo
        console.info("[OfficerComplaints] Using sample complaints reference dataset.");
      }
    };

    fetchComplaints();
  }, []);

  // Filter complaints based on search and dropdown selections
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const term = searchTerm.trim().toLowerCase();
      const citizenName = (c.citizen?.fullName || "").toLowerCase();
      const category = (c.complaintCategory || "").toLowerCase();
      const address = (c.address || "").toLowerCase();
      const id = (c._id || "").toLowerCase();

      const matchesSearch =
        !term ||
        id.includes(term) ||
        citizenName.includes(term) ||
        category.includes(term) ||
        address.includes(term);

      const matchesCategory =
        categoryFilter === "all" ||
        category.includes(categoryFilter.toLowerCase());

      const normStatus = (c.status || "").toLowerCase().replace(/\s/g, "-");
      const matchesStatus =
        statusFilter === "all" ||
        normStatus === statusFilter.toLowerCase().replace(/\s/g, "-");

      const matchesPriority =
        priorityFilter === "all" ||
        (c.priority || "").toLowerCase() === priorityFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
    });
  }, [complaints, searchTerm, categoryFilter, statusFilter, priorityFilter]);

  // Dynamic counts for summary cards
  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === "Pending" || c.status === "Seen").length;
    const inProgress = complaints.filter((c) => c.status === "In Progress").length;
    const resolved = complaints.filter((c) => c.status === "Resolved").length;
    return {
      total: total || sampleStats.totalAssigned,
      pending: pending || sampleStats.pending,
      inProgress: inProgress || sampleStats.inProgress,
      resolved: resolved || sampleStats.resolved
    };
  }, [complaints]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  return (
    <OfficerLayout onSearchChange={setSearchTerm} searchValue={searchTerm}>
      {/* Top Breadcrumb & Page Header */}
      <div className="op-page-header-container">
        <div className="op-page-header-text">
          <nav className="op-breadcrumb" aria-label="Breadcrumb">
            <Link to="/officer/dashboard">Home</Link>
            <span className="op-breadcrumb-separator">&gt;</span>
            <span className="op-breadcrumb-current">Complaints</span>
          </nav>

          <h1 className="op-page-title">Complaints Management</h1>
          <p className="op-page-subtitle">
            View, track and resolve citizen grievances efficiently.
          </p>
        </div>

        {/* Delicate Architectural Banner & Today Card */}
        <KarnatakaArchitecturalBanner />
        <TodayDateCard />
      </div>

      {/* 4 Summary Cards matching Screenshot 5 */}
      <div className="op-stats-grid">
        <StatCard
          title="Total Complaints"
          value={stats.total}
          subtitle="All complaints"
          icon={FileText}
          accentColor="#008F83"
          iconBg="#D5F1EC"
          iconColor="#006B63"
          onClick={() => setStatusFilter("all")}
        />

        <StatCard
          title="Pending"
          value={stats.pending}
          subtitle="Needs attention"
          icon={Clock}
          accentColor="#F59E0B"
          iconBg="#FEF3C7"
          iconColor="#D97706"
          onClick={() => setStatusFilter("pending")}
        />

        <StatCard
          title="In Progress"
          value={stats.inProgress}
          subtitle="Under review"
          icon={RefreshCw}
          accentColor="#0EA5E9"
          iconBg="#E0F2FE"
          iconColor="#0284C7"
          onClick={() => setStatusFilter("in-progress")}
        />

        <StatCard
          title="Resolved"
          value={stats.resolved}
          subtitle="Successfully resolved"
          icon={Check}
          accentColor="#10B981"
          iconBg="#D1FAE5"
          iconColor="#059669"
          onClick={() => setStatusFilter("resolved")}
        />
      </div>

      {/* Search and Filters Bar */}
      <div className="op-filter-card">
        <div className="op-search-input-wrap">
          <Search size={16} />
          <input
            type="text"
            className="op-search-input"
            placeholder="Search Complaint ID, Citizen Name, Category, Location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Select */}
        <select
          className="op-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="Water Leakage">Water Leakage</option>
          <option value="Electricity Problem">Electricity Problem</option>
          <option value="Pothole">Pothole</option>
          <option value="Road Damage">Road Damage</option>
          <option value="Garbage">Garbage</option>
          <option value="Street Light">Street Light</option>
        </select>

        {/* Status Select */}
        <select
          className="op-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        {/* Priority Select */}
        <select
          className="op-select"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="all">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        {/* Action Buttons */}
        <button
          type="button"
          className="op-btn-primary"
          onClick={() => {}}
        >
          <Search size={15} />
          <span>Search</span>
        </button>

        <button
          type="button"
          className="op-btn-secondary"
          onClick={handleClearFilters}
        >
          <FilterX size={15} />
          <span>Clear Filters</span>
        </button>
      </div>

      {/* Complaints Table matching Screenshot 5 */}
      <div className="op-table-container">
        <div className="op-table-responsive">
          <table className="op-table">
            <thead>
              <tr>
                <th style={{ width: "40px" }}>#</th>
                <th>Complaint ID</th>
                <th>Citizen</th>
                <th>Category</th>
                <th>Location / Address</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date Submitted</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "40px", color: "var(--op-muted)" }}>
                    No complaints found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((item, idx) => (
                  <tr key={item._id || idx}>
                    <td style={{ color: "var(--op-muted)", fontWeight: 600 }}>{idx + 1}</td>

                    <td className="op-id-cell">{item._id}</td>

                    <td>
                      <div className="op-citizen-cell">
                        <span className="op-citizen-name">
                          {item.citizen?.fullName || "Suresh Kumar"}
                        </span>
                        <span className="op-citizen-phone">
                          {item.citizen?.phoneNumber || "+91 98765 43210"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <CategoryBadge category={item.complaintCategory} />
                    </td>

                    <td>
                      <div className="op-location-cell">
                        <MapPin size={14} color="#008F83" style={{ flexShrink: 0, marginTop: "2px" }} />
                        <span>{item.address}</span>
                      </div>
                    </td>

                    <td>
                      <PriorityBadge priority={item.priority} />
                    </td>

                    <td>
                      <StatusBadge status={item.status} />
                    </td>

                    <td style={{ color: "var(--op-navy-light)", whiteSpace: "nowrap" }}>
                      {item.formattedDate || "24 Oct 2026 10:30 AM"}
                    </td>

                    <td>
                      <div className="op-action-cell" style={{ justifyContent: "center" }}>
                        <button
                          type="button"
                          className="op-table-btn-view"
                          onClick={() => navigate(`/officer/complaint/${item._id}`)}
                        >
                          <Eye size={13} strokeWidth={2.4} />
                          <span>View</span>
                        </button>

                        <div style={{ position: "relative" }}>
                          <button
                            type="button"
                            className="op-table-btn-more"
                            onClick={() =>
                              setActiveMenuId(activeMenuId === item._id ? null : item._id)
                            }
                            aria-label="Row options"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {activeMenuId === item._id && (
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
                                minWidth: "140px",
                                padding: "6px"
                              }}
                            >
                              <button
                                onClick={() => navigate(`/officer/complaint/${item._id}`)}
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
                                onMouseEnter={(e) => e.currentTarget.style.background = "#EAF9F6"}
                                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => {
                                  navigator.clipboard?.writeText(item._id);
                                  alert(`Copied Complaint ID: ${item._id}`);
                                  setActiveMenuId(null);
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
                                onMouseEnter={(e) => e.currentTarget.style.background = "#EAF9F6"}
                                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                              >
                                Copy ID
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar matching Screenshot 5 */}
        <div className="op-pagination-bar">
          <span>
            Showing 1 to {filteredComplaints.length} of {filteredComplaints.length} complaints
          </span>

          <div className="op-pagination-actions">
            <button type="button" className="op-page-btn" disabled>
              Previous
            </button>
            <button type="button" className="op-page-btn active">
              1
            </button>
            <button type="button" className="op-page-btn" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </OfficerLayout>
  );
}