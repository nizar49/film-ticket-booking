import React, { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggler from "../theme/themeToggler";
import { useTheme } from "../theme/themeContext.jsx";
import MovieImage from "../images/Movies.png";
import {
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import useAuthStore from "../authStore/authStore.js";
import { toast } from "react-toastify";

export default function UserNavbar() {
  const { logout } = useAuthStore();
  const { mode } = useTheme();
  const textColor = mode === "dark" ? "#fff" : "#000000";
  const linkColor =  mode === "dark" ? "#0ce9d6" : "#00978b";

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [activeLink, setActiveLink] = useState("");
  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const navLinks = [
    {
      path: "/user/dashboard",
      value: "Movies",
    },
    {
      path: "/user/bookings",
      value: "My Bookings",
    },
  ];

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Successfully logged out");
  };

  return (
    <div>
      <nav
        style={{
          backgroundColor: mode === "dark" ? "black" : "#eee3ec",
          color: mode === "dark" ? "#fff" : "#000",
          padding: "20px",
          width: "100%",
          boxSizing: "border-box",
          boxShadow: "0px 0px 10px 0px rgba(241, 235, 235, 0.75)",
          zIndex: 1000,
          // position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={6} sm={4} container alignItems="center">
            <Link to="/" style={{ display: "flex", alignItems: "center" }}>
              <img
                src={MovieImage}
                alt="movie-icon-image"
                style={{
                  height: "50px",
                  cursor: "pointer",
                  marginLeft: "20px",
                }}
              />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  display: { xs: "none", sm: "block" }, // Hide on small screens
                  fontWeight: "bold",
                  marginLeft: "15px",
                  marginTop: "8px",
                  cursor: "pointer",
                  color: textColor,
                  textDecoration: "none",
                  fontSize: "20px",
                  letterSpacing: "1px",
                  textShadow:
                    mode === "light"
                      ? "2px 2px 5px rgba(0, 0, 0, 0.5)"
                      : "2px 2px 5px rgb(180, 180, 180)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  wordWrap: "break-word",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Popcorn Movies
              </Typography>
            </Link>
          </Grid>

          <Grid
            item
            xs={6}
            sm={4}
            container
            alignItems="center"
            justifyContent="center"
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                style={{
                  textDecoration: "none",
                  color: activeLink === link.value ? linkColor : textColor,
                  margin: "0 15px",
                }}
                onClick={() => handleLinkClick(link.value)}
              >
                <span
                  style={{
                    cursor: "pointer",
                    transition: "color 0.3s, text-decoration 0.3s",
                    fontSize: "18px",
                  }}
                >
                  {link.value}
                </span>
              </Link>
            ))}
          </Grid>

          <Grid
            item
            xs={6}
            sm={4}
            sx={{
              display: { xs: "flex", sm: "none" },
              justifyContent: "flex-end",
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuClick}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={handleMenuClose}
            >
              {navLinks.map((link, index) => (
                <MenuItem key={index} onClick={handleMenuClose}>
                  <Link
                    to={link.path}
                    style={{
                      textDecoration: "none",
                      color: activeLink === link.value ? linkColor : textColor,
                      width: "100%",
                    }}
                    onClick={() => handleLinkClick(link.value)}
                  >
                    {link.value}
                  </Link>
                </MenuItem>
              ))}
              <MenuItem onClick={handleMenuClose}>
                <ThemeToggler />
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Button
                  variant="outlined"
                  sx={{
                    color: "#fff",
                    backgroundColor: "#a51237",
                    fontWeight: "bold",
                    border: mode === "dark" ? "1px solid black" : "#fff",
                    textTransform: "none",
                    transition: "all 0.5s ease ",
                    "&:hover": {
                      backgroundColor: "#a51237",
                      fontWeight: "bold",
                      border: mode === "dark" ? "1px solid black" : "#fff",
                      transform: "scale(1.04)",
                    },
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </MenuItem>
            </Menu>
          </Grid>

          <Grid
            item
            xs={0}
            sm={4}
            sx={{
              display: { xs: "none", sm: "flex" },
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <ThemeToggler />
            <Button
              variant="outlined"
              sx={{
                color: "#fff",
                backgroundColor: "#a51237",
                fontWeight: "bold",
                border: mode === "dark" ? "1px solid black" : "#fff",
                textTransform: "none",
                marginLeft: "20px",
                transition: "all 0.5s ease ",
                "&:hover": {
                  backgroundColor: "#a51237",
                  fontWeight: "bold",
                  border: mode === "dark" ? "1px solid black" : "#fff",
                  transform: "scale(1.04)",
                },
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      </nav>
    </div>
  );
}
