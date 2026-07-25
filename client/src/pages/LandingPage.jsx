import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1d4ed8 60%, #2563eb 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1300px",
          textAlign: "center",
          color: "white",
        }}
      >
        {/* Government Logo */}

        {/* Government Title */}

<div
  style={{
    marginTop: "45px",      // Moves everything down
    marginBottom: "40px",
    textAlign: "center",
  }}
>
  <div
    style={{
      fontSize: "70px",
      lineHeight: "1",
      marginBottom: "12px",
    }}
  >
    🏛
  </div>

  <p
    style={{
      fontSize: "24px",
      fontWeight: "600",
      color: "#dbeafe",
      letterSpacing: "0.8px",
      margin: 0,
    }}
  >
    Government of Karnataka
  </p>
</div>

        {/* Heading */}

        <h1
          style={{
            fontSize: "50px",
            fontWeight: "800",
            color: "#ffffff",
            lineHeight: "1.2",
            marginBottom: "15px",
          }}
        >
          Smart Public Grievance Management System
        </h1>

        <div
          style={{
            width: "120px",
            height: "4px",
            background: "#93c5fd",
            margin: "20px auto",
            borderRadius: "20px",
          }}
        />

        <p
          style={{
            fontSize: "24px",
            color: "#dbeafe",
            marginBottom: "55px",
          }}
        >
          AI Powered Complaint Management Platform
        </p>

        {/* Portal Cards */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch",
            gap: "35px",
            flexWrap: "wrap",
          }}
        >
          {/* ================= Citizen Portal ================= */}

          <div
            style={{
              background: "#ffffff",
              width: "420px",
              borderRadius: "20px",
              padding: "35px",
              boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
              color: "#111827",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                background: "#dbeafe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: "45px",
              }}
            >
              👤
            </div>

            <h2
              style={{
                color: "#2563eb",
                fontSize: "32px",
                marginBottom: "20px",
              }}
            >
              Citizen Portal
            </h2>

            <hr
              style={{
                opacity: 0.3,
                marginBottom: "25px",
              }}
            />

            <div
              style={{
                textAlign: "left",
                lineHeight: "2",
                fontSize: "18px",
              }}
            >
              <p>✔ Register Complaints</p>

              <p>✔ Track Complaint Status</p>

              <p>✔ View Complaint History</p>

              <p>✔ Manage Profile</p>
            </div>

            <button
              onClick={() => navigate("/home")}
              style={{
                marginTop: "20px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "14px 28px",
                width: "240px",
                cursor: "pointer",
                fontSize: "17px",
                fontWeight: "600",
              }}
            >
              Enter Citizen Portal
            </button>
                      </div>

          {/* ================= Government Officer Portal ================= */}

          <div
            style={{
              background: "#ffffff",
              width: "420px",
              borderRadius: "20px",
              padding: "35px",
              boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
              color: "#111827",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                background: "#dcfce7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: "45px",
              }}
            >
              🏛
            </div>

            <h2
              style={{
                color: "#15803d",
                fontSize: "30px",
                marginBottom: "20px",
              }}
            >
              Government Officer Portal
            </h2>

            <hr
              style={{
                opacity: 0.3,
                marginBottom: "25px",
              }}
            />

            <div
              style={{
                textAlign: "left",
                lineHeight: "2",
                fontSize: "18px",
              }}
            >
              <p>✔ View Complaints</p>

              <p>✔ Update Complaint Status</p>

              <p>✔ Reports & Analytics</p>

              <p>✔ Officer Dashboard</p>
            </div>

            <button
              onClick={() => navigate("/officer/login")}
              style={{
                marginTop: "20px",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "14px 28px",
                width: "240px",
                cursor: "pointer",
                fontSize: "17px",
                fontWeight: "600",
              }}
            >
              Officer Login
            </button>
          </div>
        </div>

        {/* Footer */}

        <p
          style={{
            marginTop: "60px",
            color: "#dbeafe",
            fontSize: "17px",
          }}
        >
          © 2026 Smart Public Grievance Management System
        </p>

        <p
          style={{
            marginTop: "8px",
            color: "#bfdbfe",
            fontSize: "15px",
          }}
        >
          Building a better tomorrow for our communities.
        </p>
      </div>
    </div>
  );
}