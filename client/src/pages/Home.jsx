import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          textAlign: "center",
          padding: "80px 20px",
          backgroundColor: "#f8fafc",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            color: "#1e293b",
            maxWidth: "1000px",
            margin: "0 auto",
            lineHeight: "1.2",
            fontWeight: "bold",
          }}
        >
          Smart Public Grievance Management System
        </h1>

        <p
          style={{
            fontSize: "22px",
            color: "#475569",
            marginTop: "20px",
            fontWeight: "500",
          }}
        >
          AI-Powered Complaint Management for Citizens and Government Officers
        </p>

        <p
          style={{
            fontSize: "18px",
            color: "#64748b",
            maxWidth: "850px",
            margin: "20px auto",
            lineHeight: "30px",
          }}
        >
          Report public issues like potholes, garbage dumping, water leakage,
          drainage blockage, and streetlight failures. Our AI-powered system
          automatically classifies complaints, assigns departments, and helps
          government officers resolve issues efficiently.
        </p>

        <div style={{ marginTop: "35px" }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              padding: "14px 28px",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer",
              marginRight: "15px",
            }}
          >
            Report Complaint
          </button>

          <button
            onClick={() => navigate("/login")}
            style={{
              backgroundColor: "#16a34a",
              color: "white",
              padding: "14px 28px",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Track Complaint
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section
        style={{
          padding: "60px 30px",
          textAlign: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <h2
          style={{
            fontSize: "38px",
            marginBottom: "40px",
            color: "#1e293b",
          }}
        >
          Our Features
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "25px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              padding: "25px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <h3>📍 Geo Tagging</h3>
            <p>
              Automatically captures the complaint location using GPS and
              converts it into a readable address.
            </p>
          </div>

          <div
            style={{
              background: "#ffffff",
              padding: "25px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <h3>🤖 AI Classification</h3>
            <p>
              Detects the issue from the uploaded image and automatically
              assigns it to the correct government department.
            </p>
          </div>

          <div
            style={{
              background: "#ffffff",
              padding: "25px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <h3>📝 Auto Description</h3>
            <p>
              AI generates a complaint description automatically, with an option
              for manual editing.
            </p>
          </div>

          <div
            style={{
              background: "#ffffff",
              padding: "25px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <h3>📷 Image Upload</h3>
            <p>
              Upload complaint images to help government officers understand the
              issue clearly.
            </p>
          </div>

          <div
            style={{
              background: "#ffffff",
              padding: "25px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <h3>📊 Complaint Tracking</h3>
            <p>
              Track complaint status from submission to resolution in real time.
            </p>
          </div>

          <div
            style={{
              background: "#ffffff",
              padding: "25px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <h3>🔔 Real-Time Updates</h3>
            <p>
              Receive instant notifications whenever the assigned officer
              updates your complaint.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;