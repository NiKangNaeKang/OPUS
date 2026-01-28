import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import Selections from "./pages/selections/Selections";
import SelectionsDetail from "./pages/selections/SelectionsDetail";
import HeroSlider from "./components/HeroSlider";
import Cart from "./pages/selections/Cart";

export default function App() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <>
      <Header variant="light" />

      {isHome && <HeroSlider />}

      <main id="main-content" className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/selections' element={<Selections />}></Route>
          <Route path='/selections/:goodsNo' element={<SelectionsDetail />}></Route>
          <Route path='/selections/cart' element={<Cart />}></Route>
        </Routes>
      </main>
      <Footer />
    </>
  );
}