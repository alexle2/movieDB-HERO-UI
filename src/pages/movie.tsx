import { useMovieFetch } from "@/hooks/useMovieFetch";
import DefaultLayout from "@/layouts/default";
import { useParams } from "react-router-dom";
import { IMAGE_BASE_URL, POSTER_SIZE } from "@/config";
import {
  Alert,
  Card,
  CardBody,
  CardHeader,
  CircularProgress,
  Image,
} from "@heroui/react";

export default function Movie() {
  const { id } = useParams();
  const { error, loading, movie } = useMovieFetch(id);
  console.log(error, loading, movie);

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
