import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/firebase.Config";
import useAuthStore from "../authStore/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import Cookies from "js-cookie";


export default function SignupWithGoogle() {
  const googleAuth = useAuthStore((state) => state.googleAuth);
  const navigate = useNavigate();

  async function SigninWithGoogle() {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);

      if (result.user) {
        const token = await result.user.getIdToken();   
        Cookies.set('googleToken', token);
        await googleAuth();
        toast.success("Successfully logged in");
        navigate('/user/dashboard');
      } else {
        toast.error("Failed to log in");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Failed to log in");
    }
  }
  return (

     <>

    <Box display="flex" alignItems="center" justifyContent="center">
      <Stack spacing={1} alignItems="center">
        <Typography variant="body1" color="textSecondary">
          --or continue with--
        </Typography>

        <Button
        onClick={SigninWithGoogle}
      // variant="outlined"
      sx={{
        color: "#fff",
        backgroundColor: "black",
        borderRadius: "5px",
        textTransform: "none",
        padding: '6px 12px', 
        fontSize: "12px",
        fontWeight: 700,
        fontFamily: "Helvetica",
      }}
      startIcon={<FcGoogle size={18} />} 
    >
      Sign up with Google
    </Button>
      </Stack>
    
    </Box>
    <br /> <br />
    </>
  );
}
