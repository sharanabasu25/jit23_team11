function SubmitComplaint() {
  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "30px",
        background: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#2563eb" }}>
        Submit New Complaint
      </h1>

      <form>
        <label><b>Upload Complaint Image</b></label>
        <br />
        <input
          type="file"
          accept="image/*"
          style={{ marginTop: "10px", marginBottom: "20px" }}
        />

        <br />

        <label><b>Problem Description</b></label>

        <div style={{ margin: "15px 0" }}>
          <input type="radio" name="description" defaultChecked />
          {" "}Auto Description

          <input
            type="radio"
            name="description"
            style={{ marginLeft: "20px" }}
          />
          {" "}Manual Description
        </div>

        <textarea
          rows="5"
          placeholder="Enter complaint description..."
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
          }}
        />

        <label><b>Latitude</b></label>
        <input
          type="text"
          placeholder="Latitude"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <label><b>Longitude</b></label>
        <input
          type="text"
          placeholder="Longitude"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <label><b>Address</b></label>
        <input
          type="text"
          placeholder="Current Address"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <label><b>Department</b></label>
        <input
          type="text"
          placeholder="AI will detect department"
          readOnly
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            background: "#f1f5f9",
          }}
        />

        <label><b>Priority</b></label>
        <input
          type="text"
          placeholder="AI will assign priority"
          readOnly
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            background: "#f1f5f9",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "15px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Submit Complaint
        </button>
      </form>
    </div>
  );
}

export default SubmitComplaint;