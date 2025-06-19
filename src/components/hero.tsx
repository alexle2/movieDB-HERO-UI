export default function Hero({ imageUrl, title, overview }) {
  return (
    <section
      className="p-6 flex flex-col gap-4 justify-end h-96 bg-no-repeat bg-cover text-white"
      style={{ backgroundImage: `url(${imageUrl}}` }}
    >
      <div className="lg:w-1/2 flex flex-col gap-4">
        <h2 className="text-left text-4xl font-bold">{title}</h2>
        <p>{overview}</p>
      </div>
    </section>
  );
}
