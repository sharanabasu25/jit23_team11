import { Droplets, Zap, ShieldAlert, Trash2, Lightbulb } from "lucide-react";

export default function CategoryBadge({ category }) {
  const norm = (category || "").toLowerCase();

  let Icon = ShieldAlert;
  let color = "#008F83";

  if (norm.includes("water")) {
    Icon = Droplets;
    color = "#0284C7";
  } else if (norm.includes("electric") || norm.includes("power")) {
    Icon = Zap;
    color = "#F59E0B";
  } else if (norm.includes("pothole") || norm.includes("road")) {
    Icon = ShieldAlert;
    color = "#0D9488";
  } else if (norm.includes("garbage") || norm.includes("waste")) {
    Icon = Trash2;
    color = "#6366F1";
  } else if (norm.includes("light") || norm.includes("street")) {
    Icon = Lightbulb;
    color = "#EAB308";
  }

  return (
    <div className="op-category-cell">
      <Icon size={16} color={color} strokeWidth={2.4} />
      <span>{category}</span>
    </div>
  );
}
