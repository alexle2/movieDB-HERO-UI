import { useMovieFetch } from "@/hooks/useMovieFetch";
import DefaultLayout from "@/layouts/default";
import { useParams } from "react-router-dom";
import { IMAGE_BASE_URL, POSTER_SIZE } from "@/config";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  CircularProgress,
  Image,
  Slider,
} from "@heroui/react";
import { useContext } from "react";
import { UserContext } from "@/context";

const HeartIcon = ({
  fill = "currentColor",
  filled = "none",
  size = 24,
  height = 24,
  width = 24,
  ...props
}) => {
  return (
    <svg
      fill={filled ? "fill" : "none"}
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

const BookmarkIcon = ({
  fill = "currentColor",
  filled = "none",
  size = 24,
  height = 24,
  width = 24,
  ...props
}) => {
  return (
    <svg
      fill={filled ? "fill" : "none"}
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

export default function Movie() {
  const { id } = useParams();
  const { error, loading, movie } = useMovieFetch(id);
  const { isAuth }: any = useContext(UserContext);

  return (
    <DefaultLayout>
      {loading && !error && (
        <div className="flex justify-center w-full mt-20">
          <CircularProgress aria-label="Loading..." size="lg" />
        </div>
      )}
      {!loading && error && <Alert color="danger" title="Error loaded" />}
      {!loading && !error && (
        <section className="flex flex-col gap-4">
          <Card
            isBlurred
            className="border-none bg-background/60 dark:bg-default-100/50 w-full"
            shadow="sm"
          >
            <CardBody className="p-0">
              <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-8">
                <div className="relative col-span-6 md:col-span-4">
                  <Image
                    alt="Album cover"
                    className="object-cover"
                    width="100%"
                    shadow="md"
                    src={`${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`}
                  />
                </div>
                <div className="flex flex-col col-span-6 md:col-span-8 p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-4">
                      <h1 className="font-semibold text-foreground/90 text-4xl">
                        {movie.title}
                      </h1>
                      <p className="text-md text-foreground/80">
                        {movie.overview}
                      </p>
                      <CircularProgress
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
                      {movie.budget > 0 && (
                        <div className="flex items-center justify-between">
                          <b>Budget</b>
                          <p className="text-default-500">{movie.budget}$</p>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <b>Status</b>
                        <p className="text-default-500">{movie.status}</p>
                      </div>
                      {isAuth && (
                        <div className="flex gap-4 items-center">
                          <Button
                            isIconOnly
                            aria-label="Like"
                            color="primary"
                            variant="light"
                          >
                            <HeartIcon />
                          </Button>
                          <Button
                            isIconOnly
                            aria-label="Like"
                            color="primary"
                            variant="light"
                          >
                            <BookmarkIcon />
                          </Button>
                          <Slider
                            className="max-w-sm"
                            defaultValue={20}
                            formatOptions={{ style: "decimal" }}
                            label="Select a rating"
                            marks={[
                              {
                                value: 20,
                                label: "20%",
                              },
                              {
                                value: 50,
                                label: "50%",
                              },
                              {
                                value: 80,
                                label: "80%",
                              },
                            ]}
                            maxValue={100}
                            minValue={0}
                            showTooltip={true}
                            step={5}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
          <h2 className="text-4xl font-semibold">Actors</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {movie.actors.map((actor) => {
              return (
                <Card key={actor.id}>
                  <CardBody className="overflow-hidden py-0 px-0 relative min-h-48">
                    <Image
                      alt="Card background"
                      className="object-cover rounded-none"
                      src={`${IMAGE_BASE_URL}${POSTER_SIZE}${actor.profile_path}`}
                    />
                  </CardBody>
                  <CardHeader className="pb-0 py-4 px-4 flex-col items-center">
                    <h4 className="font-bold text-lg leading-5">
                      {actor.original_name}
                    </h4>
                    <h4 className="text-md leading-5">{actor.character}</h4>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>
      )}
    </DefaultLayout>
  );
}
