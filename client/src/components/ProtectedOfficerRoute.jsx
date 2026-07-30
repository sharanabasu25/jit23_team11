import { Navigate } from "react-router-dom";

export default function ProtectedOfficerRoute({ children }) {
  const isLoggedIn = localStorage.getItem("officerLoggedIn");

  if (isLoggedIn === "true") {
    return children;
  }

  return <Navigate to="/officer/login" replace />;
}