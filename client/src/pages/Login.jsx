function Login() {
  return (
    <div style={{ width: "350px", margin: "50px auto" }}>
      <h2>Citizen Login</h2>

      <form>
        <input
          type="email"
          placeholder="Enter Email"
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        <input
          type="password"
          placeholder="Enter Password"
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
          Login
        </button>
      </form>

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Don't have an account? Register
      </p>
    </div>
  );
}

export default Login;