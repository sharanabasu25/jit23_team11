import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Building2,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { sampleOfficer } from "../data/officerSampleData";

export default function OfficerHeader({ onToggleMobileMenu, isMobileMenuOpen, onSearchChange, searchValue = "" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(sampleOfficer);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser({
          ...sampleOfficer,
          ...parsed,
          fullName: parsed.fullName || sampleOfficer.fullName
        });
      }
    } catch {
      // fallback to sample
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("officerLoggedIn");
    navigate("/officer/login");
  };

  // Check if search bar should be displayed in header (on complaints / dashboard)
  const showSearch = location.pathname.includes("/officer/complaints");

  // Determine officer initial
  const initial = user?.fullName?.replace("Officer ", "")?.charAt(0) || "R";

  return (
    <header className="op-top-header">
      <div className="op-header-left">
        {onToggleMobileMenu && (
          <button
            className="op-mobile-menu-toggle"
            onClick={onToggleMobileMenu}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}

        <Link to="/officer/dashboard" className="op-brand-box">
          <div className="op-brand-logo-sq">
            <Building2 size={24} strokeWidth={2.2} />
          </div>
          <div className="op-brand-text">
            <div className="op-brand-title-row">
              <span className="op-brand-title">SPGMS</span>
              <span className="op-officer-pill">OFFICER</span>
            </div>
            <span className="op-brand-subtitle">Smart Public Grievance Management System</span>
          </div>
        </Link>
      </div>

      {showSearch && (
        <div className="op-header-search-wrap">
          <Search size={16} className="op-header-search-icon" />
          <input
            type="text"
            className="op-header-search-bar"
            placeholder="Search complaints, citizen name, category, location..."
            value={searchValue}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
          <span className="op-header-search-kbd">Ctrl + K</span>
        </div>
      )}

      <div className="op-header-right">
        {/* Notification Bell with Badge */}
        <button
          className="op-bell-btn"
          onClick={() => navigate("/officer/notifications")}
          title="3 Unread Notifications"
        >
          <Bell size={20} />
          <span className="op-bell-badge">3</span>
        </button>

        {/* Officer Avatar & Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            className="op-officer-profile-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="op-officer-avatar-circle">{initial}</div>
            <span className="op-officer-name">{user.fullName || "Officer Ramesh Patil"}</span>
            <ChevronDown size={16} />
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                background: "#FFFFFF",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0, 76, 73, 0.15)",
                border: "1px solid #D8EEE9",
                width: "220px",
                zIndex: 200,
                padding: "8px",
                color: "#102D45"
              }}
            >
              <div style={{ padding: "8px 12px", borderBottom: "1px solid #E8F6F3" }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "14px", color: "#004C49" }}>
                  {user.fullName}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#627D98" }}>
                  {user.email || "officer@spgms.org"}
                </p>
              </div>

              <Link
                to="/officer/profile"
                onClick={() => setDropdownOpen(false)}
                style={{
                  display: "block",
                  padding: "10px 12px",
                  fontSize: "13px",
                  color: "#102D45",
                  textDecoration: "none",
                  borderRadius: "6px",
                  marginTop: "4px"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#EAF9F6"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                View Profile
              </Link>

              <Link
                to="/officer/reports"
                onClick={() => setDropdownOpen(false)}
                style={{
                  display: "block",
                  padding: "10px 12px",
                  fontSize: "13px",
                  color: "#102D45",
                  textDecoration: "none",
                  borderRadius: "6px"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#EAF9F6"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                Complaint Reports
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: "13px",
                  color: "#EF4444",
                  background: "transparent",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  textAlign: "left",
                  marginTop: "4px",
                  borderTop: "1px solid #E8F6F3"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#FEE2E2"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Direct Red Logout Button */}
        <button className="op-logout-btn" onClick={handleLogout} title="Logout">
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
