import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllExhibitions } from "../../api/kcisaAPI";
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
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["exhibitions", search],
    queryFn: () => getAllExhibitions({ serviceKey: SERVICE_KEY, search }),
  });

  const allItems = useMemo(() => {
    return Array.isArray(data) ? data : [];
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
        {filteredItems.map((item, index) => (
          <article key={`${item.exhibitionId} - ${index}`} className="show-card">
            <Link to={`/onStage/exhibition/${item.exhibitionId}`}>
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
              <p className="show-card__meta">{item.period}</p>
              <p className="show-card__meta">{item.place}</p>
            </Link>
          </article>
        ))}
      </div>
    </>
  )
}