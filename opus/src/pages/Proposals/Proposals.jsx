import React, { useState, useMemo, useEffect } from "react";
import axios from "axios"; // 공용 인스턴스 대신 기본 axios 사용
import "../../css/proposals.css";

const Proposals = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("notice");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("latest");
  const [keyword, setKeyword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const categoryLabel = { musical: "뮤지컬", exhibition: "전시", auction: "경매", goods: "굿즈" };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const typeCode = activeTab === "notice" ? 1 : 2;
        const apiSort = sort === "views" ? "view" : "latest";

        // 주소에 http://localhost를 직접 박아서 5173 포트를 우회합니다.
        const response = await axios.get(`http://localhost/api/board/list/${typeCode}`, {
          params: { sort: apiSort },
          withCredentials: true // 로그인 정보를 같이 보냅니다.
        });

        console.log("받은 데이터:", response.data);
        setItems(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeTab, sort]);

  const filteredItems = useMemo(() => {
    let result = [...items];
    if (category !== "all") {
      result = result.filter((it) => it.boardCategory === category);
    }
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter((it) =>
        (it.boardTitle?.toLowerCase().includes(q)) || (it.boardContent?.toLowerCase().includes(q))
      );
    }
    return result;
  }, [items, category, searchQuery]);

  const handleSearch = () => setSearchQuery(keyword);
  const formatDate = (iso) => (iso ? iso.split(" ")[0].replaceAll("-", ".") : "");
  const formatNumber = (n) => Number(n ?? 0).toLocaleString("ko-KR");

  return (
    <main className="proposals-page">
      <div className="container board-container">
        <div className="tabs">
          <button className={`tab-btn ${activeTab === "notice" ? "is-active" : ""}`} onClick={() => setActiveTab("notice")}>공지사항</button>
          <button className={`tab-btn ${activeTab === "promotion" ? "is-active" : ""}`} onClick={() => setActiveTab("promotion")}>이벤트/홍보</button>
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
              <input className="search__input" type="text" placeholder="제목/내용/작성자 검색" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
              <button className="search__btn" onClick={handleSearch}>검색</button>
            </div>
          </div>
        </section>

        <div className="board-list">
          {isLoading ? (
            <div className="loading">로딩 중...</div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item.boardNo} className="board-item">
                <div className="item__left">
                  <span className={`badge ${activeTab === "promotion" ? "badge--promotion" : "badge--notice"}`}>
                    {activeTab === "notice" ? "공지" : "홍보"}
                  </span>
                  <div className="item__content">
                    <h3 className="item__title">
                      {item.boardCategory && categoryLabel[item.boardCategory] ? `[${categoryLabel[item.boardCategory]}] ` : ""}
                      {item.boardTitle}
                    </h3>
                    <p className="item__excerpt">{item.boardContent}</p>
                  </div>
                </div>
                <div className="item__right">
                  <span>{item.writerCompany}</span>
                  <span>{formatDate(item.boardWriteDate)}</span>
                  <span><i className="fa-regular fa-eye"></i> {formatNumber(item.boardViewCount)}</span>
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