import { useEffect, useState } from "react";

export default function LiveClock() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        textAlign: "center",
      }}
    >
      <h3>🕒 Current Time</h3>

      <h2>{dateTime.toLocaleTimeString()}</h2>

      <p>{dateTime.toDateString()}</p>
    </div>
  );
}