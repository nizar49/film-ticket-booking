import React, { useEffect, useState, useCallback, useRef } from "react";
import { Box, Button, Grid, Typography, Stack, Divider } from "@mui/material";
import { useParams } from "react-router-dom";
import SeatManageStore from "../authStore/seatManagementStore";
import { useTheme } from "../theme/themeContext";
import axios from "axios";
import { baseUrl } from "../basicurl/baseurl";
import { format } from "date-fns";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import NotFound from "../images/59563746_9318707.jpg";
import NotFoundDark from "../images/notFoundDark.jpg";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Payments from "./razorPay.jsx";
import { toast } from "react-toastify";

export default function MovieScreen() {
  const { id } = useParams();
  const { mode } = useTheme();
  const initialColors = Array.from({ length: 6 }, () =>
    Array(11).fill("green")
  );
  const [colors, setColors] = useState(initialColors);
  const [showsWithTheaters, setShowsWithTheaters] = useState([]);
  const [movie, setMovie] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [confirm, setConfirm] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShows = useCallback(async () => {
    try {
      const response = await axios.get(`${baseUrl}/shows/getShows/${id}`);
      if (response.status !== 200) {
        throw new Error("Failed to fetch shows");
      }
      setMovie(response.data.movie);
      setShowsWithTheaters(response.data.showsWithTheaters);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  useEffect(() => {
    fetchShows().finally(() => setLoading(false));
  }, [fetchShows]);

  const {
    seatsByProduct,
    confirmedSeatsByProduct,
    seatControl,
    confirmSeats,
    resetSeats,
    clearTempSeats,
    resetConfirmedSeats,
  } = SeatManageStore((state) => ({
    seatsByProduct: state.seatsByProduct,
    confirmedSeatsByProduct: state.confirmedSeatsByProduct,
    seatControl: state.seatControl,
    confirmSeats: state.confirmSeats,
    resetSeats: state.resetSeats,
    clearTempSeats: state.clearTempSeats,
    resetConfirmedSeats: state.resetConfirmedSeats,
  }));

  const generateKey = (theater, date) => {
    if (!theater) return null;
    return `${id}-${theater}-${date}`;
  };

  const currentKey = generateKey(selectedTheater?.name, selectedDate);
  const currentTempSeats = seatsByProduct[currentKey] || [];
  const confirmedSeats = confirmedSeatsByProduct[currentKey] || [];

  const handleClick = useCallback(
    (rowIndex, colIndex) => {
      const seatLabel = `${String.fromCharCode(65 + (5 - rowIndex))}-${
        colIndex + 1
      }`;
      if (confirmedSeats.includes(seatLabel)) return;

      setColors((prevColors) => {
        return prevColors.map((row, rIdx) =>
          row.map((color, cIdx) =>
            rIdx === rowIndex && cIdx === colIndex
              ? color === "green"
                ? "yellow"
                : "green"
              : color
          )
        );
      });
      setConfirm((prevSeats) => {
        if (prevSeats.includes(seatLabel)) {
          return prevSeats.filter((seat) => seat !== seatLabel);
        } else {
          return [...prevSeats, seatLabel];
        }
      });
      seatControl(currentKey, seatLabel);
    },
    [confirmedSeats, seatControl, currentKey]
  );

  const handleConfirmSeats = useCallback(() => {
    confirmSeats(currentKey);
    clearTempSeats(currentKey); // Clear temporary seats after confirming
  }, [confirmSeats, clearTempSeats, currentKey]);

  const handlepay = useCallback(() => {
    confirmSeats(currentKey);
    clearTempSeats(currentKey);
    setConfirm([]);
  }, [confirmSeats, clearTempSeats, currentKey]);

  const handleResetSeats = useCallback(() => {
    resetSeats(currentKey);
    setColors(initialColors);
  }, [resetSeats, currentKey]);

  const handleResetConfirmedSeats = useCallback(() => {
    resetConfirmedSeats(currentKey);
    setColors(initialColors);
  }, [resetConfirmedSeats, currentKey]);

  useEffect(() => {
    return () => clearTempSeats(currentKey);
  }, [clearTempSeats, currentKey]);

  const prevConfirmedSeatsRef = useRef([]);

  useEffect(() => {
    const prevConfirmedSeats = prevConfirmedSeatsRef.current;
    if (JSON.stringify(prevConfirmedSeats) !== JSON.stringify(confirmedSeats)) {
      console.log("Confirmed seats changed:", confirmedSeats);
      setColors((prevColors) =>
        prevColors.map((row, rowIndex) =>
          row.map((color, colIndex) => {
            const seatLabel = `${String.fromCharCode(65 + (5 - rowIndex))}-${
              colIndex + 1
            }`;
            return confirmedSeats.includes(seatLabel) ? "grey" : color;
          })
        )
      );
      prevConfirmedSeatsRef.current = confirmedSeats;
    }
  }, [confirmedSeats]);

  const handleTheaterSelect = useCallback(
    (theater) => {
      setSelectedTheater(theater);
      setSelectedDate(null);
      resetSeats(generateKey(theater?.name, null)); // Reset seats when selecting a new theater
    },
    [resetSeats]
  );

  const handleDateSelect = useCallback(
    (date) => {
      setSelectedDate(date);
      resetSeats(generateKey(selectedTheater?.name, date)); // Reset seats when selecting a new date
    },
    [resetSeats, selectedTheater]
  );

  const filteredDates = selectedTheater
    ? showsWithTheaters
        .filter((show) => show.theater?._id === selectedTheater._id)
        .map((show) => show.dateTime)
    : [];

  const filteredPrice = selectedTheater
    ? showsWithTheaters
        .filter((show) => show.theater?._id === selectedTheater._id)
        .filter((show) => show.dateTime === selectedDate)
        .map((show) => show.price)
    : [];

  const uniqueTheaters = [];
  const theaterNames = new Set();

  showsWithTheaters.forEach((show) => {
    if (show.theater && !theaterNames.has(show.theater.name)) {
      theaterNames.add(show.theater.name);
      uniqueTheaters.push(show.theater);
    }
  });

  return (
    <Box p={2} mr={5} mt={3}>
      {!selectedTheater ? (
        <Box maxWidth={500} ml={3}>
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              color: mode === "dark" ? "#fff" : "#000",
              borderRadius: 2,
              padding: "10px",
            }}
          >
            Available Theaters
            <ArrowDownwardIcon sx={{ color: "#d11212" }} />
          </Typography>
          <Stack spacing={2} mt={4} mb={28.5}>
            {uniqueTheaters.length > 0 ? (
              uniqueTheaters.map((theater, index) => (
                <Button
                  key={index}
                  variant="contained"
                  onClick={() => handleTheaterSelect(theater)}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    fontWeight: "bold",

                    fontSize: "14px",
                    textTransform: "uppercase",
                    color: "#d1cbcb",
                    border:
                      mode === "dark" ? "1px solid #9e9797" : "1px solid #ccc",
                    backgroundColor: mode === "dark" ? "#860847" : "#1b0711",
                    transition: "all 0.3s ease-in-out",

                    "&:hover": {
                      backgroundColor: mode === "dark" ? "#a3145b" : "#353234",
                    },
                  }}
                >
                  {theater.name}
                </Button>
              ))
            ) : (
              <Stack ml={"100px"}>
                <Typography>No theaters available</Typography>
                <img
                  src={mode === "dark" ? NotFoundDark : NotFound}
                  alt="not found"
                  style={{
                    alignItems: "center",
                    width: "100%",
                    height: "auto",
                    justifyContent: "center",
                    borderRadius: "10px 400px 385px 320px",
                  }}
                />
              </Stack>
            )}
          </Stack>
        </Box>
      ) : !selectedDate ? (
        <Box maxWidth={500} ml={3} mb={28.5}>
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              color: mode === "dark" ? "#fff" : "#000",
              borderRadius: 2,
              padding: "10px",
            }}
          >
            Available Date & Time{" "}
            <ArrowDownwardIcon sx={{ color: "#d11212" }} />
          </Typography>
          <Stack spacing={2} mt={4}>
            {filteredDates.length > 0 ? (
              filteredDates.map((dateTime, index) => (
                <Button
                  key={index}
                  variant="contained"
                  onClick={() => handleDateSelect(dateTime)}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    fontWeight: "bold",

                    fontSize: "14px",
                    textTransform: "uppercase",
                    color: "#d1cbcb",
                    border:
                      mode === "dark" ? "1px solid #9e9797" : "1px solid #ccc",
                    backgroundColor: mode === "dark" ? "#620886" : "#1b0711",
                    transition: "all 0.3s ease-in-out",

                    "&:hover": {
                      backgroundColor: mode === "dark" ? "#760f9e" : "#353234",
                    },
                  }}
                >
                  {format(new Date(dateTime), "MMM dd, yyyy hh:mm a")}
                </Button>
              ))
            ) : (
              <Typography>No dates available for this theater</Typography>
            )}
          </Stack>
        </Box>
      ) : (
        <Grid
          container
          spacing={{xs:0 ,md:10}}
          direction={{ xs: "column", md: "row" }}
          mt={1}
          mb={1}
          textAlign={"center"}
        >
          <Grid item xs={12} md={8}>
            <Box>
              <Button
                variant="outlined"
                sx={{
                  textAlign: "center",
                  color: mode === "dark" ? "#ec7a0e" : "#680840",
                  fontWeight: "bold",
                  letterSpacing: "-0.01em",
                  border:
                    mode === "dark" ? "1px solid #ec7a0e" : "1px solid #a8146b",
                  borderRadius: 2,
                  cursor: "pointer",
                  "&:hover": {
                    color: mode === "dark" ? "#ec7a0e" : "#680840",
                    border:
                      mode === "dark"
                        ? "1px solid #ec7a0e"
                        : "1px solid #a8146b",
                  },
                }}
              >
                {selectedTheater.name}-
                {selectedDate
                  ? !isNaN(new Date(selectedDate).getTime())
                    ? format(new Date(selectedDate), "MMM dd, yyyy, hh:mm a ")
                    : "Invalid Date"
                  : "Invalid Date"}
              </Button>
              <div
                style={{
                  height: "200px",
                  width: "100%", 
                  maxWidth: "450px", 
                  backgroundColor: mode === "dark" ? "#dfd1d1" : "#2e2c2c",
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "auto",
                  boxShadow:
                    mode === "dark"
                      ? "0 4px 8px rgba(133, 125, 125, 0.3)"
                      : "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transform: "perspective(800px) rotateX(-50deg)",
                  overflow: "hidden",
                  position: "relative",
                }}
              ></div>
            </Box>

            <Grid
              container
              spacing={1}
              justifyContent="center"
              mt={5}
              maxWidth="100%"
            >
              {colors.map((row, rowIndex) => (
                <Grid
                  container
                  item
                  spacing={1}
                  key={rowIndex}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid item>
                    <Box
                      sx={{
                        width: { xs: 20, sm: 30, md: 30 },
                        height: { xs: 20, sm: 30, md: 30 },
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: { xs: 10, sm: 12, md: 15 },
                        fontWeight: "bold",
                      }}
                    >
                      {String.fromCharCode(65 + (5 - rowIndex))}
                    </Box>
                  </Grid>
                  {row.map((color, colIndex) => {
                    const seatLabel = `${String.fromCharCode(
                      65 + (5 - rowIndex)
                    )}-${colIndex + 1}`;
                    const isConfirmed = confirmedSeats.includes(seatLabel);
                    const isTemp = currentTempSeats.includes(seatLabel);

                    return (
                      <Grid
                        item
                        key={`seats-${rowIndex}-${colIndex}`}
                        style={{
                          marginLeft: colIndex === 4 || colIndex === 7 ? 20 : 0,
                        }}
                      >
                        <Stack>
                          <Box
                            sx={{
                              backgroundColor: isConfirmed
                                ? "grey"
                                : isTemp
                                ? "yellow"
                                : color,
                              color: "white",
                              padding: 0.5, 
                              borderRadius: 1,
                              width: { xs: 5, sm: 20, md: 25 }, 
                              height: { xs: 5, sm: 20, md: 25 }, 
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              cursor: isConfirmed ? "not-allowed" : "pointer",
                              userSelect: "none",
                              outline: "none",
                              fontSize: { xs: 10, sm: 12, md: 15 }, 
                            }}
                            onClick={() => handleClick(rowIndex, colIndex)}
                          />
                        </Stack>
                      </Grid>
                    );
                  })}
                </Grid>
              ))}
              <Grid container item spacing={1} justifyContent="center">
                <Grid item>
                  <Box sx={{ width: { xs: 5, sm: 25, md: 25 }, height: {xs: 5, sm: 25, md: 25} }} />
                </Grid>
                {Array.from({ length: 11 }).map((_, colIndex) => (
                  <Grid
                    item
                    key={colIndex}
                    style={{
                      marginLeft: colIndex === 0 ? 20 : 0,
                      marginRight: colIndex === 10 ? 20 : 0,
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 12, sm: 25, md: 30 },
                        height: { xs: 20, sm: 25, md: 30 },
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: { xs: 8, sm: 12, md: 15 },
                        fontWeight: "bold",
                        // padding:{xs: 0.5, sm: 12, md: 15}
                      }}
                    >
                      {colIndex + 1}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>



            <Stack
              direction={"row"}
              spacing={3}
              mt={5}
              mb={5}
              sx={{
                textAlign: "center",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Typography
                sx={{
                  color: mode === "dark" ? "#837a7a" : "#494747",
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                Price:
              </Typography>
              <Typography
                sx={{
                  color: mode === "dark" ? "#837a7a" : "#494747",
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                {filteredPrice}
              </Typography>
            </Stack>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              textAlign="center"
              sx={{
                mt: 3,
                mb: 3,
                mx: 2,
                borderRadius: 2,
                boxShadow: 3,
                justifyContent: "center",
                alignItems: "center",
                p: 2,
              }}
            >
              <Box sx={{ fontWeight: "bold" }}>
                Total Seats: {colors.flat().length}
              </Box>
              <Box sx={{ display: "flex", fontWeight: "bold" }}>
                Occupied Seats
                <Box
                  sx={{
                    height: 15,
                    width: 15,
                    backgroundColor: "yellow",
                    borderRadius: "10%",
                    display: "flex",
                    ml: 1,
                    mt: 0.5,
                    mr: 1,
                  }}
                ></Box>
                {colors.flat().filter((color) => color === "yellow").length}
              </Box>
              <Box sx={{ display: "flex", fontWeight: "bold" }}>
                Vacant Seats
                <Box
                  sx={{
                    height: 15,
                    width: 15,
                    backgroundColor: "green",
                    borderRadius: "10%",
                    display: "flex",
                    ml: 1,
                    mt: 0.5,
                    mr: 1,
                  }}
                ></Box>
                {colors.flat().filter((color) => color === "green").length}
              </Box>
              <Box sx={{ display: "flex", fontWeight: "bold" }}>
                Confirmed Seats
                <Box
                  sx={{
                    height: 15,
                    width: 15,
                    backgroundColor: "grey",
                    borderRadius: "10%",
                    display: "flex",
                    ml: 1,
                    mt: 0.5,
                    mr: 1,
                  }}
                ></Box>
                {confirmedSeats.length}
              </Box>
            </Stack>

            {/* <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
              mt={2}
            >
              <Button
                onClick={handleConfirmSeats}
                disabled={currentTempSeats.length === 0}
                sx={{
                  bgcolor: mode === "dark" ? "#37b147" : "#3f9c33",
                  color: "white",
                  "&:hover": {
                    bgcolor: mode === "dark" ? "#55bd2c" : "#20b920",
                  },
                }}
              >
                Confirm Seats
              </Button>
              <Button
                onClick={handleResetSeats}
                variant="contained"
                sx={{ mr: 2 }}
              >
                Reset
              </Button>

              <Button
                onClick={handleResetConfirmedSeats}
                sx={{
                  bgcolor: mode === "dark" ? "#a12a2a" : "#a72b2b",
                  color: "white",
                  "&:hover": {
                    bgcolor: mode === "dark" ? "#cc3333" : "#971b1b",
                  },
                }}
              >
                Reset Confirmed Seats
              </Button>
            </Stack> */}
          </Grid>

          <Grid item xs={12} md={4} mt={10}>
            <Box
              p={2}
              bgcolor={mode === "dark" ? "grey.900" : "grey.100"}
              borderRadius={3}
              boxShadow={5}
              height="auto"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h5" gutterBottom>
                Payment Information
              </Typography>
              <Box
                mt={2}
                p={2}
                border={1}
                borderColor={mode === "dark" ? "grey.600" : "grey.400"}
                borderRadius={3}
                width="100%"
                height="auto"
                bgcolor={mode === "dark" ? "grey.800" : "white"}
              >
                <Stack direction={"column"} spacing={1}>
                  <img
                    src={movie.image}
                    alt={movie.title}
                    style={{
                      width: "20%",
                      height: "auto",
                      objectFit: "cover",
                      borderRadius: 4,
                      display: "block",
                      marginBottom: 10,
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Divider />

                  <Stack direction={"row"} justifyContent="space-between">
                    <Typography variant="subtitle1">Movie:</Typography>
                    <Typography variant="subtitle1">{movie.title}</Typography>
                  </Stack>

                  <Divider />

                  <Stack direction={"row"} justifyContent="space-between">
                    <Typography variant="subtitle1">Theater:</Typography>
                    <Typography variant="subtitle1">
                      {selectedTheater.name}
                    </Typography>
                  </Stack>

                  <Divider />

                  <Stack direction={"row"} justifyContent="space-between">
                    <Typography variant="subtitle1">Location:</Typography>
                    <Typography variant="subtitle1">
                      {selectedTheater.address}
                    </Typography>
                  </Stack>

                  <Divider />

                  <Stack direction={"row"} justifyContent="space-between">
                    <Typography variant="subtitle1">Date:</Typography>
                    <Typography variant="subtitle1">
                      {selectedDate
                        ? !isNaN(new Date(selectedDate).getTime())
                          ? format(new Date(selectedDate), "MMM dd, yyyy ")
                          : "Invalid Date"
                        : "Invalid Date"}
                    </Typography>
                  </Stack>

                  <Divider />

                  <Stack direction={"row"} justifyContent="space-between">
                    <Typography variant="subtitle1">Time:</Typography>
                    <Typography variant="subtitle1">
                      {selectedDate
                        ? !isNaN(new Date(selectedDate).getTime())
                          ? format(new Date(selectedDate), "hh:mm a")
                          : "Invalid Date"
                        : "Invalid Date"}
                    </Typography>
                  </Stack>

                  <Divider />

                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Typography variant="subtitle1">Seat Numbers:</Typography>
                    <Typography variant="subtitle1" color="textPrimary">
                      {confirm.join(", ")}
                    </Typography>
                  </Stack>

                  <Divider />

                  <Stack direction={"row"} justifyContent="space-between">
                    <Typography variant="subtitle1">
                      Total Reservations:
                    </Typography>
                    <Typography variant="subtitle1">
                      {confirm.length}
                    </Typography>
                  </Stack>

                  <Divider />

                  <Stack direction={"row"} justifyContent="space-between">
                    <Typography variant="subtitle1">Total Price:</Typography>
                    <Typography variant="subtitle1">
                      <CurrencyRupeeIcon sx={{ fontSize: "small" }} />
                      {filteredPrice * confirm.length}
                    </Typography>
                  </Stack>

                  <Divider />
                  <Stack
                    direction={"row"}
                    spacing={2}
                    justifyContent="center"
                    mt={4}
                  >
                    {confirm.length > 0 ? (
                      <Payments
                        movie={movie.title}
                        theater={selectedTheater.name}
                        price={filteredPrice * confirm.length}
                        totalReservation={confirm.length}
                        seetNumbers={confirm}
                        date={
                          selectedDate
                            ? !isNaN(new Date(selectedDate).getTime())
                              ? format(new Date(selectedDate), "MMM dd, yyyy ")
                              : "Invalid Date"
                            : "Invalid Date"
                        }
                        time={
                          selectedDate
                            ? !isNaN(new Date(selectedDate).getTime())
                              ? format(new Date(selectedDate), "hh:mm a")
                              : "Invalid Time"
                            : "Invalid Time"
                        }
                        location={selectedTheater.address}
                        confirmSeats={confirmSeats}
                        clearTempSeats={clearTempSeats}
                        setConfirm={setConfirm}
                        currentKey={currentKey}
                        handlepay={handlepay}
                      />
                    ) : (
                      <Button
                        onClick={() =>
                          toast.error("Please select seets then proceed ")
                        }
                        variant="contained"
                        sx={{
                          fontWeight: "bold",
                          backgroundColor:
                            mode === "dark" ? "#2b3b94" : "#2b3b94",
                          color: "#fff",
                          borderColor: mode === "dark" ? "#212121" : "#ffffff",
                          transition: "all 0.5s ease ",
                          "&:hover": {
                            backgroundColor:
                              mode === "dark" ? "#2b3b94" : "#2b3b94",
                            color: "#fff",
                            borderColor:
                              mode === "dark" ? "#212121" : "#ffffff",
                            transform: "scale(1.04)",
                          },
                        }}
                      >
                        Proceed to payment
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Box>
            </Box>
          </Grid>
          
        </Grid>
      )}
    </Box>
  );
}
