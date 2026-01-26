import '../../css/common/Footer.css'

function Footer () {
  return (
    <footer id="footer" className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <h3 className="footer__brand">OPUS</h3>
            <p className="footer__desc">문화예술의 모든 것을 한 곳에서</p>
          </div>

          <div>
            <h4 className="footer__title">서비스</h4>
            <ul className="footer__links">
              <li><a href="#">What's ON</a></li>
              <li><a href="#">게시판</a></li>
              <li><a href="#">굿즈</a></li>
              <li><a href="#">경매</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer__title">고객지원</h4>
            <ul className="footer__links">
              <li><a href="#">공지사항</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">1:1 문의</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer__title">정보</h4>
            <ul className="footer__links">
              <li><a href="#">이용약관</a></li>
              <li><a href="#">개인정보처리방침</a></li>
              <li><a href="#">회사소개</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2026 OPUS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;