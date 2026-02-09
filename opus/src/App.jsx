import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Selections from "./pages/selections/Selections";
import SelectionsDetail from "./pages/selections/SelectionsDetail";
import Cart from "./pages/selections/Cart";
import Checkout from "./pages/selections/Checkout";
import DarkHeaderLayout from "./layouts/DarkHeaderLayout";
import LightHeaderLayout from "./layouts/LightHeaderLayout";
import Unveiling from "./pages/Unveiling";
import OnStage from "./pages/onStage/OnStage";
import UnveilingDetail from "./pages/UnveilingDetail";
import MusicalDetail from './pages/onStage/MusicalDetail';
import Reviews from "./pages/onStage/Reviews";
import Proposals from "./pages/Proposals/Proposals";
import ToastConfig from "./components/common/ToastConfig";

export default function App() {
  return (
  <>
    <ToastConfig />

    <Routes>
      {/* Dark Header (Home 등) */}
      <Route element={<DarkHeaderLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Light Header (게시판, 상세페이지 등) */}
      <Route element={<LightHeaderLayout />}>
        <Route path="/onStage" element={<OnStage />} />
        <Route path="/onStage/:mt20id" element={<MusicalDetail />} />
        <Route path="/onStage/reviews" element={<Reviews />} />
        
        {/* 2. Proposals 경로 추가 */}
        <Route path="/proposals" element={<Proposals />} />

        <Route path="/unveiling" element={<Unveiling />} />
        <Route path="/unveiling/:id" element={<UnveilingDetail />} />
        <Route path='/selections' element={<Selections />} />
        <Route path='/selections/:goodsNo' element={<SelectionsDetail />} />
        <Route path='/selections/cart' element={<Cart />} />
        <Route path='/selections/checkout' element={<Checkout />} />
      </Route>
    </Routes>
    
   </>
  );
}