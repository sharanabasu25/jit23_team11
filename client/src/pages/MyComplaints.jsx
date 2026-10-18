import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiSearch, 
  FiPlusCircle, 
  FiFilter, 
  FiArrowRight, 
  FiCopy, 
  FiCheck, 
  FiCalendar, 
  FiMapPin, 
  FiAlertCircle 
} from "react-icons/fi";
import axios from "axios";

function MyComplaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please sign in to view your filed grievances.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/api/complaints/history", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setComplaints(response.data || []);
      } catch (err) {
        console.error(err);
        setError("Unable to retrieve grievance history. Please check your network connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter complaints based on status tab and search text
  const filteredComplaints = complaints.filter((c) => {
    // Status filter
    if (filterStatus === "Pending" && c.status !== "Pending" && c.status !== "Seen") return false;
    if (filterStatus === "In Progress" && c.status !== "In Progress") return false;
    if (filterStatus === "Resolved" && c.status !== "Resolved") return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = c._id.toLowerCase().includes(q);
      const matchCat = (c.complaintCategory || "").toLowerCase().includes(q);
      const matchDept = (c.department || "").toLowerCase().includes(q);
      const matchAddr = (c.address || "").toLowerCase().includes(q);
      const matchDesc = (c.manualDescription || "").toLowerCase().includes(q);
      return matchId || matchCat || matchDept || matchAddr || matchDesc;
    }

    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <span className="spgms-badge badge-pending">Pending Review</span>;
      case "Seen":
        return <span className="spgms-badge badge-seen">Seen & Assigned</span>;
      case "In Progress":
        return <span className="spgms-badge badge-progress">In Progress</span>;
      case "Resolved":
        return <span className="spgms-badge badge-resolved">Resolved</span>;
      case "Rejected":
        return <span className="spgms-badge badge-rejected">Rejected</span>;
      default:
        return <span className="spgms-badge badge-pending">{status}</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High":
        return <span className="spgms-badge badge-priority-high">High Priority</span>;
      case "Medium":
        return <span className="spgms-badge badge-priority-medium">Medium</span>;
      default:
        return <span className="spgms-badge badge-priority-low">{priority || "Low"}</span>;
    }
  };

  if (loading) {
    return (
      <div className="citizen-page" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="spgms-card" style={{ padding: "40px", textAlign: "center" }}>
          <div style={{ fontSize: "36px", marginBottom: "15px" }}>⏳</div>
          <h3 style={{ margin: 0, color: "var(--midnight-indigo)" }}>Loading your grievances...</h3>
          <p style={{ color: "var(--muted-grey)", fontSize: "14px", marginTop: "6px" }}>
            Querying secure municipal database
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="citizen-page" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="spgms-card" style={{ maxWidth: "440px", textAlign: "center", padding: "40px" }}>
          <FiAlertCircle size={44} style={{ color: "var(--error-red)", marginBottom: "14px" }} />
          <h2 style={{ fontSize: "22px", color: "var(--midnight-indigo)", margin: "0 0 10px" }}>
            Session Required
          </h2>
          <p style={{ color: "var(--muted-grey)", fontSize: "14px", marginBottom: "25px" }}>
            {error}
          </p>
          <button onClick={() => navigate("/login")} className="spgms-btn spgms-btn-primary" style={{ width: "100%" }}>
            Go to Citizen Login
          </button>
        </div>
      </div>
    );
  }

  const counts = {
    all: complaints.length,
    pending: complaints.filter((c) => c.status === "Pending" || c.status === "Seen").length,
    inProgress: complaints.filter((c) => c.status === "In Progress").length,
    resolved: complaints.filter((c) => c.status === "Resolved").length
  };

  return (
    <div className="citizen-page">
      <div className="citizen-container">
        {/* Header Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "28px"
          }}
        >
          <div>
            <span className="spgms-badge badge-seen" style={{ marginBottom: "6px" }}>
              OFFICIAL GRIEVANCE DOSSIER
            </span>
            <h1 style={{ fontSize: "32px", fontWeight: "800", color: "var(--midnight-indigo)", margin: "4px 0" }}>
              My Grievance History
            </h1>
            <p style={{ color: "var(--muted-grey)", fontSize: "14px", margin: 0 }}>
              Track all civic complaints lodged under your citizen account
            </p>
          </div>

          <button
            onClick={() => navigate("/submit-complaint")}
            className="spgms-btn spgms-btn-primary"
          >
            <FiPlusCircle size={16} /> Lodge New Grievance
          </button>
        </div>

        {/* Filter and Search Controls */}
        <div
          className="spgms-card"
          style={{
            padding: "18px 24px",
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px"
          }}
        >
          {/* Status Tabs */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              onClick={() => setFilterStatus("All")}
              className={`spgms-btn spgms-btn-sm ${filterStatus === "All" ? "spgms-btn-primary" : "spgms-btn-secondary"}`}
            >
              All ({counts.all})
            </button>
            <button
              onClick={() => setFilterStatus("Pending")}
              className={`spgms-btn spgms-btn-sm ${filterStatus === "Pending" ? "spgms-btn-primary" : "spgms-btn-secondary"}`}
            >
              Pending ({counts.pending})
            </button>
            <button
              onClick={() => setFilterStatus("In Progress")}
              className={`spgms-btn spgms-btn-sm ${filterStatus === "In Progress" ? "spgms-btn-primary" : "spgms-btn-secondary"}`}
            >
              In Progress ({counts.inProgress})
            </button>
            <button
              onClick={() => setFilterStatus("Resolved")}
              className={`spgms-btn spgms-btn-sm ${filterStatus === "Resolved" ? "spgms-btn-primary" : "spgms-btn-secondary"}`}
            >
              Resolved ({counts.resolved})
            </button>
          </div>

          {/* Search Box */}
          <div style={{ position: "relative", minWidth: "260px" }}>
            <input
              type="text"
              className="spgms-input"
              style={{ paddingLeft: "36px", paddingRight: "14px", fontSize: "14px" }}
              placeholder="Search by ID, category, area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch
              size={15}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--muted-grey)"
              }}
            />
          </div>
        </div>

        {/* Complaints Table / List */}
        {filteredComplaints.length === 0 ? (
          <div className="spgms-card" style={{ textAlign: "center", padding: "50px 20px" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "var(--muted-lavender)",
                color: "var(--midnight-indigo)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                fontSize: "26px"
              }}
            >
              🔍
            </div>
            <h3 style={{ fontSize: "20px", color: "var(--midnight-indigo)", margin: "0 0 8px" }}>
              No Complaints Match Your Criteria
            </h3>
            <p style={{ color: "var(--muted-grey)", fontSize: "14px", maxWidth: "420px", margin: "0 auto 20px" }}>
              {complaints.length === 0
                ? "You haven't filed any civic grievances yet. Help improve our community by reporting issues."
                : "No grievances found matching the current filter and search parameters."}
            </p>
            {complaints.length === 0 ? (
              <button
                onClick={() => navigate("/submit-complaint")}
                className="spgms-btn spgms-btn-primary"
              >
                <FiPlusCircle size={16} /> Lodge First Grievance
              </button>
            ) : (
              <button
                onClick={() => {
                  setFilterStatus("All");
                  setSearchQuery("");
                }}
                className="spgms-btn spgms-btn-secondary"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="spgms-table-container">
            <table className="spgms-table">
              <thead>
                <tr>
                  <th>Ref ID</th>
                  <th>Category</th>
                  <th>Department</th>
                  <th>Priority</th>
                  <th>Filed Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((c) => {
                  const shortId = c._id.substring(18).toUpperCase();
                  return (
                    <tr key={c._id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontFamily: "monospace", fontWeight: "700", color: "var(--midnight-indigo)" }}>
                            #{shortId}
                          </span>
                          <button
                            onClick={() => handleCopyId(c._id)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "2px",
                              color: copiedId === c._id ? "var(--success-green)" : "var(--muted-grey)",
                              display: "flex",
                              alignItems: "center"
                            }}
                            title="Copy full reference ID"
                          >
                            {copiedId === c._id ? <FiCheck size={13} /> : <FiCopy size={13} />}
                          </button>
                        </div>
                      </td>

                      <td>
                        <strong style={{ color: "var(--dark-charcoal)" }}>{c.complaintCategory}</strong>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--muted-grey)",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            marginTop: "3px"
                          }}
                        >
                          <FiMapPin size={12} />
                          <span>{c.address ? (c.address.length > 30 ? `${c.address.substring(0, 30)}...` : c.address) : "Geotagged"}</span>
                        </div>
                      </td>

                      <td>{c.department}</td>
                      <td>{getPriorityBadge(c.priority)}</td>

                      <td style={{ fontSize: "13px", color: "var(--muted-grey)", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                          <FiCalendar size={13} />
                          <span>{new Date(c.createdAt).toLocaleDateString("en-IN")}</span>
                        </div>
                      </td>

                      <td>{getStatusBadge(c.status)}</td>

                      <td style={{ textAlign: "right" }}>
                        <button
                          onClick={() => navigate(`/complaint/${c._id}`)}
                          className="spgms-btn spgms-btn-primary spgms-btn-sm"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Track & View <FiArrowRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyComplaints;