import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllExhibitions } from "../../api/kcisaAPI";

const SERVICE_KEY = "eb314b07-0935-4241-a372-94575b2e7a10";

export default function ExhibitionList({ search }) {
  const {
    data,
    status,
    error,
  } = useQuery({
    queryKey : ["exhibitions", search],
    queryFn : () => getAllExhibitions({serviceKey : SERVICE_KEY, search})
  })

  const allItems = useMemo(() => {
    return data?.body?.items?.item ?? [];
  })

  if (status === "pending") {
    return <div style={{ padding: 80 }}>전시 불러오는 중...</div>;
  }

  if (status === "error") {
    return <div>오류: {String(error?.message ?? error)}</div>;
  }

  return(
    <>
      <div className="show-grid">
        {allItems.map((item, idx) => (
          <article key={index} className="show-card">
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