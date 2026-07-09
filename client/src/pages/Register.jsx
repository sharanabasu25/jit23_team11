function Register() {
  return (
    <div style={{ width: "400px", margin: "50px auto" }}>
      <h2>Citizen Registration</h2>

      <form>
        <input
          type="text"
          placeholder="Full Name"
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        <input
          type="email"
          placeholder="Email"
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        <input
          type="tel"
          placeholder="Phone Number"
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        <input
          type="password"
          placeholder="Password"
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Register
        </button>
      </form>

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Already have an account? Login
      </p>
    </div>
  );
}

export default Register;