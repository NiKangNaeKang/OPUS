  import { useEffect, useMemo, useRef, useState } from "react";
  import { useInfiniteQuery } from "@tanstack/react-query";
  import { getAllExhibitions } from "../../api/kcisaAPI";
  import Loading from "../../components/common/Loading.jsx"
  import { Link } from "react-router-dom";

  const SERVICE_KEY = "bcec5111-252e-47c3-9dca-4b943cf5a0ed";

  // 날짜 파싱하기 (<PERIOD>2026-01-30~2026-05-03</PERIOD>)
  function parsePeriod(period) {
    if(!period || !period.includes("~")) return null;

    const [start, end] = period.split('~').map(date => date.trim());
    
    const toDate = (str) => {
      const y = Number(str.slice(0, 4));
      const m = Number(str.slice(5, 7));
      const d = Number(str.slice(8, 10));

      return new Date(y, m-1, d);
    }

    return {
      startDate : toDate(start),
      endDate : toDate(end)
    }
  }

  // 상태(진행중, 진행예정, 진행완료) 가져오기
  function getStatus(period) {
    const parsedPeriod = parsePeriod(period);
    if(!parsedPeriod) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { startDate, endDate } = parsedPeriod;
    
    if(today < startDate) return "01";
    if(today > endDate) return "03";
    return "02";
  }

  export default function ExhibitionList({ search, status }) {
    const bottomRef = useRef(null);
    const [showScrollBtn, setShowScrollBtn] = useState(false);

    const { 
      data,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isLoading,
      isError,
      error
    } = useInfiniteQuery({
      queryKey: ["exhibitions", status],
      queryFn : ({ pageParam }) => getAllExhibitions({serviceKey : SERVICE_KEY, pageParam}),
      initialPageParam : 1,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 20 ? allPages.length + 1 : undefined;
      }
    })

    useEffect(() => {
      if(!bottomRef.current) return;

      const observer = new IntersectionObserver(([entry]) => {
        if(entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }}, {threshold : 0})
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
      window.scrollTo({ top : 0, behavior : "smooth" });
    }

    const allItems = useMemo(() => {
      if (!data) return [];

      const flatItems = data.pages.flat();

      const map = new Map();

      flatItems.forEach(item => {
        const key = item.exhibitionId;

        if(!key) return;

        if(!map.has(key)) {
          map.set(key, item);
        }
      })

      return Array.from(map.values());
    }, [data])

    const filteredItems = useMemo(() => {
      if (status === "all") return allItems;

      return allItems.filter(item => {
        return getStatus(item.period) === status;
      })
    }, [allItems, status])

    if (isLoading) {
      return <div style={{ padding: 80 }}>전시 불러오는 중...</div>;
    }

    if (isError) {
      return <div style={{ padding: 80 }}>오류: {String(error)}</div>;
    }

    if (!allItems.length) {
      return <div style={{ padding: 80 }}>표시할 전시 정보가 없습니다.</div>;
    }

    return(
      <>
        <div className="show-grid">
          {filteredItems.map((item) => (
            <article key={`${item.exhibitionId}`} className="show-card">
              <Link to={`/onStage/exhibition/${item.exhibitionId}`} state={{item}}>
                <div className="show-card__thumb">
                  {item.image ? (
                    <img src={item.image} alt={item.title} />
                  ) : (
                    <div style={{height : 220}} />
                  )}
                  <span className="show-badge show-badge--dark">
                    {(getStatus(item.period) === "01" ? "전시예정" : (getStatus(item.period) === "02") ? "전시중" : "전시완료") || "상태없음"}
                  </span>
                </div>
                <h3 className="show-card__title">{item.title || "(제목 없음)"}</h3>
                <p className="show-card__meta">{item.period || item.eventPeriod}</p>
                <p className="show-card__meta">{item.place}</p>
              </Link>
            </article>
          ))}
        </div>

        <div ref={bottomRef} style={{height : 1}}></div>

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