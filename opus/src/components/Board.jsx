import React, { useState, useMemo } from 'react';
import { boardData } from "../data/boardData.js"; 
import "../css/Board.css";

const Board = () => {
  const [activeTab, setActiveTab] = useState('notice'); 
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('latest');
  
  // 상태 관리 (입력값과 실제 검색값 분리)
  const [keyword, setKeyword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // 유틸리티
  const formatDate = (iso) => iso.replaceAll('-', '.');
  const formatNumber = (n) => Number(n).toLocaleString('ko-KR');

  // 버튼 클릭 시 호출
  const handleSearch = () => {
    setSearchQuery(keyword);
  };

  // 엔터키 지원
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  // 필터링 및 정렬 데이터 계산
  const filteredItems = useMemo(() => {
    if (!boardData || !boardData[activeTab]) return [];
    
    let items = [...boardData[activeTab]];
    const q = searchQuery.toLowerCase().trim();

    if (category !== "all") {
      items = items.filter((it) => it.category === category);
    }

    if (q) {
      items = items.filter((it) => 
        it.title.toLowerCase().includes(q) || 
        it.excerpt.toLowerCase().includes(q)
      );
    }

    if (sort === "views") {
      items.sort((a, b) => b.views - a.views);
    } else {
      items.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return items;
  }, [activeTab, category, sort, searchQuery]);

  return (
    <main className="container board-container">
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'notice' ? 'is-active' : ''}`}
          onClick={() => { setActiveTab('notice'); setCategory('all'); setSearchQuery(''); setKeyword(''); }}
        >
          공지사항
        </button>
        <button 
          className={`tab-btn ${activeTab === 'promotion' ? 'is-active' : ''}`}
          onClick={() => { setActiveTab('promotion'); setCategory('all'); setSearchQuery(''); setKeyword(''); }}
        >
          이벤트/홍보
        </button>
      </div>

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
            <input
              className="search__input"
              type="text"
              placeholder="검색어 입력..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="search__btn" type="button" onClick={handleSearch}>
              검색
            </button>
          </div>
        </div>
      </section>

      <div className="board-list">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item.id} className="board-item">
              <div className="item__left">
                <span className={`badge ${item.type === '홍보' ? 'badge--promotion' : 'badge--notice'}`}>
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
                <span><i className="fa-regular fa-eye"></i> {formatNumber(item.views)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">내용이 없습니다.</div>
        )}
      </div>
    </main>
  );
};

export default Board;