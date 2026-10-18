import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiUploadCloud, 
  FiMapPin, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiCpu, 
  FiFileText, 
  FiNavigation, 
  FiImage, 
  FiTrash2, 
  FiArrowRight, 
  FiShield 
} from "react-icons/fi";
import axios from "axios";

function SubmitComplaint() {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [complaintCategory, setComplaintCategory] = useState("Pothole");
  const [descriptionType, setDescriptionType] = useState("auto"); // "auto" or "manual"
  const [manualDescription, setManualDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [address, setAddress] = useState("");
  const [department, setDepartment] = useState("Road Department");
  const [priority, setPriority] = useState("Medium");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiInfo, setAiInfo] = useState(null);
  const [detectingLocation, setDetectingLocation] = useState(false);

  // Auto-detect browser location
  const handleAutoLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        setLatitude(lat);
        setLongitude(lng);

        try {
          // Reverse geocode via OpenStreetMap Nominatim
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const data = await res.json();
          if (data && data.display_name) {
            setAddress(data.display_name);
          } else {
            setAddress(`Location (${lat}, ${lng})`);
          }
        } catch (e) {
          setAddress(`Coordinates: ${lat}, ${lng}`);
        } finally {
          setDetectingLocation(false);
        }
      },
      (err) => {
        setDetectingLocation(false);
        alert("Unable to retrieve location. Please grant location permissions or enter address manually.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setAiInfo(null);
    setAiAnalyzing(true);

    try {
      // Send image to AI Service directly for instant pre-selection preview
      const aiFormData = new FormData();
      aiFormData.append("image", file);

      const aiRes = await axios.post("http://localhost:8001/detect", aiFormData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const data = aiRes.data;
      if (data && data.class_name && data.class_name !== "Unknown") {
        const rawClass = data.class_name.trim().toLowerCase();
        let mappedCat = "Pothole";
        let mappedDept = "Road Department";

        if (rawClass.includes("pothole")) {
          mappedCat = "Pothole";
          mappedDept = "Road Department";
        } else if (rawClass.includes("electric")) {
          mappedCat = "Electricity Problem";
          mappedDept = "Electrical Department";
        } else if (rawClass.includes("water")) {
          mappedCat = "Water Leakage";
          mappedDept = "Water Department";
        }

        const calculatedConf = Math.round((data.confidence || 0.85) * 100);
        const calculatedPriority = calculatedConf > 75 ? "High" : calculatedConf > 40 ? "Medium" : "Low";

        setComplaintCategory(mappedCat);
        setDepartment(mappedDept);
        setPriority(calculatedPriority);

        if (descriptionType === "auto") {
          setManualDescription(`[AI Auto-Generated] Detected ${mappedCat} with ${calculatedConf}% confidence requiring municipal inspection.`);
        }

        setAiInfo({
          category: mappedCat,
          confidence: calculatedConf,
          department: mappedDept,
          priority: calculatedPriority
        });
      } else {
        if (descriptionType === "auto" && !manualDescription) {
          setManualDescription("Civic grievance reported for municipal inspection.");
        }
      }
    } catch (aiErr) {
      console.warn("Real-time AI preview note:", aiErr.message);
      if (descriptionType === "auto" && !manualDescription) {
        setManualDescription("Civic grievance reported for municipal inspection.");
      }
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleDescriptionTypeChange = (type) => {
    setDescriptionType(type);
    if (type === "auto") {
      if (aiInfo) {
        setManualDescription(`[AI Auto-Generated] Detected ${aiInfo.category} with ${aiInfo.confidence}% confidence requiring municipal inspection.`);
      } else {
        setManualDescription("Civic grievance reported for municipal inspection.");
      }
    }
  };

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setComplaintCategory(cat);
    if (cat === "Pothole") setDepartment("Road Department");
    else if (cat === "Electricity Problem") setDepartment("Electrical Department");
    else if (cat === "Water Leakage") setDepartment("Water Department");
  };

  const handleClearImage = () => {
    setImage(null);
    setImagePreview(null);
    setAiInfo(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (!image) {
      setError("Please upload a clear photograph of the civic defect.");
      setSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You must be logged in as a citizen to submit a complaint.");
      }

      // Construct multipart form data
      const formData = new FormData();
      formData.append("image", image);
      formData.append("complaintCategory", complaintCategory);
      formData.append("manualDescription", manualDescription || "Reported grievance");
      formData.append("latitude", latitude || "12.9716");
      formData.append("longitude", longitude || "77.5946");
      formData.append("address", address || "Bengaluru, Karnataka");
      formData.append("priority", priority);

      await axios.post("http://localhost:5000/api/complaints", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      navigate("/my-complaints");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || err.message || "Failed to submit grievance. Please verify all inputs."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="citizen-page">
      <div className="citizen-container-narrow">
        {/* Form Header */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <span className="spgms-badge badge-seen" style={{ marginBottom: "8px" }}>
            OFFICIAL CIVIC GRIEVANCE LODGEMENT
          </span>
          <h1 style={{ fontSize: "32px", fontWeight: "800", color: "var(--midnight-indigo)", margin: "4px 0" }}>
            Lodge a New Grievance
          </h1>
          <p style={{ color: "var(--muted-grey)", fontSize: "15px", margin: 0 }}>
            Provide photo evidence and incident coordinates for instant AI triaging and officer assignment
          </p>
        </div>

        {error && (
          <div className="spgms-alert spgms-alert-error" role="alert">
            <FiAlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* SECTION 1: Photographic Evidence & AI Analysis */}
          <div className="spgms-card" style={{ borderTop: "4px solid var(--midnight-indigo)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "var(--muted-lavender)",
                  color: "var(--midnight-indigo)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "14px"
                }}
              >
                1
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px" }}>Photographic Evidence</h3>
                <span style={{ fontSize: "12px", color: "var(--muted-grey)" }}>
                  Upload clear camera photo of the pothole, water leak, or defect
                </span>
              </div>
            </div>

            {!imagePreview ? (
              <label
                htmlFor="grievance-image-input"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px 20px",
                  border: "2px dashed var(--soft-border)",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "var(--soft-ivory)",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)"
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const event = { target: { files: e.dataTransfer.files } };
                    handleFileChange(event);
                  }
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    backgroundColor: "var(--muted-lavender)",
                    color: "var(--midnight-indigo)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "12px"
                  }}
                >
                  <FiUploadCloud size={28} />
                </div>
                <strong style={{ fontSize: "16px", color: "var(--midnight-indigo)", marginBottom: "4px" }}>
                  Click to select photo or drag & drop here
                </strong>
                <span style={{ fontSize: "13px", color: "var(--muted-grey)" }}>
                  Supports JPEG, PNG, WebP (Max 10MB)
                </span>
                <input
                  id="grievance-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  required
                />
              </label>
            ) : (
              <div>
                <div
                  style={{
                    position: "relative",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    border: "1px solid var(--soft-border)",
                    backgroundColor: "#000",
                    textAlign: "center"
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="Grievance preview"
                    style={{
                      maxHeight: "320px",
                      width: "100%",
                      objectFit: "contain",
                      display: "block"
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleClearImage}
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      backgroundColor: "rgba(180, 35, 53, 0.9)",
                      color: "white",
                      border: "none",
                      borderRadius: "var(--radius-sm)",
                      padding: "6px 12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <FiTrash2 size={14} /> Remove / Replace
                  </button>
                </div>
              </div>
            )}

            {/* AI Analysis In-Progress State */}
            {aiAnalyzing && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "14px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--muted-lavender)",
                  border: "1px solid rgba(25, 25, 112, 0.2)",
                  color: "var(--midnight-indigo)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "14px",
                  fontWeight: "600"
                }}
              >
                <FiCpu size={18} style={{ animation: "spin 2s linear infinite" }} />
                <span>AI Vision Microservice analyzing defect geometry and severity...</span>
              </div>
            )}

            {/* AI Detection Result Banner */}
            {aiInfo && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "16px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--success-bg)",
                  border: "1px solid rgba(35, 122, 87, 0.3)",
                  color: "var(--success-green)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FiCheckCircle size={18} />
                    <span style={{ fontSize: "15px", fontWeight: "700" }}>
                      AI Auto-Detection: {aiInfo.category}
                    </span>
                  </div>
                  <span
                    style={{
                      backgroundColor: "var(--success-green)",
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: "700",
                      padding: "3px 8px",
                      borderRadius: "var(--radius-full)"
                    }}
                  >
                    {aiInfo.confidence}% Confidence
                  </span>
                </div>
                <div style={{ marginTop: "8px", fontSize: "13px", color: "#1b5a3f", lineHeight: "1.4" }}>
                  Auto-routed to: <strong>{aiInfo.department}</strong> • Computed Severity: <strong>{aiInfo.priority} Priority</strong>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: Category & Description */}
          <div className="spgms-card" style={{ borderTop: "4px solid var(--warm-gold)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(212, 168, 90, 0.15)",
                  color: "var(--deep-indigo)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "14px"
                }}
              >
                2
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px" }}>Category & Description</h3>
                <span style={{ fontSize: "12px", color: "var(--muted-grey)" }}>
                  Specify the grievance nature and issue details
                </span>
              </div>
            </div>

            {/* Category Select */}
            <div className="spgms-form-group">
              <label className="spgms-label" htmlFor="grievance-category">
                Complaint Category
              </label>
              <select
                id="grievance-category"
                className="spgms-select"
                value={complaintCategory}
                onChange={handleCategoryChange}
                required
              >
                <option value="Pothole">Pothole (Road Infrastructure)</option>
                <option value="Electricity Problem">Electricity Problem (Bescom / Power Grid)</option>
                <option value="Water Leakage">Water Leakage (BWSSB / Municipal Pipeline)</option>
              </select>
            </div>

            {/* Description Mode Selector Tabs */}
            <div className="spgms-form-group">
              <label className="spgms-label">Description Mode</label>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom: "12px"
                }}
              >
                <button
                  type="button"
                  onClick={() => handleDescriptionTypeChange("auto")}
                  style={{
                    flex: 1,
                    padding: "9px 14px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    border: "1px solid",
                    borderColor: descriptionType === "auto" ? "var(--midnight-indigo)" : "var(--soft-border)",
                    backgroundColor: descriptionType === "auto" ? "var(--muted-lavender)" : "var(--soft-ivory)",
                    color: descriptionType === "auto" ? "var(--midnight-indigo)" : "var(--dark-charcoal)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <FiCpu size={15} /> 🤖 AI-Assisted Auto Description
                </button>

                <button
                  type="button"
                  onClick={() => handleDescriptionTypeChange("manual")}
                  style={{
                    flex: 1,
                    padding: "9px 14px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    border: "1px solid",
                    borderColor: descriptionType === "manual" ? "var(--midnight-indigo)" : "var(--soft-border)",
                    backgroundColor: descriptionType === "manual" ? "var(--muted-lavender)" : "var(--soft-ivory)",
                    color: descriptionType === "manual" ? "var(--midnight-indigo)" : "var(--dark-charcoal)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <FiFileText size={15} /> ✍️ Custom Manual Description
                </button>
              </div>

              <textarea
                rows="4"
                className="spgms-textarea"
                placeholder={
                  descriptionType === "auto"
                    ? "Select an image above to automatically generate a technical grievance summary..."
                    : "Enter detailed descriptions regarding the defect, traffic impact, or danger..."
                }
                value={manualDescription}
                onChange={(e) => setManualDescription(e.target.value)}
                required
              />
            </div>
          </div>

          {/* SECTION 3: Location & Geotagging */}
          <div className="spgms-card" style={{ borderTop: "4px solid var(--midnight-indigo)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "var(--muted-lavender)",
                    color: "var(--midnight-indigo)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    fontSize: "14px"
                  }}
                >
                  3
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px" }}>Incident Location</h3>
                  <span style={{ fontSize: "12px", color: "var(--muted-grey)" }}>
                    Pinpoint GPS coordinates and street address
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAutoLocation}
                disabled={detectingLocation}
                className="spgms-btn spgms-btn-secondary spgms-btn-sm"
                style={{
                  backgroundColor: "var(--muted-lavender)",
                  color: "var(--midnight-indigo)",
                  borderColor: "rgba(25, 25, 112, 0.25)"
                }}
              >
                <FiMapPin size={15} style={{ color: "var(--warm-gold)" }} />
                {detectingLocation ? "Detecting GPS..." : "Auto-Detect My GPS"}
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div className="spgms-form-group">
                <label className="spgms-label" htmlFor="geo-lat">Latitude</label>
                <input
                  id="geo-lat"
                  type="text"
                  className="spgms-input"
                  placeholder="e.g. 12.9716"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  required
                />
              </div>

              <div className="spgms-form-group">
                <label className="spgms-label" htmlFor="geo-lng">Longitude</label>
                <input
                  id="geo-lng"
                  type="text"
                  className="spgms-input"
                  placeholder="e.g. 77.5946"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="spgms-form-group" style={{ marginBottom: 0 }}>
              <label className="spgms-label" htmlFor="geo-address">Street Address / Landmark</label>
              <input
                id="geo-address"
                type="text"
                className="spgms-input"
                placeholder="e.g. 14th Main Rd, Indiranagar, Bengaluru, Karnataka"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <p className="spgms-helper">
                Click "Auto-Detect My GPS" above to automatically fill address and coordinates.
              </p>
            </div>
          </div>

          {/* SECTION 4: Department & Priority Preview */}
          <div
            className="spgms-card"
            style={{
              backgroundColor: "var(--muted-lavender)",
              border: "1px solid rgba(25, 25, 112, 0.15)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <FiShield size={16} style={{ color: "var(--midnight-indigo)" }} />
              <h4 style={{ margin: 0, fontSize: "15px", color: "var(--midnight-indigo)" }}>
                Automated Municipal Routing Summary
              </h4>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div>
                <span style={{ fontSize: "12px", color: "var(--muted-grey)", display: "block", marginBottom: "4px" }}>
                  Assigned Department:
                </span>
                <strong style={{ fontSize: "14px", color: "var(--dark-charcoal)" }}>{department}</strong>
              </div>
              <div>
                <span style={{ fontSize: "12px", color: "var(--muted-grey)", display: "block", marginBottom: "4px" }}>
                  Initial Priority Level:
                </span>
                <span
                  className={`spgms-badge ${
                    priority === "High"
                      ? "badge-priority-high"
                      : priority === "Medium"
                      ? "badge-priority-medium"
                      : "badge-priority-low"
                  }`}
                >
                  {priority} Priority
                </span>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={submitting}
            className="spgms-btn spgms-btn-primary spgms-btn-lg"
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "16px",
              boxShadow: "var(--shadow-md)"
            }}
          >
            {submitting ? "Analyzing & Lodging Grievance..." : "Submit Grievance to Department"}
            {!submitting && <FiArrowRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubmitComplaint;