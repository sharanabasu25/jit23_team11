import { useNavigate, useLocation } from "react-router-dom";
import {
  LuHouse,
  LuFileText,
  LuSearch,
  LuBell,
  LuLogOut,
  LuChevronRight,
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
  const rawDisplayName = getCitizenDisplayName(user);
  const displayName = rawDisplayName === "Citizen" ? "Suresh" : rawDisplayName;
  const displayInitial = getCitizenInitial(user) === "C" ? "S" : getCitizenInitial(user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("citizenLoggedIn");
    if (onClose) onClose();
    navigate("/login");
  };

  const isDashboard = location.pathname === "/dashboard";
  const isMyGrievances = location.pathname === "/my-complaints";

  const navItems = [
    {
      id: "Dashboard",
      label: "Dashboard",
      Icon: LuHouse,
      onClick: () => {
        if (onClose) onClose();
        if (!isDashboard) {
          navigate("/dashboard");
        }
      },
      isActive: isDashboard,
      hasChevron: isDashboard
    },
    {
      id: "My Grievances",
      label: "My Grievances",
      Icon: LuFileText,
      onClick: () => {
        if (onClose) onClose();
        if (!isMyGrievances) {
          navigate("/my-complaints");
        }
      },
      isActive: isMyGrievances,
      hasChevron: isMyGrievances
    },
    {
      id: "Track Status",
      label: "Track Status",
      Icon: LuSearch,
      onClick: () => {
        if (onClose) onClose();
        if (onOpenTrack) onOpenTrack();
      },
      isActive: false
    },
    {
      id: "Notifications",
      label: "Notifications",
      Icon: LuBell,
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
        <button
          className="cd-sidebar-backdrop"
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}

      <aside className={`cd-sidebar ${isOpen ? "mobile-open" : ""}`} aria-label="Citizen navigation">
        {/* Citizen profile section */}
        <div className="cd-profile-summary">
          <div className="cd-profile-avatar">{displayInitial}</div>
          <strong>{displayName}</strong>
          <span className="cd-active-citizen">
            <i /> Active Citizen
          </span>
        </div>

        {/* Navigation items */}
        <nav className="cd-sidebar-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`cd-nav-item ${item.isActive ? "active" : ""}`}
              onClick={item.onClick}
            >
              <span className="cd-nav-icon">
                <item.Icon size={16} strokeWidth={item.isActive ? 2.4 : 2} />
              </span>

              <span className="cd-nav-label">{item.label}</span>

              {item.badge && (
                <span className="cd-nav-count">{item.badge}</span>
              )}

              {item.hasChevron && (
                <LuChevronRight
                  className="cd-nav-chevron"
                  size={14}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Bottom Sign Out button */}
        <button
          className="cd-signout-button"
          type="button"
          onClick={handleLogout}
          title="Sign out of SPGMS"
        >
          <span className="cd-signout-icon">
            <LuLogOut size={16} strokeWidth={2.2} />
          </span>
          <span>Sign Out</span>
        </button>
      </aside>
    </>
  );
}
