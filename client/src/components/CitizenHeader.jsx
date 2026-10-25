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
  const rawDisplayName = getCitizenDisplayName(user);
  // Default to Suresh if no specific name is stored, as in the reference specification
  const displayName = rawDisplayName === "Citizen" ? "Suresh" : rawDisplayName;
  const displayInitial = getCitizenInitial(user) === "C" ? "S" : getCitizenInitial(user);

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
    navigate("/login");
  };

  return (
    <header className="cd-top-header" role="banner">
      {/* 1. Left: Brand & Mobile Toggle */}
      <div className="cd-header-left">
        <button
          type="button"
          className="cd-mobile-menu"
          onClick={onOpenSidebar}
          aria-label="Toggle navigation"
        >
          <LuMenu size={22} />
        </button>

        <div 
          className="cd-brand" 
          onClick={() => navigate("/dashboard")}
          title="SPGMS — Smart Public Grievance Management System"
        >
          {/* Pale yellow rounded square government-building icon */}
          <div className="cd-brand-mark">
            <LuLandmark size={20} strokeWidth={2.2} />
          </div>

          <div className="cd-brand-copy">
            <div className="cd-brand-title">
              SPGMS <span className="cd-citizen-tag">CITIZEN</span>
            </div>
            <span className="cd-brand-subtitle">
              Smart Public Grievance Management System
            </span>
          </div>
        </div>
      </div>

      {/* 2. Center: Global Search Bar */}
      <label className="cd-header-search">
        <LuSearch size={16} />
        <input
          ref={searchInputRef}
          type="search"
          placeholder="Search grievances, ID, or location..."
          value={searchTerm}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          aria-label="Search grievances, ID, or location"
        />
        <kbd>Ctrl + K</kbd>
      </label>

      {/* 3. Right: Notifications & Profile */}
      <div className="cd-header-right">
        {/* Notification Bell */}
        <button
          type="button"
          className="cd-notification-button"
          onClick={onOpenNotifications}
          aria-label="Notifications"
          title="Civic updates & alerts"
        >
          <LuBell size={20} />
          {unreadCount > 0 && (
            <span className="cd-notification-count">{unreadCount}</span>
          )}
        </button>

        {/* Profile Dropdown Trigger */}
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <button
            type="button"
            className="cd-user-menu"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <span className="cd-header-avatar">{displayInitial}</span>
            <span>{displayName}</span>
            <LuChevronDown 
              size={14} 
              style={{
                transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.15s ease"
              }} 
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="cd-profile-menu" role="menu">
              <div className="cd-menu-user-info">
                <p className="cd-menu-user-name">
                  {user?.fullName
                    ? user.fullName.replace(/\s*[\(\[][^()\[\]]*[\)\]]/g, "").trim()
                    : displayName}
                </p>
                <p className="cd-menu-user-email">{user?.email || "suresh.citizen@karnataka.gov.in"}</p>
              </div>

              <button
                type="button"
                className="cd-menu-item"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/profile");
                }}
              >
                <LuUser size={15} />
                <span>My Profile</span>
              </button>

              <button
                type="button"
                className="cd-menu-item logout"
                onClick={handleLogout}
              >
                <LuLogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
