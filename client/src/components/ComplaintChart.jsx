import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ComplaintChart({
  pending,
  resolved,
  progress,
}) {
  const data = {
    labels: ["Pending", "Resolved", "In Progress"],

    datasets: [
      {
        data: [pending, resolved, progress],

        backgroundColor: [
          "#f59e0b",
          "#22c55e",
          "#3b82f6",
        ],
      },
    ],
  };

  return (
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "10px",
        marginTop: "30px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h2>Complaint Statistics</h2>

      <div
        style={{
          width: "350px",
          margin: "auto",
        }}
      >
        <Pie data={data} />
      </div>
    </div>
  );
}