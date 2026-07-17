import { useState } from "react";
import OfficerSidebar from "../../components/OfficerSidebar";
import OfficerTopbar from "../../components/OfficerTopbar";

export default function OfficerProfile() {
  const [officer, setOfficer] = useState({
    name: "Rajesh Kumar",
    officerId: "OFF102",
    department: "Public Works Department",
    email: "rajesh@spgms.gov.in",
    phone: "9876543210",
  });

  const handleChange = (e) => {
    setOfficer({
      ...officer,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    alert("Profile updated successfully!");
  };

  return (
    <div style={{ display: "flex" }}>
      <OfficerSidebar />

      <div
        style={{
          flex: 1,
          background: "#f5f7fb",
          minHeight: "100vh",
        }}
      >
        <OfficerTopbar />

        <div style={{ padding: "30px" }}>
          <h1>Officer Profile</h1>

          <div
            style={{
              marginTop: "25px",
              background: "white",
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              maxWidth: "700px",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "25px" }}>
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  background: "#2563eb",
                  color: "white",
                  fontSize: "45px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "auto",
                }}
              >
                👮
              </div>
            </div>

            <Label text="Officer Name" />
            <Input
              name="name"
              value={officer.name}
              onChange={handleChange}
            />

            <Label text="Officer ID" />
            <Input
              name="officerId"
              value={officer.officerId}
              onChange={handleChange}
            />

            <Label text="Department" />
            <Input
              name="department"
              value={officer.department}
              onChange={handleChange}
            />

            <Label text="Email" />
            <Input
              name="email"
              value={officer.email}
              onChange={handleChange}
            />

            <Label text="Phone Number" />
            <Input
              name="phone"
              value={officer.phone}
              onChange={handleChange}
            />

            <button
              onClick={handleSave}
              style={{
                marginTop: "20px",
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "12px 20px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ text }) {
  return (
    <label
      style={{
        display: "block",
        marginTop: "15px",
        marginBottom: "6px",
        fontWeight: "bold",
      }}
    >
      {text}
    </label>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: "6px",
        border: "1px solid #ccc",
      }}
    />
  );
}