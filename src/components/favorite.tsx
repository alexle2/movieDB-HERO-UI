import API from "@/API";
import { UserContext } from "@/context";
import { useContext, useEffect, useState } from "react";
import { addToast, Button } from "@heroui/react";

type FavoriteProp = {
  movieId: number;
};

const HeartIcon = ({
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
        d="M12.62 20.81c-.34.12-.9.12-1.24 0C8.48 19.82 2 15.69 2 8.69 2 5.6 4.49 3.1 7.56 3.1c1.82 0 3.43.88 4.44 2.24a5.53 5.53 0 0 1 4.44-2.24C19.51 3.1 22 5.6 22 8.69c0 7-6.48 11.13-9.38 12.12Z"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

export default function Favorite({ movieId }: FavoriteProp) {
  const [state, setState] = useState(false);
  const { cookies } = useContext(UserContext);

  const changeFavorite = async () => {
    const sessionId = cookies.sessionId;
    const accountId = cookies.accountId;
    const data = await API.favorite(sessionId, movieId, accountId, state);
    if (data.status_code === 1) setState(true);
    if (data.status_code === 13) setState(false);
    addToast({
      title: "Success",
      description: "",
      color: "success",
    });
  };

  const getState = async () => {
    const sessionId = cookies.sessionId;
    API.getMovieState(sessionId, movieId)
      .then((data) => {
        const favorite = !!data?.favorite;
        setState(favorite);
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
    changeFavorite();
  };

  return (
    <Button
      isIconOnly
      aria-label="Like"
      color="primary"
      variant="light"
      onPress={hundler}
    >
      <HeartIcon filled={state} />
    </Button>
  );
}
