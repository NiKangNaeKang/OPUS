import Header from "../components/common/Header"
import Footer from "../components/common/Footer"
import {Outlet} from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";

export default function LightHeaderLayout() {
  return (
    <>
      <ScrollToTop />
      <Header variant="light" />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}