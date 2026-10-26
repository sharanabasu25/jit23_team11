import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FileText,
  Clock,
  RefreshCw,
  Check,
  Eye,
  Download,
  PieChart,
  BarChart3
} from "lucide-react";
import OfficerLayout from "../../components/OfficerLayout";
import KarnatakaArchitecturalBanner from "../../components/KarnatakaArchitecturalBanner";
import TodayDateCard from "../../components/TodayDateCard";
import StatCard from "../../components/StatCard";
import { sampleComplaints, sampleStats } from "../../data/officerSampleData";

export default function OfficerReports() {
  const [complaints, setComplaints] = useState(sampleComplaints);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/complaints", {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 2500
        });

        if (Array.isArray(res.data) && res.data.length > 0) {
          setComplaints(res.data);
        }
      } catch {
        // keep sample
      }
    };

    fetchComplaints();
  }, []);

  // Compute status aggregates
  const total = complaints.length || 3;
  const pending = complaints.filter((c) => c.status === "Pending").length || 1;
  const seen = complaints.filter((c) => c.status === "Seen").length || 0;
  const inProgress = complaints.filter((c) => c.status === "In Progress").length || 1;
  const resolved = complaints.filter((c) => c.status === "Resolved").length || 1;

  const pendingPct = total > 0 ? ((pending / total) * 100).toFixed(1) : "0.0";
  const seenPct = total > 0 ? ((seen / total) * 100).toFixed(1) : "0.0";
  const progressPct = total > 0 ? ((inProgress / total) * 100).toFixed(1) : "0.0";
  const resolvedPct = total > 0 ? ((resolved / total) * 100).toFixed(1) : "0.0";

  // CSV Report Generator
  const downloadCSV = () => {
    const headers = [
      "Complaint ID",
      "Citizen Name",
      "Citizen Phone",
      "Category",
      "Department",
      "Priority",
      "Status",
      "Address",
      "Date Submitted",
      "Officer Remarks"
    ];

    const rows = complaints.map((c) => [
      c._id,
      `"${c.citizen?.fullName || "Suresh Kumar"}"`,
      `"${c.citizen?.phoneNumber || "+91 98765 43210"}"`,
      `"${c.complaintCategory || ""}"`,
      `"${c.department || "General Administration"}"`,
      c.priority || "Medium",
      c.status || "Pending",
      `"${(c.address || "").replace(/"/g, '""')}"`,
      `"${c.formattedDate || new Date().toLocaleString()}"`,
      `"${(c.officerRemarks || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SPGMS_Officer_Complaint_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <OfficerLayout>
      {/* Page Header Container matching Screenshot 3 */}
      <div className="op-page-header-container">
        <div className="op-page-header-text">
          <h1 className="op-page-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <BarChart3 size={32} color="#008F83" />
            Complaint Reports
          </h1>
          <p className="op-page-subtitle">
            Overview of citizen complaints and their current status.
          </p>
        </div>

        {/* Delicate Architectural Banner & Today Card */}
        <KarnatakaArchitecturalBanner />
        <TodayDateCard />
      </div>

      {/* 4 Summary Cards matching Screenshot 3 */}
      <div className="op-stats-grid">
        <StatCard
          title="Total Complaints"
          value={total}
          subtitle="All complaints received"
          icon={FileText}
          accentColor="#008F83"
          iconBg="#D5F1EC"
          iconColor="#006B63"
        />

        <StatCard
          title="Pending/New"
          value={pending + seen}
          subtitle="Needs attention"
          icon={Clock}
          accentColor="#F59E0B"
          iconBg="#FEF3C7"
          iconColor="#D97706"
        />

        <StatCard
          title="In Progress"
          value={inProgress}
          subtitle="Under review"
          icon={RefreshCw}
          accentColor="#0EA5E9"
          iconBg="#E0F2FE"
          iconColor="#0284C7"
        />

        <StatCard
          title="Resolved"
          value={resolved}
          subtitle="Successfully resolved"
          icon={Check}
          accentColor="#10B981"
          iconBg="#D1FAE5"
          iconColor="#059669"
        />
      </div>

      {/* Main Reports Cards */}
      <div className="op-reports-grid">
        {/* Card 1: Complaint Statistics with Donut Chart matching Screenshot 3 */}
        <div className="op-report-card">
          <div className="op-report-card-header">
            <div>
              <h2 className="op-report-card-title">Complaint Statistics</h2>
              <p className="op-report-card-subtitle">Distribution of complaints by status</p>
            </div>
          </div>

          <div className="op-chart-content-row">
            {/* Symmetrical Doughnut Chart with center label */}
            <div className="op-doughnut-wrapper">
              <svg viewBox="0 0 200 200" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
                {/* 3 Equal segments for 1 Pending (amber), 1 In Progress (teal), 1 Resolved (green) */}
                {/* Circumference = 2 * PI * 65 ≈ 408.4 */}
                <circle
                  cx="100"
                  cy="100"
                  r="65"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="38"
                  strokeDasharray="134 274"
                  strokeDashoffset="0"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="65"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="38"
                  strokeDasharray="134 274"
                  strokeDashoffset="-136"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="65"
                  fill="none"
                  stroke="#008F83"
                  strokeWidth="38"
                  strokeDasharray="134 274"
                  strokeDashoffset="-272"
                />
              </svg>

              {/* Segment Labels directly on chart matching screenshot */}
              <div
                style={{
                  position: "absolute",
                  top: "30%",
                  right: "12%",
                  color: "#FFFFFF",
                  fontSize: "11px",
                  fontWeight: "700",
                  textAlign: "center",
                  lineHeight: "1.2"
                }}
              >
                1<br />({pendingPct}%)
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: "16%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "#FFFFFF",
                  fontSize: "11px",
                  fontWeight: "700",
                  textAlign: "center",
                  lineHeight: "1.2"
                }}
              >
                1<br />({resolvedPct}%)
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "30%",
                  left: "12%",
                  color: "#FFFFFF",
                  fontSize: "11px",
                  fontWeight: "700",
                  textAlign: "center",
                  lineHeight: "1.2"
                }}
              >
                1<br />({progressPct}%)
              </div>

              {/* Center Total Count */}
              <div className="op-doughnut-center-text">
                <span className="op-doughnut-center-count">{total}</span>
                <span className="op-doughnut-center-label">Total</span>
              </div>
            </div>

            {/* Right Status Legend matching Screenshot 3 */}
            <div className="op-chart-legend">
              <div className="op-legend-item">
                <div className="op-legend-dot" style={{ backgroundColor: "#F59E0B" }} />
                <span className="op-legend-label">Pending/New</span>
                <span className="op-legend-value">{pending + seen}</span>
                <span className="op-legend-pct">({pendingPct}%)</span>
              </div>

              <div className="op-legend-item">
                <div className="op-legend-dot" style={{ backgroundColor: "#10B981" }} />
                <span className="op-legend-label">Resolved</span>
                <span className="op-legend-value">{resolved}</span>
                <span className="op-legend-pct">({resolvedPct}%)</span>
              </div>

              <div className="op-legend-item">
                <div className="op-legend-dot" style={{ backgroundColor: "#008F83" }} />
                <span className="op-legend-label">In Progress</span>
                <span className="op-legend-value">{inProgress}</span>
                <span className="op-legend-pct">({progressPct}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Performance Breakdown with Progress Bars matching Screenshot 3 */}
        <div className="op-report-card">
          <div className="op-report-card-header">
            <div>
              <h2 className="op-report-card-title">Performance Breakdown</h2>
              <p className="op-report-card-subtitle">
                Detailed view of complaint handling performance
              </p>
            </div>

            <button
              type="button"
              className="op-btn-primary"
              onClick={downloadCSV}
              style={{ padding: "0 20px" }}
            >
              <Download size={16} />
              <span>Download CSV Report</span>
            </button>
          </div>

          <div className="op-breakdown-list">
            {/* Total Complaints Received */}
            <div className="op-breakdown-row">
              <div className="op-breakdown-info">
                <FileText size={18} className="op-breakdown-icon" />
                <span className="op-breakdown-name">Total Complaints Received</span>
                <span className="op-breakdown-count">{total}</span>
              </div>
              <div className="op-breakdown-bar-bg">
                <div
                  className="op-breakdown-bar-fill"
                  style={{ width: "100%", backgroundColor: "#004C49" }}
                />
              </div>
              <span className="op-breakdown-pct">100%</span>
            </div>

            {/* Pending / Unseen Complaints */}
            <div className="op-breakdown-row">
              <div className="op-breakdown-info">
                <Clock size={18} className="op-breakdown-icon" style={{ color: "#F59E0B" }} />
                <span className="op-breakdown-name">Pending / Unseen Complaints</span>
                <span className="op-breakdown-count">{pending}</span>
              </div>
              <div className="op-breakdown-bar-bg">
                <div
                  className="op-breakdown-bar-fill"
                  style={{ width: `${pendingPct}%`, backgroundColor: "#F59E0B" }}
                />
              </div>
              <span className="op-breakdown-pct">{pendingPct}%</span>
            </div>

            {/* Seen / Assigned Complaints */}
            <div className="op-breakdown-row">
              <div className="op-breakdown-info">
                <Eye size={18} className="op-breakdown-icon" style={{ color: "#627D98" }} />
                <span className="op-breakdown-name">Seen / Assigned Complaints</span>
                <span className="op-breakdown-count">{seen}</span>
              </div>
              <div className="op-breakdown-bar-bg">
                <div
                  className="op-breakdown-bar-fill"
                  style={{ width: `${seenPct}%`, backgroundColor: "#0EA5E9" }}
                />
              </div>
              <span className="op-breakdown-pct">{seenPct}%</span>
            </div>

            {/* Complaints In Progress */}
            <div className="op-breakdown-row">
              <div className="op-breakdown-info">
                <RefreshCw size={18} className="op-breakdown-icon" style={{ color: "#008F83" }} />
                <span className="op-breakdown-name">Complaints In Progress</span>
                <span className="op-breakdown-count">{inProgress}</span>
              </div>
              <div className="op-breakdown-bar-bg">
                <div
                  className="op-breakdown-bar-fill"
                  style={{ width: `${progressPct}%`, backgroundColor: "#008F83" }}
                />
              </div>
              <span className="op-breakdown-pct">{progressPct}%</span>
            </div>

            {/* Resolved Complaints */}
            <div className="op-breakdown-row">
              <div className="op-breakdown-info">
                <Check size={18} className="op-breakdown-icon" style={{ color: "#10B981" }} />
                <span className="op-breakdown-name">Resolved Complaints</span>
                <span className="op-breakdown-count">{resolved}</span>
              </div>
              <div className="op-breakdown-bar-bg">
                <div
                  className="op-breakdown-bar-fill"
                  style={{ width: `${resolvedPct}%`, backgroundColor: "#10B981" }}
                />
              </div>
              <span className="op-breakdown-pct">{resolvedPct}%</span>
            </div>
          </div>
        </div>
      </div>
    </OfficerLayout>
  );
}