import { Routes, Route, BrowserRouter } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import ScrollToTop from "./components/ScrollToTop";
import Unveiling from "./pages/Unveiling";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />

      
      <Header variant="light" />
      <main id="main-content" className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/unveiling" element={<Unveiling />} />
        </Routes>
      

      </main>
      <Footer />
    </>
  );
}