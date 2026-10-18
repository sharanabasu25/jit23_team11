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
        style={{ maxWidth: "500px" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div 
              style={{ 
                width: "36px", 
                height: "36px", 
                borderRadius: "50%", 
                backgroundColor: "var(--muted-lavender)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                color: "var(--midnight-indigo)"
              }}
            >
              <FiSearch size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "19px", color: "var(--midnight-indigo)" }}>
                Track Grievance Status
              </h3>
              <p style={{ margin: 0, fontSize: "13px", color: "var(--muted-grey)" }}>
                Real-time official audit & timeline lookup
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="spgms-btn-ghost spgms-btn-sm"
            style={{ padding: "6px", borderRadius: "50%", color: "var(--muted-grey)" }}
            aria-label="Close modal"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleTrack}>
          {error && (
            <div className="spgms-alert spgms-alert-error" style={{ padding: "10px 14px", fontSize: "13px" }}>
              {error}
            </div>
          )}

          <div className="spgms-form-group">
            <label className="spgms-label" htmlFor="track-modal-id">
              Enter Complaint Reference ID
            </label>
            <input
              id="track-modal-id"
              type="text"
              className="spgms-input"
              placeholder="e.g. 660f8d... or ID from your receipt"
              value={complaintId}
              onChange={(e) => {
                setComplaintId(e.target.value);
                if (error) setError("");
              }}
              autoFocus
              required
            />
            <p className="spgms-helper" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <FiInfo size={13} /> You can copy this ID from your "My Complaints" list or SMS confirmation.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "24px" }}>
            <button
              type="button"
              className="spgms-btn spgms-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="spgms-btn spgms-btn-primary"
            >
              <FiSearch size={16} /> Track Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
