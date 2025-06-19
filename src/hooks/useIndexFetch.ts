import API, { Movies } from "@/API";
import { useEffect, useState } from "react";

const initState: Movies = {
  page: 0,
  results: [],
  total_pages: 0,
  total_results: 0
};

export const useIndexFetch = () => {
  const [state, setState] = useState<Movies>(initState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMovies = async (page: number = 1, searchTerm = "") => {
    try {
      const data = (await API.fetchMovies(searchTerm, page));
      setError(false);
      setLoading(false);
      setState((prev) => ({
        page: prev.page,
        results: (page > 1) ? [...prev.results, ...prev.results] : data.results,
        total_pages: prev.total_pages,
        total_results: prev.total_results
      }));
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(1, searchTerm);
  }, [searchTerm]);

  return { error, loading, state, searchTerm, setSearchTerm }
}