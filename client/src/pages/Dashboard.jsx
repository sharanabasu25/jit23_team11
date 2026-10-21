
import React, { useState } from "react";
import {
  Landmark,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  House,
  FileText,
  UserRound,
  LogOut,
  Clock3,
  RefreshCw,
  Check,
  Droplet,
  Lightbulb,
  Construction,
  Plus,
  Headphones,
  LayoutGrid,
  ArrowRight,
  Megaphone,
  Menu,
  X,
  MapPin,
  CalendarDays,
} from "lucide-react";
import "../citizenDashboard.css";

const grievances = [
  {
    id: "SPGMS-2026-3406",
    title: "Street Light Not Working",
    date: "18 Oct 2026",
    status: "Pending",
    type: "light",
    image:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "SPGMS-2026-3407",
    title: "Water Supply Issue",
    date: "18 Oct 2026",
    status: "Resolved",
    type: "water",
    image:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "SPGMS-2026-3405",
    title: "Road Maintenance Request",
    date: "18 Oct 2026",
    status: "In Progress",
    type: "road",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=240&q=80",
  },
];

const stats = [
  { label: "Total Grievances", value: "3", note: "3 this month", kind: "total", Icon: FileText },
  { label: "Pending", value: "1", note: "0 this month", kind: "pending", Icon: Clock3 },
  { label: "In Progress", value: "1", note: "0 this month", kind: "progress", Icon: RefreshCw },
  { label: "Resolved", value: "1", note: "1 this month", kind: "resolved", Icon: Check },
];

function StatusPill({ status }) {
  return (
    <span className={`cd-status cd-status-${status.toLowerCase().replaceAll(" ", "-")}`}>
      {status}
    </span>
  );
}

