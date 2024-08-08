import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggler from "../theme/themeToggler";
import { useTheme } from "../theme/themeContext.jsx";
import MovieImage from "../images/Movies.png";
import { Button, Menu, MenuItem, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import useAuthStore from "../authStore/authStore.js";
import { toast } from "react-toastify";

export default function HomeNavbar() {
  const { mode } = useTheme();
  const muiTheme = useMuiTheme();
  const isSmallScreen = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const { isAuth, checkAuth, logout } = useAuthStore();
  const textColor = mode === "dark" ? "#fff" : "#000000";

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Successfully logged out");
  };

  const navLinks = [
    {
      path: "/user/login",
      value: "Login",
    },
    {
      path: "/user/signup",
      value: "Signup",
    },
  ];

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <nav
        style={{
          backgroundColor: mode === "dark" ? "black" : "#ddd7dc",
          color: mode === "dark" ? "#fff" : "#000",
          padding: "20px",
          width: "100%",
          boxSizing: "border-box",
          boxShadow: "0px 0px 10px 0px rgba(241, 235, 235, 0.75)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link to="/">
          <div style={{ display: "flex" }}>
            <img
              src={MovieImage}
              alt="movie-icon-image"
              style={{
                margin: 0,
                height: "50px",
                cursor: "pointer",
                marginLeft: "20px",
              }}
            />
            <h6
              style={{
                fontWeight: "bold",
                marginLeft: "15px",
                marginTop: "8px",
                cursor: "pointer",
                color: textColor,
                textDecoration: "none",
                fontSize: "20px",
                letterSpacing: "1px",
                textShadow: mode === "light" ? "2px 2px 5px rgba(0, 0, 0, 0.5)" : "2px 2px 5px rgb(180, 180, 180)",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                wordBreak: "break-all",
                wordWrap: "break-word",
                fontFamily: "Poppins, sans-serif",
                display: isSmallScreen ? "none" : "block",
              }}
            >
              Popcorn Movies
            </h6>
          </div>
        </Link>

        <div style={{ display: isSmallScreen ? "none" : "flex" }}>
          <Link to={'/user/dashBoard'} style={{ textDecoration: "none", color: textColor }}>
            <Button
              sx={{
                color: mode === "dark" ? "white" : "black",
                fontSize: "20px",
                letterSpacing: "1px",
              }}
            >
              Movies
            </Button>
          </Link>
        </div>

        <div style={{ display: isSmallScreen ? "none" : "flex", alignItems: "center", gap: "30px" }}>
          <ThemeToggler />
          {!isAuth && navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              style={{
                textDecoration: "none",
                color: textColor,
              }}
            >
              <Button
                variant={link.value.toLowerCase() === "login" ? "outlined" : "contained"}
                style={{
                  cursor: "pointer",
                  transition: "color 0.3s, text-decoration 0.3s",
                  fontWeight: 'bold',
                  fontSize: "15px",
                  letterSpacing: "1px",
                  textShadow: mode === "light" ? "2px 2px 5px rgba(0, 0, 0, 0.5)" : "2px 2px 5px rgb(180, 180, 180)",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  backgroundColor: link.value.toLowerCase() === 'signup' ? 'orange' : '#fff',
                  color: "#000",
                }}
              >
                {link.value}
              </Button>
            </Link>
          ))}
          {isAuth && (
            <Button
              variant='outlined'
              sx={{
                color: '#fff',
                backgroundColor: '#a51237',
                fontWeight: 'bold',
                border: mode === "dark" ? '1px solid black' : '#fff',
                textTransform: 'none',
                marginLeft: '20px',
                transition: 'all 0.5s ease ',
                '&:hover': {
                  backgroundColor: '#a51237',
                  fontWeight: 'bold',
                  border: mode === "dark" ? '1px solid black' : '#fff',
                  transform: 'scale(1.04)',
                }
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </div>

        <div style={{ display: isSmallScreen ? "flex" : "none", alignItems: "center" }}>
          <IconButton onClick={handleMenuClick}>
            <MenuIcon style={{ color: textColor }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <Link to="/user/dashBoard" style={{ textDecoration: "none", color: textColor }}>
                Movies
              </Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ThemeToggler />
            </MenuItem>
            {!isAuth && navLinks.map((link, index) => (
              <MenuItem key={index} onClick={handleMenuClose}>
                <Link to={link.path} style={{ textDecoration: "none", color: textColor }}>
                  {link.value}
                </Link>
              </MenuItem>
            ))}
            {isAuth && (
              <MenuItem onClick={handleMenuClose}>
                <Button
                  variant='outlined'
                  sx={{
                    color: '#fff',
                    backgroundColor: '#a51237',
                    fontWeight: 'bold',
                    border: mode === "dark" ? '1px solid black' : '#fff',
                    textTransform: 'none',
                    transition: 'all 0.5s ease ',
                    '&:hover': {
                      backgroundColor: '#a51237',
                      fontWeight: 'bold',
                      border: mode === "dark" ? '1px solid black' : '#fff',
                      transform: 'scale(1.04)',
                    }
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </MenuItem>
            )}
          </Menu>
        </div>
      </nav>
    </div>
  );
}
