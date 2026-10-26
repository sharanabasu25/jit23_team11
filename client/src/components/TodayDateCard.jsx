import { Calendar } from "lucide-react";

export default function TodayDateCard({ dateString }) {
  // Format current date matching screenshot format: Monday, 26 October 2026
  const formattedDate =
    dateString ||
    new Date().toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="op-today-card">
      <div className="op-today-icon">
        <Calendar size={20} />
      </div>
      <div>
        <p className="op-today-label">Today</p>
        <p className="op-today-date">{formattedDate}</p>
      </div>
    </div>
  );
}
