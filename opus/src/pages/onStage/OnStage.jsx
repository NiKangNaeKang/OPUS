import { useEffect, useMemo, useState, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import '../../css/pages/onStage/OnStage.css'
import { Link } from 'react-router-dom';

// JS Date의 형식을 YYYYMMDD로 만들기(stdate, eddate에 적용)
function formatYYYYMMDD(d) {
  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  
  return `${yyyy}${mm}${dd}`;
}

// XML을 JS 배열 형태로 변환하기
function parseKopisXML(xmlText) {
  const doc = new DOMParser().parseFromString(xmlText, "text/xml");
  const dbNodes = Array.from(doc.getElementsByTagName("db"));

  const items = dbNodes.map((db) => {
    const get = (tag) => db.getElementsByTagName(tag)?.[0]?.textContent?.trim() ?? "";

    return {
      mt20id : get("mt20id"),
      poster : get("poster"),
      prfnm : get("prfnm"),
      prfstate : get("prfstate"),
      prfpdfrom : get("prfpdfrom"),
      prfpdto : get("prfpdto"),
      fcltynm : get("fcltynm"),
      prfruntime : get("prfruntime"),
      prfage : get("prfage"),
      prfcast : get("prfcast"),
      styurls : parseStyurls("db"),
      relates : parseRelates("db")
    };
  });

  return items;
}

// styurls
function parseStyurls(db) {
  return Array.from(db.getElementsByTagName("styurl")).map(
    (node) => node.textContent.trim()
  )
}

// relates
function parseRelates(db) {
  return Array.from(db.getElementsByTagName("relateurl")).map((relate) => ({
    name : relate.getElementsByTagName("relatenm")?.[0]?.textContent?.trim() ?? "",
    url : relate.getElementsByTagName("relateurl")?.[0]?.textContent?.trim() ?? "",
  }))
}

export default function OnStage() {
  // Genre :  / Status : All, 진행예정(01), 진행중(02), 진행완료(03)
  const [genre, setGenre] = useState("musical"); // Exhibition, Musical KOPIS API를 사용하기 위해 기본값을 musical로 해둠
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [rangeEnd, setRangeEnd] = useState(() => new Date());

  // !! 보안을 위해 빼두기 !!
  const SERVICE_KEY = "f8d2111671454d7bb5b0102d85c7cf1c";

  const dateRange = useMemo(() => {
    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - 30);

    return {
      stdate : formatYYYYMMDD(start),
      eddate : formatYYYYMMDD(end),
    };
  }, []);

  // 한 번에 몇 행씩 가지고 올 건지? (KOPIS : 최대 100행)
  const rows = 100;

  // 가져올 작품을 필터링할 키 (계산한 값을 메모리에 저장 후 재사용해야 함 -> useMemo() 사용)
  const filtersForQueryKey = useMemo(() => ({
    genre,
    status,
    search,
    stdate: dateRange.stdate,
    eddate: dateRange.eddate,
    rows,
  }), [genre, status, search, dateRange.stdate, dateRange.eddate, rows]);

  // useInfinite 사용하기 (무한 스크롤)
  const {
    data,
    status : queryStatus,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    error
  } = useInfiniteQuery({
    queryKey : ["kopis", "pblprfr", filtersForQueryKey],
    initialPageParam : 1,
    enabled : Boolean(SERVICE_KEY) && genre !== "exhibition", // 전시 탭인 경우, KOPIS 호출 막아주기
    
    queryFn: async ({ pageParam }) => {
      if (!SERVICE_KEY) throw new Error("SERVICE_KEY 오류");

      const url = new URL("/kopis/openApi/restful/pblprfr", window.location.origin);
      url.searchParams.set("service", SERVICE_KEY);
      url.searchParams.set("stdate", dateRange.stdate);
      url.searchParams.set("eddate", dateRange.eddate);
      url.searchParams.set("cpage", String(pageParam));
      url.searchParams.set("rows", String(rows));
      url.searchParams.set("shcate", 'GGGA');
      url.searchParams.set("signgucode", '11');
      url.searchParams.set("kidstate", 'N');

      // 공연명 검색 (KOPIS 파라미터는 shprfnm 사용)
      if (search.trim()) {
        url.searchParams.set("shprfnm", search.trim());
      }

      const res = await fetch(`/kopis/openApi/restful/pblprfr?${url.searchParams.toString()}`);

      if (!res.ok) throw new Error(`KOPIS 요청 실패 : HTTP ${res.status}`);

      const xmlText = await res.text(); // XML 응답이므로 text로 받고 파싱
      const items = parseKopisXML(xmlText);

      return {
        items,
        page: pageParam,
      };
    },
      // 다음 페이지 결정
      getNextPageParam: (lastPage, allPages) => {
        // (이번 페이지의 길이 < 지정된 행) => 마지막 페이지로 판단
        if(!lastPage.items || lastPage.items.length < rows) return undefined;
        return allPages.length + 1;
      },
  });

  // =============== 공연 데이터 가져오기 ===============
  // 모든 뮤지컬 공연
  const flatItems = useMemo(() => {
    return data?.pages?.flatMap((p) => p.items) ?? [];
  }, [data]);

  const filteredItems = useMemo(() => {
    if(status === "all") return flatItems;

    return flatItems.filter(item => {
      if (status === "02") return item.prfstate === "공연중" || item.prfstate === "02";
      if (status === "01") return item.prfstate === "공연예정" || item.prfstate === "01";
      if (status === "03") return item.prfstate === "공연완료" || item.prfstate === "03";
      return true;
    });
  }, [flatItems, status])

  // 가져온 작품 정렬 (카테고리별)
  // 인기 공연
  const hotItems = useMemo(() => {
    return data?.pages?.flatMap((p) => p.items) ?? [];
  }, [data]);

  // 대학로 공연
  const univItems = useMemo(() => {
    return flatItems.filter(item => item.fcltychartr === "4");
  }, [flatItems]);

  // =============== 무한 스크롤 ===============
  // 무한 스크롤 : 바닥 감지
  const sentinelRef = useRef(null);

  // Intersection Observer
  useEffect(() => {
    const el = sentinelRef.current;
    if(!el) return;

    // 인스턴스(obs)로 Observer 초기화, 관찰할 대상(Element) 지정
    // 콜백 함수 > 관찰할 대상(Target)이 등록되거나 가시성에 변화가 생길 때 실행
    const obs = new IntersectionObserver((entries) => {
      const first = entries[0];
      // 아직 바닥이 보이지 않을 때
      if(!first.isIntersecting) return;
      // 다음 페이지가 없을 때
      if(!hasNextPage) return;
      // 이미 다음 페이지 로딩 중일 때
      if(isFetchingNextPage) return;
      // 다음 페이지 요청!
      fetchNextPage();
    }, {root : null, threshold : 0.1}) // threshold : 옵저버 실행 위해 관찰 대상의 가시성을 백분율로 표시

    // 관찰할 대상 등록
    obs.observe(el)
    // 클린업 (컴포넌트가 사라지거나 deps가 바뀔 때 observer를 해제해서 메모리 누수/중복 감지 방지)
    return () => obs.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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
                  {flatItems.map((item) => (
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

                {/* <h2 className="block__title">대학로 공연</h2>
                <div className="show-grid show-grid--row">
                  {univItems.map((item) => (
                    <article key={item.mt20id} className="show-card show-card--snap">
                      <div className='show-card__thumb'>
                        {item.poster ? <img src={item.poster} alt={`${item.prfnm} 포스터`}/> : <div style={{height : 220}} />}
                        <span className='show-badge show-badge--dark'>{item.prfstate || "상태없음"}</span>
                      </div>
                      <h3 className="show-card__title">{item.prfnm || "(제목 없음)"}</h3>
                      <p className="show-card__meta">
                        {item.prfpdfrom} ~ {item.prfpdto}
                      </p>
                      <p className="show-card__meta">{item.fcltynm}</p>
                    </article>
                  ))}
                </div> */}

                <h2 className="block__title">전체 공연</h2>
                <div className="show-grid show-grid--row">
                  {flatItems.map((item) => (
                    <article key={item.mt20id} className="show-card show-card--snap">
                      <Link to={`/onStage/${item.mt20id}`}>
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
                  {filteredItems.map((item) => (
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
            {/* <div ref={sentinelRef} style={{height: 1}} /> */}
        
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