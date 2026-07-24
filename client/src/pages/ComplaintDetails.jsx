import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view complaint details.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/complaints/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        setComplaint(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch complaint details or record not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return <div style={{ textAlign: "center", padding: "50px" }}><h3>Loading complaint details...</h3></div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => navigate("/my-complaints")} style={btnStyle}>Back to List</button>
      </div>
    );
  }

  if (!complaint) return null;

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "30px",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <button onClick={() => navigate("/my-complaints")} style={{ ...btnStyle, marginBottom: "20px" }}>
        ⬅ Back to My Complaints
      </button>

      <h1 style={{ color: "#2563eb", marginBottom: "25px", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px" }}>
        Complaint Details
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", lineHeight: "1.8", marginBottom: "30px" }}>
        <p><strong>Complaint ID:</strong> <span style={{ fontFamily: "monospace" }}>{complaint._id.toUpperCase()}</span></p>
        <p><strong>Status:</strong> <span style={{
          padding: "4px 10px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "bold",
          color: "white",
          backgroundColor: 
            complaint.status === "Pending" ? "#f59e0b" : 
            complaint.status === "Seen" ? "#3b82f6" : 
            complaint.status === "In Progress" ? "#8b5cf6" : "#10b981"
        }}>{complaint.status}</span></p>
        <p><strong>Category:</strong> {complaint.complaintCategory}</p>
        <p><strong>Department:</strong> {complaint.department}</p>
        <p><strong>Priority:</strong> {complaint.priority}</p>
        <p><strong>Address:</strong> {complaint.address}</p>
        <p><strong>Coordinates:</strong> {complaint.latitude}, {complaint.longitude}</p>
        <p><strong>Submited On:</strong> {new Date(complaint.createdAt).toLocaleString("en-IN")}</p>
      </div>

      <div style={{ background: "#f8fafc", padding: "15px", borderRadius: "8px", marginBottom: "30px" }}>
        <p><strong>Citizen Description:</strong></p>
        <p style={{ margin: "5px 0 0 0", color: "#475569" }}>{complaint.manualDescription}</p>
      </div>

      <div style={{ background: "#eff6ff", padding: "15px", borderRadius: "8px", marginBottom: "30px", borderLeft: "4px solid #2563eb" }}>
        <p><strong>AI Inference Description:</strong></p>
        <p style={{ margin: "5px 0 0 0", color: "#1e40af", fontStyle: "italic" }}>{complaint.aiGeneratedDescription || "No AI feedback generated."}</p>
      </div>

      <hr style={{ border: "0", borderTop: "1px solid #e2e8f0", margin: "30px 0" }} />

      <h3 style={{ color: "#1e293b", marginBottom: "15px" }}>Officer Details</h3>
      {complaint.assignedOfficer ? (
        <div style={{ lineHeight: "1.8" }}>
          <p><strong>Officer Name:</strong> {complaint.assignedOfficer.user.fullName}</p>
          <p><strong>Designation:</strong> {complaint.assignedOfficer.designation}</p>
          <p><strong>Department:</strong> {complaint.assignedOfficer.department}</p>
          <p><strong>Zone/Area:</strong> {complaint.assignedOfficer.assignedArea}</p>
        </div>
      ) : (
        <p style={{ color: "#64748b", fontStyle: "italic" }}>No officer has been assigned to this complaint yet.</p>
      )}

      <hr style={{ border: "0", borderTop: "1px solid #e2e8f0", margin: "30px 0" }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        <div>
          <h3 style={{ color: "#1e293b", marginBottom: "15px" }}>Complaint Image</h3>
          <div style={imageContainerStyle}>
            <img 
              src={complaint.complaintImageUrl} 
              alt="Grievance" 
              style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }} 
            />
          </div>
        </div>

        <div>
          <h3 style={{ color: "#1e293b", marginBottom: "15px" }}>Resolution Image</h3>
          {complaint.resolutionImage ? (
            <div style={imageContainerStyle}>
              <img 
                src={complaint.resolutionImage} 
                alt="Resolution" 
                style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }} 
              />
            </div>
          ) : (
            <div style={{ ...imageContainerStyle, backgroundColor: "#f1f5f9", display: "flex", justifyContent: "center", alignItems: "center", color: "#64748b", fontStyle: "italic" }}>
              Not resolved yet.
            </div>
          )}
        </div>
      </div>

      <hr style={{ border: "0", borderTop: "1px solid #e2e8f0", margin: "30px 0" }} />

      <h3 style={{ color: "#1e293b", marginBottom: "15px" }}>Officer Remarks</h3>
      <textarea
        rows="4"
        readOnly
        value={complaint.officerRemarks || "No remarks added by the resolving officer."}
        style={{
          width: "100%",
          padding: "10px",
          resize: "none",
          borderRadius: "6px",
          border: "1px solid #cbd5e1",
          background: "#f8fafc",
          color: "#475569"
        }}
      />
    </div>
  );
}

const btnStyle = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "8px 15px",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px"
};

const imageContainerStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  overflow: "hidden"
};

export default ComplaintDetails;