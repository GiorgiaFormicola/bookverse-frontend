import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = useSelector((currentState) => currentState.profile.user);
  const authChecked = useSelector((currentState) => currentState.profile.authChecked);

  const token = localStorage.getItem("token");
  if (token && !authChecked) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
