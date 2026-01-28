import { Routes, Route, BrowserRouter } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";

import Board from "./components/Board"

export default function App() {
  return (
    <>
      <Header variant="light" />
      <main id="main-content" className="main">
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/" element={<Board />} />

        </Routes>
      </main>
      <Footer />
    </>
  );
}