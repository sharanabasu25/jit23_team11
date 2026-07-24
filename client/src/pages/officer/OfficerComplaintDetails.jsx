import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import OfficerSidebar from "../../components/OfficerSidebar";
import OfficerTopbar from "../../components/OfficerTopbar";

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

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized access. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/complaints/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        setComplaint(response.data);
        setStatus(response.data.status);
        setRemarks(response.data.officerRemarks || "");
      } catch (err) {
        console.error(err);
        setError("Failed to fetch complaint details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Session expired. Please log in again.");
      }

      // If status is set to Resolved or a file is uploaded, use the resolve endpoint
      if (status === "Resolved" || image) {
        if (!image && !complaint.resolutionImage) {
          throw new Error("A resolution image file is required to resolve this complaint.");
        }

        const formData = new FormData();
        if (image) {
          formData.append("resolutionImage", image);
        }
        formData.append("remarks", remarks);

        const response = await axios.patch(
          `http://localhost:5000/api/officers/complaints/${id}/resolve`,
          formData,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "multipart/form-data"
            }
          }
        );
        setComplaint(response.data);
        alert("Complaint successfully resolved!");
      } else {
        // Update status and remarks separately
        let updatedComplaint = null;

        if (status !== complaint.status) {
          const resStatus = await axios.patch(
            `http://localhost:5000/api/officers/complaints/${id}/status`,
            { status },
            { headers: { "Authorization": `Bearer ${token}` } }
          );
          updatedComplaint = resStatus.data;
        }

        if (remarks !== (complaint.officerRemarks || "")) {
          const resRemarks = await axios.patch(
            `http://localhost:5000/api/officers/complaints/${id}/remarks`,
            { remarks },
            { headers: { "Authorization": `Bearer ${token}` } }
          );
          updatedComplaint = resRemarks.data;
        }

        if (updatedComplaint) {
          setComplaint(updatedComplaint);
        }
        alert("Complaint actions saved successfully!");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to update complaint actions.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <h3>Loading complaint details...</h3>
      </div>
    );
  }

  if (error && !complaint) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
        <h3>Error Loading Record</h3>
        <p>{error}</p>
        <button onClick={() => navigate("/officer/complaints")} style={buttonStyle}>Back to complaints</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <OfficerSidebar />

      <div
        style={{
          flex: 1,
          background: "#f5f7fb",
          minHeight: "100vh",
        }}
      >
        <OfficerTopbar />

        <div style={{ padding: "30px" }}>
          <button onClick={() => navigate("/officer/complaints")} style={{ ...buttonStyle, background: "#475569", marginBottom: "20px" }}>
            ⬅ Back to Complaints list
          </button>

          <h1>Complaint Details</h1>

          {error && <p style={{ color: "red", fontWeight: "bold", margin: "15px 0" }}>{error}</p>}

          <div
            style={{
              marginTop: "25px",
              background: "white",
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <h2>Complaint Information</h2>

            <hr />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", lineHeight: "1.8", margin: "20px 0" }}>
              <p><strong>Complaint ID:</strong> <span style={{ fontFamily: "monospace" }}>{complaint._id.toUpperCase()}</span></p>
              <p><strong>Citizen Name:</strong> {complaint.citizen?.fullName || "Anonymous"}</p>
              <p><strong>Phone:</strong> {complaint.citizen?.phoneNumber || "N/A"}</p>
              <p><strong>Category:</strong> {complaint.complaintCategory}</p>
              <p><strong>Location/Address:</strong> {complaint.address}</p>
              <p><strong>Priority:</strong> {complaint.priority}</p>
              <p><strong>Department:</strong> {complaint.department}</p>
              <p><strong>Created Date:</strong> {new Date(complaint.createdAt).toLocaleString("en-IN")}</p>
            </div>

            <p><strong>Citizen Description</strong></p>
            <div
              style={{
                background: "#f8f8f8",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "25px",
              }}
            >
              {complaint.manualDescription}
            </div>

            {complaint.aiGeneratedDescription && (
              <>
                <p><strong>AI Inference Description</strong></p>
                <div
                  style={{
                    background: "#eff6ff",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "25px",
                    color: "#1e40af",
                    fontStyle: "italic"
                  }}
                >
                  {complaint.aiGeneratedDescription}
                </div>
              </>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "30px" }}>
              <div>
                <h3>Complaint Image</h3>
                <img 
                  src={complaint.complaintImageUrl} 
                  alt="Grievance" 
                  style={{ width: "100%", maxHeight: "250px", objectFit: "cover", borderRadius: "8px" }} 
                />
              </div>

              <div>
                <h3>Resolution Image</h3>
                {complaint.resolutionImage ? (
                  <img 
                    src={complaint.resolutionImage} 
                    alt="Resolution" 
                    style={{ width: "100%", maxHeight: "250px", objectFit: "cover", borderRadius: "8px" }} 
                  />
                ) : (
                  <div style={{ height: "200px", background: "#f1f5f9", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center", color: "#64748b", fontStyle: "italic" }}>
                    No resolution image uploaded.
                  </div>
                )}
              </div>
            </div>

            <h2>Officer Action</h2>

            <hr />

            <label>
              <strong>Update Status</strong>
            </label>
            <br />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                width: "250px",
                padding: "10px",
                marginTop: "10px",
                marginBottom: "25px",
                fontSize: "14px"
              }}
            >
              <option value="Pending">Pending</option>
              <option value="Seen">Seen</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <br />

            <label>
              <strong>Officer Remarks</strong>
            </label>
            <br />
            <textarea
              rows="5"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter officer remarks..."
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "10px",
                marginBottom: "25px",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box"
              }}
            />

            <label>
              <strong>Upload Resolution Image (Required to resolve)</strong>
            </label>
            <br />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              style={{
                marginTop: "10px",
                marginBottom: "25px",
              }}
            />

            {image && (
              <p style={{ color: "green", fontWeight: "bold" }}>
                Selected File: {image.name}
              </p>
            )}

            <br />
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                background: saving ? "#93c5fd" : "#2563eb",
                color: "white",
                border: "none",
                padding: "12px 25px",
                borderRadius: "6px",
                cursor: saving ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "bold"
              }}
            >
              {saving ? "Saving Actions..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const buttonStyle = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "8px 15px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "500",
};