import {
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Star, StarBorder } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import axios from "axios";
import { baseUrl } from "../basicurl/baseurl";
import { toast } from "react-toastify";
import { useTheme } from "../theme/themeContext";
import StarRateIcon from '@mui/icons-material/StarRate';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

const status = [
  { status: "Very Bad", color: "red" },
  { status: "Bad", color: "red" },
  { status: "Average", color: "blue" },
  { status: "Good", color: "green" },
  { status: "Excellent", color: "green" },
];

export default function RateAndReview({ movie }) {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [allReviews, setAllReviews] = useState([]);
  const { mode } = useTheme();

  const fetchReviews = async () => {
    if (!movie._id) {
      console.error("movie._id is not defined");
      return;
    }

    try {
      const response = await axios.get(
        `${baseUrl}/reviews/getReviews/${movie._id}`
      );

      if (response.status === 200) {
        const reviews = response.data.reviews || []; 
        setAllReviews(reviews);
      } else {
        toast.error("Failed to fetch reviews. Please try again later.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch reviews. Please try again later.");
    }
  };

  useEffect(() => {
    if (movie._id) {
      fetchReviews();
    }
  }, [movie._id]);

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Rating is required.");
      return;
    }
    const formData = {
      comment: reviewText,
      rating: rating,
      movieId: movie._id,
    };
  
    try {
      const response = await axios.post(`${baseUrl}/reviews/addReview`, formData, {
        withCredentials: true,
      });
      if (response.status === 200) {
        toast.success("Review submitted successfully!");
        setReviewText("");
        setRating(0);
        fetchReviews();
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 409) {
          toast.error(data.message || "Review already exists.");
        } else if (status === 403) {
          toast.error(data.message || "You have not booked this movie.");
        } else if (status === 400) {
          toast.error(data.message || "Incomplete data.");
        } else if (status === 401) {
          toast.error(data.message || "User not authorized.");
        } else if (status === 404) {
          toast.error(data.message || "Movie or User not found.");
        } else {
          toast.error(data.message || "An error occurred.");
        }
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
      console.error("Error:", error);
    }
  };

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const reviewTextStyle = {
    fontSize: 12,
    color: mode === "dark" ? "#9e9898" : "#2e2c2c",
    fontWeight: 'bold'
  };

  return (
    <Box
      sx={{
        padding: isSmallScreen ? 1 : 2,
        marginLeft: isSmallScreen ? 5 : 3,
        mt: 5,
      }}
    >
      <Stack
        direction={isSmallScreen ? "column" : "row"}
        spacing={4}
        justifyContent="space-between"
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            maxWidth: 600,
            width: "100%",
            p: 2,
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            flex: 1,
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom>
            Submit a Review
          </Typography>
          <TextField
            label="Write your review"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" component="span" sx={{ mr: 1 }}>
              Rating:
            </Typography>
            {Array.from({ length: 5 }).map((_, index) => (
              <IconButton key={index} onClick={() => handleStarClick(index)}>
                {index < rating ? (
                  <Star sx={{ color: "yellow" }} />
                ) : (
                  <StarBorder />
                )}
              </IconButton>
            ))}
            <Typography component={'div'}>
              {status[rating - 1] && (
                <Typography
                  color={status[rating - 1].color}
                  sx={{ fontSize: '14px', fontWeight: 'bold' }}
                >
                  {status[rating - 1].status}
                </Typography>
              )}
            </Typography>
          </Box>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#5d0aac",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "5px",
              "&:hover": {
                backgroundColor: "#382baf",
              },
            }}
            disabled={!reviewText}
          >
            Submit
          </Button>
        </Box>

        <Box
          sx={{
            flex: 1,
            p: 2,
            borderLeft: "1px dashed #a79f9f",
            maxWidth: isSmallScreen ? "100%" : "50%",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            mt: isSmallScreen ? 2 : 0,
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }}
        >
          <Box component="span" sx={{ display: "block", mt: 1 }}>
            {allReviews.length > 0 ? (
              allReviews.map((data, i) => (
                <Box key={i} sx={{ mb: 2 }}>
                  <Stack direction={"row"} spacing={2}>
                    <Typography
                      fontSize={'small'}
                      sx={{
                        backgroundColor: 'green',
                        fontWeight: 'bold',
                        borderRadius: '5px',
                        paddingLeft: '4px',
                        color: 'white',
                        marginLeft: '0.5rem',
                      }}
                    >
                      {data.rating}
                      <StarRateIcon sx={{ fontSize: 'small', mt: '-5px', ml: '2px' }} />
                    </Typography>
                    <Typography sx={reviewTextStyle}>{data.email}</Typography>
                  </Stack>
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: mode === "dark" ? "#9e9898" : "#2e2c2c",
                      marginTop: "0.8rem",
                      marginBottom: "0.5rem",
                      maxWidth: "70%",
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                    }}
                  >
                    {data.comment}
                  </Typography>
                  <hr
                    style={{
                      width: "100%",
                      height: "1px",
                      border: "none",
                      marginTop: "1rem",
                      marginBottom: "1rem",
                      backgroundColor: mode === "dark" ? "#252424" : "#dfd5d5",
                      borderRadius: "5px",
                      opacity: "0.8",
                    }}
                  />
                </Box>
              ))
            ) : (
              <Typography>No reviews yet <HourglassEmptyIcon sx={{ fontSize:'16px', color:'red' }} /></Typography>
            )}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
