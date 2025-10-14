// ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const getUserFromStorage = () => {
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
};

const ProtectedRoute: React.FC = () => {
  const user = getUserFromStorage();
  if (!user) return <Navigate to="/admin/login" replace />;
  return <Outlet />; // render nested routes
};

export default ProtectedRoute;
