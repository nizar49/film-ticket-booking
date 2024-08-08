import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useGetMovies from "../custom/useGetMoviesHook";
import { useTheme } from "../theme/themeContext.jsx";
import StarIcon from "@mui/icons-material/Star";
import SearchBar from "../ui/searchBar.jsx";
import NotFound from "../images/no result.png";

export default function Movies() {
  const { movies, setMovies } = useGetMovies();
  const { mode } = useTheme();
  const [query, setQuery] = useState("");

  const textStyle = {
    color: mode === "dark" ? "#a7a1a1" : "#3d3a3a",
    fontWeight: "bold",
  };
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

  const displayProduct = (status) => {
    return movies.filter((item) => item.status.includes(status));
  };

  const nowShowingMovies = displayProduct("Now Showing");
  const upcomingMovies = displayProduct("Up Coming");
  const trendingMovies = displayProduct("Trending");

  const filteredData = movies.filter((item) => {
    const statusString = item.status.join(" ").toLowerCase();
    return (
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      statusString.includes(query.toLowerCase()) ||
      item.language.toLowerCase().includes(query.toLowerCase())
    );
  });

  return (
    <>
      <Box alignItems={"center"} >
        <SearchBar setQuery={setQuery} />
        {movies.length===0 && (
          <Box >
            <Stack alignItems={'center'} justifyContent={'center'} textAlign={'center'} align={'center'} direction={'column'}>
              <CircularProgress size={20}/> 
              <h5>Loading...</h5>
            </Stack>
          </Box>
        )}
        
        <Stack mb={10}>
          {query ? (
            <>
              {query && filteredData.length !== 0 && (
                <div
                  style={{
                    marginTop: "3%",
                    textAlign: "center",
                    marginBottom: "5%",
                  }}
                >
                  <Typography
                    variant="h5"
                    component="h4"
                    style={{ color: "#4CAF50", fontWeight: "bold" }}
                  >
                    Search Results for "{query}"
                  </Typography>
                </div>
              )}
              {query && filteredData.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    borderRadius: "10px",
                    marginTop: "20px",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#df1616",
                      marginBottom: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    No results for "{query}"
                  </Typography>

                  <Typography
                    sx={{
                      marginBottom: "50px",
                      fontSize: "14px",
                      color: mode === "dark" ? "#a7a1a1" : "#504d4d",
                     
                    }}
                  >
                    Try using other words...?
                  </Typography>

                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <img
                      src={NotFound}
                      alt="No results found"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: "10px",
                      }}
                    />
                  </div>
                </div>
              )}
             <Box ml={{ xs: 2, md: 8 }} mr={{ xs: 2, md: 8 }}>
                <Grid container spacing={3}>
                  {filteredData.map((item, index) => (
                    <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
                      <Link
                        style={{ textDecoration: "none" }}
                        to={`/user/movies/${item._id}`}
                      >
                        <Card
                          sx={{
                            width: "260px",
                            height: "380px",
                            backgroundColor:
                              mode === "dark" ? "#070707" : "#f5f3f3",
                            color: mode === "dark" ? "#fff" : "#000",
                            border:
                              mode === "dark"
                                ? "1px solid #fff"
                                : "1px solid #000",
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
                                width: "280px",
                                objectFit: "cover",
                                transition: "all 0.3s",
                                borderRadius:'10px'

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
                              >
                                {item.title}
                              </Typography>
                              <Stack direction={"row"} spacing={5}>
                                <Typography
                                  sx={textStyle}
                                  gutterBottom
                                  variant="body2"
                                  component="div"
                                >
                                  {`${item.language}`}
                                </Typography>

                                <Typography sx={textStyle} variant="body2">
                                  <StarIcon sx={{ color: "#fde905 " }} />{" "}
                                  {item.rating}
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
          ) : (
            <>
              {/* Now Showing */}
              <Box ml={{ xs: 2, md: 8 }} mr={{ xs: 2, md: 8 }}>
                <Typography
                  variant="h2"
                  style={headStyle}
                  color={mode === "dark" ? "textSecondary" : "textPrimary"}
                >
                  Now Showing
                </Typography>
                <Grid container spacing={3}>
                  {nowShowingMovies.map((item, index) => (
                    <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
                      <Link
                        style={{ textDecoration: "none" }}
                        to={`/user/movies/${item._id}`}
                      >
                        <Card
                          sx={{
                            width: "260px",
                            height: "380px",
                            backgroundColor:
                              mode === "dark" ? "#070707" : "#f5f3f3",
                            color: mode === "dark" ? "#fff" : "#000",
                            border:
                              mode === "dark"
                                ? "1px solid #fff"
                                : "1px solid #000",
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
                                width: "280px",
                                objectFit: "cover",
                                transition: "all 0.3s",
                                borderRadius:'10px'

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
                              >
                                {item.title}
                              </Typography>
                              <Stack direction={"row"} spacing={5}>
                                <Typography
                                  sx={textStyle}
                                  gutterBottom
                                  variant="body2"
                                  component="div"
                                >
                                  {`${item.language}`}
                                </Typography>

                                <Typography sx={textStyle} variant="body2">
                                  <StarIcon sx={{ color: "#fde905 " }} />{" "}
                                  {item.rating}
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
             
              {/* Trending */}
              <Box ml={{ xs: 2, md: 8 }} mr={{ xs: 2, md: 8 }}>
                <Typography
                  variant="h2"
                  style={headTwoStyle}
                  color={mode === "dark" ? "textSecondary" : "textPrimary"}
                >
                  Trending
                </Typography>
                <Grid container spacing={3}>
                  {trendingMovies.map((item, index) => (
                    <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
                      <Link
                        style={{ textDecoration: "none" }}
                        to={`/user/movies/${item._id}`}
                      >
                        <Card
                          sx={{
                            width: "260px",
                            height: "380px",
                            backgroundColor:
                              mode === "dark" ? "#070707" : "#f5f3f3",
                            color: mode === "dark" ? "#fff" : "#000",
                            border:
                              mode === "dark"
                                ? "1px solid #fff"
                                : "1px solid #000",
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
                                width: "280px",
                                objectFit: "cover",
                                transition: "all 0.3s",
                                borderRadius:'10px'

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
                              >
                                {item.title}
                              </Typography>
                              <Stack direction={"row"} spacing={5}>
                                <Typography
                                  sx={textStyle}
                                  gutterBottom
                                  variant="body2"
                                  component="div"
                                >
                                  {`${item.language}`}
                                </Typography>

                                <Typography sx={textStyle} variant="body2">
                                  <StarIcon sx={{ color: "#fde905 " }} />{" "}
                                  {item.rating}
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
              {/* Up Coming */}
              <Box ml={{ xs: 2, md: 8 }} mr={{ xs: 2, md: 8 }}>
                <Typography
                  variant="h2"
                  style={headTwoStyle}
                  color={mode === "dark" ? "textSecondary" : "textPrimary"}
                >
                  Up Coming
                </Typography>
                <Grid container spacing={3}>
                  {upcomingMovies.map((item, index) => (
                    <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
                      <Link
                        style={{ textDecoration: "none" }}
                        to={`/user/movies/${item._id}`}
                      >
                        <Card
                          sx={{
                            width: "260px",
                            height: "380px",
                            backgroundColor:
                              mode === "dark" ? "#070707" : "#f5f3f3",
                            color: mode === "dark" ? "#fff" : "#000",
                            border:
                              mode === "dark"
                                ? "1px solid #fff"
                                : "1px solid #000",
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
                                width: "280px",
                                objectFit: "cover",
                                transition: "all 0.3s",
                                borderRadius:'10px'
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
                              >
                                {item.title}
                              </Typography>
                              <Stack direction={"row"} spacing={5}>
                                <Typography
                                  sx={textStyle}
                                  gutterBottom
                                  variant="body2"
                                  component="div"
                                >
                                  {`${item.language}`}
                                </Typography>

                                <Typography sx={textStyle} variant="body2">
                                  <StarIcon sx={{ color: "#fde905 " }} />{" "}
                                  {item.rating}
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
          )}
        </Stack>
      </Box>
    </>
  );
}
