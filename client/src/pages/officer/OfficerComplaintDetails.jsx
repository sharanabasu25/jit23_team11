import { useParams } from "react-router-dom";
import OfficerSidebar from "../../components/OfficerSidebar";
import OfficerTopbar from "../../components/OfficerTopbar";

export default function OfficerComplaintDetails() {
  const { id } = useParams();

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
            <p><strong>Complaint ID:</strong> {id}</p>

            <p><strong>Citizen Name:</strong> Ravi Kumar</p>

            <p><strong>Category:</strong> Road Damage</p>

            <p><strong>Location:</strong> Mysuru</p>

            <p><strong>Status:</strong> Pending</p>

            <p><strong>Date:</strong> 15 July 2026</p>

            <p>
              <strong>Description:</strong>
            </p>

            <div
              style={{
                background: "#f8f8f8",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              Large potholes have formed on the main road near the bus stand,
              causing traffic congestion and creating safety risks for commuters.
            </div>

            <h3>Complaint Image</h3>

            <div
              style={{
                width: "350px",
                height: "200px",
                background: "#ddd",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              Image Placeholder
            </div>

            <button
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "12px 20px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Update Complaint (Day 4)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}