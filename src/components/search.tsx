import { useIndexFetch } from "@/hooks/useIndexFetch";
import { Autocomplete, AutocompleteItem, Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Kbd, Link } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { IMAGE_BASE_URL, POSTER_SIZE } from "@/config";
import { SearchIcon } from "./icons";

export default function Search() {
  const { error, loading, state, searchTerm, setSearchTerm } = useIndexFetch();
  const inital = useRef(true);
  const [search, setSearch] = useState("");
  const movies = state.results;


  const ch = (text: string) => {
    console.log(text)
  }

  useEffect(() => {
    if (inital.current) {
      inital.current = false;
      return;
    }
    const timerId = setTimeout(() => setSearchTerm(search), 500);
    return () => clearTimeout(timerId);
  }, [search]);
  return (
    <Dropdown>
      {/* <DropdownTrigger className="w-full"> */}
        <Input
          aria-label="Search"
          classNames={{
            inputWrapper: "bg-default-100",
            input: "text-sm min-w-40",
          }}
          endContent={
            <Kbd className="hidden lg:inline-block" keys={["command"]}>
              K
            </Kbd>
          }
          labelPlacement="outside"
          placeholder="Search..."
          startContent={
            <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
          }
          type="search"
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
      {/* </DropdownTrigger> */}
      <DropdownMenu aria-label="Dynamic Actions" items={movies}>
        {(item) => (
          <DropdownItem key={item.id} href={`/movies/movie/${item.id}`}  startContent={
            <Avatar
              alt="logo"
              className="w-6 h-6"
              src={`${IMAGE_BASE_URL}${POSTER_SIZE}${item.poster_path}`}
            />
          }>
            {item.title}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
    // <Autocomplete
    //   label=""
    //   labelPlacement="outside-left"
    //   placeholder="Search"
    //   onInputChange={(text: string) => setSearch(text)}
    // >
    //   {movies?.map((movie) => (
    //     <AutocompleteItem
    //       href={`/movies/movie/${movie.id}`}
    //       key={movie.id}
    //       startContent={
    //         <Avatar
    //           alt="logo"
    //           className="w-6 h-6"
    //           src={`${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`}
    //         />
    //       }
    //     >
    //       {movie.title}
    //     </AutocompleteItem>
    //   ))}
    // </Autocomplete>
  );
}
