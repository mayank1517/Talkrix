import { Navigate } from "react-router";

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isProfileComplete) {
    console.log("Profile incomplete, redirecting to profile-complete page.");
    return <Navigate to="/profile-complete" replace />;
  }

  return children;
};

export default ProtectedRoute;
