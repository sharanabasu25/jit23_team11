import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OfficerLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (
      email === "officer@karnataka.gov.in" &&
      password === "admin123"
    ) {
      setError("");
      navigate("/officer/dashboard");
    } else {
      setError("Invalid Officer Email or Password");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        background: "#f5f7fb",
      }}
    >
      <div
        style={{
          width: "420px",
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 0 15px rgba(0,0,0,0.15)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#1e3a8a",
            marginBottom: "25px",
          }}
        >
          🏛 Government Officer Login
        </h2>

        <form onSubmit={handleLogin}>
          <label>Official Email</label>

          <input
            type="email"
            placeholder="Enter Official Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />

          {error && (
            <p
              style={{
                color: "red",
                marginBottom: "15px",
                fontWeight: "bold",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            style={buttonStyle}
          >
            Login
          </button>
        </form>

        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            background: "#eef4ff",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        >
          <strong>Demo Credentials</strong>

          <p>Email: officer@karnataka.gov.in</p>

          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "20px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "15px",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "16px",
};