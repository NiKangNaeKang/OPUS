import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMergedMusicals } from "../../api/kopisAPI";
import '../../css/pages/onStage/OnStage.css'

const SERVICE_KEY = "f8d2111671454d7bb5b0102d85c7cf1c";
const PAGE_SIZE = 20;

export default function MusicalList({ status, search }) {
  
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [status, search]);
  
  const {
    data,
    status: queryStatus,
    error,
  } = useQuery({
    queryKey: ["kopis", "merged", search],
    enabled: Boolean(SERVICE_KEY),
    queryFn: () =>
      getMergedMusicals({
        serviceKey: SERVICE_KEY,
      }),
  });
  
    // =============== 공연 데이터 가져오기 ===============
    // 모든 뮤지컬 공연
    const allItems = useMemo(() => {
      return data ?? [];
    }, [data]);
  
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

    const visibleItems = useMemo(
      () => filteredItems.slice(0, visibleCount),
      [filteredItems, visibleCount]
    );

    const sentinelRef = useRef(null);

    useEffect(() => {
      const el = sentinelRef.current;
      if (!el) return;

      const obs = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;

        setVisibleCount((prev) =>
          prev >= filteredItems.length ? prev : prev + PAGE_SIZE
        );
      });

      obs.observe(el);
      return () => obs.disconnect();
    },   [filteredItems.length]);

  if(queryStatus === "pending") {
    return <div style={{padding : 100}}>Loading...</div>;
  }

  if(queryStatus === "error") {
    return(
      <div style={{padding : 100}}>
        <p>오류 : {String(error?.message ?? error)}</p>
      </div>
    );
  }

  return (
    <>
      <div className="show-grid">
        {visibleItems.map((item) => (
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

      <div ref={sentinelRef} style={{ height: 1 }} />
    </>
  )
}