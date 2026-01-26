import React, { useState, useMemo } from 'react';
import './board.css'; // CSS 파일 위치에 맞게 수정하세요

const INITIAL_DATA = {
  notice: [
    { id: "n1", type: "공지", category: "all", title: "2024년 1월 서비스 정기 점검 안내", excerpt: "안정적인 서비스 제공을 위한 정기 점검이 진행됩니다.", author: "관리자", date: "2024-01-15", views: 1247 },
    { id: "n2", type: "공지", category: "auction", title: "경매 서비스 이용 가이드", excerpt: "경매 참여 전 필수 확인 사항과 유의사항을 안내합니다.", author: "관리자", date: "2024-01-12", views: 892 },
    { id: "n3", type: "공지", category: "all", title: "개인정보 처리방침 변경 안내", excerpt: "2024년 1월 1일부터 적용되는 변경 내용을 확인하세요.", author: "관리자", date: "2024-01-08", views: 1563 },
    { id: "n4", type: "공지", category: "goods", title: "굿즈 배송 지연 관련 안내", excerpt: "명절 연휴로 인한 배송 일정 변경을 안내드립니다.", author: "관리자", date: "2024-01-05", views: 634 },
    { id: "n5", type: "공지", category: "exhibition", title: "2024 신규 전시 라인업 공개", excerpt: "상반기 주목할 만한 전시 일정을 확인하세요.", author: "관리자", date: "2024-01-03", views: 2104 },
    { id: "n6", type: "공지", category: "all", title: "회원 등급 혜택 안내", excerpt: "등급별 제공되는 혜택과 포인트 정책을 안내합니다.", author: "관리자", date: "2023-12-28", views: 1872 },
    { id: "n7", type: "공지", category: "musical", title: "티켓 예매 시스템 업데이트", excerpt: "더욱 편리해진 예매 UI/UX 업데이트 내용을 확인하세요.", author: "관리자", date: "2023-12-20", views: 956 },
    { id: "n8", type: "공지", category: "all", title: "고객센터 운영시간 변경 안내", excerpt: "2024년부터 변경되는 고객센터 운영시간을 안내드립니다.", author: "관리자", date: "2023-12-15", views: 723 },
  ],
  promo: [
    { id: "p1", type: "홍보", category: "exhibition", title: "[전시] 사진으로 보는 현대 — 도슨트 투어 오픈", excerpt: "주말 도슨트(30분) 투어가 새로 오픈되었습니다. 사전 예약 필수!", author: "ARTSPACE", date: "2024-01-14", views: 409 },
    { id: "p2", type: "홍보", category: "musical", title: "[뮤지컬] 얼리버드 할인 안내", excerpt: "1월 예매자 대상 최대 20% 할인. 좌석 소진 전 서둘러주세요.", author: "제휴사", date: "2024-01-11", views: 1320 },
    { id: "p3", type: "홍보", category: "auction", title: "[경매] 1월 프리뷰 전시 — 출품작 미리보기", excerpt: "출품작 프리뷰 전시가 시작됩니다. 현장 상담도 가능해요.", author: "경매팀", date: "2024-01-09", views: 980 },
    { id: "p4", type: "홍보", category: "goods", title: "[굿즈] 한정 수량 아트북 입고", excerpt: "리미티드 에디션 아트북이 입고되었습니다. 재고 소진 시 종료.", author: "스토어", date: "2024-01-07", views: 155 },
    { id: "p5", type: "홍보", category: "exhibition", title: "[전시] 작가와의 대화(Artist Talk) 신청 안내", excerpt: "작가의 작업 과정과 비하인드 스토리를 직접 들어보세요.", author: "ARTSPACE", date: "2024-01-04", views: 741 },
  ],
};

