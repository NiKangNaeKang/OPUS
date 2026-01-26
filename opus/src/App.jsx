import { Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/art" element={<Art />} /> */}
          {/* <Route path="/musical" element={<Musical />} /> */}
        </Routes>
      </main>

      <Footer />
    </>
  );
}
