import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiX, FiInfo } from "react-icons/fi";

export default function TrackModal({ isOpen, onClose }) {
  const [complaintId, setComplaintId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleTrack = (e) => {
    e.preventDefault();
    const cleanId = complaintId.trim();

    if (!cleanId) {
      setError("Please enter a valid Complaint ID.");
      return;
    }

    onClose();
    navigate(`/complaint/${cleanId}`);
  };

  return (
    <div className="spgms-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="spgms-modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "480px",
          width: "100%",
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid #E2EAF5",
          borderTop: "3px solid #102748",
          boxShadow: "0 16px 40px rgba(16, 39, 72, 0.16), 0 4px 12px rgba(16, 39, 72, 0.06)",
          padding: "24px 28px",
          boxSizing: "border-box"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div 
              style={{ 
                width: "40px", 
                height: "40px", 
                borderRadius: "50%", 
                backgroundColor: "#E9EAFE", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                color: "#102748",
                flexShrink: 0
              }}
            >
              <FiSearch size={19} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "19px", fontWeight: "700", color: "#102748", letterSpacing: "-0.01em" }}>
                Track Grievance Status
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#7183AD" }}>
                Real-time official audit & timeline lookup
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="spgms-btn-ghost spgms-btn-sm"
            style={{
              padding: "6px",
              borderRadius: "50%",
              color: "#7183AD",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "color 0.15s ease, background-color 0.15s ease"
            }}
            aria-label="Close modal"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#102748";
              e.currentTarget.style.backgroundColor = "#EAF2FC";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#7183AD";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleTrack}>
          {error && (
            <div className="spgms-alert spgms-alert-error" style={{ padding: "10px 14px", fontSize: "13px", marginBottom: "16px" }}>
              {error}
            </div>
          )}

          <div className="spgms-form-group" style={{ marginBottom: "20px" }}>
            <label className="spgms-label" htmlFor="track-modal-id" style={{ color: "#14284A", fontWeight: "600", fontSize: "13.5px", marginBottom: "6px" }}>
              Enter Complaint Reference ID
            </label>
            <input
              id="track-modal-id"
              type="text"
              className="spgms-input"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2EAF5",
                borderRadius: "8px",
                height: "42px",
                color: "#14284A",
                fontSize: "14px"
              }}
              placeholder="e.g. 660f8d... or ID from your receipt"
              value={complaintId}
              onChange={(e) => {
                setComplaintId(e.target.value);
                if (error) setError("");
              }}
              autoFocus
              required
            />
            <p className="spgms-helper" style={{ display: "flex", alignItems: "center", gap: "6px", color: "#7183AD", fontSize: "12.5px", marginTop: "6px" }}>
              <FiInfo size={14} style={{ flexShrink: 0 }} /> You can copy this ID from your "My Complaints" list or SMS confirmation.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "24px" }}>
            <button
              type="button"
              className="spgms-btn spgms-btn-secondary"
              onClick={onClose}
              style={{
                backgroundColor: "#FFFFFF",
                color: "#102748",
                border: "1px solid #E2EAF5",
                borderRadius: "8px",
                padding: "9px 18px",
                fontWeight: "600",
                fontSize: "14px"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="spgms-btn spgms-btn-primary"
              style={{
                backgroundColor: "#102748",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                padding: "9px 20px",
                fontWeight: "600",
                fontSize: "14px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <FiSearch size={16} /> Track Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
