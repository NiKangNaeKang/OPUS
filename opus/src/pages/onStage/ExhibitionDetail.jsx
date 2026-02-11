import '../../css/pages/onStage/detail.css'
import { EmailShareButton, FacebookShareButton, LineShareButton, ThreadsShareButton, TwitterShareButton } from "react-share";
import { EmailIcon, FacebookIcon, LineIcon, ThreadsIcon, XIcon } from "react-share";
import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function ExhibitionDetail () {
  const { state } = useLocation();
  const item = state?.item;

  if(!item) {
    return <div>잘못된 접근입니다.</div>
  }

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const modalBackground = useRef();
  
  const currentURL = window.location.href;

  const copyURL = async () => {
    try {
      await navigator.clipboard.writeText(currentURL);
      alert('URL이 복사되었습니다');
    } catch (err) {
      alert('복사에 실패했습니다');
    }
  };

  return (
    <main className="detail-page">
      <div className="container" id="main-content">
        <div className='detail-grid'>
          <section className="left-col">
            <div className="poster-sticky" id="poster-section">
              <div className="poster-box">
                {item.image? <img className="poster-img" src={item.image} alt={`${item.title} 포스터`} />
                  : <div className="poster-img" style={{height : 220}} />
                }
              </div>

              <div className="poster-actions">
                <button className='btn btn-primary' id='book-btn' type='button'
                  onClick={() => {
                    if(!item.url) {
                      alert("상세 보기 기능이 없는 전시입니다.");
                      return;
                    }
                    window.open(item.url, "_blank", "noopener,noreferrer")
                  }}>
                    상세 보기
                  </button>

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
                <span className='info-badge' id='badge-name'>전시</span>
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
                    <div className='share-modal-row'>
                      <div className='share-modal-empty'>&times;</div>
                      <div className='share-modal-title'>공유하기</div>
                      <div className='share-modal-close-btn' onClick={() => setShareModalOpen(false)}>&times;</div>
                    </div>
                    <div className='share-modal-icon-row'>
                      <EmailShareButton url={currentURL}>
                        <EmailIcon size={50} round={true} />
                      </EmailShareButton>
                      <FacebookShareButton url={currentURL}>
                        <FacebookIcon size={50} round={true} />
                      </FacebookShareButton>
                      <LineShareButton url={currentURL}>
                        <LineIcon size={50} round={true} />
                      </LineShareButton>
                      <ThreadsShareButton url={currentURL}>
                        <ThreadsIcon size={50} round={true} />
                      </ThreadsShareButton>
                      <TwitterShareButton url={currentURL}>
                        <XIcon size={50} round={true} />
                      </TwitterShareButton>
                    </div>
                    <div className='share-modal-copy-row'>
                      <div>{currentURL}</div>
                      <div className='share-modal-copy-btn' onClick={copyURL}>복사</div>
                    </div>
                  </div>
                </div>
              }

              <h1 className="title">{item.title || "(제목 없음)"}</h1>

              <div className="meta-box">
                <div className="meta-row">
                  <div className="meta-label">일정</div>
                  <div className='meta-value'>{item.period ? <span dangerouslySetInnerHTML={{__html : item.period}}></span> : "(알 수 없음)"}</div>
                </div>
                <div className="meta-row">
                  <div className="meta-label">장소</div>
                  <div className='meta-value'>{item.place ? <span dangerouslySetInnerHTML={{__html : item.place}}></span> : "(알 수 없음)"}</div>
                </div>
                <div className="meta-row">
                  <div className="meta-label">관람시간</div>
                  <div className='meta-value'>{item.eventPeriod ? <span dangerouslySetInnerHTML={{__html : item.eventPeriod}}></span> : "(알 수 없음)"}</div>
                </div>
                <div className="meta-row">
                  <div className="meta-label">관람등급</div>
                  <div className="meta-value">{item.age ? <span dangerouslySetInnerHTML={{__html : item.age}}></span> : "(알 수 없음)"}</div>
                </div>
              </div>

              <div className="section">
                <h2 className="section-title">상세 정보</h2>
                <div className='desc' id='descText'>{item.desc ? <span dangerouslySetInnerHTML={{__html : item.desc}}></span>: "(알 수 없음)"}</div>
              </div>

              <div className="section section-divider" id="cast-section">
                <h2 className="section-title">작가</h2>
                <div className="desc" id='cast-desc-div'>{item.author ? <span dangerouslySetInnerHTML={{__html : item.author}}></span> : "(알 수 없음)"}</div>
              </div>

              <div className="section" id="reviews-section">
                <div className="reviews-head">
                  <h2 className="section-title">관람 후기</h2>
                  <Link to={`/onStage/reviews/${item.exhibitionId}`}>
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