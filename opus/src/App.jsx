import { Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import ScrollToTop from "./components/ScrollToTop";

import Board from "./components/Board"

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />

      <main>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/" element={<Board />} />

        </Routes>
      </main>

      <Footer />
    </>
  );
}
