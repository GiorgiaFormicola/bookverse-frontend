import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = useSelector((currentState) => currentState.profile.user);
  const authChecked = useSelector((currentState) => currentState.profile.authChecked);

  const token = localStorage.getItem("token");
  if (token && !authChecked) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
        }}
      >
        <span className="bv-loader-dot" style={{ animationDelay: "0ms" }} />
        <span className="bv-loader-dot" style={{ animationDelay: "150ms" }} />
        <span className="bv-loader-dot" style={{ animationDelay: "300ms" }} />
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
