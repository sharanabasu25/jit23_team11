import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedOfficerRoute from "./components/ProtectedOfficerRoute";

// Landing Page
import LandingPage from "./pages/LandingPage";

// Citizen Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SubmitComplaint from "./pages/SubmitComplaint";
import MyComplaints from "./pages/MyComplaints";
import ComplaintDetails from "./pages/ComplaintDetails";
import Profile from "./pages/Profile";

// Government Officer Pages
import OfficerLogin from "./pages/officer/OfficerLogin";
import OfficerDashboard from "./pages/officer/OfficerDashboard";
import OfficerComplaints from "./pages/officer/OfficerComplaints";
import OfficerComplaintDetails from "./pages/officer/OfficerComplaintDetails";
import OfficerNotifications from "./pages/officer/OfficerNotifications";
import OfficerReports from "./pages/officer/OfficerReports";
import OfficerProfile from "./pages/officer/OfficerProfile";

function Layout() {
  const location = useLocation();

  // Hide Citizen Navbar & Footer on Officer pages
  const isOfficerRoute = location.pathname.startsWith("/officer");

  return (
    <>
      {!isOfficerRoute && <Navbar />}

      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Citizen Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/submit-complaint" element={<SubmitComplaint />} />
        <Route path="/my-complaints" element={<MyComplaints />} />
        <Route path="/complaint/:id" element={<ComplaintDetails />} />
        <Route path="/profile" element={<Profile />} />

        {/* Government Officer Routes */}
        <Route path="/officer/login" element={<OfficerLogin />} />
        <Route
  path="/officer/dashboard"
  element={
    <ProtectedOfficerRoute>
      <OfficerDashboard />
    </ProtectedOfficerRoute>
  }
/>
        <Route
  path="/officer/complaints"
  element={
    <ProtectedOfficerRoute>
      <OfficerComplaints />
    </ProtectedOfficerRoute>
  }
/>
        <Route
  path="/officer/complaint/:id"
  element={
    <ProtectedOfficerRoute>
      <OfficerComplaintDetails />
    </ProtectedOfficerRoute>
  }
/>
        <Route
  path="/officer/notifications"
  element={
    <ProtectedOfficerRoute>
      <OfficerNotifications />
    </ProtectedOfficerRoute>
  }
/>
        <Route
  path="/officer/reports"
  element={
    <ProtectedOfficerRoute>
      <OfficerReports />
    </ProtectedOfficerRoute>
  }
/>
        <Route
  path="/officer/profile"
  element={
    <ProtectedOfficerRoute>
      <OfficerProfile />
    </ProtectedOfficerRoute>
  }
/>
      </Routes>

      {!isOfficerRoute && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}