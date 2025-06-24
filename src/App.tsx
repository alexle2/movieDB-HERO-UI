import { Route, Routes } from "react-router-dom";
import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import NotFound from "./pages/notFound";
import Movie from "./pages/movie";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<Movie />} path="/movies/movie/:id" />
      <Route element={<DocsPage />} path="/docs" />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<NotFound />} path="*" />
    </Routes>
  );
}
export default App;