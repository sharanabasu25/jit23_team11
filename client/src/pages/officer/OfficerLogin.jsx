import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function OfficerLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      // Enforce Role Restriction on login screen
      if (response.data.role !== "Officer") {
        throw new Error("Access Denied - This portal is restricted to Government Officers.");
      }

      // Save officer session credentials to local storage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("officerLoggedIn", "true");

      navigate("/officer/dashboard");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || err.message || "Invalid Officer Email or Password."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg,#dbeafe,#eff6ff)",
      }}
    >
      <div
        style={{
          width: "430px",
          background: "#fff",
          padding: "35px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
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
          <label style={{ fontWeight: "bold" }}>
            Official Email
          </label>

          <input
            type="email"
            placeholder="Enter Official Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />

          <label style={{ fontWeight: "bold" }}>
            Password
          </label>

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
                fontWeight: "bold",
                marginBottom: "15px",
                fontSize: "14px"
              }}
            >
              {error}
            </p>
          )}

          <button type="submit" disabled={submitting} style={buttonStyle}>
            {submitting ? "Verifying..." : "Login"}
          </button>
        </form>

        <div
          style={{
            marginTop: "25px",
            padding: "15px",
            background: "#eef4ff",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        >
          <strong>Demo Officer Credentials</strong>
          <p style={{ margin: "5px 0" }}>
            Create an officer account in the database (or use your test script details) to authenticate.
          </p>
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
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
};