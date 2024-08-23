import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Typography, Container, Box, CircularProgress } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../theme/themeContext.jsx";
import { baseUrl } from "../basicurl/baseurl";
import MovieImage from "../images/Movies.png";
import { Stack } from "@mui/system";
import AuthStore from "../authStore/authStore";

const styles = {
  color: "blue",
  cursor: "pointer",
  textDecoration: "underline",
  fontWeight: "bold",
  fontSize: "15px",
};

const schema = yup.object().shape({
  firstName: yup
    .string()
    .min(3, "First name must be at least 3 characters long")
    .matches(/^[a-zA-Z0-9]+$/, "First name can only contain letters and numbers")
    .required("First name is required"),
  lastName: yup
    .string()
    .min(3, "Last name must be at least 3 characters long")
    .matches(/^[a-zA-Z0-9]+$/, "Last name can only contain letters and numbers")
    .required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(24, "Password cannot be longer than 24 characters")
    .required("Password is required"),
});


export default function Signup() {
  const { signup } = AuthStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate();
  const { mode } = useTheme();

  const [loading, setLoading] = useState(false);

  const onSave = async (data) => {
    setLoading(true);
    try {
      const result = await axios.post(`${baseUrl}/users/signup`, data, {
        withCredentials: true,
      });
      if (result.status === 200) {
        await signup();
        setTimeout(() => {
          setLoading(false);
          toast.success("Successfully signed up");
          navigate("/user/dashboard");
          reset();
          
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Something went wrong");
      
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          // alignItems: 'center',
          mt: 6,
          mb: 8,
          maxWidth: { xs: "100%", md: "80%" },
          borderRadius: "10px",
          padding: "20px",
          boxShadow:
            mode === "dark"
              ? "rgba(255, 255, 255, 0.25) 0px 5px 5px, rgba(255, 255, 255, 0.12) 0px -12px 30px, rgba(255, 255, 255, 0.12) 0px 4px 6px, rgba(255, 255, 255, 0.17) 0px 12px 13px, rgba(255, 255, 255, 0.09) 0px -3px 5px"
              : "rgba(0, 0, 0, 0.25) 0px 5px 5px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
          backgroundColor: mode === "light" && "#f5f2f2",
          objectFit: "cover",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: mode === "dark" ? "white" : "black",
          "@media (max-width: 600px)": {
            mt: 4,
            padding: "10px",
          },
        }}
      >
        <Stack direction={"row"} spacing={10}>
          <img
            src={MovieImage}
            alt="movie-icon-image"
            style={{
              height: "50px",
              "@media (max-width: 600px)": {
                height: "30px",
              },
            }}
          />
          <Typography
            component="h1"
            variant="h5"
            sx={{
              textAlign: "center",
              fontSize: "1.5rem",
              "@media (max-width: 600px)": {
                fontSize: "1.2rem",
              },
            }}
          >
            Sign Up
          </Typography>
        </Stack>
        <Box
          component="form"
          onSubmit={handleSubmit(onSave)}
          sx={{
            mt: 3,
            "@media (max-width: 600px)": {
              mt: 2,
            },
          }}
        >
          <TextField
            sx={{
              fontWeight: "bold",
              fontSize: "1rem",
              "@media (max-width: 600px)": { fontSize: "0.9rem" },
            }}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="fname"
            autoFocus
            {...register("firstName")}
            error={!!errors.firstName}
            helperText={errors.firstName ? errors.firstName.message : ""}
           
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="lname"
            {...register("lastName")}
            error={!!errors.lastName}
            helperText={errors.lastName ? errors.lastName.message : ""}
            sx={{
              fontWeight: "bold",
              fontSize: "1rem",
              "@media (max-width: 600px)": { fontSize: "0.9rem" },
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ""}
            sx={{
              fontWeight: "bold",
              fontSize: "1rem",
              "@media (max-width: 600px)": { fontSize: "0.9rem" },
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ""}
            sx={{
              fontWeight: "bold",
              fontSize: "1rem",
              "@media (max-width: 600px)": { fontSize: "0.9rem" },
            }}
          />
          <p style={{ textAlign: "center" }}>
            Already have an account ?{" "}
            <Link to={"/user/login"} style={styles}>
              Login
            </Link>
          </p>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              mt: 3,
              mb: 2,
              fontWeight: 600,
              borderRadius: 10,
              backgroundColor: mode === "dark" ? "green" : "#f02c2c",
              color: mode === "dark" ? "white" : "black",
              padding: "6px 12px",
              textTransform: "uppercase",
              fontSize: 14,
              cursor: "pointer",
              textDecoration: "none",
              "&:hover": {
                backgroundColor: mode === "dark" ? "#439e27" : "#f02c2c",
                color: mode === "dark" ? "white" : "black",
              },
            }}
          >
            {loading ? (
              <CircularProgress
                size={20}
                sx={{
                  color: mode === "dark" ? "#c7bebe" : "#1a1919",
                }}
              />
            ) : (
              "Sign Up"
            )}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
