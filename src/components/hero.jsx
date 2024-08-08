import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useTheme } from '../theme/themeContext.jsx';
import { useNavigate } from 'react-router-dom';


export default function Hero() {
  const { mode } = useTheme();

const navigate = useNavigate();

  const textColor = mode === 'dark' ? '#000' : '#eee6e6';

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Blurred background image */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: mode==="dark" ?'url(https://img.freepik.com/free-photo/view-3d-cinema-theatre-room_23-2151067056.jpg?t=st=1721479776~exp=1721483376~hmac=1d17098b09c0b909dca470e97c1e83d2fd12672f8f0869f0be7e81006aaba353&w=740)'
          : 'url(https://img.freepik.com/free-photo/3d-cinema-theatre-seating_23-2151005452.jpg?t=st=1721482992~exp=1721486592~hmac=61fed6d6b92f060fb3253a1081cace043c039a826ca42dca0bb170f9ca2c5ff4&w=826)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(1px)',
          zIndex: 1,
        }}
      />
      {/* Text content */}
      <Stack
  spacing={2}
  sx={{
    textAlign: 'center',
    color: textColor,
    position: 'relative',
    zIndex: 2,
    maxWidth: 600,
    mx: 'auto',
    justifyContent: 'center',
    alignItems: 'center'
  }}
>
  <Typography variant="h2" sx={{fontFamily:'MV Boli '}}>
    "Your journey to cinematic thrills begins here—book your tickets  and let the show begin!"
  </Typography>
  <Typography sx={{fontWeight:'bold'}}>Book Now..</Typography>
  <Button
    variant="outlined"
    size="small"
    sx={{
      mt: 3,
      width: 200,
      fontWeight: 600,
      borderRadius: 10,
      padding: '6px 12px',
     
      fontSize: 14,
      color: mode === "dark" ? "#fff" : "#000",
      backgroundColor: mode === "dark" ? "#161515" : "#ccc",
      border: 'none',
      transition: 'all 0.5s ease-out',
      '&:hover': {
        // backgroundColor: mode === "dark" ? "#161515" : "#ccc",
        color: mode === "dark" ? "#fff" : "#000",
        cursor: 'pointer',
      
        boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.2)',
        border: mode === "dark" ? '1px solid #fff' : '1px solid #000',
        transform: 'scale(1.04)',
      },
    }}
    onClick={()=>navigate('/user/dashBoard')}
  >
    Explore More...
  </Button>
</Stack>


    </Box>
  );
}
