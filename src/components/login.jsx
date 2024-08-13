import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../theme/themeContext.jsx";
import MovieImage from "../images/Movies.png"
import { Stack } from "@mui/system";
import { baseUrl } from "../basicurl/baseurl.js";
import useAuthStore from "../authStore/authStore.js";


const styles = {
  color: "blue",
  cursor: "pointer",
  textDecoration: "underline",
  fontWeight: "bold",
  fontSize: "15px",
};

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).max(24).required(),
});
export default function login() {
  const { login } = useAuthStore();
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
      const result = await axios.post(`${baseUrl}/users/login`, data, {
        withCredentials: true,
      });
      if (result.status !== 200) {
        toast.error("Invalid Credentials");
        setLoading(false);
        return;
      }
      await login();
      setTimeout(() => {
        navigate("/user/dashboard");
        toast.success("Successfully signed up");
        reset();
        setLoading(false);
      }, 2000); // 2 seconds delay
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <Box
           sx={{
            display: 'flex',
            flexDirection: 'column',
            mt: { xs: 6, md: 12 },
            mb: { xs: 4, md: 8 },
            maxWidth: { xs: '100%', md: '80%' },
            border: mode === "dark" ? '1px solid #fff' : '1px solid #000',
            borderRadius: '10px',
            padding: '20px',
            padding: { xs: "10px", md: "20px" },
            boxShadow: mode === "dark" 
            ? 'rgba(255, 255, 255, 0.25) 0px 5px 5px, rgba(255, 255, 255, 0.12) 0px -12px 30px, rgba(255, 255, 255, 0.12) 0px 4px 6px, rgba(255, 255, 255, 0.17) 0px 12px 13px, rgba(255, 255, 255, 0.09) 0px -3px 5px' 
            : 'rgba(0, 0, 0, 0.25) 0px 5px 5px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',
            backgroundColor:mode==="light"&& "#f5f2f2",
            objectFit:'cover',
            backgroundRepeat:'no-repeat',
            backgroundSize:'cover',
            backgroundPosition:'center',
            color:mode==="dark"?"white":"black"    
        }}
        >
          <Stack direction={'row'} spacing={10}>
           <img
              src={MovieImage}
              alt="movie-icon-image"
              style={{
                height: "50px",
              }}
            />
          <Typography component="h1" variant="h5" className="underline" sx={{
          alignContent: "center",
        }}>
            Login
          </Typography>
          </Stack>
          <Box component="form" onSubmit={handleSubmit(onSave)} sx={{ mt: 3 }}>
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
            />
            <p style={{ textAlign: "center" }}>
              Don't have an account ?{" "}
              <Link to={"/user/signup"} style={styles}>
                Signup
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
                  backgroundColor: mode==="dark"?"green":"#f02c2c",
                  color: mode==="dark"?"white":"black",
                  padding: '6px 12px',
                  textTransform: 'uppercase',
                  fontSize: 14,
                  cursor: 'pointer',
                  textDecoration: 'none',
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
                "Login"
              )}
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
