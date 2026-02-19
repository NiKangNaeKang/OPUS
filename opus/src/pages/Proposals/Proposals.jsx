import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import "../../css/proposals.css";

const Proposals = () => {
  const [items, setItems] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("notice");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("latest");
  const [keyword, setKeyword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const formatDate = (iso) => (iso ? iso.split("T")[0].replaceAll("-", ".") : "");
  const formatNumber = (n) => Number(n ?? 0).toLocaleString("ko-KR");

  const categoryLabel = {
    musical: "뮤지컬",
    exhibition: "전시",
    auction: "경매",
    goods: "굿즈",
  };

  // 데이터 로드: @RequestMapping("/api/board") 연결
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // 백엔드 컨트롤러 경로에 맞춰 호출 (전체 리스트 조회)
        const response = await axios.get("/api/board"); 
        setItems(response.data); 
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = () => setSearchQuery(keyword);
  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };

  const changeTab = (tab) => {
    setActiveTab(tab);
    setCategory("all");
    setSort("latest");
    setSearchQuery("");
    setKeyword("");
  };

  const filteredItems = useMemo(() => {
    if (!Array.isArray(items)) return [];

    // 1. 탭 필터링 (DB의 'type' 컬럼이 '공지' 또는 '홍보' 등으로 저장되어 있다고 가정)
    // 백엔드 데이터 구조에 따라 item.tab 또는 item.type으로 비교하세요.
    let result = items.filter((it) => {
      if (activeTab === "notice") return it.type === "공지" || it.type === "notice";
      if (activeTab === "promotion") return it.type === "홍보" || it.type === "promotion";
      return true;
    });

    // 2. 카테고리 필터링
    if (category !== "all") {
      result = result.filter((it) => it.category === category);
    }

    // 3. 검색어 필터링
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter((it) =>
        it.title?.toLowerCase().includes(q) ||
        it.excerpt?.toLowerCase().includes(q)
      );
    }

    // 4. 정렬
    if (sort === "views") {
      result.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    } else {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return result;
  }, [items, activeTab, category, sort, searchQuery]);

  return (
    <main className="proposals-page">
      <div className="container board-container">
        <div className="tabs">
          <button className={`tab-btn ${activeTab === "notice" ? "is-active" : ""}`} onClick={() => changeTab("notice")}>공지사항</button>
          <button className={`tab-btn ${activeTab === "promotion" ? "is-active" : ""}`} onClick={() => changeTab("promotion")}>이벤트/홍보</button>
        </div>

        <section className="filters">
          <div className="filters__left">
            <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">전체</option>
              {Object.entries(categoryLabel).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="latest">최신순</option>
              <option value="views">조회수순</option>
            </select>
          </div>
          <div className="filters__right">
            <div className="search">
              <input className="search__input" type="text" placeholder="검색어 입력..." value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={handleKeyDown} />
              <button className="search__btn" onClick={handleSearch}>검색</button>
            </div>
          </div>
        </section>

        <div className="board-list">
          {isLoading ? (
            <div className="loading">데이터 로딩 중...</div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item.id || item._id} className="board-item">
                <div className="item__left">
                  <span className={`badge ${item.type === "홍보" || item.type === "promotion" ? "badge--promotion" : "badge--notice"}`}>
                    {item.type}
                  </span>
                  <div className="item__content">
                    <h3 className="item__title">
                      {item.category !== "all" && categoryLabel[item.category] ? `[${categoryLabel[item.category]}] ` : ""}{item.title}
                    </h3>
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
      </div>
    </main>
  );
};

export default Proposals;