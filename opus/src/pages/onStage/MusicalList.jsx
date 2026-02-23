import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllMusicals, dateRange } from "../../api/kopisAPI";
import '../../css/pages/onStage/OnStage.css'
import Loading from "../../components/common/Loading.jsx"
import { useContentStore } from "../../store/useContentStore.js";

const SERVICE_KEY = "f8d2111671454d7bb5b0102d85c7cf1c";

export default function MusicalList({ status, search }) {
  const bottomRef = useRef(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["kopis", status, search],
    enabled: Boolean(SERVICE_KEY),
    queryFn: ({ pageParam }) => {
      const range = dateRange[pageParam - 1];
      if (!range) {
        return { items: [], hasNext: false };
      }

      return getAllMusicals({ serviceKey: SERVICE_KEY, startDate: range.start, endDate: range.end, pageParam: 1, search })
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => lastPage.hasNext ? allPages.length + 1 : undefined,
  });

  useEffect(() => {
    if (!bottomRef.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, { threshold: 0 })
    observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollBtn(window.scrollY > 400);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const allItems = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap(page => page.items);
  }, [data]);

  // 챗봇에게 데이터 전달용 (박유진 추가)
  const setMusicals = useContentStore((s) => s.setMusicals);

  useEffect(() => {
    if (allItems.length > 0) {
      setMusicals(allItems.slice(0, 20).map(m => ({
        title: m.prfnm,
        period: `${m.prfpdfrom} ~ ${m.prfpdto}`,
        place: m.fcltynm,
        status: m.prfstate
      })));
    }
  }, [allItems]);

  // -------------------------------------------

  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      const matchStatus =
        status === "all" ||
        (status === "02" && item.prfstate === "공연중") ||
        (status === "01" && item.prfstate === "공연예정") ||
        (status === "03" && item.prfstate === "공연완료");

      const matchSearch =
        !search.trim() || item.prfnm?.includes(search.trim());

      return matchStatus && matchSearch;
    });
  }, [allItems, status, search]);

  if (isLoading) {
    return <div style={{ padding: 80 }}>뮤지컬 불러오는 중...</div>;
  }

  if (isError) {
    return <div style={{ padding: 80 }}>오류: {String(error)}</div>;
  }

  if (!allItems.length) {
    return <div style={{ padding: 80 }}>표시할 뮤지컬 정보가 없습니다.</div>;
  }

  return (
    <>
      <div className="show-grid">
        {filteredItems.map((item) => (
          <article key={item.mt20id} className="show-card">
            <Link to={`/onStage/musical/${item.mt20id}`}>
              <div className="show-card__thumb">
                {item.poster ? (
                  <img src={item.poster} alt={item.prfnm} />
                ) : (
                  <div style={{ height: 220 }} />
                )}
                <span className="show-badge show-badge--dark">
                  {item.prfstate || "상태없음"}
                </span>
              </div>
              <h3 className="show-card__title">{item.prfnm}</h3>
              <p className="show-card__meta">
                {item.prfpdfrom} ~ {item.prfpdto}
              </p>
              <p className="show-card__meta">{item.fcltynm}</p>
            </Link>
          </article>
        ))}
      </div>

      <div ref={bottomRef} style={{ height: 1 }}></div>

      {isFetchingNextPage && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px 0",
            width: "100%",
          }}
        >
          <Loading />
        </div>
      )}

      {showScrollBtn && (
        <button
          onClick={handleScrollToTop}
          style={{
            position: "fixed",
            right: 20,
            bottom: 80,
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "none",
            background: "#000",
            color: "#fff",
            fontSize: 20,
            cursor: "pointer",
            zIndex: 9999,
          }}
        >
          ↑
        </button>
      )}
    </>
  )
}