import { Outlet } from "react-router-dom"
import Header from "../components/common/Header"
import Footer from "../components/common/Footer"
import ScrollToTop from "../components/ScrollToTop";

export default function DarkHeaderLayout() {
  return (
    <>
      <ScrollToTop />
      <Header variant = "dark" />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}