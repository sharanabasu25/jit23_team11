import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Phone,
  FileText,
  Upload,
  Check,
  Save,
  Sparkles,
  Building2,
  Clock
} from "lucide-react";
import OfficerLayout from "../../components/OfficerLayout";
import StatusBadge from "../../components/StatusBadge";
import PriorityBadge from "../../components/PriorityBadge";
import CategoryBadge from "../../components/CategoryBadge";
import { sampleComplaints } from "../../data/officerSampleData";

export default function OfficerComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Pending");
  const [remarks, setRemarks] = useState("");
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        // Try API first
        if (token) {
          try {
            const res = await axios.get(`http://localhost:5000/api/complaints/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
              timeout: 2500
            });
            if (res.data) {
              setComplaint(res.data);
              setStatus(res.data.status || "Pending");
              setRemarks(res.data.officerRemarks || "");
              setLoading(false);
              return;
            }
          } catch {
            // fallback to sample
          }
        }

        // Match in sampleComplaints
        const sampleMatch = sampleComplaints.find(
          (c) => c._id.toLowerCase() === (id || "").toLowerCase()
        ) || sampleComplaints[0];

        setComplaint(sampleMatch);
        setStatus(sampleMatch.status);
        setRemarks(sampleMatch.officerRemarks || "");
      } catch (err) {
        console.error(err);
        setError("Failed to fetch complaint details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      if (token && complaint && !token.startsWith("demo-")) {
        // Attempt backend save
        if (status === "Resolved" || image) {
          const formData = new FormData();
          if (image) formData.append("resolutionImage", image);
          formData.append("remarks", remarks);

          const res = await axios.patch(
            `http://localhost:5000/api/officers/complaints/${id}/resolve`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
              }
            }
          );
          setComplaint(res.data);
        } else {
          await axios.patch(
            `http://localhost:5000/api/officers/complaints/${id}/status`,
            { status },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (remarks) {
            await axios.patch(
              `http://localhost:5000/api/officers/complaints/${id}/remarks`,
              { remarks },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          }
        }
      }

      // Local state update
      setComplaint((prev) => ({
        ...prev,
        status,
        officerRemarks: remarks
      }));

      setSuccessMessage("Complaint action and status updated successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to update complaint.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <OfficerLayout>
        <div style={{ textAlign: "center", padding: "80px", color: "var(--op-navy)" }}>
          <h3>Loading Grievance Record...</h3>
        </div>
      </OfficerLayout>
    );
  }

  if (!complaint) {
    return (
      <OfficerLayout>
        <div style={{ textAlign: "center", padding: "60px", color: "var(--op-navy)" }}>
          <h2>Grievance Record Not Found</h2>
          <button
            onClick={() => navigate("/officer/complaints")}
            className="op-btn-primary"
            style={{ marginTop: "16px" }}
          >
            Back to Complaints
          </button>
        </div>
      </OfficerLayout>
    );
  }

  return (
    <OfficerLayout>
      {/* Breadcrumb & Navigation */}
      <div className="op-page-header-container">
        <div className="op-page-header-text">
          <nav className="op-breadcrumb" aria-label="Breadcrumb">
            <Link to="/officer/dashboard">Home</Link>
            <span className="op-breadcrumb-separator">&gt;</span>
            <Link to="/officer/complaints">Complaints</Link>
            <span className="op-breadcrumb-separator">&gt;</span>
            <span className="op-breadcrumb-current">{complaint._id}</span>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              type="button"
              onClick={() => navigate("/officer/complaints")}
              className="op-btn-secondary"
              style={{ height: "36px", padding: "0 14px" }}
            >
              <ArrowLeft size={15} />
              <span>Back</span>
            </button>

            <h1 className="op-page-title" style={{ fontSize: "26px" }}>
              Complaint ID: {complaint._id}
            </h1>

            <StatusBadge status={complaint.status} />
            <PriorityBadge priority={complaint.priority} />
          </div>
        </div>
      </div>

      {successMessage && (
        <div
          style={{
            backgroundColor: "#D1FAE5",
            color: "#065F46",
            padding: "12px 20px",
            borderRadius: "10px",
            marginBottom: "24px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <Check size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: "#FEE2E2",
            color: "#991B1B",
            padding: "12px 20px",
            borderRadius: "10px",
            marginBottom: "24px",
            fontWeight: "600"
          }}
        >
          {error}
        </div>
      )}

      {/* Main Grid: Info + Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px" }}>
        {/* Left Column: Complaint Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Card: Grievance Information */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #D8EEE9",
              borderRadius: "16px",
              padding: "26px 28px",
              boxShadow: "0 2px 10px rgba(0, 76, 73, 0.04)"
            }}
          >
            <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#102D45", margin: "0 0 16px" }}>
              Grievance Information
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                fontSize: "13.5px",
                borderBottom: "1px solid #E8F6F3",
                paddingBottom: "16px",
                marginBottom: "16px"
              }}
            >
              <div>
                <span style={{ color: "#627D98", display: "block", marginBottom: "3px" }}>
                  Citizen Name
                </span>
                <strong style={{ color: "#102D45" }}>
                  {complaint.citizen?.fullName || "Suresh Kumar"}
                </strong>
              </div>

              <div>
                <span style={{ color: "#627D98", display: "block", marginBottom: "3px" }}>
                  Citizen Phone
                </span>
                <strong style={{ color: "#102D45" }}>
                  {complaint.citizen?.phoneNumber || "+91 98765 43210"}
                </strong>
              </div>

              <div>
                <span style={{ color: "#627D98", display: "block", marginBottom: "3px" }}>
                  Category
                </span>
                <CategoryBadge category={complaint.complaintCategory} />
              </div>

              <div>
                <span style={{ color: "#627D98", display: "block", marginBottom: "3px" }}>
                  Department
                </span>
                <strong style={{ color: "#102D45" }}>
                  {complaint.department || "Public Works Department (PWD)"}
                </strong>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <span style={{ color: "#627D98", display: "block", marginBottom: "3px" }}>
                  Location / Address
                </span>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                  <MapPin size={15} color="#008F83" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <strong style={{ color: "#102D45", lineHeight: 1.4 }}>
                    {complaint.address}
                  </strong>
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: "16px" }}>
              <span style={{ color: "#627D98", fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                Citizen Description
              </span>
              <div
                style={{
                  background: "#F3FAF8",
                  border: "1px solid #D8EEE9",
                  borderRadius: "8px",
                  padding: "14px",
                  fontSize: "13.5px",
                  lineHeight: "1.5",
                  color: "#102D45"
                }}
              >
                {complaint.manualDescription || "No manual description provided by citizen."}
              </div>
            </div>

            {/* AI Analysis */}
            {complaint.aiGeneratedDescription && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                  <Sparkles size={14} color="#008F83" />
                  <span style={{ color: "#006B63", fontSize: "13px", fontWeight: "700" }}>
                    AI Computer Vision Inference
                  </span>
                </div>
                <div
                  style={{
                    background: "#EAF9F6",
                    border: "1px solid #CEEBE5",
                    borderRadius: "8px",
                    padding: "14px",
                    fontSize: "13.5px",
                    lineHeight: "1.5",
                    color: "#004C49"
                  }}
                >
                  {complaint.aiGeneratedDescription}
                </div>
              </div>
            )}
          </div>

          {/* Card: Images Comparison */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #D8EEE9",
              borderRadius: "16px",
              padding: "26px 28px",
              boxShadow: "0 2px 10px rgba(0, 76, 73, 0.04)"
            }}
          >
            <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#102D45", margin: "0 0 16px" }}>
              Photographic Evidence
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#627D98", display: "block", marginBottom: "8px" }}>
                  Reported Issue Photo
                </span>
                <img
                  src={complaint.complaintImageUrl || "/thumb-water.jpg"}
                  alt="Reported Grievance"
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    border: "1px solid #D8EEE9"
                  }}
                  onError={(e) => {
                    e.currentTarget.src = "/thumb-water.jpg";
                  }}
                />
              </div>

              <div>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#627D98", display: "block", marginBottom: "8px" }}>
                  Resolution Photo
                </span>
                {complaint.resolutionImage ? (
                  <img
                    src={complaint.resolutionImage}
                    alt="Resolution evidence"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      border: "1px solid #D8EEE9"
                    }}
                    onError={(e) => {
                      e.currentTarget.src = "/thumb-water.jpg";
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: "200px",
                      background: "#F3FAF8",
                      border: "1px dashed #B8E2D9",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#627D98",
                      fontSize: "13px",
                      textAlign: "center",
                      padding: "20px"
                    }}
                  >
                    No resolution image uploaded yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Officer Action Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #D8EEE9",
              borderRadius: "16px",
              padding: "26px 28px",
              boxShadow: "0 2px 10px rgba(0, 76, 73, 0.04)"
            }}
          >
            <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#102D45", margin: "0 0 18px" }}>
              Officer Action & Resolution
            </h2>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* Update Status */}
              <div>
                <label style={{ fontSize: "13.5px", fontWeight: "700", color: "#102D45", display: "block", marginBottom: "6px" }}>
                  Grievance Status
                </label>
                <select
                  className="op-select"
                  style={{ width: "100%" }}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Seen">Seen / Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              {/* Officer Remarks */}
              <div>
                <label style={{ fontSize: "13.5px", fontWeight: "700", color: "#102D45", display: "block", marginBottom: "6px" }}>
                  Officer Remarks / Action Taken
                </label>
                <textarea
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #D8EEE9",
                    background: "#F3FAF8",
                    fontSize: "13.5px",
                    color: "#102D45",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    resize: "vertical"
                  }}
                  placeholder="Enter official resolution notes or dispatch remarks..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>

              {/* Resolution Photo Upload */}
              <div>
                <label style={{ fontSize: "13.5px", fontWeight: "700", color: "#102D45", display: "block", marginBottom: "6px" }}>
                  Upload Resolution Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  style={{
                    width: "100%",
                    fontSize: "12.5px",
                    color: "#627D98"
                  }}
                />
                {image && (
                  <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#10B981", fontWeight: "600" }}>
                    Selected: {image.name}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="op-btn-primary"
                style={{ width: "100%", justifyContent: "center", marginTop: "10px" }}
              >
                <Save size={16} />
                <span>{saving ? "Saving Actions..." : "Save Grievance Actions"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </OfficerLayout>
  );
}