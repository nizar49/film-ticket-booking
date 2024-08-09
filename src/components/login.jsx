import React from "react";
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
  const onSave = async (data) => {
    try {
      const result = await axios.post(`${baseUrl}/users/login`, 
      data,
      {
        withCredentials: true, 
      }
      );
        if(result.status ==!200){
          toast.error("Invalid Credentials");
          return; 
        }
        await login()
        toast.success("Successfully logged in");
          navigate('/user/dashboard');
          reset();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <Box
           sx={{
            display: 'flex',
            flexDirection: 'column',
            // alignItems: 'center',
            mt: 12,
            mb:8,
            maxWidth: '80%',
            border: mode === "dark" ? '1px solid #fff' : '1px solid #000',
            borderRadius: '10px',
            padding: '20px',
    
            boxShadow: mode === "dark" 
            ? 'rgba(255, 255, 255, 0.25) 0px 5px 5px, rgba(255, 255, 255, 0.12) 0px -12px 30px, rgba(255, 255, 255, 0.12) 0px 4px 6px, rgba(255, 255, 255, 0.17) 0px 12px 13px, rgba(255, 255, 255, 0.09) 0px -3px 5px' 
            : 'rgba(0, 0, 0, 0.25) 0px 5px 5px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',
            // backgroundImage:mode==="dark"?"url(https://img.freepik.com/free-photo/cinematography-symbols-black-background_23-2147698946.jpg?t=st=1721547817~exp=1721551417~hmac=243047804eb986da2d7a68968410f87b51e65de619b9a7bbd32ba81e66acd0f8&w=740)":
            // "url(https://img.freepik.com/free-photo/spilled-popcorn-near-opened-clapperboard_23-2147698870.jpg?t=st=1721548304~exp=1721551904~hmac=d646b1a614d7a9413e54c6f728c282c8bd458fe461e330eb29a6fbe52cf4186d&w=740)",
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
                  
                 }}
            >
              Login
            </Button>
            {/* <SignupWithGoogle/> */}
          </Box>
        </Box>
      </Container>
    </>
  );
}
