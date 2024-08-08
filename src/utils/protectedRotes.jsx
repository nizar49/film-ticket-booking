import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../authStore/authStore";
import { Backdrop, CircularProgress } from "@mui/material";

const ProtectedRoute = ({ children, redirectPath = "/user/login" }) => {
  const { isAuth, checkAuth, loading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div>
        <Backdrop
          sx={{
            color: "#faf5f5",
            zIndex: (theme) => theme.zIndex.drawer + 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          open={loading}
        >
          <CircularProgress color="inherit" />
          <div className="loading-text">Loading....</div>
        </Backdrop>
      </div>
    );
  }

  return isAuth ? children : <Navigate to={redirectPath} />;
};

export default ProtectedRoute;
