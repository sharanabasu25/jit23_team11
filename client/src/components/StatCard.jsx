import { ChevronRight } from "lucide-react";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accentColor = "#008F83",
  iconBg = "#D5F1EC",
  iconColor = "#006B63",
  onClick,
}) {
  return (
    <div
      className="op-stat-card"
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div
        className="op-stat-card-top-accent"
        style={{ backgroundColor: accentColor }}
      />

      <div
        className="op-stat-icon-wrap"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        {Icon && <Icon size={26} strokeWidth={2.2} />}
      </div>

      <div className="op-stat-info">
        <div className="op-stat-title-row">
          <span className="op-stat-title">{title}</span>
          <ChevronRight size={18} className="op-stat-arrow" />
        </div>

        <div className="op-stat-value">{value}</div>

        {subtitle && (
          <p className="op-stat-subtitle">
            <span>↳</span> {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
