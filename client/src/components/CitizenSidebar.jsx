import { useNavigate, useLocation } from "react-router-dom";
import {
  LuHouse,
  LuFileText,
  LuSearch,
  LuBell,
  LuLogOut,
  LuChevronRight,
  LuX
} from "react-icons/lu";
import { getStoredUser, getCitizenDisplayName, getCitizenInitial } from "../utils/userUtils";

export default function CitizenSidebar({
  user: propUser,
  isOpen,
  onClose,
  onOpenTrack,
  onOpenNotifications,
  unreadCount = 2
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const user = propUser || getStoredUser();
  const displayName = getCitizenDisplayName(user);
  const displayInitial = getCitizenInitial(user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("citizenLoggedIn");
    if (onClose) onClose();
    navigate("/");
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      iconType: "gold-home",
      onClick: () => {
        if (onClose) onClose();
        if (location.pathname !== "/dashboard") {
          navigate("/dashboard");
        }
      },
      isActive: location.pathname === "/dashboard",
      showChevron: true
    },
    {
      id: "my-grievances",
      label: "My Grievances",
      iconType: "indigo-file",
      onClick: () => {
        if (onClose) onClose();
        navigate("/my-complaints");
      },
      isActive: location.pathname === "/my-complaints"
    },
    {
      id: "track-status",
      label: "Track Status",
      iconType: "indigo-search",
      onClick: () => {
        if (onClose) onClose();
        if (onOpenTrack) onOpenTrack();
      },
      isActive: false
    },
    {
      id: "notifications",
      label: "Notifications",
      iconType: "indigo-bell",
      onClick: () => {
        if (onClose) onClose();
        if (onOpenNotifications) onOpenNotifications();
      },
      isActive: false,
      badge: unreadCount > 0 ? unreadCount : 2
    }
  ];

  return (
    <>
      {isOpen && (
        <div
          className="cd-sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`cd-sidebar ${isOpen ? "mobile-open" : ""}`} aria-label="Citizen portal navigation">
        {/* Mobile close button */}
        <div className="cd-sidebar-mobile-close">
          <button
            type="button"
            className="cd-sidebar-close-btn"
            onClick={onClose}
            aria-label="Close menu"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="cd-avatar-block">
          <div
            className="cd-avatar-circle"
            title={displayName}
            aria-label={`Citizen profile for ${displayName}`}
          >
            <span>{displayInitial}</span>
          </div>
          <span className="cd-avatar-name">{displayName}</span>
          <span className="cd-avatar-status">
            <span className="cd-status-dot" /> Active Citizen
          </span>
        </div>

        {/* Navigation list */}
        <nav className="cd-nav-wrapper">
          <ul className="cd-nav-list">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`cd-nav-button ${item.isActive ? "active" : ""}`}
                  onClick={item.onClick}
                >
                  <div className={`cd-nav-icon-badge ${item.iconType}`}>
                    {item.iconType === "gold-home" && <LuHouse size={16} strokeWidth={2.4} />}
                    {item.iconType === "indigo-file" && <LuFileText size={16} strokeWidth={2.2} />}
                    {item.iconType === "indigo-search" && <LuSearch size={16} strokeWidth={2.2} />}
                    {item.iconType === "indigo-bell" && <LuBell size={16} strokeWidth={2.2} />}
                  </div>

                  <span className="cd-nav-label">{item.label}</span>

                  {item.badge && (
                    <span className="cd-nav-badge">
                      {item.badge}
                    </span>
                  )}

                  {item.showChevron && (
                    <LuChevronRight size={16} className="cd-nav-chevron" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom sign out button */}
        <div className="cd-sidebar-bottom">
          <button
            type="button"
            className="cd-signout-button"
            onClick={handleLogout}
            title="Sign out of SPGMS"
          >
            <LuLogOut size={18} strokeWidth={2} className="cd-signout-icon" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
