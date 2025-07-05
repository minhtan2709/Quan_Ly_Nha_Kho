import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  requiredRole?: string; // VD: 'ADMIN', 'STAFF', 'USER'
  children?: React.ReactNode;
}

const ProtectedRoute = ({ requiredRole, children }: ProtectedRouteProps) => {
  // Lấy role đã login (có thể lấy từ context hoặc localStorage)
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;

  if (requiredRole) {
    // Nếu requiredRole là "ADMIN,STAFF" thì check kiểu này
    const roleArr = requiredRole.split(",");
    if (!roleArr.includes(userRole || "")) {
      // Nếu user không có quyền thì về trang login hoặc dashboard phù hợp
      if (userRole === "USER" || userRole === "VIEWER")
        return <Navigate to="/user/incidents" />;
      return <Navigate to="/login" />;
    }
  }

  // Nếu children được truyền thì render children, nếu không thì render <Outlet />
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
