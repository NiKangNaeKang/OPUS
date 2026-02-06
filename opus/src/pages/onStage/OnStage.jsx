import '../../css/pages/onStage/OnStage.css'
import { getMergedMusicals } from "../../api/kopisAPI";
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query'

export default function OnStage() {
  // Genre :  / Status : All, 진행예정(01), 진행중(02), 진행완료(03)
  const [genre, setGenre] = useState("musical"); // Exhibition, Musical KOPIS API를 사용하기 위해 기본값을 musical로 해둠
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  // 무한 스크롤
  const PAGE_SIZE = 20;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [status, search]);


  const SERVICE_KEY = "f8d2111671454d7bb5b0102d85c7cf1c";

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

  // =============== 무한 스크롤 ===============
    // 무한 스크롤용 slice
  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  // 무한 스크롤 : 바닥 감지
  const sentinelRef = useRef(null);

  // Intersection Observer
  useEffect(() => {
    const el = sentinelRef.current;
    if(!el) return;

    // 인스턴스(obs)로 Observer 초기화, 관찰할 대상(Element) 지정
    // 콜백 함수 > 관찰할 대상(Target)이 등록되거나 가시성에 변화가 생길 때 실행
    const obs = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;

      setVisibleCount(prev => {
        if (prev >= filteredItems.length) return prev;
        return prev + PAGE_SIZE;
      });
    }, { threshold: 0.1 });

    // 관찰할 대상 등록
    obs.observe(el)
    // 클린업 (컴포넌트가 사라지거나 deps가 바뀔 때 observer를 해제해서 메모리 누수/중복 감지 방지)
    return () => obs.disconnect();
  }, [filteredItems.length]);

  // =============== 랜더링 ===============
  if(!SERVICE_KEY) {
    return (
      <div style={{padding : 16}}>
        <p>발급키를 넣은 후 실행해주세요.</p>
      </div>
    )
  }

  if(genre === "exhibition") {
    return(
      <div>
          <p>전시는 API 연동이 필요합니다.</p>
      </div>
    )
  }

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
    <main id="main-content" className="main">
      <div className="wrap">
        {/* 검색 */}
        <section id="search-section" className="search-sec">
          <div className="search-row">
            <div className="search-box">
              <input className="search-input" type="text" placeholder="공연명, 전시명 검색"
                value={search} onChange={(e) => setSearch(e.target.value)} />
              <i className="fa-solid fa-search search-icon" aria-hidden="true"></i>
            </div>
            <button className="search-btn search-btn--dark" type="button">검색</button>
          </div>

          {/* 필터 */}
          <div id="filter-section" className="filter-row">
            <div className="filter-group">
              <span className="filter-label">장르</span>
              <button type="button"
                className={`chip genre-btn ${genre === "exhibition" ? "is-active" : ""}`}
                data-genre="exhibition"
                onClick={() => setGenre("exhibition")}>
                  전시
              </button>
              <button type="button"
                className={`chip genre-btn ${genre === "musical" ? "is-active" : ""}`}
                data-genre="musical"
                onClick={() => setGenre("musical")}>
                  뮤지컬
              </button>
            </div>

            <span className="divider" aria-hidden="true"></span>

            <div className="filter-group">
              <span className="filter-label">진행 현황</span>
              <button type = "button"
                className={`chip status-btn ${status === "all" ? "is-active" : ""}`}
                data-status="all"
                onClick={() => setStatus("all")}>
                  전체
              </button>
              <button type = "button"
                className={`chip status-btn ${status === "02" ? "is-active" : ""}`}
                data-status="ongoing"
                onClick={() => setStatus("02")}>
                  진행작
              </button>
              <button type = "button"
                className={`chip status-btn ${status === "01" ? "is-active" : ""}`}
                data-status="upcoming"
                onClick={() => setStatus("01")}>
                  예정작
              </button>
              <button type = "button"
                className={`chip status-btn ${status === "03" ? "is-active" : ""}`}
                data-status="ended"
                onClick={() => setStatus("03")}>
                  종료작
              </button>
            </div>
          </div>
        </section>

        {/* 목록 */}
        <div id="exhibition-content" className="content">
          <section className="block" id="recommended-section">
            {/* ========== 전체 ========== */}
            {status === "all" ? (
              <>
                <h2 className="block__title">인기 공연</h2>
                <div className="show-grid show-grid--row">
                  {visibleItems.map((item) => (
                    <article key={item.mt20id} className="show-card show-card--snap">
                      <Link to= {`/onStage/${item.mt20id}`}>
                        <div className='show-card__thumb'>
                          {item.poster ? <img src={item.poster} alt={`${item.prfnm} 포스터`}/> : <div style={{height : 220}} />}
                            <span className='show-badge show-badge--dark'>{item.prfstate || "상태없음"}</span>
                        </div>
                        <h3 className="show-card__title">{item.prfnm || "(제목 없음)"}</h3>
                        <p className="show-card__meta">
                          {item.prfpdfrom} ~ {item.prfpdto}
                        </p>
                        <p className="show-card__meta">{item.fcltynm}</p>
                      </Link>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              // ========== 진행 상태별 ==========
              <>
                <h2 className='block__title'>
                  {status === "02" && "진행작"}
                  {status === "01" && "예정작"}
                  {status === "03" && "종료작"}
                </h2>

                <div className='show-grid'>
                  {visibleItems.map((item) => (
                    <article key={item.mt20id} className="show-card">
                      <Link to = {`/onStage/${item.mt20id}`}>
                        <div className="show-card__thumb">
                          {item.poster ? (
                            <img src={item.poster} alt={`${item.prfnm} 포스터`} />
                          ) : (
                            <div style={{ height: 220 }} />
                          )}
                          <span className="show-badge show-badge--dark">{item.prfstate || "상태없음"}</span>
                        </div>
                        <h3 className="show-card__title">{item.prfnm || "(제목 없음)"}</h3>
                        <p className="show-card__meta">{item.prfpdfrom} ~ {item.prfpdto}</p>
                        <p className="show-card__meta">{item.fcltynm}</p>
                      </Link>
                    </article>
                  ))}
                </div>
              </>
            )}

            {/* ============================================================== */}
            {/* 무한 스크롤 */}
            <div ref={sentinelRef} style={{height: 1}} />
        
            {/* Loading... */}
            {/* <div className={`loading ${isFetchingNextPage ? "" : "is-hidden"}`} style={{ marginTop: 16 }}>
              <div className="spinner" aria-hidden="true"></div>
              <p>더 많은 콘텐츠를 불러오는 중...</p>
            </div>

            {!hasNextPage && (
              <p style={{ marginTop: 16, color: "#6b7280" }}>
                더 불러올 데이터가 없습니다.
              </p>
            )} */}
          </section>
        </div>
      </div>
    </main>
  );
}