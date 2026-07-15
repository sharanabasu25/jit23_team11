import { useState } from "react";
import { useParams } from "react-router-dom";
import OfficerSidebar from "../../components/OfficerSidebar";
import OfficerTopbar from "../../components/OfficerTopbar";

export default function OfficerComplaintDetails() {
  const { id } = useParams();

  const [status, setStatus] = useState("Pending");
  const [remarks, setRemarks] = useState("");
  const [image, setImage] = useState(null);

  const handleSave = () => {
    alert("Complaint Updated Successfully!");
  };

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
          <h1>Complaint Details</h1>

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

            <p><strong>Complaint ID:</strong> {id}</p>

            <p><strong>Citizen Name:</strong> Ravi Kumar</p>

            <p><strong>Phone:</strong> 9876543210</p>

            <p><strong>Category:</strong> Road Damage</p>

            <p><strong>Location:</strong> Mysuru</p>

            <p><strong>Priority:</strong> High</p>

            <p><strong>Date:</strong> 15 July 2026</p>

            <p>
              <strong>Description</strong>
            </p>

            <div
              style={{
                background: "#f8f8f8",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "25px",
              }}
            >
              Large potholes have formed on the main road near the bus stand.
              Vehicles are finding it difficult to travel and accidents are
              likely to occur if immediate repair work is not carried out.
            </div>

            <h3>Complaint Image</h3>

            <div
              style={{
                width: "400px",
                height: "220px",
                background: "#ddd",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "8px",
                marginBottom: "30px",
              }}
            >
              Image Placeholder
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
              }}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
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
              }}
            />

            <label>
              <strong>Upload Resolution Image</strong>
            </label>

            <br />

            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              style={{
                marginTop: "10px",
                marginBottom: "25px",
              }}
            />

            {image && (
              <p style={{ color: "green" }}>
                Selected File: {image.name}
              </p>
            )}

            <button
              onClick={handleSave}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "12px 25px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}