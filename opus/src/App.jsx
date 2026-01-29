import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Selections from "./pages/selections/Selections";
import SelectionsDetail from "./pages/selections/SelectionsDetail";
import Cart from "./pages/selections/Cart";
import DarkHeaderLayout from "./layouts/DarkHeaderLayout";
import LightHeaderLayout from "./layouts/LightHeaderLayout";
import Unveiling from "./pages/Unveiling";
import OnStage from "./pages/onStage/OnStage";
import HeroSlider from "./components/HeroSlider";

export default function App() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <>
      {isHome && <HeroSlider />}
      <Routes>
        {/* Dark Header */}
        <Route element={<DarkHeaderLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Light Header */}
        <Route element={<LightHeaderLayout />}>
          <Route path="/onStage" element={<OnStage />} />
          <Route path="/unveiling" element={<Unveiling />} />
          <Route path='/selections' element={<Selections />}></Route>
          <Route path='/selections/:goodsNo' element={<SelectionsDetail />}></Route>
          <Route path='/selections/cart' element={<Cart />}></Route>
        </Route>
      </Routes>
    </>
  );
} 