import { Outlet, Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const ProtectedRoute = () => {
  const { user, loading } = useAuthStore();

  if (loading) return null; 

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
