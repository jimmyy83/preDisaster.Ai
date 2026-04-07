import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // ❌ No token
  if (!token || token === "undefined" || token === "null") {
    return <Navigate to="/auth" replace />;
  }

  try {
    // ✅ Decode JWT
    const payload = JSON.parse(atob(token.split(".")[1]));

    // ❌ Token expired
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return <Navigate to="/auth" replace />;
    }

    // ✅ Valid token
    return children;

  } catch (err) {
    // ❌ Invalid token format
    localStorage.removeItem("token");
    return <Navigate to="/auth" replace />;
  }
};

export default ProtectedRoute;