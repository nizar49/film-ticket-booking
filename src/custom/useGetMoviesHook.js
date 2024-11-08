import axios from "axios";
import { useState, useEffect } from "react";
import { baseUrl } from "../basicurl/baseurl";

export default function useGetMovies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const response = await axios.get(`${baseUrl}/movies/getMovies`);
        setMovies(response.data.movies);
       
      } catch (error) {
        console.error(error||"error");
      }
    };
    getMovies();
  }, []);

  return {
    movies,
    setMovies,
  };
}
