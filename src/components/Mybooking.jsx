import {
  Box,
  Divider,
  Paper,
  Grid,
  Typography,
  Stack,
  Button,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../basicurl/baseurl";
import axios from "axios";
import { format } from "date-fns";
import { useTheme } from "../theme/themeContext.jsx";
import notFoundDark from "../images/notFoundDark.jpg";
import notFoundLight from "../images/59563746_9318707.jpg";
import { toast } from "react-toastify";

const styles = (mode) => ({
  fontSize: { xs: "0.7rem", md: "0.8rem" },
  color: mode === "dark" ? "#a5a19d" : "#555153",
});

export default function MyBooking() {
  const [bookings, setBookings] = useState([]);
  const { mode } = useTheme();
  const [loading, setLoading] = useState([]);
  const [canceled, setCanceld] = useState([]);

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

  const handleCancel = async (data) => {
    setLoading((prev) => [...prev, data._id]);
    try {
      const response = await axios.post(`${baseUrl}/cancel/bookings`, data);
      if (response.status === 200) {
        setTimeout(async () => {
          toast.info(response.data.message);
          await getUserCancellations();
          setLoading((prev) => prev.filter((id) => id !== data._id));
        }, 2500);
      }
    } catch (error) {
      setTimeout(() => {
        console.log(error);
        toast.error(error.data.message || "something went wrong");
        setLoading((prev) => prev.filter((id) => id !== data._id));
      }, 2500);
    }
  };

  const getUserCancellations = async () => {
    try {
      const response = await axios.get(`${baseUrl}/cancel/userBookings`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log("cancele orders", response.data);
        setCanceld(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchBookings();
    getUserCancellations();
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
            You haven't made any bookings yet.
          </Typography>
          <img
            src={mode === "dark" ? notFoundDark : notFoundLight}
            alt="not found"
            style={{
              maxWidth: "35%",
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
                opacity: canceled.some((data) => data.orderId === item._id)
                  ? "0.7"
                  : "1",
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
                  alignContent="center"
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
                <Grid item xs={12} md={5} display="flex" flexDirection="column">
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

                  {canceled.some((data) => data.orderId === item._id) ? (
                    canceled.some(
                      (data) =>
                        data.orderId === item._id &&
                        data.status === "Cancel Requested"
                    ) ? (
                      <Stack key={`cancel-requested-${item._id}`} mt={1} mb={1}>
                        <Typography
                          sx={{
                            color: "#f8f8f8",
                            fontSize: "14px",
                            fontWeight: "bold",
                            opacity: 1.5,
                          }}
                        >
                          Cancel Requested
                        </Typography>
                      </Stack>
                    ) : (
                      <Stack
                        key={`confirmed-cancellation-${item._id}`}
                        mt={1}
                        mb={1}
                      >
                        <Typography
                          sx={{
                            color: "#f3f3f3",
                            fontSize: "14px",
                            fontWeight: "bold",
                            opacity: 1.5,
                          }}
                        >
                          Confirmed cancellation
                        </Typography>
                        <Button>Delete</Button>
                      </Stack>
                    )
                  ) : (
                    <>
                      <Button
                        onClick={() => handleCancel(item)}
                        variant="contained"
                        size="small"
                        sx={{
                          mt: 1,
                          textTransform: "none",
                          mb: 1,
                          backgroundColor:
                            mode === "dark" ? "#610c99" : "#1c75ce",
                          color: mode === "dark" ? "#f0f0f0" : "#000000",
                          maxWidth: "120px",
                          "&:hover": {
                            backgroundColor:
                              mode === "dark" ? "#500c7e" : "#125eaa",
                            color: mode === "dark" ? "#fff" : "#000000",
                          },
                        }}
                      >
                        {loading.includes(item._id) ? (
                          <CircularProgress
                            size={18}
                            sx={{ color: "#d4d4d4" }}
                          />
                        ) : (
                          "Cancel Booking"
                        )}
                      </Button>
                    </>
                  )}
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
