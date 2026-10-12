import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
          setManualDescription(`[AI Auto-Generated] Detected ${mappedCat} with ${calculatedConf}% confidence requiring inspection.`);
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
        setManualDescription(`[AI Auto-Generated] Detected ${aiInfo.category} with ${aiInfo.confidence}% confidence requiring inspection.`);
      } else {
        setManualDescription("Civic grievance reported for municipal inspection.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (!image) {
      setError("Please upload an image of the grievance.");
      setSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You must be logged in to submit a complaint.");
      }

      // Construct multipart form data
      const formData = new FormData();
      formData.append("image", image);
      formData.append("complaintCategory", complaintCategory);
      formData.append("manualDescription", manualDescription || "Reported grievance");
      formData.append("latitude", latitude || "12.9716");
      formData.append("longitude", longitude || "77.5946");
      formData.append("address", address || "Bengaluru");
      formData.append("priority", priority);

      await axios.post("http://localhost:5000/api/complaints", formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      navigate("/my-complaints");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || err.message || "Failed to submit complaint. Please check your inputs."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "30px",
        background: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#2563eb", marginBottom: "30px" }}>
        Submit New Complaint
      </h1>

      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: "red", fontWeight: "bold", marginBottom: "15px" }}>{error}</p>}

        <label><b>Upload Complaint Image</b></label>
        <br />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginTop: "10px", marginBottom: "20px" }}
          required
        />

        {imagePreview && (
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{ maxWidth: "100%", maxHeight: "250px", borderRadius: "8px", objectFit: "contain" }} 
            />
          </div>
        )}

        {aiAnalyzing && (
          <div style={{ padding: "12px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "6px", color: "#1d4ed8", marginBottom: "15px", fontWeight: "500" }}>
            🤖 AI Analyzing image in real-time...
          </div>
        )}

        {aiInfo && (
          <div style={{ padding: "12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "6px", color: "#15803d", marginBottom: "15px" }}>
            <span style={{ fontSize: "15px", fontWeight: "bold" }}>✨ AI Auto-Detected: {aiInfo.category}</span>
            <span style={{ marginLeft: "8px", background: "#dcfce7", padding: "2px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
              {aiInfo.confidence}% Confidence
            </span>
            <div style={{ marginTop: "4px", fontSize: "13px" }}>
              🏢 Auto-Assigned Department: <b>{aiInfo.department}</b> | Priority: <b>{aiInfo.priority}</b>
            </div>
          </div>
        )}

        <label><b>Complaint Category</b></label>
        <select
          value={complaintCategory}
          onChange={(e) => {
            const cat = e.target.value;
            setComplaintCategory(cat);
            if (cat === "Pothole") setDepartment("Road Department");
            else if (cat === "Electricity Problem") setDepartment("Electrical Department");
            else if (cat === "Water Leakage") setDepartment("Water Department");
          }}
          style={inputStyle}
          required
        >
          <option value="Pothole">Pothole</option>
          <option value="Electricity Problem">Electricity Problem</option>
          <option value="Water Leakage">Water Leakage</option>
        </select>

        {/* Auto Description vs Manual Description Radio Options */}
        <label><b>Problem Description</b></label>
        <div style={{ margin: "10px 0 15px 0", display: "flex", gap: "25px", alignItems: "center" }}>
          <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
            <input
              type="radio"
              name="descriptionType"
              value="auto"
              checked={descriptionType === "auto"}
              onChange={() => handleDescriptionTypeChange("auto")}
            />
            <b>Auto Description (AI-Assisted)</b>
          </label>

          <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
            <input
              type="radio"
              name="descriptionType"
              value="manual"
              checked={descriptionType === "manual"}
              onChange={() => handleDescriptionTypeChange("manual")}
            />
            <b>Manual Description</b>
          </label>
        </div>

        <textarea
          rows="4"
          placeholder={descriptionType === "auto" ? "AI will auto-generate problem description upon image selection..." : "Enter detailed description manually..."}
          value={manualDescription}
          onChange={(e) => setManualDescription(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
            fontFamily: "inherit"
          }}
          required
        />

        {/* Location Section with Auto-Detect Button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <label style={{ margin: 0 }}><b>Location Coordinates & Address</b></label>
          <button
            type="button"
            onClick={handleAutoLocation}
            disabled={detectingLocation}
            style={{
              background: detectingLocation ? "#9ca3af" : "#10b981",
              color: "white",
              border: "none",
              padding: "7px 14px",
              borderRadius: "6px",
              cursor: detectingLocation ? "not-allowed" : "pointer",
              fontSize: "13px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}
          >
            {detectingLocation ? "⏳ Fetching GPS..." : "📍 Auto-Detect My Location"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div>
            <label style={{ fontSize: "13px" }}>Latitude</label>
            <input
              type="text"
              placeholder="e.g. 12.9716"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label style={{ fontSize: "13px" }}>Longitude</label>
            <input
              type="text"
              placeholder="e.g. 77.5946"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
        </div>

        <label><b>Address / Landmark</b></label>
        <input
          type="text"
          placeholder="Current Address (or click Auto-Detect above)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={inputStyle}
          required
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div>
            <label><b>Assigned Department (Auto)</b></label>
            <input
              type="text"
              value={department}
              readOnly
              style={{
                ...inputStyle,
                background: "#f1f5f9",
                color: "#334155",
                fontWeight: "500"
              }}
            />
          </div>
          <div>
            <label><b>Priority (Auto)</b></label>
            <input
              type="text"
              value={priority}
              readOnly
              style={{
                ...inputStyle,
                background: "#f1f5f9",
                color: "#334155",
                fontWeight: "500"
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%",
            padding: "15px",
            backgroundColor: submitting ? "#93c5fd" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: submitting ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            marginTop: "15px"
          }}
        >
          {submitting ? "Analyzing & Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  marginBottom: "15px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
  fontSize: "14px"
};

export default SubmitComplaint;