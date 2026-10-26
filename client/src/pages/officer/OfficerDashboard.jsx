import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FileText,
  Clock,
  RefreshCw,
  Check,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  History,
  Eye,
  MapPin,
  Calendar
} from "lucide-react";
import OfficerLayout from "../../components/OfficerLayout";
import KarnatakaArchitecturalBanner from "../../components/KarnatakaArchitecturalBanner";
import TodayDateCard from "../../components/TodayDateCard";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";
import PriorityBadge from "../../components/PriorityBadge";
import CategoryBadge from "../../components/CategoryBadge";
import { sampleComplaints, sampleOfficer, sampleStats } from "../../data/officerSampleData";

export default function OfficerDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(sampleOfficer);
  const [complaints, setComplaints] = useState(sampleComplaints);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch officer and dashboard data
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser({ ...sampleOfficer, ...parsed });
      }
    } catch {
      // keep sample
    }

    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/officers/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 2500
        });

        if (res.data?.complaints && res.data.complaints.length > 0) {
          setComplaints(res.data.complaints);
        }
      } catch {
        // retain reference sample
      }
    };

    fetchDashboard();
  }, []);

  // Aggregates
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

  // Categories distribution
  const categoryCounts = useMemo(() => {
    const counts = {};
    complaints.forEach((c) => {
      const cat = c.complaintCategory || "Other";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [complaints]);

  const resolutionRate =
    stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 100;

  return (
    <OfficerLayout>
      {/* Welcome Banner matching Section 4 */}
      <div className="op-page-header-container">
        <div className="op-page-header-text">
          <div className="op-page-eyebrow">GOVERNMENT OFFICER PORTAL</div>
          <h1 className="op-page-title">
            Welcome back, {user.fullName || "Officer Ramesh Patil"}!
          </h1>
          <p className="op-page-subtitle">
            Manage public grievances efficiently and ensure timely resolution for a better Karnataka.
          </p>
        </div>

        {/* Delicate Architectural Banner & Today Card */}
        <KarnatakaArchitecturalBanner />
        <TodayDateCard />
      </div>

      {/* 4 Stat Cards */}
      <div className="op-stats-grid">
        <StatCard
          title="Total Complaints"
          value={stats.total}
          subtitle="All complaints received"
          icon={FileText}
          accentColor="#008F83"
          iconBg="#D5F1EC"
          iconColor="#006B63"
          onClick={() => navigate("/officer/complaints?status=all")}
        />

        <StatCard
          title="Pending"
          value={stats.pending}
          subtitle="Needs attention"
          icon={Clock}
          accentColor="#F59E0B"
          iconBg="#FEF3C7"
          iconColor="#D97706"
          onClick={() => navigate("/officer/complaints?status=pending")}
        />

        <StatCard
          title="In Progress"
          value={stats.inProgress}
          subtitle="Under review"
          icon={RefreshCw}
          accentColor="#0EA5E9"
          iconBg="#E0F2FE"
          iconColor="#0284C7"
          onClick={() => navigate("/officer/complaints?status=in-progress")}
        />

        <StatCard
          title="Resolved"
          value={stats.resolved}
          subtitle="Successfully resolved"
          icon={Check}
          accentColor="#10B981"
          iconBg="#D1FAE5"
          iconColor="#059669"
          onClick={() => navigate("/officer/complaints?status=resolved")}
        />
      </div>

      {/* Current Time & Officer Performance Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginBottom: "28px"
        }}
      >
        {/* Current Time Card */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #D8EEE9",
            borderRadius: "16px",
            padding: "26px 28px",
            boxShadow: "0 2px 10px rgba(0, 76, 73, 0.04)",
            display: "flex",
            alignItems: "center",
            gap: "24px"
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "#D5F1EC",
              color: "#006B63",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <Clock size={32} strokeWidth={2.2} />
          </div>

          <div>
            <span
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color: "#008F83",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}
            >
              Current Time & Duty Station
            </span>
            <div
              style={{
                fontSize: "30px",
                fontWeight: "800",
                color: "#102D45",
                margin: "4px 0 2px",
                fontFamily: "'JetBrains Mono', monospace"
              }}
            >
              {currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </div>
            <p style={{ margin: 0, fontSize: "13.5px", color: "#627D98" }}>
              {currentTime.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} • Karnataka Zone
            </p>
          </div>
        </div>

        {/* Officer Performance Card */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #D8EEE9",
            borderRadius: "16px",
            padding: "26px 28px",
            boxShadow: "0 2px 10px rgba(0, 76, 73, 0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Award size={18} color="#008F83" />
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#008F83",
                  textTransform: "uppercase",
                  letterSpacing: "1px"
                }}
              >
                Officer Performance
              </span>
            </div>

            <div
              style={{
                fontSize: "28px",
                fontWeight: "800",
                color: "#102D45",
                margin: "6px 0 2px"
              }}
            >
              {resolutionRate}% Resolution Rate
            </div>

            <p style={{ margin: 0, fontSize: "13px", color: "#627D98" }}>
              {stats.resolved} of {stats.total} cases resolved • Rating: ⭐⭐⭐⭐⭐ Excellent
            </p>
          </div>

          <Link
            to="/officer/reports"
            className="op-btn-secondary"
            style={{ padding: "0 16px", height: "38px" }}
          >
            <span>View Reports</span>
            <ChevronRight size={15} />
          </Link>
        </div>
      </div>

      {/* Complaint Categories Horizontal Progress Bars */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #D8EEE9",
          borderRadius: "16px",
          padding: "24px 28px",
          marginBottom: "28px",
          boxShadow: "0 2px 10px rgba(0, 76, 73, 0.04)"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "18px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Layers size={18} color="#008F83" />
            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#102D45" }}>
              Complaint Categories in Jurisdiction
            </h2>
          </div>

          <span style={{ fontSize: "12.5px", color: "#627D98", fontWeight: "600" }}>
            Total {stats.total} Active Grievances
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {Object.entries(categoryCounts).map(([cat, count]) => {
            const pct = Math.round((count / (stats.total || 1)) * 100);
            return (
              <div key={cat} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "220px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <CategoryBadge category={cat} />
                </div>
                <div
                  style={{
                    flex: 1,
                    height: "10px",
                    background: "#EAF9F6",
                    borderRadius: "5px",
                    overflow: "hidden"
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      backgroundColor: "#006B63",
                      borderRadius: "5px",
                      transition: "width 0.4s"
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#102D45",
                    width: "70px",
                    textAlign: "right"
                  }}
                >
                  {count} ({pct}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Complaints Table */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #D8EEE9",
          borderRadius: "16px",
          padding: "24px 28px",
          marginBottom: "28px",
          boxShadow: "0 2px 10px rgba(0, 76, 73, 0.04)"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px"
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#102D45" }}>
              Recent Complaints
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#627D98" }}>
              Recently reported grievances requiring officer supervision
            </p>
          </div>

          <Link
            to="/officer/complaints"
            className="op-btn-secondary"
            style={{ padding: "0 16px", height: "38px" }}
          >
            <span>View All</span>
            <ChevronRight size={15} />
          </Link>
        </div>

        <div className="op-table-responsive">
          <table className="op-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Citizen</th>
                <th>Category</th>
                <th>Location</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.slice(0, 5).map((c, idx) => (
                <tr key={c._id || idx}>
                  <td className="op-id-cell">{c._id}</td>
                  <td>
                    <div className="op-citizen-cell">
                      <span className="op-citizen-name">{c.citizen?.fullName || "Suresh Kumar"}</span>
                      <span className="op-citizen-phone">{c.citizen?.phoneNumber || "+91 98765 43210"}</span>
                    </div>
                  </td>
                  <td><CategoryBadge category={c.complaintCategory} /></td>
                  <td>
                    <div className="op-location-cell">
                      <MapPin size={13} color="#008F83" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span style={{ fontSize: "12px" }}>{c.address}</span>
                    </div>
                  </td>
                  <td><PriorityBadge priority={c.priority} /></td>
                  <td><StatusBadge status={c.status} /></td>
                  <td style={{ color: "#627D98", fontSize: "12.5px" }}>{c.formattedDate || "24 Oct 2026"}</td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      type="button"
                      className="op-table-btn-view"
                      onClick={() => navigate(`/officer/complaint/${c._id}`)}
                    >
                      <Eye size={13} />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activities Timeline */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #D8EEE9",
          borderRadius: "16px",
          padding: "24px 28px",
          boxShadow: "0 2px 10px rgba(0, 76, 73, 0.04)"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <History size={18} color="#008F83" />
            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#102D45" }}>
              Recent Activities & Logs
            </h2>
          </div>

          <Link
            to="/officer/notifications"
            className="op-btn-secondary"
            style={{ padding: "0 16px", height: "36px" }}
          >
            <span>View Notifications</span>
            <ChevronRight size={15} />
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            {
              text: "Complaint 3B138D marked as Resolved (Water Leakage, Koramangala)",
              time: "10 mins ago",
              color: "#10B981"
            },
            {
              text: "Status changed to In Progress for Complaint 3B138B (Pothole, Malleshwaram)",
              time: "45 mins ago",
              color: "#0EA5E9"
            },
            {
              text: "Complaint 3B138C assigned to Officer Ramesh Patil (Electricity Problem)",
              time: "2 hours ago",
              color: "#F59E0B"
            },
            {
              text: "Monthly SPGMS Jurisdiction Compliance Report exported to CSV",
              time: "Yesterday, 4:15 PM",
              color: "#006B63"
            }
          ].map((act, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: act.color,
                  marginTop: "6px",
                  flexShrink: 0
                }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#102D45" }}>
                  {act.text}
                </p>
                <span style={{ fontSize: "12px", color: "#627D98" }}>{act.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </OfficerLayout>
  );
}
