import API from "@/API";
import { UserContext } from "@/context";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { useContext, useEffect, useState } from "react";

type BookmarkProp = {
  movieId: number;
};

const BookmarkIcon = ({
  fill = "currentColor",
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  ...props
}) => {
  return (
    <svg
      fill={filled ? "currentColor" : "none"}
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

export default function Bookmark({ movieId }: BookmarkProp) {
  const [state, setState] = useState(false);
  const { cookies } = useContext(UserContext);

  const toggleWatchlist = async () => {
    try {
      const sessionId = cookies.sessionId;
      const accountId = cookies.accountId;
      const data = await API.watchlist(sessionId, movieId, accountId, state);
      if (data.status_code === 3) {
        addToast({
          title: "Error",
          description: data?.status_message,
          color: "danger",
        });
        return;
      }
      if (data.status_code === 1) setState(true);
      if (data.status_code === 13) setState(false);
      addToast({
        title: "Success",
        description: "",
        color: "success",
      });
    } catch {}
  };

  const getState = async () => {
    const sessionId = cookies.sessionId;
    API.getMovieState(sessionId, movieId)
      .then((data) => {
        const watchlist = !!data?.watchlist;
        setState(watchlist);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getState();
  }, []);

  const hundler = () => {
    setState(!state);
    toggleWatchlist();
  };

  return (
    <Button
      isIconOnly
      aria-label="Like"
      color="primary"
      variant="light"
      onPress={hundler}
    >
      <BookmarkIcon filled={state} />
    </Button>
  );
}
