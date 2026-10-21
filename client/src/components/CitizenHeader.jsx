import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LuLandmark, 
  LuBell, 
  LuChevronDown, 
  LuUser, 
  LuLogOut, 
  LuMenu,
  LuSearch
} from "react-icons/lu";
import { getStoredUser, getCitizenDisplayName, getCitizenInitial } from "../utils/userUtils";

export default function CitizenHeader({
  user: propUser,
  onOpenSidebar,
  onOpenNotifications,
  unreadCount = 2,
  searchTerm = "",
  onSearchChange
}) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

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

  // Keyboard shortcut Ctrl + K or Cmd + K to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
      {/* 1. Left: Brand & Mobile Toggle */}
      <div className="cd-header-left">
        <button
          type="button"
          className="cd-header-hamburger"
          onClick={onOpenSidebar}
          aria-label="Open portal navigation"
        >
          <LuMenu size={22} />
        </button>

        <div 
          className="cd-header-brand" 
          onClick={() => navigate("/dashboard")}
          title="SPGMS — Smart Public Grievance Management System"
        >
          {/* Blue Emblem Container */}
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

      {/* 2. Center: Global Search Bar */}
      <div className="cd-header-center-search">
        <div className="cd-header-search-box">
          <LuSearch size={16} className="cd-header-search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            className="cd-header-search-input"
            placeholder="Search grievances, ID, or location..."
            value={searchTerm}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            aria-label="Search grievances, ID, or location"
          />
          <kbd className="cd-shortcut-badge">Ctrl + K</kbd>
        </div>
      </div>

      {/* 3. Right: Notifications & Profile */}
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
          {unreadCount > 0 && (
            <span className="cd-notification-badge-number">{unreadCount}</span>
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
            {/* Purple Avatar */}
            <div className="cd-purple-avatar">
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
                className="cd-menu-item logout"
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
