export default function PriorityBadge({ priority }) {
  const norm = (priority || "").toLowerCase();

  return (
    <span className={`op-priority-badge ${norm}`}>
      <span className="op-priority-dot" />
      {priority || "Normal"}
    </span>
  );
}
