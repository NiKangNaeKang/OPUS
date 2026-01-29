import { useEffect, useMemo, useState, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import '../../css/pages/onStage/OnStage.css'

// 랜더링될 때마다 다시 선언되지 않음
// 컴포넌트는 state가 바뀔 때마다 함수가 재실행, 따라서 함수 밖에 두면 영향을 받지 않음
// const KOPIS_BASE = "http://www.kopis.or.kr/openApi/restful/pblprfr";

// JS Date의 형실을 YYYYMMDD로 만들기(stdate, eddate의 형식)
function formatYYYYMMDD(d) {
  const yyyy = String(d.getFullYear());
  // getMonth() : 0에서부터 시작, 문자열의 길이를 2자리로 맞추고 부족하면 왼쪽에 0을 채움
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  
  return `${yyyy}${mm}${dd}`;
}

// XML을 JS 배열 형태로 변환하기
function parseKopisXML(xmlText) {
  // DOMParser : 문자열(XML/HTML)을 "DOM(Document)" 객a체로 변환해주는 브라우저 내장 기능
  // KOPIS의 응답은 XML 문자열! > XML 문서처럼 파싱 후 > 원하는 태그 값 뽑기<dbs><db></db></dbs>
  // parseFrom String : 어떤 종류의 문서로 해석할지 알려주고 파싱
  // parseFromString(xmlText, "text/xml") : xmlText를 XML로 해석하라고 알려줌
  const doc = new DOMParser().parseFromString(xmlText, "text/xml");
  const dbNodes = Array.from(doc.getElementsByTagName("db"));

  const items = dbNodes.map((db) => {
    // ?? : 널 병합 연산자(Nullish Coalescing) : 왼쪽이 null 또는 undefined면 오른쪽을 사용
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
      prfcast : get("prfcast")
    };
  });

  return items;
}