const Board = () => {
  // 상태 관리
  const [activeTab, setActiveTab] = useState('notice'); 
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('latest');
  const [keyword, setKeyword] = useState('');

  // 유틸리티
  const formatDate = (iso) => iso.replaceAll('-', '.');
  const formatNumber = (n) => Number(n).toLocaleString('ko-KR');

  // 데이터 필터링 로직
  const filteredItems = useMemo(() => {
    let items = [...(INITIAL_DATA[activeTab] || [])];
    const kw = keyword.toLowerCase().trim();

    if (category !== "all") {
      items = items.filter((it) => it.category === category);
    }

    if (kw) {
      items = items.filter((it) => 
        it.title.toLowerCase().includes(kw) || 
        it.excerpt.toLowerCase().includes(kw) || 
        it.author.toLowerCase().includes(kw)
      );
    }

    if (sort === "views") {
      items.sort((a, b) => b.views - a.views);
    } else {
      items.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return items;
  }, [activeTab, category, sort, keyword]);

  return (
    <div className="page">
      {/* HEADER (필요 시 별도 컴포넌트로 분리 가능) */}
      <header className="header is-scrolled"> {/* 스크롤 상태 예시로 고정 */}
        <div className="wrap header__inner">
          <div className="header__left">
            <a href="/" className="brand">CULTURIST</a>
            <nav className="gnb">
              <a href="/" className="gnb__link">홈</a>
              <a href="/board" className="gnb__link is-active">What's ON</a>
              <a href="/board" className="gnb__link">게시판</a>
              <a href="/goods" className="gnb__link">굿즈</a>
              <a href="/auction" className="gnb__link">경매</a>
              <a href="/admin" className="admin-link">관리자</a>
            </nav>
          </div>
          <div className="header__right">
            <button className="icon-btn" aria-label="마이페이지">
              <i className="fa-regular fa-user"></i>
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'notice' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('notice')}
          >
            공지
          </button>
          <button 
            className={`tab-btn ${activeTab === 'promo' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('promo')}
          >
            홍보
          </button>
        </div>

        {/* Filters */}
        <section className="filters">
          <div className="filters__left">
            <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">전체</option>
              <option value="musical">뮤지컬</option>
              <option value="exhibition">미술 전시</option>
              <option value="auction">경매</option>
              <option value="goods">굿즈</option>
            </select>

            <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="latest">최신순</option>
              <option value="views">조회수순</option>
            </select>
          </div>

          <div className="filters__right">
            <div className="search">
              <div className="search__field">
                <input
                  className="search__input"
                  type="text"
                  placeholder="제목/내용/작성자 검색"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <i className="fa-solid fa-magnifying-glass search__icon"></i>
              </div>
              <button className="search__btn">검색</button>
            </div>
          </div>
        </section>

        {/* List */}
        <div className="board-list">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item.id} className="item" onClick={() => console.log(item.id)}>
                <div className="item__left">
                  <span className={`badge ${item.type === '홍보' ? 'badge--promo' : ''}`}>
                    {item.type}
                  </span>
                  <div className="item__content">
                    <h3 className="item__title">{item.title}</h3>
                    <p className="item__excerpt">{item.excerpt}</p>
                  </div>
                </div>
                <div className="item__right">
                  <span>{item.author}</span>
                  <span>{formatDate(item.date)}</span>
                  <span className="views">
                    <i className="fa-regular fa-eye"></i> {formatNumber(item.views)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty">조건에 맞는 게시글이 없어요.</div>
          )}
        </div>

        {/* Write Button */}
        <div className="write-btn">
          <button className="btn btn-primary">글쓰기</button>
        </div>

        {/* Pagination (더미) */}
        <div className="pagination">
          <button className="page-btn"><i className="fa-solid fa-chevron-left"></i></button>
          <button className="page-btn is-active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn"><i className="fa-solid fa-chevron-right"></i></button>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__grid">
            <div>
              <div className="footer__brand">ARTSPACE</div>
              <p className="footer__desc">문화예술의 모든 순간을<br />함께합니다</p>
            </div>
            <div>
              <h3 className="footer__title">서비스</h3>
              <ul className="footer__list">
                <li><a href="#!">What's ON</a></li>
                <li><a href="#!">게시판</a></li>
              </ul>
            </div>
            <div>
              <h3 className="footer__title">고객지원</h3>
              <ul className="footer__list">
                <li><a href="#!">공지사항</a></li>
                <li><a href="#!">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="footer__title">SNS</h3>
              <div className="sns">
                <a className="sns__btn" href="#!"><i className="fa-brands fa-instagram"></i></a>
                <a className="sns__btn" href="#!"><i className="fa-brands fa-youtube"></i></a>
              </div>
            </div>
          </div>
          <div className="footer__bottom">
            <p>© 2024 ARTSPACE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Board;