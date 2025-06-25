import API, { Cast, Crew, Movie } from "@/API";
import { useEffect, useState } from "react";



type MovieData = Movie & { actors: Array<Cast> } & { directors: Array<Crew> }

export const useMovieFetch = (movieId: string = '') => {
  const [movie, setMovie] = useState<MovieData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const movie = await API.fetchMovie(movieId);
        const credits = await API.fetchCredits(movieId);
        const directors = credits.crew.filter(member => member.job === 'Director')
        setMovie({
          ...movie,
          actors: credits.cast,
          directors
        });
        setError(false);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchMovie();
  }, [movieId]);

  return { error, loading, movie };
}