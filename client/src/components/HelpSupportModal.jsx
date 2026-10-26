import { useState } from "react";
import { 
  LuHeadphones, 
  LuX, 
  LuPhoneCall, 
  LuChevronDown, 
  LuShieldCheck 
} from "react-icons/lu";

export default function HelpSupportModal({ isOpen, onClose }) {
  const [openFaq, setOpenFaq] = useState(0);

  if (!isOpen) return null;

  const helplines = [
    { title: "BBMP Grievance Helpline", number: "1533", desc: "Urban infrastructure, roads & sanitation", badge: "24x7" },
    { title: "BESCOM Electricity Helpline", number: "1912", desc: "Power outages, streetlights & transformers", badge: "Toll Free" },
    { title: "BWSSB Water & Sewage", number: "1916", desc: "Water supply disruption & pipeline leaks", badge: "24x7" },
    { title: "Karnataka Emergency Service", number: "112", desc: "Police, Fire & Urgent Civic Hazards", badge: "Emergency" }
  ];

  const faqs = [
    {
      q: "How does SPGMS AI triaging work?",
      a: "When you upload a photo of a civic issue, our automated vision model classifies the issue (e.g. pothole, streetlight malfunction, or water leakage), assesses urgency, and automatically routes the ticket to the respective municipal department."
    },
    {
      q: "What is the expected resolution timeline?",
      a: "Emergency hazards are triaged within 4 hours. General road maintenance, streetlight repairs, and water leakages are typically addressed within 48 to 72 hours by assigned ward engineers."
    },
    {
      q: "How can I track my submitted grievance?",
      a: "Click 'Track Status' in your dashboard and paste your unique Complaint Reference ID (e.g. SPGMS-2026-1024), or navigate to 'My Grievances' to monitor live status updates, assigned officer details, and resolution photos."
    },
    {
      q: "Can I escalate a delayed grievance?",
      a: "If a complaint exceeds the designated SLA without progress, our system automatically escalates it to the Zonal Senior Executive Engineer. You can also contact the toll-free helpline with your Reference ID."
    }
  ];

  return (
    <div className="spgms-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="spgms-modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "600px",
          width: "100%",
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid #E2EAF5",
          borderTop: "3px solid #102748",
          boxShadow: "0 16px 40px rgba(16, 39, 72, 0.16)",
          padding: "24px 28px",
          boxSizing: "border-box"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div 
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#E9EAFE",
                color: "#102748",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              <LuHeadphones size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "19px", fontWeight: "700", color: "#102748", letterSpacing: "-0.01em" }}>
                Citizen Help & Support
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#7183AD" }}>
                Government of Karnataka — Public Grievance Redressal
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
            <LuX size={20} />
          </button>
        </div>

        {/* Content body */}
        <div style={{ maxHeight: "calc(100vh - 220px)", overflowY: "auto", paddingRight: "4px" }}>
          {/* Official Helplines Banner */}
          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ 
              fontSize: "12.5px", 
              fontWeight: "700", 
              letterSpacing: "0.5px", 
              color: "#7183AD", 
              textTransform: "uppercase", 
              margin: "0 0 10px" 
            }}>
              Emergency & Civic Helplines
            </h4>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", 
              gap: "10px" 
            }}>
              {helplines.map((h, i) => (
                <div 
                  key={i}
                  style={{
                    backgroundColor: "#F4F7FC",
                    border: "1px solid #E2EAF5",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: "#102748" }}>
                      {h.title}
                    </div>
                    <div style={{ fontSize: "11px", color: "#7183AD", marginTop: "2px" }}>
                      {h.desc}
                    </div>
                  </div>
                  <a 
                    href={`tel:${h.number}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      backgroundColor: "#E9EAFE",
                      color: "#102748",
                      border: "1px solid #CAD8EC",
                      fontSize: "12.5px",
                      fontWeight: "700",
                      padding: "5px 10px",
                      borderRadius: "6px",
                      textDecoration: "none",
                      flexShrink: 0,
                      marginLeft: "10px",
                      transition: "background-color 0.15s ease"
                    }}
                    title={`Call ${h.number}`}
                  >
                    <LuPhoneCall size={12} />
                    {h.number}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div>
            <h4 style={{ 
              fontSize: "12.5px", 
              fontWeight: "700", 
              letterSpacing: "0.5px", 
              color: "#7183AD", 
              textTransform: "uppercase", 
              margin: "0 0 10px" 
            }}>
              Frequently Asked Questions
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  style={{
                    border: "1px solid #E2EAF5",
                    borderRadius: "10px",
                    overflow: "hidden",
                    backgroundColor: "#FFFFFF"
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      background: openFaq === idx ? "#F4F7FC" : "#FFFFFF",
                      border: "none",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#14284A"
                    }}
                  >
                    <span>{faq.q}</span>
                    <LuChevronDown
                      size={16}
                      style={{
                        color: "#7183AD",
                        transform: openFaq === idx ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease"
                      }}
                    />
                  </button>
                  {openFaq === idx && (
                    <div
                      style={{
                        padding: "12px 14px",
                        fontSize: "12.5px",
                        lineHeight: "1.5",
                        color: "#7183AD",
                        backgroundColor: "#FFFFFF",
                        borderTop: "1px solid #E2EAF5"
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", paddingTop: "14px", borderTop: "1px solid #E2EAF5" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#7183AD" }}>
            <LuShieldCheck size={16} style={{ color: "#0B806B" }} />
            <span>Official Karnataka Grievance Redressal Assurance</span>
          </div>
          <button
            type="button"
            className="spgms-btn spgms-btn-primary"
            onClick={onClose}
            style={{
              backgroundColor: "#102748",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              padding: "8px 20px",
              fontWeight: "600",
              fontSize: "13.5px",
              cursor: "pointer"
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
