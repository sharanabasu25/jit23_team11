function Profile() {
  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "30px",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <h1
        style={{
          color: "#2563eb",
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        Citizen Profile
      </h1>

      <div style={{ lineHeight: "2" }}>
        <p><strong>Name:</strong> Sharan</p>
        <p><strong>Email:</strong> sharan@example.com</p>
        <p><strong>Phone:</strong> +91 9876543210</p>
        <p><strong>Address:</strong> Hubballi, Karnataka</p>
        <p><strong>City:</strong> Hubballi</p>
        <p><strong>State:</strong> Karnataka</p>
      </div>

      <button
        style={{
          marginTop: "20px",
          width: "100%",
          padding: "12px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Edit Profile
      </button>
    </div>
  );
}

export default Profile;