import React, { useState, useMemo } from "react";
import { proposalsData } from "../../data/proposalsData.js";
import "../../css/proposals.css";

const Proposals = () => {
  const [activeTab, setActiveTab] = useState("notice");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("latest");
  const [keyword, setKeyword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  //데이터 포맷 계산 유틸
  const formatDate = (iso) => (iso ? iso.replaceAll("-", ".") : "");
  const formatNumber = (n) => Number(n ?? 0).toLocaleString("ko-KR");

  //말머리
  const categoryLabel = {
    musical: "뮤지컬",
    exhibition: "전시",
    auction: "경매",
    goods: "굿즈",
  };

  //이벤트 핸들러
  const handleSearch = () => setSearchQuery(keyword);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const changeTab = (tab) => {
    setActiveTab(tab);
    setCategory("all");
    setSort("latest");
    setSearchQuery("");
    setKeyword("");
  };

  // 게시글 필터링
  const filteredItems = useMemo(() => {
    if (!proposalsData?.[activeTab]) return [];

    let items = [...proposalsData[activeTab]];
    const q = searchQuery.toLowerCase().trim();

    if (category !== "all") {
      items = items.filter((it) => it.category === category);
    }

    if (q) {
      items = items.filter((it) => {
        return (
          it.title?.toLowerCase().includes(q) ||
          it.excerpt?.toLowerCase().includes(q)
        );
      });
    }

    if (sort === "views") {
      items.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    } else {
      items.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return items;
  }, [activeTab, category, sort, searchQuery]);

  return (
    <main className="container board-container">
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "notice" ? "is-active" : ""}`}
          onClick={() => changeTab("notice")}
        >
          공지사항
        </button>

        <button
          className={`tab-btn ${activeTab === "promotion" ? "is-active" : ""}`}
          onClick={() => changeTab("promotion")}
        >
          이벤트/홍보
        </button>
      </div>

      <section className="filters">
        <div className="filters__left">
          <select
            className="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">전체</option>
            <option value="musical">뮤지컬</option>
            <option value="exhibition">전시</option>
            <option value="auction">경매</option>
            <option value="goods">굿즈</option>
          </select>

          <select
            className="select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
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
            <button className="search__btn" onClick={handleSearch}>
              검색
            </button>
          </div>
        </div>
      </section>

      <div className="board-list">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const prefix =
              item.category !== "all"
                ? `[${categoryLabel[item.category] ?? item.category}] `
                : "";

            return (
              <div key={item.id} className="board-item">
                <div className="item__left">
                  <span
                    className={`badge ${
                      item.type === "홍보"
                        ? "badge--promotion"
                        : "badge--notice"
                    }`}
                  >
                    {item.type}
                  </span>

                  <div className="item__content">
                    <h3 className="item__title">
                      {prefix}
                      {item.title}
                    </h3>
                    <p className="item__excerpt">{item.excerpt}</p>
                  </div>
                </div>

                <div className="item__right">
                  <span>{item.author}</span>
                  <span>{formatDate(item.date)}</span>
                  <span>
                    <i className="fa-regular fa-eye"></i>{" "}
                    {formatNumber(item.views)}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state">내용이 없습니다.</div>
        )}
      </div>
    </main>
  );
};

export default Proposals;