import { useEffect, useState } from "react";
import { useLocation, Link, NavLink } from "react-router-dom";
import "../../css/common/Header.css";

function Header({ onClickUser, onLogout, isLoggedIn, variant }) {
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
      /* 아래 className 부분에 ${variant}를 추가했습니다. 이래야 색깔이 바뀝니다! */
      className={`header ${variant} ${scrolled ? "is-scrolled" : ""} ${onHero ? "is-on-hero" : ""}`}
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

          <button
            className="icon-btn" 
            type="button"
            aria-label={isLoggedIn ? "마이페이지" : "로그인"}
            onClick={onClickUser}
          >
            <i className={`${isLoggedIn ? "fa-regular fa-user" : "fa-solid fa-arrow-right-to-bracket"}`} aria-hidden="true"></i>
          </button>


          {location.pathname.includes("selections") ?
            <NavLink to="/selections/cart">
              <button className="icon-btn" type="button" aria-label="장바구니">
                <i className="fa-solid fa-cart-shopping" aria-hidden="true"></i>
              </button>
            </NavLink>
            : null}

            {isLoggedIn && (
              <button
                className="icon-btn"
                type="button"
                aria-label="로그아웃"
                onClick={onLogout}
              >
                <i className="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i>
              </button>
            )}
        </div>
      </div>
    </header>
  );
}

export default Header;