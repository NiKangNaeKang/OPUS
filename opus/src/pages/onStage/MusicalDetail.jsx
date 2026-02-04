import '../../css/pages/onStage/detail.css'
import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function parseKopisXML(xmlText) {
  const doc = new DOMParser().parseFromString(xmlText, "text/xml");
  const dbNodes = Array.from(doc.getElementsByTagName("db"));

  const items = dbNodes.map((db) => {
    const get = (tag) => db.getElementsByTagName(tag)?.[0]?.textContent?.trim() ?? "";

    return {
      mt20id : get("mt20id"),
      poster : get("poster"),
      prfnm : get("prfnm"),
      prfpdfrom : get("prfpdfrom"),
      prfpdto : get("prfpdto"),
      fcltynm : get("fcltynm"),
      prfruntime : get("prfruntime"),
      prfage : get("prfage"),
      prfcast : get("prfcast"),
      styurls : parseStyurls(db),
      relates : parseRelates(db)
    }
  })

  return items;
}

// 상세 정보 이미지 리스트 형태로
function parseStyurls(db) {
  return Array.from(db.getElementsByTagName("styurl")).map(
    (node) => node.textContent.trim()
  )
}

// 예매처 정보(예매처명, URL) 리스트 형태로
function parseRelates(db) {
  return Array.from(db.getElementsByTagName("relate")).map((relate) => ({
    name : relate.getElementsByTagName("relatenm")?.[0]?.textContent?.trim() ?? "",
    url : relate.getElementsByTagName("relateurl")?.[0]?.textContent?.trim() ?? "",
  }))
}

export default function MusicalDetail () {
  const { mt20id } = useParams();
  
  const { isPending, error, data } = useQuery({
    queryKey : ['mt20id', mt20id],
    enabled : Boolean(mt20id),
    queryFn: async () => {
      const res = await fetch(`/kopis/openApi/restful/pblprfr/${mt20id}?service=f8d2111671454d7bb5b0102d85c7cf1c`);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const xmlText = await res.text();
      const items = parseKopisXML(xmlText);
      
      return items[0] ?? null;
    },
  });
  
  // SNS 공유
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const modalBackground = useRef(); // 모달의 바깥 영역
  
  if (isPending) return 'Loading...'
  if (error) return error.message
  if (!data) return 'No data'
  
  return (
    <main className="detail-page">
      <div className="container" id="main-content">
        <div className='detail-grid'>
          <section className="left-col">
            <div className="poster-sticky" id="poster-section">
              <div className="poster-box">
                {data.poster? <img className="poster-img" src={data.poster} alt={`${data.prfnm} 포스터`} />
                  :  <div className="poster-img" style={{height : 220}} />
                }
              </div>

              <div className="poster-actions">
                {data.relates.map((relate, idx) => (
                  <button className="btn btn-primary" id='book-btn' type="button" key={idx}
                    onClick={() => {
                      if (!relate.url) {
                        alert("예매 링크가 없는 공연입니다.");
                        return;
                      }
                      window.open(relate.url, "_blank", "noopener,noreferrer");
                    }}>
                      {relate.name}에서 예매하기
                  </button>
                ))}

                <div className="actions-row">
                  <button className="btn btn-outline" type="button">
                    <i className="fa-solid fa-heart" aria-hidden="true"></i>
                    <span>Like</span>
                  </button>
                  <button className="btn btn-outline" type="button">
                    <i className="fa-solid fa-heart-crack"></i>
                    <span>Dislike</span>
                  </button>
                  <button className="btn btn-outline" type="button">
                    <i className="fa-solid fa-list"></i>
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="right-col">
            <div className="info" id="info-section">
              <div className='info-badge-row'>
                <span className='info-badge' id='badge-name'>뮤지컬</span>
                <button className='info-badge' id='share-row' onClick={() => setShareModalOpen(true)}>
                  <i className="fa-solid fa-share-nodes" aria-hidden="true"></i>
                  <span>공유</span>
                </button>
              </div>

              {shareModalOpen &&
                <div className={'share-modal-container'} ref={modalBackground} onClick={e => {
                  if(e.target === modalBackground.current) {
                    setShareModalOpen(false);
                  }
                }}>
                  <div className='share-modal-content'>
                    <button className={'share-modal-close-btn'} onClick={() => setShareModalOpen(false)}>&times;</button>
                    <div className='share-modal-row'>
                      <h3>공유하기</h3>
                    </div>
                    <div className='share-modal-row'>
                      <button type="button" className="sns-icon-btn">트위터로 공유하기</button>
                      <button type="button" className="sns-icon-btn">페이스북으로 공유하기</button>
                      <button type="button" className="sns-icon-btn">카카오톡으로 공유하기</button>
                      <button type="button" className="sns-icon-btn">카카오스토리로 공유하기</button>
                    </div>
                    <div className='share-modal-row'></div>
                  </div>
                </div>
              }

              <h1 className="title">{data.prfnm || "(제목 없음)"}</h1>

              <div className="meta-box">
                <div className="meta-row">
                  <div className="meta-label">일정</div>
                  <div className="meta-value">{data.prfpdfrom} ~ {data.prfpdto}</div>
                </div>
                <div className="meta-row">
                  <div className="meta-label">장소</div>
                  <div className="meta-value">{data.fcltynm || "(알 수 없음)"}</div>
                </div>
                <div className="meta-row">
                  <div className="meta-label">관람시간</div>
                  <div className="meta-value">{data.prfruntime || "(알 수 없음)"}</div>
                </div>
                <div className="meta-row">
                  <div className="meta-label">관람등급</div>
                  <div className="meta-value">{data.prfage || "(알 수 없음)"}</div>
                </div>
              </div>

              <div className="section">
                <h2 className="section-title">상세 정보</h2>

                <div className="desc" id="descText">
                  {data.styurls.length > 0 && (
                    <div className='desc'>
                      {data.styurls.map((url, idx) => (
                        <img key = {idx} className='desc-img'
                          src={url} alt={`${data.prfnm} 상세 이미지 ${idx + 1}`} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="section section-divider" id="cast-section">
                <h2 className="section-title">출연진</h2>
                <div className="desc" id='cast-desc-div'>{data.prfcast || "(알 수 없음)"}</div>
              </div>

              <div className="section" id="reviews-section">
                <div className="reviews-head">
                  <h2 className="section-title">관람 후기</h2>
                  <Link to={`/onStage/reviews`}>
                    <button className="btn btn-sm btn-outline" id='more-review-btn' type="button">후기 더보기</button>
                  </Link>
                </div>

                <div className="reviews">
                  <article className="review">
                    <div className="review__top">
                      <div className="review__user">
                        <div className="avatar">
                          <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg" alt="user" />
                        </div>
                        <div>
                          <div className="review__name">김**</div>
                          <div className="review__date">2024.01.15</div>
                        </div>
                      </div>

                      <div className="review__like">
                        <i className="fa-solid fa-thumbs-up" id='review-like-btn'></i>
                        <span className="like-count">24</span>
                      </div>
                    </div>

                    <p className="review__text">
                      아이비 배우님의 록시 연기가 정말 인상 깊었어요. All That Jazz 넘버에서 소름 돋았습니다. 무대 연출도 심플하면서 세련되고, 음악도 귀에 쏙쏙 들어와서 170분이 전혀 지루하지 않았어요. 강력 추천합니다!
                    </p>
                  </article>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}