import { NavLink, useNavigate } from "react-router-dom";
import {
  Building2,
  LayoutDashboard,
  ClipboardList,
  Bell,
  User,
  BarChart3,
  LogOut
} from "lucide-react";
import KarnatakaSidebarArtwork from "./KarnatakaSidebarArtwork";

export default function OfficerSidebar({ isMobileOpen, onCloseMobile }) {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("officerLoggedIn");
    navigate("/officer/login");
  };

  const navItems = [
    {
      to: "/officer/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      to: "/officer/complaints",
      icon: ClipboardList,
      label: "Complaints",
    },
    {
      to: "/officer/notifications",
      icon: Bell,
      label: "Notifications",
      badge: "3",
    },
    {
      to: "/officer/profile",
      icon: User,
      label: "Profile",
    },
    {
      to: "/officer/reports",
      icon: BarChart3,
      label: "Reports",
    },
  ];

  return (
    <aside className={`op-sidebar ${isMobileOpen ? "mobile-open" : ""}`}>
      <div className="op-sidebar-top">
        {/* Sidebar Brand Header */}
        <div className="op-sidebar-brand">
          <Building2 className="op-sidebar-logo-icon" size={38} strokeWidth={2} />
          <h2 className="op-sidebar-title">SPGMS</h2>
          <span className="op-sidebar-subtitle">Officer Panel</span>
        </div>

        {/* Navigation Items */}
        <nav>
          <ul className="op-nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to} className="op-nav-item">
                  <NavLink
                    to={item.to}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `op-nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    <Icon size={19} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="op-nav-badge">{item.badge}</span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="op-sidebar-bottom">
        <button
          onClick={handleLogout}
          className="op-sidebar-logout-btn"
          title="Sign out of Officer Portal"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      {/* Decorative Karnataka Civic Architecture Line-Art at the bottom */}
      <KarnatakaSidebarArtwork />
    </aside>
  );
}