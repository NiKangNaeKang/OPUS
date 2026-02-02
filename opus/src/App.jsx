import { Routes, Route } from "react-router-dom";
import DarkHeaderLayout from "./layouts/DarkHeaderLayout";
import LightHeaderLayout from "./layouts/LightHeaderLayout";
import Home from "./pages/Home";
import Unveiling from "./pages/Unveiling";
import OnStage from "./pages/onStage/OnStage";
import UnveilingDetail from "./pages/UnveilingDetail";
import MusicalDetail from './pages/onStage/MusicalDetail';

export default function App() {
  return (
    <Routes>
      {/* Dark Header */}
      <Route element = {<DarkHeaderLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Light Header */}
      <Route element = {<LightHeaderLayout />}>
        <Route path="/onStage" element={<OnStage />}/>
        <Route path="/onStage/:mt20id" element={<MusicalDetail />}/>
        <Route path="/unveiling" element={<Unveiling />} />
        <Route path="/unveiling/:id" element={<UnveilingDetail />} />
      </Route>
    </Routes>
  );
} 