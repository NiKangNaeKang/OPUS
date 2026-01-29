import { Routes, Route } from "react-router-dom";
import DarkHeaderLayout from "./layouts/DarkHeaderLayout";
import LightHeaderLayout from "./layouts/LightHeaderLayout";
import Home from "./pages/Home";
import ScrollToTop from "./components/ScrollToTop";
import Unveiling from "./pages/Unveiling";
import OnStage from "./pages/onStage/OnStage";

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
        <Route path="/unveiling" element={<Unveiling />} />
      </Route>
    </Routes>
  );
} 