import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SubmitComplaint() {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [complaintCategory, setComplaintCategory] = useState("Pothole");
  const [manualDescription, setManualDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
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
      formData.append("manualDescription", manualDescription);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      formData.append("address", address);

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
              style={{ maxWidth: "100%", maxHeight: "250px", borderRadius: "8px" }} 
            />
          </div>
        )}

        <label><b>Complaint Category</b></label>
        <select
          value={complaintCategory}
          onChange={(e) => setComplaintCategory(e.target.value)}
          style={inputStyle}
          required
        >
          <option value="Pothole">Pothole</option>
          <option value="Electricity Problem">Electricity Problem</option>
          <option value="Water Leakage">Water Leakage</option>
        </select>

        <label><b>Problem Description</b></label>
        <textarea
          rows="4"
          placeholder="Describe the issue in detail..."
          value={manualDescription}
          onChange={(e) => setManualDescription(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            boxSizing: "border-box"
          }}
          required
        />

        <label><b>Latitude</b></label>
        <input
          type="text"
          placeholder="e.g. 12.9716"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          style={inputStyle}
          required
        />

        <label><b>Longitude</b></label>
        <input
          type="text"
          placeholder="e.g. 77.5946"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          style={inputStyle}
          required
        />

        <label><b>Address</b></label>
        <input
          type="text"
          placeholder="Enter current address where issue is located"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={inputStyle}
          required
        />

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
            marginTop: "10px"
          }}
        >
          {submitting ? "Analyzing with AI & Submitting..." : "Submit Complaint"}
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