function GrievanceTypeIcon({ type }) {
  if (type === "water") return <Droplet size={23} />;
  if (type === "road") return <Construction size={23} />;
  return <Lightbulb size={23} />;
}

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const navItems = [
    { label: "Dashboard", Icon: House },
    { label: "My Grievances", Icon: FileText },
    { label: "Track Status", Icon: Search },
    { label: "Notifications", Icon: Bell, count: 2 },
  ];

  const quickActions = [
    {
      title: "Track Status",
      text: "Check your complaint progress",
      Icon: Plus,
      action: "Track Status",
    },
    {
      title: "My Grievances",
      text: "View your submitted complaints",
      Icon: FileText,
      action: "My Grievances",
    },
    {
      title: "Notifications",
      text: "View recent updates",
      Icon: Bell,
      action: "Notifications",
      count: 2,
    },
    {
      title: "Profile",
      text: "Manage your account details",
      Icon: UserRound,
      action: "Profile",
    },
    {
      title: "Help & Support",
      text: "Get assistance and FAQs",
      Icon: Headphones,
      action: "Help & Support",
    },
  ];

  const selectNav = (label) => {
    setActiveNav(label);
    setMobileMenuOpen(false);
  };

  const filteredGrievances = grievances.filter((item) =>
    `${item.title} ${item.id} ${item.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const displayedGrievances = showAll
    ? filteredGrievances
    : filteredGrievances.slice(0, 3);

  return (
    <div className="cd-app-shell">
      <header className="cd-top-header">
        <button
          className="cd-mobile-menu"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className="cd-brand">
          <div className="cd-brand-mark">
            <Landmark size={28} />
          </div>
          <div className="cd-brand-copy">
            <div className="cd-brand-title">
              SPGMS <span className="cd-citizen-tag">CITIZEN</span>
            </div>
            <div className="cd-brand-subtitle">
              Smart Public Grievance Management System
            </div>
          </div>
        </div>

        <label className="cd-header-search">
          <Search size={18} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search grievances, ID, or location..."
            aria-label="Search grievances"
          />
          <kbd>Ctrl + K</kbd>
        </label>

        <div className="cd-header-right">
          <button
            className="cd-notification-button"
            type="button"
            aria-label="Notifications"
            onClick={() => selectNav("Notifications")}
          >
            <Bell size={22} />
            <span className="cd-notification-count">2</span>
          </button>

          <button
            className="cd-user-menu"
            type="button"
            onClick={() => selectNav("Profile")}
          >
            <span className="cd-header-avatar">S</span>
            <span>Suresh</span>
            <ChevronDown size={16} />
          </button>
        </div>
      </header>

      <div className="cd-dashboard-layout">
        {mobileMenuOpen && (
          <button
            className="cd-sidebar-backdrop"
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <aside className={`cd-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <div className="cd-profile-summary">
            <div className="cd-profile-avatar">S</div>
            <strong>Suresh</strong>
            <span className="cd-active-citizen">
              <i /> Active Citizen
            </span>
          </div>

          <nav className="cd-sidebar-nav" aria-label="Main navigation">
            {navItems.map(({ label, Icon, count }) => (
              <button
                key={label}
                type="button"
                className={`cd-nav-item ${activeNav === label ? "active" : ""}`}
                onClick={() => selectNav(label)}
              >
                <span className="cd-nav-icon">
                  <Icon size={20} />
                </span>

                <span className="cd-nav-label">{label}</span>

                {count && (
                  <span className="cd-nav-count">{count}</span>
                )}

                {activeNav === label && (
                  <ChevronRight
                    className="cd-nav-chevron"
                    size={16}
                  />
                )}
              </button>
            ))}
          </nav>

          <button
            className="cd-signout-button"
            type="button"
            onClick={() => selectNav("Sign Out")}
          >
            <span className="cd-signout-icon">
              <LogOut size={20} />
            </span>
            <span>Sign Out</span>
          </button>
        </aside>

        <main className="cd-main-content">
          <section className="cd-welcome-row">
            <div>
              <h1>
                Welcome back, Suresh! <span className="cd-wave">👋</span>
              </h1>
              <p>
                Here’s your civic overview. Report issues, track progress,
                and help build a better Karnataka.
              </p>
            </div>
          </section>

          <section className="cd-stats-row" aria-label="Grievance summary">
            {stats.map(({ label, value, note, kind, Icon }) => (
              <article className={`cd-stat-card cd-stat-${kind}`} key={label}>
                <div className="cd-stat-icon">
                  <Icon size={31} />
                </div>

                <div className="cd-stat-info">
                  <span className="cd-stat-label">{label}</span>
                  <strong>{value}</strong>
                  <span className="cd-stat-note">{note}</span>
                </div>

                <button
                  className="cd-stat-arrow"
                  type="button"
                  aria-label={`View ${label}`}
                  onClick={() => selectNav(label)}
                >
                  <ChevronRight size={17} />
                </button>
              </article>
            ))}
          </section>

          <section className="cd-civic-hero-banner">
            <div className="cd-banner-photo" />
            <div className="cd-banner-shade" />

            <div className="cd-banner-copy">
              <div className="cd-banner-eyebrow">
                <Megaphone size={18} />
                YOUR VOICE MATTERS
                <span />
              </div>

              <h2>
                Report <em>Civic</em> Issues
              </h2>

              <p>Water <b>•</b> Electricity <b>•</b> Roads</p>
            </div>

            <div className="cd-banner-actions">
              <button type="button" onClick={() => selectNav("My Grievances")}>
                <Droplet size={21} />
                Water
              </button>
              <button type="button" onClick={() => selectNav("My Grievances")}>
                <span className="cd-bolt">ϟ</span>
                Electricity
              </button>
              <button type="button" onClick={() => selectNav("My Grievances")}>
                <Construction size={21} />
                Roads
              </button>
            </div>
          </section>

          <div className="cd-lower-grid">
            <section className="cd-panel cd-recent-panel">
              <div className="cd-panel-heading">
                <h2>
                  <FileText size={24} />
                  Recent Grievances
                </h2>

                <button
                  className="cd-view-all"
                  type="button"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "Show Less" : "View All"}
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="cd-grievance-list">
                {displayedGrievances.length > 0 ? (
                  displayedGrievances.map((item) => (
                    <article className="cd-grievance-row" key={item.id}>
                      <img
                        className="cd-grievance-thumb"
                        src={item.image}
                        alt=""
                      />

                      <div className={`cd-grievance-type cd-type-${item.type}`}>
                        <GrievanceTypeIcon type={item.type} />
                      </div>

                      <div className="cd-grievance-details">
                        <strong>{item.title}</strong>
                        <div className="cd-grievance-meta">
                          <span>ID: {item.id}</span>
                          <i />
                          <span>{item.date}</span>
                        </div>
                      </div>

                      <StatusPill status={item.status} />

                      <button
                        className="cd-row-arrow"
                        type="button"
                        aria-label={`View ${item.title}`}
                        onClick={() => selectNav("Track Status")}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </article>
                  ))
                ) : (
                  <div className="cd-empty-state">
                    No grievances match “{search}”.
                  </div>
                )}
              </div>
            </section>

            <section className="cd-panel cd-quick-panel">
              <div className="cd-panel-heading">
                <h2>
                  <LayoutGrid size={25} />
                  Quick Actions
                </h2>
              </div>

              <div className="cd-quick-actions-grid">
                {quickActions.map(({ title, text, Icon, action, count }) => (
                  <button
                    className="cd-quick-action"
                    key={title}
                    type="button"
                    onClick={() => selectNav(action)}
                  >
                    <span className="cd-quick-icon">
                      <Icon size={25} />
                      {count && <i>{count}</i>}
                    </span>

                    <span className="cd-quick-copy">
                      <strong>{title}</strong>
                      <small>{text}</small>
                    </span>

                    <ChevronRight
                      className="cd-quick-chevron"
                      size={18}
                    />
                  </button>
                ))}
              </div>
            </section>
          </div>

          <footer className="cd-footer">
            <span>
              <MapPin size={13} />
              Karnataka Citizen Services
            </span>
            <span>
              <CalendarDays size={13} />
              Updated 18 Oct 2026
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
