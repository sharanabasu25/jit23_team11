import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LuLandmark, 
  LuBell, 
  LuChevronDown, 
  LuUser, 
  LuLogOut, 
  LuMenu,
  LuFileText,
  LuSearch
} from "react-icons/lu";
import { getStoredUser, getCitizenDisplayName, getCitizenInitial } from "../utils/userUtils";

export default function CitizenHeader({
  user: propUser,
  onOpenSidebar,
  onOpenNotifications,
  onOpenTrack,
  unreadCount = 0
}) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const user = propUser || getStoredUser();
  const displayName = getCitizenDisplayName(user);
  const displayInitial = getCitizenInitial(user);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("citizenLoggedIn");
    navigate("/");
  };

  return (
    <header className="cd-top-header" role="banner">
      <div className="cd-header-left">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          type="button"
          className="cd-header-hamburger"
          onClick={onOpenSidebar}
          aria-label="Open portal navigation"
        >
          <LuMenu size={22} />
        </button>

        {/* Brand Logo & Title */}
        <div 
          className="cd-header-brand" 
          onClick={() => navigate("/dashboard")}
          title="SPGMS — Smart Public Grievance Management System"
        >
          {/* Square Champagne Gold Logo Container */}
          <div className="cd-brand-icon-box">
            <LuLandmark size={20} className="cd-civic-building-icon" strokeWidth={2.2} />
          </div>

          <div className="cd-brand-text-block">
            <div className="cd-brand-title-row">
              <span className="cd-brand-acronym">SPGMS</span>
              <span className="cd-citizen-badge">CITIZEN</span>
            </div>
            <span className="cd-brand-subtitle">Smart Public Grievance Management System</span>
          </div>
        </div>
      </div>

      <div className="cd-header-right">
        {/* Notification Bell */}
        <button
          type="button"
          className="cd-notification-btn"
          onClick={onOpenNotifications}
          aria-label="Open notifications"
          title="Civic updates & alerts"
        >
          <LuBell size={20} strokeWidth={2} />
          {unreadCount > 0 ? (
            <span className="cd-notification-badge-number">{unreadCount}</span>
          ) : (
            <span className="cd-notification-badge-dot" />
          )}
        </button>

        {/* Profile Dropdown Trigger */}
        <div className="cd-profile-dropdown-wrapper" ref={dropdownRef}>
          <button
            type="button"
            className="cd-profile-trigger"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            {/* Circular Gold Avatar */}
            <div className="cd-gold-avatar">
              <span>{displayInitial}</span>
            </div>

            {/* Citizen's Name */}
            <span className="cd-citizen-name">{displayName}</span>

            <LuChevronDown 
              size={15} 
              className={`cd-chevron-icon ${dropdownOpen ? "open" : ""}`} 
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="cd-profile-menu" role="menu">
              <div className="cd-menu-user-info">
                <p className="cd-menu-user-name">
                  {user?.fullName
                    ? user.fullName.replace(/\s*[\(\[][^()\[\]]*[\)\]]/g, "").trim()
                    : "Citizen"}
                </p>
                <p className="cd-menu-user-email">{user?.email || "citizen@spgms.org"}</p>
                <span className="cd-menu-user-role">Verified Citizen</span>
              </div>
              <hr className="cd-menu-divider" />

              <button
                type="button"
                className="cd-menu-item"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/profile");
                }}
              >
                <LuUser size={16} />
                <span>My Profile</span>
              </button>

              <button
                type="button"
                className="cd-menu-item"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/my-complaints");
                }}
              >
                <LuFileText size={16} />
                <span>My Grievances</span>
              </button>

              {onOpenTrack && (
                <button
                  type="button"
                  className="cd-menu-item"
                  onClick={() => {
                    setDropdownOpen(false);
                    onOpenTrack();
                  }}
                >
                  <LuSearch size={16} />
                  <span>Track Status</span>
                </button>
              )}

              <hr className="cd-menu-divider" />

              <button
                type="button"
                className="cd-menu-item cd-menu-item-danger"
                onClick={handleLogout}
              >
                <LuLogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
