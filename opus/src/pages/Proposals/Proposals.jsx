import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/proposals.css";
import Pagination from "./Pagination"; 

const Proposals = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("notice");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("latest");
  const [keyword, setKeyword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 

  const categoryLabel = {
    musical: "뮤지컬",
    exhibition: "전시",
    auction: "경매",
    goods: "굿즈",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const typeCode = activeTab === "notice" ? 1 : 2;
        const apiSort = sort === "views" ? "view" : "latest";

        const response = await axios.get(`http://localhost/api/board/list/${typeCode}`, {
          params: { sort: apiSort },
          withCredentials: true,
        });

        setItems(Array.isArray(response.data) ? response.data : []);
        setCurrentPage(1);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeTab, sort]);

  const { paginatedItems, totalPages } = useMemo(() => {
    let result = [...items];
    
    if (category !== "all") {
      result = result.filter((it) => it.boardCategory === category);
    }
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (it) =>
          it.boardTitle?.toLowerCase().includes(q) ||
          it.boardContent?.toLowerCase().includes(q)
      );
    }

    // 페이지네이션 계산
    const total = Math.ceil(result.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const sliced = result.slice(start, start + itemsPerPage);

    return { paginatedItems: sliced, totalPages: total };
  }, [items, category, searchQuery, currentPage]);

  const handleSearch = () => {
    setSearchQuery(keyword);
    setCurrentPage(1);
  };

  const formatDate = (iso) => (iso ? iso.split(" ")[0].replaceAll("-", ".") : "");
  const formatNumber = (n) => Number(n ?? 0).toLocaleString("ko-KR");

  return (
    <main className="proposals-page">
      <div className="container board-container">
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "notice" ? "is-active" : ""}`}
            onClick={() => setActiveTab("notice")}
          >
            공지사항
          </button>
          <button
            className={`tab-btn ${activeTab === "promotion" ? "is-active" : ""}`}
            onClick={() => setActiveTab("promotion")}
          >
            이벤트/홍보
          </button>
        </div>

        <section className="pp-filters">
          <div className="pp-filters__left">
            <select
              className="pp-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">전체</option>
              {Object.entries(categoryLabel).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <select
              className="pp-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="latest">최신순</option>
              <option value="views">조회수순</option>
            </select>
          </div>
          <div className="pp-filters__right">
            <div className="pp-search-wrap">
              <input
                className="pp-search__input"
                type="text"
                placeholder="제목/내용/작성자 검색"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button className="pp-search__btn" onClick={handleSearch}>
                검색
              </button>
            </div>
          </div>
        </section>

        <div className="board-list">
          {isLoading ? (
            <div className="loading">로딩 중...</div>
          ) : paginatedItems.length > 0 ? (
            paginatedItems.map((item) => (
              <div 
                key={item.boardNo} 
                className="board-item" 
                onClick={() => navigate(`/proposals/detail/${item.boardNo}`)} 
                style={{ cursor: "pointer" }}
              >
                <div className="item__left">
                  <span
                    className={`badge ${
                      activeTab === "promotion" ? "badge--promotion" : "badge--notice"
                    }`}
                  >
                    {activeTab === "notice" ? "공지" : "홍보"}
                  </span>
                  <div className="item__content">
                    <h3 className="item__title">
                      {item.boardCategory && categoryLabel[item.boardCategory]
                        ? `[${categoryLabel[item.boardCategory]}] `
                        : ""}
                      {item.boardTitle}
                    </h3>
                    <p className="item__excerpt">{item.boardContent}</p>
                  </div>
                </div>
                <div className="item__right">
                  <span>{item.writerCompany}</span>
                  <span>{formatDate(item.boardWriteDate)}</span>
                  <span>
                    <i className="fa-regular fa-eye"></i>{" "}
                    {formatNumber(item.boardViewCount)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">내용이 없습니다.</div>
          )}
        </div>

        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      </div>
    </main>
  );
};

export default Proposals;