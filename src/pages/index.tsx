import DefaultLayout from "@/layouts/default";
import {
  Alert,
  Card,
  CardBody,
  CardHeader,
  CircularProgress,
  Image,
  Input,
} from "@heroui/react";
import { IMAGE_BASE_URL, POSTER_SIZE } from "@/config";
import { useIndexFetch } from "@/hooks/useIndexFetch";
import { Movie } from "@/API";
import Hero from "@/components/hero";
import { useCallback, useEffect, useRef, useState } from "react";

export default function IndexPage() {
  const {
    error,
    loading,
    state,
    searchTerm,
    setSearchTerm,
    setIsLoadingMore,
    isLoadingMore,
  } = useIndexFetch();
  const [search, setSearch] = useState("");
  const movies = state.results;
  const hero = state.results[0];
  const inital = useRef(true);

  const scrollHandler = useCallback(() => {
    if (
      window.scrollY + 1 >=
      document.documentElement.scrollHeight -
        document.documentElement.clientHeight
    ) {
      console.log("end", state.page, state.total_pages, !loading);
      if (state.page < state.total_pages && !loading) {
        console.log("loadmore");
        setIsLoadingMore(true);
      }
    }
  }, [state, loading]);

  useEffect(() => {
    if (inital.current) {
      inital.current = false;
      return;
    }
    const timerId = setTimeout(() => setSearchTerm(search), 500);
    return () => clearTimeout(timerId);
  }, [search]);

  useEffect(() => {
    document.addEventListener("scroll", scrollHandler);
    return () => document.removeEventListener("scroll", scrollHandler);
  }, []);

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-4">
        {!searchTerm && hero && (
          <Hero
            imageUrl={`${IMAGE_BASE_URL}${POSTER_SIZE}${hero.backdrop_path}`}
            title={hero.title}
            overview={hero.overview}
          />
        )}
        <section className="flex flex-col gap-4 justify-center">
          <Input
            label="Search movies"
            size="sm"
            type="text"
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          <h2 className="text-left text-3xl font-semibold">
            {searchTerm ? "Search Result" : "Popular movies"}
          </h2>
          {!loading && error && <Alert color="danger" title="Error loaded" />}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {movies.map((movie: Movie) => {
              return (
                <Card key={movie.id}>
                  <CardBody className="overflow-hidden py-0 px-0 relative min-h-48">
                    <CircularProgress
                      className="absolute top-2 left-2 z-20 bg-slate-100 rounded-full dark:bg-slate-700"
                      color={
                        movie.vote_average > 7
                          ? "success"
                          : movie.vote_average < 4
                            ? "danger"
                            : "warning"
                      }
                      formatOptions={{ style: "unit", unit: "percent" }}
                      showValueLabel={true}
                      size="lg"
                      value={Math.round(movie.vote_average * 10)}
                    />
                    <Image
                      alt="Card background"
                      className="object-cover rounded-none"
                      src={`${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`}
                    />
                  </CardBody>
                  <CardHeader className="pb-0 py-4 px-4 flex-col items-start">
                    <h4 className="font-bold text-lg leading-5">
                      {movie.title}
                    </h4>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
          {loading && !error && (
            <div className="flex justify-center w-full">
              <CircularProgress aria-label="Loading..." size="lg" />
            </div>
          )}
        </section>
      </div>
    </DefaultLayout>
  );
}
