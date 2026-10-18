import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FiArrowLeft, 
  FiCopy, 
  FiCheck, 
  FiMapPin, 
  FiExternalLink, 
  FiCalendar, 
  FiUser, 
  FiShield, 
  FiCpu, 
  FiMessageSquare, 
  FiStar, 
  FiCamera, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiClock, 
  FiMaximize2, 
  FiX 
} from "react-icons/fi";
import axios from "axios";

function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Citizen Feedback State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please sign in as a citizen to inspect grievance details.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/complaints/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setComplaint(response.data);
      } catch (err) {
        console.error(err);
        setError("Grievance reference record could not be found or has restricted access.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleCopyId = () => {
    if (complaint?._id) {
      navigator.clipboard.writeText(complaint._id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
  };

  if (loading) {
    return (
      <div className="citizen-page" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="spgms-card" style={{ padding: "40px", textAlign: "center" }}>
          <div style={{ fontSize: "36px", marginBottom: "15px" }}>⏳</div>
          <h3 style={{ margin: 0, color: "var(--midnight-indigo)" }}>Retrieving grievance record...</h3>
          <p style={{ color: "var(--muted-grey)", fontSize: "14px", marginTop: "6px" }}>
            Fetching audit trail and resolution images
          </p>
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="citizen-page" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="spgms-card" style={{ maxWidth: "460px", textAlign: "center", padding: "40px 28px" }}>
          <FiAlertCircle size={44} style={{ color: "var(--error-red)", marginBottom: "14px" }} />
          <h2 style={{ fontSize: "22px", color: "var(--midnight-indigo)", margin: "0 0 10px" }}>
            Record Unavailable
          </h2>
          <p style={{ color: "var(--muted-grey)", fontSize: "14px", marginBottom: "25px" }}>
            {error || "Unable to retrieve details for the specified grievance ID."}
          </p>
          <button onClick={() => navigate("/my-complaints")} className="spgms-btn spgms-btn-primary" style={{ width: "100%" }}>
            Return to My Grievances
          </button>
        </div>
      </div>
    );
  }

  // Calculate current stage for the timeline stepper
  // 1: Submitted, 2: Seen/Assigned, 3: In Progress, 4: Resolved
  let currentStep = 1;
  if (complaint.status === "Seen") currentStep = 2;
  else if (complaint.status === "In Progress") currentStep = 3;
  else if (complaint.status === "Resolved") currentStep = 4;
  else if (complaint.assignedOfficer) currentStep = 2;

  const isResolved = complaint.status === "Resolved";
  const shortId = complaint._id.substring(18).toUpperCase();

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

  return (
    <div className="citizen-page">
      <div className="citizen-container">
        {/* Navigation & Case Header */}
        <div style={{ marginBottom: "24px" }}>
          <button
            onClick={() => navigate("/my-complaints")}
            className="spgms-btn spgms-btn-secondary spgms-btn-sm"
            style={{ marginBottom: "16px" }}
          >
            <FiArrowLeft size={15} /> Back to My Grievances
          </button>

          <div
            className="spgms-card"
            style={{
              padding: "24px 28px",
              borderTop: "4px solid var(--midnight-indigo)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px"
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
                <span className="spgms-badge badge-seen">OFFICIAL CASE FILE</span>
                {getStatusBadge(complaint.status)}
                <span
                  className={`spgms-badge ${
                    complaint.priority === "High"
                      ? "badge-priority-high"
                      : complaint.priority === "Medium"
                      ? "badge-priority-medium"
                      : "badge-priority-low"
                  }`}
                >
                  {complaint.priority} Priority
                </span>
              </div>

              <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--midnight-indigo)", margin: "4px 0" }}>
                Grievance #{shortId} — {complaint.complaintCategory}
              </h1>

              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", fontSize: "13px", color: "var(--muted-grey)", marginTop: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <FiCalendar size={14} />
                  <span>Logged: {new Date(complaint.createdAt).toLocaleString("en-IN")}</span>
                </div>
                <span>•</span>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <FiMapPin size={14} />
                  <span>{complaint.address || "Geotagged Location"}</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleCopyId}
                className="spgms-btn spgms-btn-secondary spgms-btn-sm"
                title="Copy reference ID for helpline inquiry"
              >
                {copied ? <FiCheck size={14} style={{ color: "var(--success-green)" }} /> : <FiCopy size={14} />}
                <span>{copied ? "ID Copied" : "Copy Case ID"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Milestone Stepper Timeline */}
        <div className="spgms-card" style={{ marginBottom: "26px", padding: "26px 28px" }}>
          <h3 style={{ fontSize: "17px", color: "var(--midnight-indigo)", margin: "0 0 10px" }}>
            Live Grievance Redressal Timeline
          </h3>

          <div className="spgms-timeline">
            {/* Step 1: Grievance Lodged */}
            <div className={`spgms-timeline-step ${currentStep >= 1 ? (currentStep > 1 ? "completed" : "active") : ""}`}>
              <div className="spgms-timeline-circle">
                {currentStep > 1 ? <FiCheck size={18} /> : "1"}
              </div>
              <div className="spgms-timeline-title">1. Lodged</div>
              <span style={{ fontSize: "11px", color: "var(--muted-grey)", marginTop: "2px" }}>
                AI Triaged
              </span>
            </div>

            {/* Step 2: Officer Assigned */}
            <div className={`spgms-timeline-step ${currentStep >= 2 ? (currentStep > 2 ? "completed" : "active") : ""}`}>
              <div className="spgms-timeline-circle">
                {currentStep > 2 ? <FiCheck size={18} /> : "2"}
              </div>
              <div className="spgms-timeline-title">2. Officer Assigned</div>
              <span style={{ fontSize: "11px", color: "var(--muted-grey)", marginTop: "2px" }}>
                Department Review
              </span>
            </div>

            {/* Step 3: In Progress */}
            <div className={`spgms-timeline-step ${currentStep >= 3 ? (currentStep > 3 ? "completed" : "active") : ""}`}>
              <div className="spgms-timeline-circle">
                {currentStep > 3 ? <FiCheck size={18} /> : "3"}
              </div>
              <div className="spgms-timeline-title">3. In Progress</div>
              <span style={{ fontSize: "11px", color: "var(--muted-grey)", marginTop: "2px" }}>
                Field Crew On Site
              </span>
            </div>

            {/* Step 4: Resolved */}
            <div className={`spgms-timeline-step ${currentStep >= 4 ? "completed" : ""}`}>
              <div className="spgms-timeline-circle">
                {currentStep >= 4 ? <FiCheck size={18} /> : "4"}
              </div>
              <div className="spgms-timeline-title">4. Resolved</div>
              <span style={{ fontSize: "11px", color: "var(--muted-grey)", marginTop: "2px" }}>
                Verified Proof
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Detail Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "24px",
            marginBottom: "26px",
            alignItems: "start"
          }}
          className="details-grid"
        >
          {/* Left Column: Descriptions & Geo Coordinates */}
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            {/* Case Details Card */}
            <div className="spgms-card">
              <h3 style={{ fontSize: "18px", margin: "0 0 16px", borderBottom: "1px solid var(--soft-border)", paddingBottom: "10px" }}>
                Incident Particulars
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "14px" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "var(--muted-grey)", display: "block" }}>Full Ref ID:</span>
                  <strong style={{ fontFamily: "monospace", color: "var(--midnight-indigo)" }}>{complaint._id}</strong>
                </div>

                <div>
                  <span style={{ fontSize: "12px", color: "var(--muted-grey)", display: "block" }}>Department:</span>
                  <strong>{complaint.department}</strong>
                </div>

                <div>
                  <span style={{ fontSize: "12px", color: "var(--muted-grey)", display: "block" }}>GPS Coordinates:</span>
                  <span>{complaint.latitude}, {complaint.longitude}</span>
                </div>

                <div>
                  <span style={{ fontSize: "12px", color: "var(--muted-grey)", display: "block" }}>Location Map:</span>
                  <a
                    href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      color: "var(--midnight-indigo)",
                      fontWeight: "600",
                      textDecoration: "underline",
                      fontSize: "13px"
                    }}
                  >
                    Open in Maps <FiExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div style={{ marginTop: "18px", paddingTop: "14px", borderTop: "1px solid var(--soft-border)" }}>
                <span style={{ fontSize: "12px", color: "var(--muted-grey)", display: "block", marginBottom: "4px" }}>
                  Verified Street Address / Landmark:
                </span>
                <p style={{ margin: 0, fontSize: "14px", color: "var(--dark-charcoal)", fontWeight: "500" }}>
                  {complaint.address || "Location coordinates pinned by citizen device"}
                </p>
              </div>
            </div>

            {/* Citizen Statement Card */}
            <div className="spgms-card">
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <FiMessageSquare size={16} style={{ color: "var(--midnight-indigo)" }} />
                <h3 style={{ margin: 0, fontSize: "17px" }}>Citizen Incident Statement</h3>
              </div>
              <div
                style={{
                  backgroundColor: "var(--vanilla-cream)",
                  padding: "16px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--soft-border)",
                  fontSize: "14px",
                  color: "var(--dark-charcoal)",
                  lineHeight: "1.6"
                }}
              >
                {complaint.manualDescription || "No manual text provided."}
              </div>
            </div>

            {/* AI Inference Description Card */}
            <div
              className="spgms-card"
              style={{
                backgroundColor: "var(--muted-lavender)",
                border: "1px solid rgba(25, 25, 112, 0.2)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <FiCpu size={16} style={{ color: "var(--midnight-indigo)" }} />
                <h3 style={{ margin: 0, fontSize: "16px", color: "var(--midnight-indigo)" }}>
                  AI Computer Vision Inference
                </h3>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "var(--dark-charcoal)",
                  fontStyle: "italic",
                  lineHeight: "1.6"
                }}
              >
                {complaint.aiGeneratedDescription ||
                  `Automated neural classification detected ${complaint.complaintCategory} defect requiring standard municipal intervention.`}
              </p>
            </div>
          </div>

          {/* Right Column: Officer Details & Remarks */}
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            {/* Assigned Officer Card */}
            <div className="spgms-card" style={{ borderTop: "4px solid var(--warm-gold)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <FiShield size={18} style={{ color: "var(--deep-indigo)" }} />
                <h3 style={{ margin: 0, fontSize: "17px" }}>Designated Municipal Officer</h3>
              </div>

              {complaint.assignedOfficer ? (
                <div style={{ fontSize: "14px", lineHeight: "1.7" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "var(--midnight-indigo)",
                        color: "var(--vanilla-cream)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "700"
                      }}
                    >
                      {complaint.assignedOfficer?.user?.fullName?.charAt(0) || "O"}
                    </div>
                    <div>
                      <strong style={{ fontSize: "15px", color: "var(--midnight-indigo)", display: "block" }}>
                        {complaint.assignedOfficer?.user?.fullName || "Assigned Officer"}
                      </strong>
                      <span style={{ fontSize: "12px", color: "var(--muted-grey)" }}>
                        {complaint.assignedOfficer?.designation || "Municipal Field Engineer"}
                      </span>
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid var(--soft-border)", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div>
                      <span style={{ color: "var(--muted-grey)" }}>Department: </span>
                      <strong>{complaint.assignedOfficer?.department || complaint.department}</strong>
                    </div>
                    <div>
                      <span style={{ color: "var(--muted-grey)" }}>Assigned Ward / Area: </span>
                      <strong>{complaint.assignedOfficer?.assignedArea || "Designated Municipal Zone"}</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: "20px 0", textAlign: "center", color: "var(--muted-grey)" }}>
                  <p style={{ margin: 0, fontStyle: "italic", fontSize: "14px" }}>
                    In queue for municipal engineer allocation. The ward supervisor will assign an inspection crew shortly.
                  </p>
                </div>
              )}
            </div>

            {/* Officer Remarks & Resolution Report */}
            <div className="spgms-card">
              <h3 style={{ fontSize: "17px", margin: "0 0 12px" }}>Official Officer Remarks</h3>
              <div
                style={{
                  backgroundColor: "var(--soft-ivory)",
                  border: "1px solid var(--soft-border)",
                  borderRadius: "var(--radius-md)",
                  padding: "14px",
                  fontSize: "14px",
                  color: complaint.officerRemarks ? "var(--dark-charcoal)" : "var(--muted-grey)",
                  fontStyle: complaint.officerRemarks ? "normal" : "italic",
                  lineHeight: "1.6",
                  minHeight: "75px"
                }}
              >
                {complaint.officerRemarks || "No inspection remarks logged yet by the handling officer."}
              </div>
            </div>
          </div>
        </div>

        {/* Visual Evidence Showcase: Before & After */}
        <div className="spgms-card" style={{ marginBottom: "26px" }}>
          <div className="spgms-card-header">
            <div>
              <h3 style={{ margin: 0, fontSize: "20px" }}>Photographic Audit Evidence</h3>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--muted-grey)" }}>
                Compare original citizen report with municipal resolution proof
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px"
            }}
            className="photo-grid"
          >
            {/* Citizen Complaint Image */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <strong style={{ fontSize: "14px", color: "var(--midnight-indigo)" }}>
                  1. Initial Defect Photo (Citizen)
                </strong>
                <span className="spgms-badge badge-seen">Before Fix</span>
              </div>

              <div
                onClick={() => complaint.complaintImageUrl && setLightboxImage(complaint.complaintImageUrl)}
                style={{
                  position: "relative",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  border: "1px solid var(--soft-border)",
                  backgroundColor: "#000",
                  height: "260px",
                  cursor: "pointer"
                }}
                title="Click to zoom image"
              >
                <img
                  src={complaint.complaintImageUrl}
                  alt="Citizen Grievance Evidence"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    backgroundColor: "rgba(16, 20, 58, 0.75)",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <FiMaximize2 size={12} /> Click to expand
                </div>
              </div>
            </div>

            {/* Officer Resolution Image */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <strong style={{ fontSize: "14px", color: isResolved ? "var(--success-green)" : "var(--muted-grey)" }}>
                  2. Official Resolution Proof (Officer)
                </strong>
                <span className={`spgms-badge ${isResolved ? "badge-resolved" : "badge-pending"}`}>
                  {isResolved ? "After Repair" : "Pending Fix"}
                </span>
              </div>

              {complaint.resolutionImage ? (
                <div
                  onClick={() => setLightboxImage(complaint.resolutionImage)}
                  style={{
                    position: "relative",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    border: "2px solid var(--success-green)",
                    backgroundColor: "#000",
                    height: "260px",
                    cursor: "pointer"
                  }}
                  title="Click to zoom image"
                >
                  <img
                    src={complaint.resolutionImage}
                    alt="Official Resolution Proof"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      backgroundColor: "rgba(35, 122, 87, 0.85)",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    <FiMaximize2 size={12} /> Click to expand
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    borderRadius: "var(--radius-md)",
                    border: "2px dashed var(--soft-border)",
                    backgroundColor: "var(--soft-ivory)",
                    height: "260px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                    textAlign: "center",
                    color: "var(--muted-grey)",
                    boxSizing: "border-box"
                  }}
                >
                  <FiClock size={36} style={{ marginBottom: "12px", color: "var(--warm-gold)" }} />
                  <strong style={{ fontSize: "15px", color: "var(--dark-charcoal)", marginBottom: "4px" }}>
                    Resolution Photo Not Yet Uploaded
                  </strong>
                  <span style={{ fontSize: "13px", maxWidth: "280px" }}>
                    Once the field engineer executes repairs, official proof will appear here.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Citizen Feedback & Rating Module */}
        <div
          className="spgms-card"
          style={{
            borderTop: "4px solid var(--warm-gold)",
            backgroundColor: "var(--soft-ivory)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <FiStar size={20} style={{ color: "var(--warm-gold)" }} />
            <h3 style={{ margin: 0, fontSize: "19px", color: "var(--midnight-indigo)" }}>
              Citizen Satisfaction Feedback & Rating
            </h3>
          </div>
          <p style={{ color: "var(--muted-grey)", fontSize: "13px", margin: "0 0 18px" }}>
            Rate the speed, workmanship quality, and professionalism of the municipal department.
          </p>

          {feedbackSubmitted ? (
            <div className="spgms-alert spgms-alert-success" style={{ margin: 0 }}>
              <FiCheckCircle size={20} style={{ flexShrink: 0 }} />
              <div>
                <strong>Thank you for your feedback!</strong> Your {rating}-star rating and comments have been recorded in the municipal audit dashboard.
              </div>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit}>
              {/* Star Rating Widget */}
              <div style={{ marginBottom: "16px" }}>
                <span className="spgms-label">Resolution Quality Rating</span>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "4px",
                        color: star <= (hoverRating || rating) ? "var(--warm-gold)" : "#d6d4e2",
                        transition: "transform 100ms ease",
                        display: "flex",
                        alignItems: "center"
                      }}
                      aria-label={`Rate ${star} stars`}
                    >
                      <FiStar size={28} fill={star <= (hoverRating || rating) ? "var(--warm-gold)" : "none"} />
                    </button>
                  ))}
                  <span style={{ marginLeft: "10px", fontSize: "14px", fontWeight: "600", color: "var(--midnight-indigo)" }}>
                    {rating === 5 ? "Exceptional" : rating === 4 ? "Good Service" : rating === 3 ? "Acceptable" : rating === 2 ? "Needs Improvement" : "Unsatisfactory"}
                  </span>
                </div>
              </div>

              {/* Feedback Comment */}
              <div className="spgms-form-group">
                <label className="spgms-label" htmlFor="feedback-comment">
                  Citizen Comments & Verification Notes
                </label>
                <textarea
                  id="feedback-comment"
                  rows="3"
                  className="spgms-textarea"
                  placeholder="Share details regarding whether the repair was fully completed, clean-up quality, or remarks for the department supervisor..."
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" className="spgms-btn spgms-btn-primary">
                  Submit Grievance Feedback
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Lightbox Modal for Full-size Image Inspection */}
      {lightboxImage && (
        <div
          className="spgms-modal-backdrop"
          onClick={() => setLightboxImage(null)}
          style={{ zIndex: 2000 }}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "90vh"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImage(null)}
              style={{
                position: "absolute",
                top: "-40px",
                right: "0",
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "white",
                borderRadius: "50%",
                padding: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center"
              }}
              aria-label="Close image viewer"
            >
              <FiX size={22} />
            </button>
            <img
              src={lightboxImage}
              alt="Full size preview"
              style={{
                maxWidth: "100%",
                maxHeight: "85vh",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-xl)"
              }}
            />
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .details-grid {
            grid-template-columns: 1fr !important;
          }
          .photo-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ComplaintDetails;