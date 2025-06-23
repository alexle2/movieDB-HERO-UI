import { useEffect, useRef, useState } from "react";
import { IMAGE_BASE_URL, POSTER_SIZE } from "@/config";
import { SearchIcon } from "./icons";
import {
  Avatar,
  Input,
  Listbox,
  ListboxItem,
  Progress,
} from "@heroui/react";
import { useSearchFetch } from "@/hooks/useSearchFetch";

export default function Search() {
  const { error, loading, state, setSearchTerm } = useSearchFetch();
  const inital = useRef(true);
  const [search, setSearch] = useState("");
  const movies = state.results;
  const [focused, setFocused] = useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => {
    setTimeout(() => setFocused(false), 300);
  }

  useEffect(() => {
    if (inital.current) {
      inital.current = false;
      return;
    }
    let timerId = undefined;
    clearTimeout(timerId);
    timerId = setTimeout(() => setSearchTerm(search), 40);
    return () => clearTimeout(timerId);
  }, [search]);

  return (
    <div className="relative">
      <Input
        onFocus={onFocus}
        onBlur={onBlur}
        aria-label="Search"
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm min-w-60",
        }}
        labelPlacement="outside"
        placeholder="Search..."
        startContent={
          <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
        }
        type="search"
        value={search}
        onValueChange={(v) => setSearch(v)}
      />
      {focused && search && (
        <div className="absolute left-0 right-0 flex flex-col items-center max-h-96 overflow-auto px-1 py-2 border-small rounded-small border-default-200 dark:border-default-100 bg-white dark:bg-black">
          {loading && !error && (
            <Progress
              isIndeterminate
              aria-label="Loading..."
              className="top-0 absolute left-0 right-0"
              size="sm"
            />
          )}
          <Listbox
            aria-label="Search"
            emptyContent={loading ? "" : "No found movies!"}
            selectionMode="none"
          >
            {movies.map((movie) => {
              return (
                <ListboxItem
                  key={movie.id}
                  textValue={movie.title}
                  href={`/movies/movie/${movie.id}`}
                  className="block"
                >
                  <div className="flex gap-2 items-center">
                    <Avatar
                      alt="logo"
                      className="flex-shrink-0"
                      size="md"
                      src={`${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`}
                    />
                    <span className="text-small truncate">{movie.title}</span>
                  </div>
                </ListboxItem>
              );
            })}
          </Listbox>
        </div>
      )}
    </div>
  );
}
