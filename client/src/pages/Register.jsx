import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        fullName,
        email,
        phoneNumber,
        password
      });

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div style={{ width: "400px", margin: "50px auto", padding: "20px", background: "white", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center", color: "#1e3a8a", marginBottom: "20px" }}>Citizen Registration</h2>

      <form onSubmit={handleRegister}>
        {error && <p style={{ color: "red", fontWeight: "bold", fontSize: "14px", marginBottom: "15px" }}>{error}</p>}
        {success && <p style={{ color: "green", fontWeight: "bold", fontSize: "14px", marginBottom: "15px" }}>{success}</p>}

        <label><b>Full Name</b></label>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={inputStyle}
          required
        />

        <label><b>Email Address</b></label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />

        <label><b>Phone Number</b></label>
        <input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          style={inputStyle}
          required
        />

        <label><b>Password</b></label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
        />

        <label><b>Confirm Password</b></label>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle}
          required
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "16px",
            marginTop: "10px"
          }}
        >
          Register
        </button>
      </form>

      <p style={{ marginTop: "20px", textAlign: "center" }}>
        Already have an account? <Link to="/login" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "bold" }}>Login</Link>
      </p>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  marginBottom: "15px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  boxSizing: "border-box"
};

export default Register;