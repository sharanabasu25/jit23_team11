import { useState } from "react";
import OfficerHeader from "./OfficerHeader";
import OfficerSidebar from "./OfficerSidebar";
import "../officerTheme.css";

export default function OfficerLayout({ children, onSearchChange, searchValue }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="op-portal-root">
      {/* Shared Officer Top Header */}
      <OfficerHeader
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        onSearchChange={onSearchChange}
        searchValue={searchValue}
      />

      {/* Main Area with Sidebar and Content Pane */}
      <div className="op-main-wrapper">
        <OfficerSidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        <main className="op-content-pane">
          {children}
        </main>
      </div>
    </div>
  );
}
