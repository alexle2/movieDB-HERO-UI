import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function NotFound() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 h-full">
        <span className={title()}>404</span>
      </section>
    </DefaultLayout>
  );
}
