import { useNavigate, useLocation } from "react-router-dom";
import {
  LuLayoutGrid,
  LuCirclePlus,
  LuFileText,
  LuSearch,
  LuBell,
  LuUser,
  LuLogOut,
  LuX
} from "react-icons/lu";
import { getStoredUser, getCitizenDisplayName, getCitizenInitial } from "../utils/userUtils";

export default function CitizenSidebar({
  user: propUser,
  isOpen,
  onClose,
  onOpenTrack,
  onOpenNotifications,
  unreadCount = 0
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
      icon: <LuLayoutGrid className="cd-sidebar-icon" />,
      onClick: () => {
        if (onClose) onClose();
        if (location.pathname !== "/dashboard") {
          navigate("/dashboard");
        }
      },
      isActive: location.pathname === "/dashboard"
    },
    {
      id: "submit-grievance",
      label: "Submit Grievance",
      icon: <LuCirclePlus className="cd-sidebar-icon" />,
      onClick: () => {
        if (onClose) onClose();
        navigate("/submit-complaint");
      },
      isActive: location.pathname === "/submit-complaint"
    },
    {
      id: "my-grievances",
      label: "My Grievances",
      icon: <LuFileText className="cd-sidebar-icon" />,
      onClick: () => {
        if (onClose) onClose();
        navigate("/my-complaints");
      },
      isActive: location.pathname === "/my-complaints"
    },
    {
      id: "track-status",
      label: "Track Status",
      icon: <LuSearch className="cd-sidebar-icon" />,
      onClick: () => {
        if (onClose) onClose();
        if (onOpenTrack) onOpenTrack();
      },
      isActive: false
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <LuBell className="cd-sidebar-icon" />,
      onClick: () => {
        if (onClose) onClose();
        if (onOpenNotifications) onOpenNotifications();
      },
      isActive: false,
      badge: unreadCount > 0 ? unreadCount : null
    },
    {
      id: "profile",
      label: "Profile",
      icon: <LuUser className="cd-sidebar-icon" />,
      onClick: () => {
        if (onClose) onClose();
        navigate("/profile");
      },
      isActive: location.pathname === "/profile"
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
        {/* Mobile close button (visible only in mobile drawer mode) */}
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

        {/* Centered citizen avatar & dynamic profile */}
        <div className="cd-avatar-block">
          <div
            className="cd-avatar-circle"
            title={displayName}
            aria-label={`Citizen profile for ${displayName}`}
          >
            <LuUser size={26} strokeWidth={1.8} />
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
                  {item.icon}
                  <span className="cd-nav-label">{item.label}</span>
                  {item.badge && (
                    <span className="cd-nav-badge">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom sign out with thin divider above */}
        <div className="cd-sidebar-bottom">
          <hr className="cd-sidebar-divider" />
          <button
            type="button"
            className="cd-signout-button"
            onClick={handleLogout}
            title="Sign out of SPGMS"
          >
            <LuLogOut size={18} strokeWidth={1.8} className="cd-sidebar-icon" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
