import { useState } from "react";
import { 
  LuHeadphones, 
  LuX, 
  LuPhoneCall, 
  LuCircleHelp, 
  LuFileText, 
  LuExternalLink,
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
    <div className="cd-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="cd-modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "620px" }}
      >
        {/* Header */}
        <div className="cd-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="cd-modal-icon-badge">
              <LuHeadphones size={20} />
            </div>
            <div>
              <h3 className="cd-modal-title">Citizen Help & Support</h3>
              <p className="cd-modal-subtitle">
                Government of Karnataka — Public Grievance Redressal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cd-modal-close-btn"
            aria-label="Close modal"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Content body */}
        <div className="cd-modal-body">
          {/* Official Helplines Banner */}
          <div style={{ marginBottom: "22px" }}>
            <h4 style={{ 
              fontSize: "13px", 
              fontWeight: "700", 
              letterSpacing: "0.5px", 
              color: "var(--cd-secondary-text)", 
              textTransform: "uppercase", 
              margin: "0 0 10px" 
            }}>
              Emergency & Civic Helplines
            </h4>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
              gap: "10px" 
            }}>
              {helplines.map((h, i) => (
                <div 
                  key={i}
                  style={{
                    backgroundColor: "var(--cd-vanilla-cream)",
                    border: "1px solid var(--cd-soft-border)",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--cd-midnight-indigo)" }}>
                        {h.title}
                      </span>
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--cd-secondary-text)", marginTop: "2px" }}>
                      {h.desc}
                    </div>
                  </div>
                  <a 
                    href={`tel:${h.number}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      backgroundColor: "var(--cd-champagne-gold)",
                      color: "var(--cd-midnight-indigo)",
                      fontSize: "13px",
                      fontWeight: "700",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      textDecoration: "none",
                      flexShrink: 0,
                      marginLeft: "10px"
                    }}
                    title={`Call ${h.number}`}
                  >
                    <LuPhoneCall size={13} />
                    {h.number}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div>
            <h4 style={{ 
              fontSize: "13px", 
              fontWeight: "700", 
              letterSpacing: "0.5px", 
              color: "var(--cd-secondary-text)", 
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
                    border: "1px solid var(--cd-soft-border)",
                    borderRadius: "10px",
                    overflow: "hidden",
                    backgroundColor: "#ffffff"
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: openFaq === idx ? "var(--cd-vanilla-cream)" : "transparent",
                      border: "none",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "var(--cd-midnight-indigo)"
                    }}
                  >
                    <span>{faq.q}</span>
                    <LuChevronDown
                      size={16}
                      style={{
                        transform: openFaq === idx ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease"
                      }}
                    />
                  </button>
                  {openFaq === idx && (
                    <div
                      style={{
                        padding: "12px 16px",
                        fontSize: "13px",
                        lineHeight: "1.5",
                        color: "var(--cd-dark-text)",
                        backgroundColor: "#ffffff",
                        borderTop: "1px solid var(--cd-soft-border)"
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
        <div className="cd-modal-footer">
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--cd-secondary-text)" }}>
            <LuShieldCheck size={16} style={{ color: "var(--cd-success-green)" }} />
            <span>Official Karnataka Grievance Redressal Assurance</span>
          </div>
          <button
            type="button"
            className="cd-modal-btn-primary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
