import React from "react";
import { Navigate, Outlet, Route } from "react-router-dom";
import { withCookies, Cookies } from "react-cookie";

const cookies = new Cookies();
const ProtectedRoute = () => {
  console.log(cookies.get("name"));
  const isAuthenticated = cookies.get("user") ? true : false;
  console.log("this", isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
