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
    queryKey: ["kopis", "merged", genre],
    enabled: Boolean(SERVICE_KEY) && genre !== "exhibition",
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
      if(status === "all") return allItems;
  
      return allItems.filter(item => {
        if (status === "02") return item.prfstate === "공연중" || item.prfstate === "02";
        if (status === "01") return item.prfstate === "공연예정" || item.prfstate === "01";
        if (status === "03") return item.prfstate === "공연완료" || item.prfstate === "03";
        return true;
      });
    }, [allItems, status])

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
            <Link to={`/onStage/${item.mt20id}`}>
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