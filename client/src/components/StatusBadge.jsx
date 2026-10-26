import { Check, Clock, RefreshCw, Eye } from "lucide-react";

export default function StatusBadge({ status }) {
  const norm = (status || "").toLowerCase().replace(/\s/g, "-");

  if (norm === "resolved") {
    return (
      <span className="op-badge resolved">
        <Check size={13} strokeWidth={2.6} />
        Resolved
      </span>
    );
  }

  if (norm === "pending") {
    return (
      <span className="op-badge pending">
        <Clock size={13} strokeWidth={2.4} />
        Pending
      </span>
    );
  }

  if (norm === "in-progress" || norm === "in_progress") {
    return (
      <span className="op-badge in-progress">
        <RefreshCw size={13} strokeWidth={2.4} />
        In Progress
      </span>
    );
  }

  if (norm === "seen") {
    return (
      <span className="op-badge seen">
        <Eye size={13} strokeWidth={2.4} />
        Seen
      </span>
    );
  }

  return <span className="op-badge seen">{status || "Unknown"}</span>;
}
