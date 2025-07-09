import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  requiredRole?: string; // VD: 'ADMIN', 'STAFF', 'VIEWER'
  children?: React.ReactNode;
}

const ProtectedRoute = ({ requiredRole, children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (requiredRole) {
    const roleArr = requiredRole.split(",");
    if (!roleArr.includes(userRole || "")) {
      if (userRole === "VIEWER")
        return <Navigate to="/viewer" />;
      if (userRole === "STAFF")
        return <Navigate to="/staff" />;
      return <Navigate to="/login" />;
    }
  }
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
