import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header id="header" className="header header--overlay">
      <div className="wrap header__inner">
        <div className="header__left">
          <Link to="/" className="brand">
            OPUS
          </Link>

          <nav className="gnb">
            <Link to="/" className="gnb__link">On-Stage</Link>
            <Link to="/art" className="gnb__link">Proposals</Link>
            <Link to="/musical" className="gnb__link">Unveiling</Link>
            <Link to="/" className="gnb__link">Selections</Link>
          </nav>
        </div>

        <div className="header__right">
          <button className="icon-btn" type="button" aria-label="마이페이지">
            <i className="fa-regular fa-user" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
