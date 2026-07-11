function ComplaintDetails() {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "30px",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <h1 style={{ color: "#2563eb", marginBottom: "20px" }}>
        Complaint Details
      </h1>

      <p><strong>Complaint ID:</strong> 101</p>
      <p><strong>Issue:</strong> Pothole</p>

      <p>
        <strong>Description:</strong><br />
        Large pothole near the Bus Stand causing traffic issues and accidents.
      </p>

      <p><strong>Department:</strong> Road Department</p>
      <p><strong>Priority:</strong> High</p>
      <p><strong>Status:</strong> Pending</p>

      <hr />

      <h3>Officer Details</h3>

      <p><strong>Officer Name:</strong> Ramesh Kumar</p>
      <p><strong>Email:</strong> ramesh@gov.in</p>
      <p><strong>Phone:</strong> 9876543210</p>

      <hr />

      <h3>Complaint Image</h3>

      <div
        style={{
          width: "100%",
          height: "220px",
          backgroundColor: "#e5e7eb",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        Complaint Image Placeholder
      </div>

      <h3>Resolution Image</h3>

      <div
        style={{
          width: "100%",
          height: "220px",
          backgroundColor: "#e5e7eb",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        Resolution Image Placeholder
      </div>

      <h3>Officer Remarks</h3>

      <textarea
        rows="5"
        readOnly
        value="Complaint received. Repair work will begin shortly."
        style={{
          width: "100%",
          padding: "10px",
          resize: "none",
        }}
      />
    </div>
  );
}

export default ComplaintDetails;