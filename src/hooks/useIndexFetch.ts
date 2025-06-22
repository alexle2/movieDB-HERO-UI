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
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchMovies = async (page: number = 1, searchTerm = "") => {
    setLoading(true);
    try {
      const data = (await API.fetchMovies(searchTerm, page));
      setError(false);
      setLoading(false);
      setIsLoadingMore(false);
      setState((prev) => ({
        ...data,
        results: (page > 1) ? [...prev.results, ...data.results] : [...data.results],
      }));
    } catch (error) {
      setError(true);
      setLoading(false);
      setIsLoadingMore(false);
    }
  };
  useEffect(() => {
    setState(initState);
    fetchMovies(1, searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (!isLoadingMore) return;
    fetchMovies(state.page + 1, searchTerm);
  }, [isLoadingMore])

  return { error, loading, state, searchTerm, setSearchTerm, setIsLoadingMore, isLoadingMore };
}