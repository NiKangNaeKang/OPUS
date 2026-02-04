import { useEffect, useMemo, useRef, useState } from "react";
import { unveilingData } from "../data/unveilingData";
import AuctionGrid from "../components/Unveiling/AuctionGrid";
import AuctionInfo from "../components/Unveiling/AuctionInfo";
import "../css/Unveiling.css";

const TABS = [
  { key: "ALL", label: "전체" },
  { key: "LIVE", label: "진행중" },
  { key: "UPCOMING", label: "예정" },
  { key: "ENDED", label: "종료" },
];

const PAGE_SIZE = 9; // 3열 grid 기준: 6/9/12 중 취향대로

export default function Unveiling() {
  const [activeTab, setActiveTab] = useState("ALL");
  const [query, setQuery] = useState("");

  // 무한 스크롤 표시 개수
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // 화면 바닥 감지용 sentinel
  const sentinelRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    // unveilingData 원본 순서 그대로 유지
    return unveilingData.filter((item) => {
      const matchesTab = activeTab === "ALL" ? true : item.status === activeTab;
      const matchesQuery = q
        ? `${item.title} ${item.artist}`.toLowerCase().includes(q)
        : true;
      return matchesTab && matchesQuery;
    });
  }, [activeTab, query]);

  // 필터/검색 바뀌면 보여주는 개수 리셋
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeTab, query]);

  const visibleItems = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  const hasMore = visibleCount < filtered.length;

  useEffect(() => {
    if (!hasMore) return;

    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filtered.length));
        }
      },
      {
        root: null,
        rootMargin: "300px", // 바닥에 닿기 전 미리 로드
        threshold: 0,
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, filtered.length]);

  return (
    <div className="page">
      <main className="main">
        {/* FILTERS + SEARCH (한 줄) */}
        <section id="auction-filters" className="filters">
          <div className="filters__row">
            <div className="filters__left">
              <div className="filters__tabs" role="tablist" aria-label="경매 상태 필터">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    className={`tab ${activeTab === t.key ? "is-active" : ""}`}
                    type="button"
                    onClick={() => setActiveTab(t.key)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="filters__meta">
                <span className="count">
                  총 <strong>{filtered.length}</strong>점
                </span>
              </div>
            </div>

            <div className="filters__right">
              <div className="searchbox">
                <input
                  className="searchbox__input"
                  type="text"
                  placeholder="작품명, 작가명 검색"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button className="searchbox__btn" type="button" aria-label="검색">
                  <i className="fa-solid fa-search" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* GRID */}
        <section id="auction-grid" className="grid-wrap">
          <div className="grid">
            <AuctionGrid items={visibleItems} />
          </div>

          {/* 빈 결과 상태(UX) */}
          {filtered.length === 0 && (
            <div className="empty">
              <p className="empty__title">검색 결과가 없습니다.</p>
              <p className="empty__desc">다른 키워드로 다시 입력해주세요.</p>
            </div>
          )}

          {/* 바닥 감지 sentinel */}
          <div ref={sentinelRef} className="infinite-sentinel" />

          {/* 진행 상태 텍스트 */}
          {filtered.length > 0 && (
            <div className="infinite-meta">
              {hasMore ? "불러오는 중..." : "모든 경매를 확인하셨습니다."}
            </div>
          )}
        </section>

        {/* INFO */}
        <AuctionInfo />
      </main>
    </div>
  );
}
