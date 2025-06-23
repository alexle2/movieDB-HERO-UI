import API, { Movies } from "@/API";
import { useEffect, useState } from "react";

const initState: Movies = {
  page: 0,
  results: [],
  total_pages: 0,
  total_results: 0
};

export const useSearchFetch = () => {
  const [state, setState] = useState<Movies>(initState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMovies = async (searchTerm = "") => {
    setLoading(true);
    try {
      const data = (await API.fetchMovies(searchTerm, 1));
      setError(false);
      setLoading(false);
      setState(() => ({
        ...data
      }));
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };
  useEffect(() => {
    if(searchTerm !== '') {
      fetchMovies(searchTerm);
    } else setState(initState)

  }, [searchTerm]);

  return { error, loading, state, setSearchTerm };
}