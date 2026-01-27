import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../css/common/Header.css";

function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ 홈 최상단에서만 hero 모드(흰 글씨)
  const onHero = isHome && !scrolled;

  return (
    <header
      id="header"
      className={`header ${scrolled ? "is-scrolled" : ""} ${
        onHero ? "is-on-hero" : ""
      }`}
    >
      <div className="wrap header__inner">
        <div className="header__left">
          <a href="#" className="brand">
            OPUS
          </a>

          <nav className="gnb">
            <a href="#" className="gnb__link is-active">
              On-Stage
            </a>
            <a href="#" className="gnb__link">
              Proposals
            </a>
            <a href="#" className="gnb__link">
              Unveiling
            </a>
            <a href="#" className="gnb__link">
              Selections
            </a>
          </nav>
        </div>

        <div className="header__right">
          <button className="icon-btn" type="button" aria-label="알림">
            <i className="fa-regular fa-bell" aria-hidden="true"></i>
          </button>
          <button className="icon-btn" type="button" aria-label="마이페이지">
            <i className="fa-regular fa-user" aria-hidden="true"></i>
          </button>
          {location.pathname.includes("goods") ? 
          <button className="icon-btn" type="button" aria-label="장바구니">
            <i className="fa-solid fa-cart-shopping" aria-hidden="true"></i></button> 
            : null}
        </div>
      </div>
    </header>
  );
}

export default Header;
