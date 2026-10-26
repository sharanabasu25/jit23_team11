import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  CreditCard,
  Mail,
  Phone,
  Shield,
  Pencil,
  Check,
  Save,
  Building2
} from "lucide-react";
import OfficerLayout from "../../components/OfficerLayout";
import KarnatakaWatermark from "../../components/KarnatakaWatermark";
import { sampleOfficer } from "../../data/officerSampleData";
import officerAvatarImg from "../../assets/officer-avatar.png";

export default function OfficerProfile() {
  const [officer, setOfficer] = useState(sampleOfficer);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...sampleOfficer });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        const merged = {
          ...sampleOfficer,
          ...parsed,
          fullName: parsed.fullName || sampleOfficer.fullName,
          _id: parsed._id || sampleOfficer._id,
          email: parsed.email || sampleOfficer.email,
          phoneNumber: parsed.phoneNumber || sampleOfficer.phoneNumber,
          role: parsed.role || sampleOfficer.role
        };
        setOfficer(merged);
        setFormData(merged);
      }
    } catch {
      // keep sample
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setOfficer(formData);
    localStorage.setItem("user", JSON.stringify(formData));
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <OfficerLayout>
      {/* Top Breadcrumb & Page Header matching Screenshot 2 */}
      <div className="op-page-header-container">
        <div className="op-page-header-text">
          <nav className="op-breadcrumb" aria-label="Breadcrumb">
            <Link to="/officer/dashboard">Home</Link>
            <span className="op-breadcrumb-separator">&gt;</span>
            <span className="op-breadcrumb-current">Profile</span>
          </nav>

          <h1 className="op-page-title">Officer Profile</h1>
          <p className="op-page-subtitle">
            View your officer details and account information.
          </p>
        </div>
      </div>

      {/* Main Container with Karnataka Background Watermark */}
      <div className="op-profile-container">
        <KarnatakaWatermark />

        <div className="op-profile-card">
          {/* Centered Circular Officer Portrait matching Screenshot 2 */}
          <div className="op-profile-avatar-wrap">
            <div className="op-profile-avatar-inner">
              <img
                src={officerAvatarImg}
                alt={officer.fullName}
                className="op-profile-avatar-img"
                onError={(e) => {
                  e.currentTarget.src = "/officer-avatar.png";
                }}
              />

              <button
                type="button"
                className="op-profile-edit-avatar-btn"
                onClick={() => setIsEditing(!isEditing)}
                title="Edit Profile"
              >
                <Pencil size={15} strokeWidth={2.4} />
              </button>
            </div>
          </div>

          {saveSuccess && (
            <div
              style={{
                backgroundColor: "#D1FAE5",
                color: "#065F46",
                padding: "10px 16px",
                borderRadius: "8px",
                marginBottom: "20px",
                fontSize: "13.5px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                justifyContent: "center"
              }}
            >
              <Check size={16} />
              <span>Officer profile updated successfully!</span>
            </div>
          )}

          {/* Profile Fields matching Screenshot 2 */}
          <form onSubmit={handleSave} className="op-profile-fields">
            {/* Officer Name */}
            <div className="op-profile-field-group">
              <label className="op-profile-label">
                <User size={16} color="#008F83" />
                <span>Officer Name</span>
              </label>
              <div className="op-profile-input-wrap">
                <input
                  type="text"
                  name="fullName"
                  className="op-profile-input"
                  value={formData.fullName}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  required
                />
              </div>
            </div>

            {/* Officer User ID */}
            <div className="op-profile-field-group">
              <label className="op-profile-label">
                <CreditCard size={16} color="#008F83" />
                <span>Officer User ID</span>
              </label>
              <div className="op-profile-input-wrap">
                <input
                  type="text"
                  name="_id"
                  className="op-profile-input"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  value={formData._id}
                  readOnly
                />
              </div>
            </div>

            {/* Email */}
            <div className="op-profile-field-group">
              <label className="op-profile-label">
                <Mail size={16} color="#008F83" />
                <span>Email</span>
              </label>
              <div className="op-profile-input-wrap">
                <input
                  type="email"
                  name="email"
                  className="op-profile-input"
                  value={formData.email}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="op-profile-field-group">
              <label className="op-profile-label">
                <Phone size={16} color="#008F83" />
                <span>Phone Number</span>
              </label>
              <div className="op-profile-input-wrap">
                <input
                  type="text"
                  name="phoneNumber"
                  className="op-profile-input"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  required
                />
              </div>
            </div>

            {/* System Permission Scope */}
            <div className="op-profile-field-group">
              <label className="op-profile-label">
                <Shield size={16} color="#008F83" />
                <span>System Permission Scope</span>
              </label>
              <div className="op-profile-input-wrap">
                <input
                  type="text"
                  name="role"
                  className="op-profile-input"
                  value={formData.role}
                  readOnly
                />
              </div>
            </div>

            {/* Edit / Save controls */}
            {isEditing && (
              <div style={{ display: "flex", gap: "12px", marginTop: "14px" }}>
                <button
                  type="submit"
                  className="op-btn-primary"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  <Save size={16} />
                  <span>Save Changes</span>
                </button>
                <button
                  type="button"
                  className="op-btn-secondary"
                  onClick={() => {
                    setFormData(officer);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </OfficerLayout>
  );
}