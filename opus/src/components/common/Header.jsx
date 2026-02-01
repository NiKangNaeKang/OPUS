import { useEffect, useState } from "react";
import { useLocation, Link, NavLink } from "react-router-dom";
import "../../css/common/Header.css";

function Header({ onClickUser }) {
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
          <Link to="/" className="brand">
            OPUS
          </Link>

          <nav className="gnb">
            <NavLink
              to="/onStage"
              className={({ isActive }) =>
                `gnb__link ${isActive ? "is-active" : ""}`
              }
            >
              On-Stage
            </NavLink>

            <NavLink
              to="/proposals"
              className={({ isActive }) =>
                `gnb__link ${isActive ? "is-active" : ""}`
              }
            >
              Proposals
            </NavLink>

            <NavLink
              to="/unveiling"
              className={({ isActive }) =>
                `gnb__link ${isActive ? "is-active" : ""}`
              }
            >
              Unveiling
            </NavLink>

            <NavLink
              to="/selections"
              className={({ isActive }) =>
                `gnb__link ${isActive ? "is-active" : ""}`
              }
            >
              Selections
            </NavLink>
          </nav>
        </div>

        <div className="header__right">
          <button className="icon-btn" type="button" aria-label="알림">
            <i className="fa-regular fa-bell" aria-hidden="true"></i>
          </button>

          {/* 로그인 모달창 오픈위해 클릭 이벤트를 props로 받음 */}
          <button
            className="icon-btn" 
            type="button"
            aria-label="마이페이지"
            onClick={onClickUser}
          >
            <i className="fa-regular fa-user" aria-hidden="true"></i>
          </button>

          {location.pathname.includes("goods") ? (
            <button className="icon-btn" type="button" aria-label="장바구니">
              <i className="fa-solid fa-cart-shopping" aria-hidden="true"></i>
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Header;
