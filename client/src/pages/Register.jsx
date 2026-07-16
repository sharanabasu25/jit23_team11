import { useState } from "react";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { fullName, email, phone, password, confirmPassword } = formData;

    // Check if any field is empty
    if (
      fullName.trim() === "" ||
      email.trim() === "" ||
      phone.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      alert("All fields are required!");
      return;
    }

    // Check password match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    alert("Registration Successful!");

    console.log(formData);

    // Clear the form
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div style={{ width: "400px", margin: "50px auto" }}>
      <h2 style={{ textAlign: "center" }}>Citizen Registration</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
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
            fontSize: "16px",
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