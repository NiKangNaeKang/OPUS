import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosApi from "../../api/axiosAPI";
import "../../css/proposals.css";
import Pagination from "./Pagination";
import { useAuthStore } from "../../components/auth/useAuthStore";

const Proposals = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, member } = useAuthStore();
  const role = member?.role;

  /* ✅ detail -> list로 돌아올 때 탭/페이지 복원 */
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "notice");
  const [currentPage, setCurrentPage] = useState(location.state?.currentPage || 1);

  /* ✅ 글쓰기 버튼 노출 조건
     - ADMIN: 공지/홍보 둘다 글쓰기 가능
     - COMPANY: 홍보 탭에서만 글쓰기 가능 */
  const canWrite =
    isLoggedIn &&
    (role === "ADMIN" || (role === "COMPANY" && activeTab === "promotion"));

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /* ✅ location.state가 바뀌면(Detail에서 state 들고 돌아오면) 다시 세팅 */
  useEffect(() => {
    if (location.state?.currentPage) setCurrentPage(location.state.currentPage);
    if (location.state?.activeTab) setActiveTab(location.state.activeTab);
  }, [location.state]);

  /* ✅ 필터/검색 상태 */
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("latest"); // latest | views
  const [keyword, setKeyword] = useState(""); // input 값
  const [searchQuery, setSearchQuery] = useState(""); // 실제 검색에 반영되는 값

  const itemsPerPage = 8;

  const categoryLabel = {
    musical: "뮤지컬",
    exhibition: "전시",
    auction: "경매",
    goods: "굿즈",
  };

  /* ✅ 탭/정렬 변경 시 백엔드에서 목록 다시 불러오기 */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // 공지(1), 홍보(2)
        const typeCode = activeTab === "notice" ? 1 : 2;

        // 프론트 sort 값 -> 백엔드 sort 파라미터 변환
        const apiSort = sort === "views" ? "view" : "latest";

        const response = await axiosApi.get(`/api/board/list/${typeCode}`, {
          params: { sort: apiSort },
        });

        setItems(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, sort]);

  /* ✅ 탭 변경: 페이지 1로 + url state 초기화(뒤로가기 꼬임 방지) */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    navigate(location.pathname, { replace: true, state: {} });
  };

  /* ✅ 필터 변경 시 페이지 1로 */
  const handleFilterChange = (type, value) => {
    if (type === "category") setCategory(value);
    if (type === "sort") setSort(value);
    setCurrentPage(1);
  };

  /* ✅ 목록 필터링 + 페이징 자르기(프론트 처리) */
  const { paginatedItems, totalPages } = useMemo(() => {
    let result = [...items];

    // 카테고리 필터
    if (category !== "all") {
      result = result.filter((it) => it.boardCategory === category);
    }

    // 검색(제목/내용)
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (it) =>
          it.boardTitle?.toLowerCase().includes(q) ||
          it.boardContent?.toLowerCase().includes(q)
      );
    }

    const total = Math.max(1, Math.ceil(result.length / itemsPerPage));
    const start = (currentPage - 1) * itemsPerPage;
    const sliced = result.slice(start, start + itemsPerPage);

    return { paginatedItems: sliced, totalPages: total };
  }, [items, category, searchQuery, currentPage]);

  /* ✅ 검색 실행: input(keyword)을 searchQuery로 반영 */
  const handleSearch = () => {
    setSearchQuery(keyword);
    setCurrentPage(1);
  };

  /* ✅ 날짜/숫자 포맷 */
  const formatDate = (iso) => (iso ? iso.split(" ")[0].replaceAll("-", ".") : "");
  const formatNumber = (n) => Number(n ?? 0).toLocaleString("ko-KR");

  const isPromotion = activeTab === "promotion";

  /* ✅ 상세 이동: 돌아올 때 탭/페이지 유지하기 위해 state 넘김 */
  const goDetail = (boardNo) => {
    navigate(`/proposals/detail/${boardNo}`, {
      state: { activeTab, currentPage },
    });
  };

  return (
    <main className="proposals-page">
      <div className="container board-container">
        {/* ✅ 탭 */}
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "notice" ? "is-active" : ""}`}
            onClick={() => handleTabChange("notice")}
          >
            공지사항
          </button>
          <button
            className={`tab-btn ${activeTab === "promotion" ? "is-active" : ""}`}
            onClick={() => handleTabChange("promotion")}
          >
            이벤트/홍보
          </button>
        </div>

        {/* ✅ 필터 + 검색 */}
        <section className="pp-filters">
          <div className="pp-filters__left">
            <select
              className="pp-select"
              value={category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
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
              onChange={(e) => handleFilterChange("sort", e.target.value)}
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
                placeholder="제목/내용 검색"
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

        {/* ✅ 목록 렌더링 */}
        {isLoading ? (
          <div className="loading">로딩 중...</div>
        ) : paginatedItems.length === 0 ? (
          <div className="empty-state">게시글이 없습니다.</div>
        ) : isPromotion ? (
          /* ✅ 홍보 탭: 카드 그리드 + 썸네일 */
          <div className="event-grid">
            {paginatedItems.map((item) => {
              // 백엔드에서 썸네일을 어떤 이름으로 내려줘도 최대한 잡기
              const thumb =
                item.boardThumbnail ||
                item.boardImgFullpath ||
                item.boardImgRe ||
                "";

              return (
                <article
                  key={item.boardNo}
                  className="event-card"
                  onClick={() => goDetail(item.boardNo)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && goDetail(item.boardNo)}
                >
                  <div className="event-card__thumb">
                    <img
                        src={thumb || "/proposals-default.png"}
                        alt={item.boardTitle}
                        loading="lazy"
                        onError={(e) => {
                        e.currentTarget.src = "/proposals-default.png";
                        }}
                    />
                  </div>

                  <div className="event-card__body">
                    <div className="event-card__title">
                      {item.boardCategory && categoryLabel[item.boardCategory]
                        ? `[${categoryLabel[item.boardCategory]}] `
                        : ""}
                      {item.boardTitle}
                    </div>

                    <div className="event-card__meta">
                      <span className="meta__company">{item.writerCompany}</span>
                      <span className="meta__date">{formatDate(item.boardWriteDate)}</span>
                      <span className="meta__views">
                        <i className="fa-regular fa-eye"></i> {formatNumber(item.boardViewCount)}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* ✅ 공지 탭: 리스트 */
          <div className="board-list">
            {paginatedItems.map((item) => (
              <div
                key={item.boardNo}
                className="board-item"
                onClick={() => goDetail(item.boardNo)}
              >
                <div className="item__left">
                  <span className="badge badge--notice">공지</span>
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
                    <i className="fa-regular fa-eye"></i> {formatNumber(item.boardViewCount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ✅ 글쓰기 버튼 */}
        {canWrite && (
          <div className="pp-actions">
            <button
              className="pp-write-btn"
              onClick={() =>
                navigate("/proposals/write", {
                  state: { activeTab, currentPage },
                })
              }
            >
              글쓰기
            </button>
          </div>
        )}

        {/* ✅ 페이지네이션 */}
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