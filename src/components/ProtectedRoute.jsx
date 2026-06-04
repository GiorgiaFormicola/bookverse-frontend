import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = useSelector((currentState) => currentState.profile.user);
  const authChecked = useSelector((currentState) => currentState.profile.authChecked);

  const token = localStorage.getItem("token");
  if (token && !authChecked) {
    return (
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center gap-3">
        <Spinner animation="grow" size="sm" style={{ color: "var(--primary-light)" }} />
        <Spinner animation="grow" size="sm" style={{ color: "var(--accent)" }} />
        <Spinner animation="grow" size="sm" style={{ color: "var(--st-review)" }} />
      </div>
    );
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
