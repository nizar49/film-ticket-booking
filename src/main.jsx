import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomeLayout from "./layout/homeLayout";
import Hero from "./pages/hero.jsx";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import "./index.css";
import { ThemeProvider } from "./theme/themeContext.jsx";
import UserLayout from "./layout/userLayout.jsx";
import DashBoard from "./pages/dashBoard.jsx";
import PaymentAndBooking from "./pages/paymentAndBooking.jsx";
import MyBookings from "./pages/bookings.jsx";
import MovieDetails from "./pages/movieDetais.jsx";
import ProtectedRoute from "./utils/protectedRotes.jsx";
import Notifications from "./pages/notifications.jsx"

const router = createBrowserRouter([
  {
    element: <HomeLayout />,
    children: [
      {
        path: "/",
        element: <Hero />,
      },
      {
        path: "/user/login",
        element: <Login />,
      },
      {
        path: "/user/signup",
        element: <Signup />,
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),

    children: [
      {
        path: "/user/dashboard",
        element: <DashBoard />,
      },
      {
        path: "/user/movies/:id",
        element: <MovieDetails />,
      },
      {
        path: "/user/movies/booking/payments/:id",
        element: <PaymentAndBooking />,
      },
      {
        path: "/user/bookings",
        element: <MyBookings />,
      },
      {
        path:'/user/notifications',
        element:<Notifications/>
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
      <ToastContainer
        autoClose={2500}
        toastStyle={{
          borderRadius: "10px",
          padding: "10px",
          fontSize: "16px",
          fontWeight: "bold",
          width: "300px",
        }}
      />
    </ThemeProvider>
  </React.StrictMode>
);
