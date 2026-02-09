import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllExhibitions } from "../../api/kcisaAPI";

const SERVICE_KEY = "eb314b07-0935-4241-a372-94575b2e7a10";

export default function ExhibitionList({ search }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["exhibitions", search],
    queryFn: () => getAllExhibitions({ serviceKey: SERVICE_KEY, search }),
    retry: false
  });

  const allItems = useMemo(() => {
    return Array.isArray(data)  ? data : [];
  }, [data])

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
        {allItems.map((item, idx) => (
          <article key={item.url ?? idx} className="show-card">
            {/* target : 새 탭에서 열기 rel : 새 탭이 원래 페이지에 접근하지 못하게 차단(referer 헤더를 외부 사이트에 전달하지 않음) */}
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <div className="show-card__thumb">
                {item.imageObject ? (
                  <img src={item.imageObject} alt={item.title} />
                ) : (
                  <div style={{height : 220}} />
                )}
              </div>
              <h3 className="show-card__title">{item.title || "(제목 없음)"}</h3>
              <p className="show-card__meta">{item.period}</p>
              <p className="show-card__meta">{item.eventSite}</p>
            </a>
          </article>
        ))}
      </div>
    </>
  )
}