import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
import OfficerProfile from "./pages/officer/OfficerProfile";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Citizen Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/submit-complaint" element={<SubmitComplaint />} />
        <Route path="/my-complaints" element={<MyComplaints />} />
        <Route path="/complaint/:id" element={<ComplaintDetails />} />
        <Route path="/profile" element={<Profile />} />

        {/* Government Officer Routes */}
        <Route path="/officer/login" element={<OfficerLogin />} />
        <Route path="/officer/dashboard" element={<OfficerDashboard />} />
        <Route path="/officer/complaints" element={<OfficerComplaints />} />
        <Route
          path="/officer/complaint/:id"
          element={<OfficerComplaintDetails />}
        />
        <Route path="/officer/profile" element={<OfficerProfile />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;