export default function OnStage() {
  // Genre : Exhibition, Musical / Status : All, 진행예정(01), 진행중(02), 진행완료(03)
  // KOPIS API를 사용하기 위해 기본값을 musical로 해둠!
  const [genre, setGenre] = useState("musical");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  // !! 보안을 위해 빼두기
  const SERVICE_KEY = "f8d2111671454d7bb5b0102d85c7cf1c";

  // KOPIS : 시작일~마감일 31일 제한 있음
  const dateRange = useMemo(() => {
    const end = new Date();
    const start = new Date();
    // start를 30일 전 날짜로
    start.setDate(end.getDate() - 30);

    return {
      stdate : formatYYYYMMDD(start),
      eddate : formatYYYYMMDD(end),
    };
  }, []);

  // 한 번에 몇 행씩 가지고 올 건지? (최대 100행)
  const rows = 100;

  // 필터링할 키
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
    // refetch 기준이 됨 
    queryKey : ["kopis", "pblprfr", filtersForQueryKey],
    // 첫 페이지
    initialPageParam : 1,
    // 전시 탭인 경우, KOPIS 호출 막아주기
    enabled : Boolean(SERVICE_KEY) && genre !== "exhibition",
    
    queryFn: async ({ pageParam }) => {
      if (!SERVICE_KEY) throw new Error("SERVICE_KEY 오류");

      const url = new URL("/kopis/openApi/restful/pblprfr", window.location.origin);

      url.searchParams.set("service", SERVICE_KEY);
      url.searchParams.set("stdate", dateRange.stdate);
      url.searchParams.set("eddate", dateRange.eddate);
      url.searchParams.set("cpage", String(pageParam));
      url.searchParams.set("rows", String(rows));

      // 공연명 검색 (KOPIS 파라미터는 shprfnm 사용)
      if (search.trim()) {
        url.searchParams.set("shprfnm", search.trim());
      }

      const res = await fetch(`/kopis/openApi/restful/pblprfr?${url.searchParams.toString()}`);

      if (!res.ok) throw new Error(`KOPIS 요청 실패 : HTTP ${res.status}`);

      // ✅ XML 응답이므로 text로 받고 파싱
      const xmlText = await res.text();
      console.log("KOPIS 응답 앞부분:", xmlText.slice(0, 200));
      const items = parseKopisXML(xmlText);

      return {
        items,
        page: pageParam,
      };
    },
      // 다음 페이지 결정
      getNextPageParam: (lastPage, allPages) => {
        // 이번 페이지의 길이 < 지정된 행 => 마지막 페이지로 판단
        if(!lastPage.items || lastPage.items.length < rows) return undefined;
        return allPages.length + 1;
      },
  });
  
  // 지금까지 불러온 모든 페이지를 배열로 만들기
  const flatItems = useMemo(() => {
    return data?.pages?.flatMap((p) => p.items) ?? [];
  }, [data]);

  // 무한 스크롤 : 바닥 감지
  const sentinelRef = useRef(null);

  // Intersection Observer
  useEffect(() => {
    const el = sentinelRef.current;
    if(!el) return;

    // 인스턴스(obs)로 Observer 초기화, 관찰할 대상(Element) 지정
    // 콜백 : 관찰할 대상(Target)이 등록되거나 가시성에 변화가 생길 때 실행
    // threshold : 옵저버 실행 위해 관찰 대상의 가시성을 백분율로 표시
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
    }, {root : null, threshold : 0.1})

    // 관찰할 대상 등록
    obs.observe(el)
    // 클린업 (컴포넌트가 사라지거나 deps가 바뀔 때 observer를 해제해서 메모리 누수/중복 감지 방지)
    return () => obs.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);


  // 클릭 시 상태 바꾸는 헬퍼 함수
  const onClickGenre = (next) => setGenre(next);
  const onClickStatus = (next) => setStatus(next);

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
            <button className="btn btn--dark" type="button">검색</button>
          </div>

          {/* 필터 */}
          <div id="filter-section" className="filter-row">
            <div className="filter-group">
              <span className="filter-label">장르</span>
              <button type="button"
                className={`chip genre-btn ${genre === "exhibition" ? "is-active" : ""}`}
                data-genre="exhibition"
                onClick={() => onClickGenre("exhibition")}>
                  전시
              </button>
              <button type="button"
                className={`chip genre-btn ${genre === "musical" ? "is-active" : ""}`}
                data-genre="musical"
                onClick={() => onClickGenre("musical")}>
                  뮤지컬
              </button>
            </div>

            <span className="divider" aria-hidden="true"></span>

            <div className="filter-group">
              <span className="filter-label">진행 현황</span>
              <button type = "button"
                className={`chip status-btn ${status === "all" ? "is-active" : ""}`}
                data-status="all"
                onClick={() => onClickStatus("all")}>
                  전체
              </button>
              <button type = "button"
                className={`chip status-btn ${status === "ongoing" ? "is-active" : ""}`}
                data-status="ongoing"
                onClick={() => onClickStatus("ongoing")}>
                  진행작
              </button>
              <button type = "button"
                className={`chip status-btn ${status === "upcoming" ? "is-active" : ""}`}
                data-status="upcoming"
                onClick={() => onClickStatus("upcoming")}>
                  예정작
              </button>
              <button type = "button"
                className={`chip status-btn ${status === "ended" ? "is-active" : ""}`}
                data-status="ended"
                onClick={() => onClickStatus("ended")}>
                  종료작
              </button>
            </div>
          </div>
        </section>

        {/* 목록 */}
        <div id="exhibition-content" className="content">
          <section className="block" id="recommended-section">
            <h2 className="block__title">공연 목록</h2>
            <div className="grid">
              {flatItems.map((item) => (
                <article key={item.mt20id} className="card">
                  <div className='card__thumb'>
                    {item.poster ? <img src={item.poster} alt={`${item.prfnm} 포스터`}/> : <div style={{height : 220}} />}
                    <span className='badge badge--dark'>{item.prfstate || "상태없음"}</span>
                  </div>
                  <h3 className="card__title">{item.prfnm || "(제목 없음)"}</h3>
                  <p className="card__meta">
                    {item.prfpdfrom} ~ {item.prfpdto}
                  </p>
                  <p className="card__meta">{item.fcltynm}</p>
                </article>
              ))}
            </div>
            
            {/* 무한 스크롤 */}
            <div ref={sentinelRef} style={{height: 1}} />
        
            {/* Loading... */}
            <div className={`loading ${isFetchingNextPage ? "" : "is-hidden"}`} style={{ marginTop: 16 }}>
              <div className="spinner" aria-hidden="true"></div>
              <p>더 많은 콘텐츠를 불러오는 중...</p>
            </div>

            {!hasNextPage && (
              <p style={{ marginTop: 16, color: "#6b7280" }}>
                더 불러올 데이터가 없습니다.
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}