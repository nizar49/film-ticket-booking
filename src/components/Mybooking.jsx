import { Box, Divider, Paper, Grid, Typography, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../basicurl/baseurl";
import axios from "axios";
import { format } from "date-fns";
import { useTheme } from "../theme/themeContext.jsx";
import notFoundDark from "../images/notFoundDark.jpg";
import notFoundLight from "../images/59563746_9318707.jpg";

const styles = (mode) => ({
  fontSize: { xs: "0.7rem", md: "0.8rem" },
  color: mode === "dark" ? "#a5a19d" : "#555153",
});

export default function MyBooking() {
  const [bookings, setBookings] = useState([]);
  const { mode } = useTheme();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${baseUrl}/getBooking/userBookings`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setBookings(response.data);
        } else {
          console.error("Failed to fetch bookings");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  return (
    <Box mt={6} ml={{ xs: 2, md: 10 }} mb={10}>
      {bookings.length <= 0 ? (
       <Stack spacing={4} alignItems="center">
       <Typography
         variant="h4"
         color={mode === "dark" ? "textSecondary" : "textPrimary"}
         textAlign="center"
       >
         You haven't made any bookings yet...!
       </Typography>
       <img
         src={mode === "dark" ? notFoundDark : notFoundLight}
         alt="not found"
         style={{
           width: "100%", 
           maxWidth: "400px", 
           height: "auto",
           borderRadius: "20px",
         }}
       />
     </Stack>
     
      ) : (
        <Stack
          spacing={4}
          width="100%"
          maxWidth={{ xs: "90%", sm: "450px", md: "500px" }}
          ml={{ xs: 0, sm: 5, md: 40 }}
          mb={15}
        >
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem" },
              fontWeight: "bold",
              background: "linear-gradient(45deg, #00f260, #0575e6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow:
                "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)",
              letterSpacing: "1px",
              textTransform: "uppercase",
              transition: "transform 0.3s ease",
              textDecoration: "underline",
              textDecorationColor: mode === "dark" ? "#8a8a8a" : "#646464",
              "&:hover": {
                transform: "scale(1.05)",
              },
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            My Bookings
          </Typography>
          {bookings.map((item, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{
                padding: { xs: 1, sm: 2 },
                marginBottom: { xs: 1, sm: 2 },
                backgroundColor: mode === "dark" ? "#080808" : "#fff",
             
              }}
            >
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={12}
                  sm={3}
                  md={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {item.movieDetails?.image && (
                    <img
                      src={item.movieDetails.image}
                      alt=""
                      style={{
                        width: "60px",
                        borderRadius: "8px",
                      }}
                    />
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={9}
                  md={5}
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Typography
                    fontWeight="bold"
                    sx={{
                      color: mode === "dark" ? "#00f260" : "#0575e6",
                      fontSize: { xs: "0.9rem", md: "1rem" },
                    }}
                  >
                    {item.movieName}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: "0.8rem", md: "0.9rem" },
                      color: mode === "dark" ? "#00f260" : "#0575e6",
                    }}
                  >
                    {item.theaterName}, ({item.location})
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: "0.8rem", md: "0.9rem" },
                      color: mode === "dark" ? "#00f260" : "#0575e6",
                    }}
                  >
                    Date: {format(new Date(item.date), "dd MMM yyyy")}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: "0.8rem", md: "0.9rem" },
                      color: mode === "dark" ? "#00f260" : "#0575e6",
                    }}
                  >
                    Time: {item.time}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={5}
                  display="flex"
                  flexDirection="column"
                >
                  <Typography variant="body1" sx={styles(mode)}>
                    Seat Numbers:{" "}
                    {item.seetNumbers ? item.seetNumbers.join(", ") : "N/A"}
                  </Typography>
                  <Typography variant="body1" sx={styles(mode)}>
                    Total Reservation: {item.totalReservation}
                  </Typography>
                  <Typography variant="body1" sx={styles(mode)}>
                    Total Price: ₹{item.amount}
                  </Typography>
                  <Typography variant="body1" sx={styles(mode)}>
                    Payment Status: {item.paymentStatus}
                  </Typography>
                </Grid>
              </Grid>
              <Divider />
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
}
