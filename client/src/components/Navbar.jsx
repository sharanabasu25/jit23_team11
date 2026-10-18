import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FiBell, 
  FiSearch, 
  FiUser, 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiPlusCircle, 
  FiFileText, 
  FiHome, 
  FiGrid 
} from "react-icons/fi";
import TrackModal from "./TrackModal";
import NotificationDrawer from "./NotificationDrawer";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("citizenLoggedIn");
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const isActive = (path) => {
    if (path === "/" && (location.pathname === "/" || location.pathname === "/home")) {
      return true;
    }
    return location.pathname === path;
  };

  const linkStyle = (active) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 14px",
    borderRadius: "var(--radius-sm)",
    fontSize: "14px",
    fontWeight: active ? "700" : "500",
    textDecoration: "none",
    transition: "all var(--transition-fast)",
    backgroundColor: active ? "var(--muted-lavender)" : "transparent",
    color: active ? "var(--midnight-indigo)" : "var(--vanilla-cream)",
    border: active ? "1px solid var(--warm-gold)" : "1px solid transparent"
  });

  return (
    <>
      <header
        style={{
          backgroundColor: "var(--deep-indigo)",
          borderBottom: "2px solid var(--warm-gold)",
          color: "var(--vanilla-cream)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          boxShadow: "0 4px 15px rgba(16, 20, 58, 0.25)"
        }}
      >
        {/* Top Government Micro-Bar */}
        <div
          style={{
            backgroundColor: "#0b0e2b",
            padding: "4px 24px",
            fontSize: "11px",
            color: "#c8c7db",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,0.06)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "var(--warm-gold)", fontWeight: "600" }}>🏛 Government of Karnataka</span>
            <span>•</span>
            <span>Public Grievance Redressal Portal</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span>Toll-Free Helpline: <strong>1912</strong></span>
            <Link 
              to="/officer/login" 
              style={{ color: "var(--warm-gold)", textDecoration: "none", fontWeight: "600" }}
            >
              Officer Access →
            </Link>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "12px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          {/* Brand Identity */}
          <Link
            to={token && user ? "/dashboard" : "/"}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textDecoration: "none",
              color: "var(--vanilla-cream)"
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--midnight-indigo)",
                border: "1.5px solid var(--warm-gold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
              }}
            >
              🏛
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "21px",
                    fontWeight: "800",
                    letterSpacing: "0.5px",
                    color: "var(--vanilla-cream)"
                  }}
                >
                  SPGMS
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    backgroundColor: "var(--warm-gold)",
                    color: "var(--deep-indigo)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}
                >
                  Citizen
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "11px",
                  color: "#d0cee3",
                  letterSpacing: "0.2px"
                }}
              >
                Smart Grievance Management System
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
            className="desktop-nav"
          >
            <Link to="/home" style={linkStyle(isActive("/home"))}>
              <FiHome size={15} /> Home
            </Link>

            {token && user ? (
              <>
                <Link to="/dashboard" style={linkStyle(isActive("/dashboard"))}>
                  <FiGrid size={15} /> Dashboard
                </Link>

                <Link to="/submit-complaint" style={linkStyle(isActive("/submit-complaint"))}>
                  <FiPlusCircle size={15} /> Lodge Grievance
                </Link>

                <Link to="/my-complaints" style={linkStyle(isActive("/my-complaints"))}>
                  <FiFileText size={15} /> My Grievances
                </Link>
              </>
            ) : null}

            {/* Quick Track Action Button */}
            <button
              onClick={() => setIsTrackOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "var(--radius-sm)",
                fontSize: "14px",
                fontWeight: "600",
                backgroundColor: "rgba(232, 231, 245, 0.12)",
                color: "var(--vanilla-cream)",
                border: "1px solid rgba(212, 168, 90, 0.4)",
                cursor: "pointer",
                transition: "all var(--transition-fast)"
              }}
              title="Track a grievance status by ID"
            >
              <FiSearch size={15} style={{ color: "var(--warm-gold)" }} />
              Track Status
            </button>

            {/* Notification Bell */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setIsNotifOpen((prev) => !prev)}
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  backgroundColor: isNotifOpen ? "var(--muted-lavender)" : "rgba(255,255,255,0.08)",
                  color: isNotifOpen ? "var(--midnight-indigo)" : "var(--vanilla-cream)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)",
                  position: "relative"
                }}
                aria-label="View notifications"
              >
                <FiBell size={17} />
                <span
                  style={{
                    position: "absolute",
                    top: "3px",
                    right: "3px",
                    width: "8px",
                    height: "8px",
                    backgroundColor: "var(--warm-gold)",
                    borderRadius: "50%",
                    boxShadow: "0 0 0 2px var(--deep-indigo)"
                  }}
                />
              </button>

              <NotificationDrawer
                isOpen={isNotifOpen}
                onClose={() => setIsNotifOpen(false)}
              />
            </div>

            {/* User Session Profile & Controls */}
            {token && user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "6px" }}>
                <Link
                  to="/profile"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 12px",
                    borderRadius: "var(--radius-full)",
                    backgroundColor: "var(--midnight-indigo)",
                    border: "1px solid var(--soft-border)",
                    color: "var(--vanilla-cream)",
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: "600"
                  }}
                  title="View Profile"
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor: "var(--warm-gold)",
                      color: "var(--deep-indigo)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "700",
                      fontSize: "12px"
                    }}
                  >
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : "C"}
                  </div>
                  <span>{user.fullName ? user.fullName.split(" ")[0] : "Citizen"}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "7px 12px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "transparent",
                    color: "#fca5a5",
                    border: "1px solid rgba(252, 165, 165, 0.4)",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)"
                  }}
                  title="Sign out of Citizen Portal"
                >
                  <FiLogOut size={14} /> Logout
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "8px" }}>
                <Link
                  to="/login"
                  style={{
                    padding: "8px 16px",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--vanilla-cream)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: "600"
                  }}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  style={{
                    padding: "8px 18px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--warm-gold)",
                    color: "var(--deep-indigo)",
                    border: "1px solid var(--warm-gold)",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: "700"
                  }}
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              style={{
                display: "none",
                background: "transparent",
                border: "none",
                color: "var(--vanilla-cream)",
                cursor: "pointer",
                padding: "6px"
              }}
              className="mobile-toggle"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </nav>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            style={{
              backgroundColor: "var(--deep-indigo)",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              padding: "16px 24px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}
          >
            <Link
              to="/home"
              onClick={() => setIsMobileMenuOpen(false)}
              style={linkStyle(isActive("/home"))}
            >
              <FiHome size={16} /> Home
            </Link>

            {token && user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={linkStyle(isActive("/dashboard"))}
                >
                  <FiGrid size={16} /> Dashboard
                </Link>
                <Link
                  to="/submit-complaint"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={linkStyle(isActive("/submit-complaint"))}
                >
                  <FiPlusCircle size={16} /> Lodge Grievance
                </Link>
                <Link
                  to="/my-complaints"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={linkStyle(isActive("/my-complaints"))}
                >
                  <FiFileText size={16} /> My Grievances
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={linkStyle(isActive("/profile"))}
                >
                  <FiUser size={16} /> My Profile ({user.fullName})
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    ...linkStyle(false),
                    color: "#fca5a5",
                    justifyContent: "flex-start",
                    background: "transparent",
                    cursor: "pointer"
                  }}
                >
                  <FiLogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={linkStyle(isActive("/login"))}
                >
                  Citizen Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={linkStyle(isActive("/register"))}
                >
                  Citizen Registration
                </Link>
                <Link
                  to="/officer/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ ...linkStyle(false), color: "var(--warm-gold)" }}
                >
                  Officer Portal Login →
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* Global Quick Track Modal */}
      <TrackModal
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
      />

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav > a,
          .desktop-nav > div > a,
          .desktop-nav > div > button {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}

export default Navbar;