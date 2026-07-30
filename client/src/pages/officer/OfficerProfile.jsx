import { useNavigate } from "react-router-dom";
import OfficerSidebar from "../../components/OfficerSidebar";
import OfficerTopbar from "../../components/OfficerTopbar";

export default function OfficerProfile() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Access Denied</h2>
        <p>Please log in to view the officer profile.</p>
        <button onClick={() => navigate("/officer/login")} style={{ padding: "10px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Go to Login</button>
      </div>
    );
  }

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
              value={user.fullName}
              readOnly
            />

            <Label text="Officer User ID" />
            <Input
              name="officerId"
              value={user._id}
              readOnly
            />

            <Label text="Email" />
            <Input
              name="email"
              value={user.email}
              readOnly
            />

            <Label text="Phone Number" />
            <Input
              name="phone"
              value={user.phoneNumber || "N/A"}
              readOnly
            />

            <Label text="System Permission Scope" />
            <Input
              name="role"
              value={user.role}
              readOnly
            />
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
        background: "#f8fafc",
        color: "#475569"
      }}
    />
  );
}