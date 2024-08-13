import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import axios from "axios";
import { baseUrl } from "../basicurl/baseurl";
import { toast } from "react-toastify";
import { useTheme } from "../theme/themeContext.jsx";
import StarIcon from "@mui/icons-material/Star";
import RateAndreview from "./rateAndreview.jsx";
import { format } from "date-fns";
import useGetMovies from "../custom/useGetMoviesHook.js";

export default function MovieDetails() {
  const { id } = useParams();
  const [item, setItem] = useState({});
  const { mode } = useTheme();
  const [showIframe, setShowIframe] = useState(true);
  const { movies } = useGetMovies();

  const filterMovies = (status) => {
    return movies.filter((m) => m.status.includes(status));
  };
  const trendingMovies = filterMovies("Trending");
  const slicedTrendingMovies = trendingMovies.slice(0, 4);

  const handleButtonClick = () => {
    setShowIframe(!showIframe);
  };

  useEffect(() => {
    const movieDetails = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/movies/getMoviesById/${id}`
        );
        if (!response.data.movie) {
          toast.error("No movies found for the specified id");
          return;
        }
        setItem(response.data.movie);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch movie details");
      }
    };
    movieDetails();
  }, [id]);

  const textStyle = {
    mb: 2,
    color: mode === "dark" ? "#aaa" : "#555",
    fontWeight: "bold",
  };

  let formattedDate = "Invalid Date";

  if (item.date) {
    const date = new Date(item.date);
    if (!isNaN(date.getTime())) {
      formattedDate = format(date, "MMM dd, yyyy");
    }
  }

  const headStyle = {
    color: mode === "dark" ? "#a7a1a1" : "#3d3a3a",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: "25px",
    marginBottom: "40px",
    padding: "10px",
  };
  const headTwoStyle = {
    color: mode === "dark" ? "#a7a1a1" : "#3d3a3a",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: "80px",
    marginBottom: "35px",
    padding: "10px",
  };

  return (
    <>
      <Box sx={{ m: 3 }}>
        <Card
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            backgroundColor: mode === "dark" ? "#141414" : "#faf8f8",
            color: mode === "dark" ? "#fff" : "#000",
            ml: { xs: "5%", md: "100px" },
            mr: { xs: "5%", md: "100px" },
            boxShadow: "rgba(0, 0, 0, 0.2) 0px 5px 15px",
            borderRadius: "20px",
            overflow: "hidden",
            transition: "all 0.3s ease",
          }}
        >
          <CardMedia
            component="img"
            image={item.image}
            alt="Movie Image"
            sx={{
              m: "2%",
              height: { xs: "auto", md: "400px" },
              width: { xs: "100%", md: "300px" },
              objectFit: "cover",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
              boxShadow: "rgba(0, 0, 0, 0.2) 0px 5px 15px",
            }}
          />
          <CardContent
            sx={{
              flex: "1 0 auto",
              p: { xs: 2, md: 3 },
              width: { xs: "100%", md: "400px" },
              ml: { xs: "0px", md: "40px" },
            }}
          >
            <Typography
              gutterBottom
              variant="h4"
              component="div"
              sx={{
                mb: 2,
                fontWeight: "bold",
                fontSize: { xs: "24px", md: "34px" },
              }}
            >
              {item.title}
            </Typography>
            <Typography variant="subtitle1" sx={textStyle}>
              Language: {item.language}
            </Typography>

            <Typography variant="subtitle1" sx={textStyle}>
              Genre: {item.category}
            </Typography>

            <Typography variant="subtitle1" sx={textStyle}>
              Release Date: {formattedDate}
            </Typography>

            <Typography variant="subtitle1" sx={textStyle}>
              Duration: {item.duration}
            </Typography>

            <Typography variant="body1" sx={textStyle}>
              {item.description}
            </Typography>
            <Typography variant="subtitle1" sx={textStyle}>
              <StarIcon sx={{ color: "#fde905" }} /> {item.rating}/10
            </Typography>
            <Stack
              spacing={3}
              direction={"row"}
              sx={{
                mt: 3,
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <Link to={`/user/movies/booking/payments/${item._id}`}>
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    backgroundColor: "green",
                    color: "#fff",
                    fontWeight: "bold",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#fff",
                      backgroundColor: "#004d00",
                    },
                    width: { xs: "100%", md: "auto" },
                    textAlign: "center",
                  }}
                >
                  <BookOnlineIcon sx={{ mr: 1, fontSize: "small" }} /> Buy
                  Tickets
                </Button>
              </Link>
            </Stack>
          </CardContent>
        </Card>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{ mt: "5%" }}
        >
          <hr
            style={{
              width: "100px",
              borderColor: mode === "dark" ? "#9b9494" : "#4b4848",
              borderStyle: "solid",
              borderWidth: "1px",
            }}
          />
          <Button
            sx={{
              width: "150px",
              backgroundColor: mode === "dark" ? "#141414" : "#faf8f8",
              color: mode === "dark" ? "#fff" : "#000",
              fontWeight: "bold",
              borderRadius: "5px",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: mode === "dark" ? "#333" : "#ece2e2",
              },
              cursor: "pointer",
              textTransform: "none",
            }}
            onClick={handleButtonClick}
          >
            {showIframe ? "Hide Trailer" : "Show Trailer"}
          </Button>
          <hr
            style={{
              width: "100px",
              borderColor: mode === "dark" ? "#9b9494" : "#4b4848",
              borderStyle: "solid",
              borderWidth: "1px",
            }}
          />
        </Stack>
        {showIframe && item.iframeUrl && (
          <Box
            component="div"
            dangerouslySetInnerHTML={{ __html: item.iframeUrl }}
            sx={{
              mt: 3,
              textAlign: "center",
              ml: { xs: "1%", md: "30%" }, 
              height: { xs: "30%", md: "100%" },
              width: { xs: "100%", md: "80%" }, 
              maxWidth: "100%", 
              overflow: "hidden", 
            }}
          />
        )}
      </Box>

      <Stack>
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            color: mode === "dark" ? "#aaa" : "#555",
            ml: { xs: "50px", md: "100px" },
            mr: { xs: "50px", md: "100px" },
            mb: 2,
            mt: 3,
            textDecoration: "underline",
            textAlign: { xs: "left", md: "center" },
          }}
        >
          Rating & Review
        </Typography>
        {item && <RateAndreview movie={item} />}
      </Stack>

      <Box sx={{ ml: { xs: 2, md: 8 }, mr: { xs: 2, md: 8 }, mb: 10 }}>
        <Typography
          variant="h2"
          sx={headTwoStyle}
          color={mode === "dark" ? "textSecondary" : "textPrimary"}
        >
          Trending Movies
        </Typography>
        <Grid container spacing={3}>
          {slicedTrendingMovies.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Link
                style={{ textDecoration: "none" }}
                to={`/user/movies/${item._id}`}
              >
                <Card
                  sx={{
                    width: { xs: "100%", sm: "260px" },
                    height: { xs: "auto", sm: "380px" },
                    backgroundColor: mode === "dark" ? "#070707" : "#f5f3f3",
                    color: mode === "dark" ? "#fff" : "#000",
                    border:
                      mode === "dark" ? "1px solid #fff" : "1px solid #000",
                    borderRadius: "10px",
                    transition: "all 0.3s",
                    padding: 1,
                    ":hover": {
                      transform: "translateY(-10px)",
                      transition: "all 0.3s",
                      cursor: "pointer",
                      boxShadow:
                        mode === "dark"
                          ? "5px 5px 5px 0px rgba(95, 91, 91, 0.3)"
                          : "5px 5px 5px 0px rgba(0, 0, 0, 0.3)",
                      filter:
                        mode === "dark"
                          ? "drop-shadow(5px 5px 5px rgba(71, 68, 68, 0.3))"
                          : "drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.3))",
                    },
                  }}
                >
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      sx={{
                        height: "280px",
                        width: "100%",
                        objectFit: "cover",
                        transition: "all 0.3s",
                        borderRadius: "10px",
                      }}
                      image={item.image}
                      alt={item.title}
                    />
                    <CardContent>
                      <Typography
                        sx={textStyle}
                        gutterBottom
                        variant="h6"
                        component="div"
                        textAlign="center"
                      >
                        {item.title}
                      </Typography>
                      <Stack
                        direction={"row"}
                        spacing={5}
                        justifyContent="center"
                      >
                        <Typography
                          sx={textStyle}
                          gutterBottom
                          variant="body2"
                          component="div"
                        >
                          {`${item.language}`}
                        </Typography>

                        <Typography sx={textStyle} variant="body2">
                          <StarIcon sx={{ color: "#fde905 " }} /> {item.rating}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
