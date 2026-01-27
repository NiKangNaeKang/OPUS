import { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import '../../css/pages/onStage/OnStage.css'

const KOPIS_BASE = "http://www.kopis.or.kr/openApi/restful/pblprfr";

// 날짜를 YYYYMMDD로 만들기(stdate, eddate의 형식)
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
    
  })


  // 각 작품 : item, 스크롤 바닥이면 page++
  const [item, setItem] = useState([]);
  const [page, setPage] = useState(1);
  
  // query 키와 query function을 정의
  const {data, isLoading, isError} = useQuery({
    // r각 쿼리를 식별하기 위해 사용하는 고유한 값
    // > 이 값을 기반으로 데이터를 캐싱, 필요할 때 다시 불러오거나 캐시된 데이터 재사용
    queryKey: ["items"],
    // 실제 데이터를 fetch하는 함수
    queryFn: () => {
      // 서버에서 데이터를 가져오는 역할
      // promise를 반환하는 비동기 함수여야 하고, useQuery가 데이터를 필요로 할 때 자동으로 호출됨
      const response = fetch("http://kopis.or.kr/openApi/restful/pblprfr");
      return response.json();
    }
  })

  // 탭, 필더 변경일 경우 > useEffect로 목록 초기화 + 1페이지부터
  useEffect(() => {
    setItem([]);
    setPage(1);
  }, [genre, status, search]);
  
  if(isError) {
    return "error : " + error.message;
  }
  return (
    <>
      {isLoading ? "Loading..." : null}
      <main id="main-content" className="main">
        <div className="wrap">
          <section id="search-section" className="search-sec">
            <div className="search-row">
              <div className="search-box">
                <input className="search-input" type="text" placeholder="공연명, 전시명 검색" />
                <i className="fa-solid fa-search search-icon" aria-hidden="true"></i>
              </div>
              <button className="btn btn--dark" type="button">검색</button>
            </div>

            <div id="filter-section" className="filter-row">
              <div className="filter-group">
                <span className="filter-label">장르</span>
                <button className="chip genre-btn is-active" data-genre="exhibition" type="button">전시</button>
                <button className="chip genre-btn" data-genre="musical" type="button">뮤지컬</button>
              </div>

              <span className="divider" aria-hidden="true"></span>

              <div className="filter-group">
                <span className="filter-label">진행 현황</span>
                <button className="chip status-btn is-active" data-status="all" type="button">전체</button>
                <button className="chip status-btn" data-status="ongoing" type="button">진행작</button>
                <button className="chip status-btn" data-status="upcoming" type="button">예정작</button>
                <button className="chip status-btn" data-status="ended" type="button">종료작</button>
              </div>
            </div>
          </section>

          {/* 전시 정보 */}
          <div id="exhibition-content" className="content">
            <section className="block" id="recommended-section">
              <h2 className="block__title">OOO님이 좋아할 만한 전시</h2>
              <div className="grid">
                {/* ?. */}
                {data?.map(item => {
                  <article key={item.id}>
                    <div className="card__thumb">
                      <img src="" alt="전시 포스터" />
                      <span className="badge badge--dark">{item.status}</span>
                    </div>
                    <h3 className="card__title">{item.title}</h3>
                    <p className="card__meta">{item.period}</p>
                    <p className="card__meta">{item.place}</p>
                  </article>
                })}
              </div>

              <div className="grid">
                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/724bbde368-2fbbb1a5c4067015a877.png" alt="modern art exhibition poster with abstract colorful paintings" />
                    <span className="badge badge--dark">진행중</span>
                  </div>
                  <h3 className="card__title">모던 아트 특별전</h3>
                  <p className="card__meta">2024.01.15 - 2024.03.30</p>
                  <p className="card__meta">서울시립미술관</p>
                </article>

                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/acf0e512e6-74e4450abee56bbfed12.png" alt="contemporary photography exhibition poster black and white" />
                    <span className="badge badge--dark">진행중</span>
                  </div>
                  <h3 className="card__title">사진으로 보는 현대</h3>
                  <p className="card__meta">2024.02.01 - 2024.04.15</p>
                  <p className="card__meta">국립현대미술관</p>
                </article>

                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/618a2084d6-11702189c8b27cac26a5.png" alt="minimalist art exhibition poster simple geometric shapes" />
                    <span className="badge badge--dark">예정</span>
                  </div>
                  <h3 className="card__title">미니멀리즘의 세계</h3>
                  <p className="card__meta">2024.03.01 - 2024.05.20</p>
                  <p className="card__meta">리움미술관</p>
                </article>

                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/6911feac60-3e8f1bc6f3bcc5de19cf.png" alt="impressionist paintings exhibition poster monet style" />
                    <span className="badge badge--dark">진행중</span>
                  </div>
                  <h3 className="card__title">인상주의 거장전</h3>
                  <p className="card__meta">2024.01.20 - 2024.04.10</p>
                  <p className="card__meta">예술의전당</p>
                </article>

                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/fc0cd33fa6-eff203dd80edefd2b648.png" alt="digital art exhibition poster futuristic neon lights" />
                    <span className="badge badge--dark">진행중</span>
                  </div>
                  <h3 className="card__title">디지털 아트 페스티벌</h3>
                  <p className="card__meta">2024.02.10 - 2024.03.25</p>
                  <p className="card__meta">DDP</p>
                </article>
              </div>
            </section>
          </div>

          {/* 뮤지컬 정보 */}
          <div id="musical-content" className="content is-hidden">
            <section className="block" id="musical-recommended-section">
              <h2 className="block__title">OOO님이 좋아할 만한 뮤지컬</h2>
              <div className="grid">
                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/9d1d459dec-578a6efbaf92cbdab10a.png" alt="phantom of the opera musical poster dramatic mask chandelier" />
                    <span className="badge badge--dark">진행중</span>
                  </div>
                  <h3 className="card__title">오페라의 유령</h3>
                  <p className="card__meta">2024.01.10 - 2024.04.30</p>
                  <p className="card__meta">샤롯데씨어터</p>
                </article>

                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/c0b4596fab-11e964c9fca49bdebae6.png" alt="wicked musical poster green witch flying" />
                    <span className="badge badge--dark">진행중</span>
                  </div>
                  <h3 className="card__title">위키드</h3>
                  <p className="card__meta">2024.02.01 - 2024.05.15</p>
                  <p className="card__meta">블루스퀘어</p>
                </article>

                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/035dd6e503-1865ec6dcdaf59596413.png" alt="les miserables musical poster french flag barricade" />
                    <span className="badge badge--dark">예정</span>
                  </div>
                  <h3 className="card__title">레미제라블</h3>
                  <p className="card__meta">2024.03.05 - 2024.06.20</p>
                  <p className="card__meta">예술의전당</p>
                </article>

                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/34252293b3-894ade3b644e39ba9e3b.png" alt="cats musical poster feline eyes silhouette" />
                    <span className="badge badge--dark">진행중</span>
                  </div>
                  <h3 className="card__title">캣츠</h3>
                  <p className="card__meta">2024.01.20 - 2024.04.10</p>
                  <p className="card__meta">LG아트센터</p>
                </article>

                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/c7d3f4e53f-e4b997707bb8760b02c3.png" alt="chicago musical poster jazz age dancers red" />
                    <span className="badge badge--dark">진행중</span>
                  </div>
                  <h3 className="card__title">시카고</h3>
                  <p className="card__meta">2024.02.10 - 2024.04.25</p>
                  <p className="card__meta">디큐브아트센터</p>
                </article>
              </div>
            </section>
          </div>

          {/* Loading... */}
          <div id="loading-indicator" className="loading is-hidden">
            <div className="spinner" aria-hidden="true"></div>
            <p>더 많은 콘텐츠를 불러오는 중...</p>
          </div>
        </div>
      </main>
    </>
  );
}