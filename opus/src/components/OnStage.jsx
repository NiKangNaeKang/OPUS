import '../css/OnStage.css'

function WhatsOn() {
  return (
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

            <section className="block" id="hot-section">
              <h2 className="block__title">요즘 핫한 전시</h2>
              <div className="grid">
                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/5a4173bfa4-c9037f8dd133c47a33f2.png" alt="pop art exhibition poster andy warhol style colorful" />
                    <span className="badge badge--dark">진행중</span>
                    <span className="badge badge--hot">HOT</span>
                  </div>
                  <h3 className="card__title">팝 아트의 역사</h3>
                  <p className="card__meta">2024.01.10 - 2024.03.15</p>
                  <p className="card__meta">소마미술관</p>
                </article>

                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/d831e12773-591bc70840df679fe7b5.png" alt="korean traditional art exhibition poster hanbok patterns" />
                    <span className="badge badge--dark">진행중</span>
                    <span className="badge badge--hot">HOT</span>
                  </div>
                  <h3 className="card__title">한국의 미: 전통과 현대</h3>
                  <p className="card__meta">2024.02.05 - 2024.04.20</p>
                  <p className="card__meta">국립중앙박물관</p>
                </article>

                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/58586b90c9-fa28995f07e56cf51bde.png" alt="surrealism art exhibition poster dali style dreamlike" />
                    <span className="badge badge--dark">진행중</span>
                    <span className="badge badge--hot">HOT</span>
                  </div>
                  <h3 className="card__title">초현실주의 명작전</h3>
                  <p className="card__meta">2024.01.25 - 2024.03.30</p>
                  <p className="card__meta">세종문화회관</p>
                </article>

                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/05f13d38cf-4d598fce7ccdf834d557.png" alt="sculpture exhibition poster modern bronze statues" />
                    <span className="badge badge--dark">진행중</span>
                  </div>
                  <h3 className="card__title">조각의 미학</h3>
                  <p className="card__meta">2024.02.15 - 2024.04.30</p>
                  <p className="card__meta">롯데뮤지엄</p>
                </article>

                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/7dc9eb8c25-ecf4b2e7293f38ff538e.png" alt="nature photography exhibition poster landscape mountains" />
                    <span className="badge badge--dark">진행중</span>
                  </div>
                  <h3 className="card__title">자연의 순간들</h3>
                  <p className="card__meta">2024.01.30 - 2024.03.20</p>
                  <p className="card__meta">한가람미술관</p>
                </article>
              </div>
            </section>

            <section className="block" id="latest-section">
              <h2 className="block__title">최신 전시</h2>
              <div className="grid">
                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/e0023a4fa5-e1cf4888111520afe653.png" alt="abstract expressionism exhibition poster bold brushstrokes" />
                    <span className="badge badge--dark">예정</span>
                    <span className="badge badge--new">NEW</span>
                  </div>
                  <h3 className="card__title">추상표현주의의 탄생</h3>
                  <p className="card__meta">2024.03.05 - 2024.05.15</p>
                  <p className="card__meta">아라리오갤러리</p>
                </article>

                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/a62e3aa580-a323068cd602959f5175.png" alt="ceramic art exhibition poster pottery vases" />
                    <span className="badge badge--dark">예정</span>
                    <span className="badge badge--new">NEW</span>
                  </div>
                  <h3 className="card__title">도자기의 예술</h3>
                  <p className="card__meta">2024.03.10 - 2024.05.20</p>
                  <p className="card__meta">가나아트센터</p>
                </article>

                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/a34c8babcd-42f8843e0964bc6d8d69.png" alt="street art exhibition poster graffiti urban culture" />
                    <span className="badge badge--dark">예정</span>
                    <span className="badge badge--new">NEW</span>
                  </div>
                  <h3 className="card__title">거리의 예술가들</h3>
                  <p className="card__meta">2024.03.15 - 2024.05.10</p>
                  <p className="card__meta">성곡미술관</p>
                </article>

                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/064ebcf0d1-cac2652640b92c22b22f.png" alt="renaissance art exhibition poster classNameical paintings" />
                    <span className="badge badge--dark">진행중</span>
                  </div>
                  <h3 className="card__title">르네상스 명작 특별전</h3>
                  <p className="card__meta">2024.02.20 - 2024.04.25</p>
                  <p className="card__meta">예술의전당</p>
                </article>

                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/131e907183-d72962da641d33ffc9b1.png" alt="installation art exhibition poster interactive media" />
                    <span className="badge badge--dark">진행중</span>
                  </div>
                  <h3 className="card__title">인터랙티브 아트</h3>
                  <p className="card__meta">2024.02.25 - 2024.04.15</p>
                  <p className="card__meta">플랫폼엘</p>
                </article>
              </div>
            </section>

            <section className="block" id="classNameics-section">
              <h2 className="block__title">클래식 명작전</h2>
              <div className="grid">
                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/6096e49852-d15c4afcc02616fead8d.png" alt="van gogh exhibition poster starry night sunflowers" />
                    <span className="badge badge--dark">진행중</span>
                  </div>
                  <h3 className="card__title">반 고흐: 빛과 색채</h3>
                  <p className="card__meta">2024.01.15 - 2024.04.05</p>
                  <p className="card__meta">서울시립미술관</p>
                </article>

                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/07ae51e6f7-805fae8ef436dc2b00a8.png" alt="picasso exhibition poster cubism geometric faces" />
                    <span className="badge badge--dark">진행중</span>
                  </div>
                  <h3 className="card__title">피카소의 입체주의</h3>
                  <p className="card__meta">2024.02.01 - 2024.04.20</p>
                  <p className="card__meta">국립현대미술관</p>
                </article>

                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/b098fc1209-726526bbfdbb02735b4e.png" alt="matisse exhibition poster colorful cutouts dance" />
                    <span className="badge badge--dark">예정</span>
                  </div>
                  <h3 className="card__title">마티스의 색채 혁명</h3>
                  <p className="card__meta">2024.03.20 - 2024.05.30</p>
                  <p className="card__meta">리움미술관</p>
                </article>

                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/6114a1f33d-f801e1acc8e1eb3cc204.png" alt="kandinsky exhibition poster abstract compositions circles" />
                    <span className="badge badge--dark">진행중</span>
                  </div>
                  <h3 className="card__title">칸딘스키: 추상의 선구자</h3>
                  <p className="card__meta">2024.02.10 - 2024.04.10</p>
                  <p className="card__meta">예술의전당</p>
                </article>

                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/9e44eae477-82b584f184604df4fdac.png" alt="klimt exhibition poster the kiss gold patterns" />
                    <span className="badge badge--dark">진행중</span>
                  </div>
                  <h3 className="card__title">클림트: 황금빛 사랑</h3>
                  <p className="card__meta">2024.01.20 - 2024.03.25</p>
                  <p className="card__meta">DDP</p>
                </article>
              </div>
            </section>

            <section className="block" id="contemporary-section">
              <h2 className="block__title">현대미술 특별전</h2>
              <div className="grid">
                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/781f04cc62-05312b0ddb02ef637f0a.png" alt="contemporary sculpture exhibition poster metal abstract forms" />
                    <span className="badge badge--dark">진행중</span>
                  </div>
                  <h3 className="card__title">현대 조각의 새로운 시선</h3>
                  <p className="card__meta">2024.02.05 - 2024.04.15</p>
                  <p className="card__meta">소마미술관</p>
                </article>

                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/5f96303fec-05e8c3030aad3aba1ee2.png" alt="mixed media art exhibition poster collage textures" />
                    <span className="badge badge--dark">진행중</span>
                  </div>
                  <h3 className="card__title">혼합매체의 가능성</h3>
                  <p className="card__meta">2024.02.15 - 2024.04.25</p>
                  <p className="card__meta">국립중앙박물관</p>
                </article>

                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/27e93eb786-52f1b5b299d57b35b1e4.png" alt="video art exhibition poster screens projections" />
                    <span className="badge badge--dark">예정</span>
                  </div>
                  <h3 className="card__title">비디오 아트의 진화</h3>
                  <p className="card__meta">2024.03.10 - 2024.05.20</p>
                  <p className="card__meta">세종문화회관</p>
                </article>

                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/ad4aab7fc2-229ebe04a9c9fd1910be.png" alt="performance art exhibition poster body movement" />
                    <span className="badge badge--dark">진행중</span>
                  </div>
                  <h3 className="card__title">퍼포먼스 아트 페스티벌</h3>
                  <p className="card__meta">2024.02.20 - 2024.04.05</p>
                  <p className="card__meta">롯데뮤지엄</p>
                </article>

                <article className="card">
                  <div className="card__thumb">
                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/7ed7d9216e-c73fbb0600e25c0e723f.png" alt="conceptual art exhibition poster typography text based" />
                    <span className="badge badge--dark">진행중</span>
                  </div>
                  <h3 className="card__title">개념미술의 세계</h3>
                  <p className="card__meta">2024.01.25 - 2024.03.30</p>
                  <p className="card__meta">한가람미술관</p>
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
  );
}

export default WhatsOn;