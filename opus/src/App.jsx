import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Selections from "./pages/selections/Selections";
import SelectionsDetail from "./pages/selections/SelectionsDetail";
import Cart from "./pages/selections/Cart";
import DarkHeaderLayout from "./layouts/DarkHeaderLayout";
import LightHeaderLayout from "./layouts/LightHeaderLayout";
import Unveiling from "./pages/Unveiling";
import OnStage from "./pages/onStage/OnStage";
import MusicalDetail from './pages/onStage/MusicalDetail';
import Reviews from "./pages/onStage/Reviews";

export default function App() {
  return (
      <Routes>
        {/* Dark Header */}
        <Route element={<DarkHeaderLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Light Header */}
        <Route element={<LightHeaderLayout />}>
          <Route path="/onStage" element={<OnStage />} />
          <Route path="/onStage/:mt20id" element={<MusicalDetail />}/>
          <Route path="/onStage/reviews" element={<Reviews />}/>
          <Route path="/unveiling" element={<Unveiling />} />
          <Route path='/selections' element={<Selections />}></Route>
          <Route path='/selections/:goodsNo' element={<SelectionsDetail />}></Route>
          <Route path='/selections/cart' element={<Cart />}></Route>
        </Route>
    </Routes>
  );
} 