import { useState } from 'react'
import '../../css/pages/onStage/reviews.css'

export default function Reviews() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [writeReview, setWriteReview] = useState("");
  
  const openForm = () => setIsFormOpen(v => !v);
  const closeForm = () => setIsFormOpen(false);

  const submitReview = () => {
    if(!writeReview.trim()) return;

    // 후기 작성 API
    setWriteReview("");
  }

  return (
    <main className="reviews-page">
      <section id="review-header" className="section section--mb-lg">
        <div className="row row--between row--gap-lg section__head">
          <div>
            <h1 className="h1">작품 후기</h1>
            <p className="sub">관람하신 작품에 대한 솔직한 후기를 남겨주세요</p>
          </div>

          <button id="write-review-btn" className="btn btn--dark" type="button" onClick={openForm}>
            {isFormOpen ? "입력창 접기" : "후기 작성하기"}
          </button>
        </div>

        {/* 후기 작성란 */}
        <div id="review-form"
          className={`card card--p-lg ${isFormOpen ? "" : "hidden"}`}
          aria-hidden={isFormOpen ? "false" : "true"}>
          <div className="form">
            <div className="field">
              <textarea className="textarea" placeholder="작품에 대한 솔직한 후기를 작성해주세요"
                value={writeReview} onChange={(e) => setWriteReview(e.target.value)} />
            </div>

            <div className="form__actions">
              <button className="btn btn--outline" type="button" id="cancel-review-btn">취소</button>
              <button className="btn btn--dark" type="button" id='submit-review-btn'>등록하기</button>
            </div>
          </div>
        </div>
      </section>

      <section id="review-controls" className="section section--mb-md">
        <div className="row row--between row--gap-md">
          <div className="count">
            총 <span className="count__strong">247</span>개의 후기
          </div>

          <div className="seg">
            <button className="seg-sort-btn is-active" type="button" data-sort="latest">최신순</button>
            <button className="seg-sort-btn" type="button" data-sort="popular">인기순</button>
          </div>
        </div>
      </section>

      <section id="reviews-list" className="list">
        <article className="review-item card card--p-lg">
          <div className="review__top">
            <div className="user">
              <div className="user__meta">
                <div className="user__name">김민지</div>
                <div className="user__date">2024.01.15</div>
              </div>
            </div>

            <button className="icon-btn icon-btn--muted" type="button" aria-label="더보기">
              <i className="fa-solid fa-ellipsis" aria-hidden="true"></i>
            </button>
          </div>
          
          <div className="review__body">
            <p className="text">
              정말 감동적인 무대였습니다. 배우들의 연기력과 무대 연출이 완벽하게 조화를 이루었고,
              특히 음향 효과가 인상 깊었습니다. 오페라의 유령을 이렇게 생생하게 느낄 수 있는 공연은
              처음이었어요. 강력 추천합니다!
            </p>
          </div>     
          
          <div className="review__actions">
            <button className="action-btn" type="button">
              <i className="fa-regular fa-heart" aria-hidden="true"></i>
              <span>좋아요 32</span>
            </button>

            <button className="comment-toggle action-btn" type="button">
              <i className="fa-regular fa-comment" aria-hidden="true"></i>
              <span>댓글 5</span>
            </button>
          </div>

          <div className="comments-section hidden" aria-hidden="true">
            <div className="comment-list">
              <div className="comment">
                <div className="comment__main">
                  <div className="comment__meta">
                    <span className="comment__name">이준호</span>
                    <span className="comment__date">2024.01.15</span>
                  </div>
                  <p className="comment__text">저도 같은 생각입니다! 정말 멋진 공연이었어요.</p>
                </div>
              </div>

              <div className="comment">
                <div className="comment__main">
                  <div className="comment__meta">
                    <span className="comment__name">박서연</span>
                    <span className="comment__date">2024.01.16</span>
                  </div>
                  <p className="comment__text">음향 효과 정말 대단했죠! 저도 깊은 인상을 받았습니다.</p>
                </div>
              </div>
            </div>

            <div className="comment-input">
              <div className="avatar avatar--sm"><span>나</span></div>
              <input className="input input--sm" type="text" placeholder="댓글을 입력하세요" />
              <button className="btn btn--dark btn--sm" type="button">등록</button>
            </div>
          </div>
        </article>

        <article className="review-item card card--p-lg">
          <div className="review__top">
            <div className="user">
              <div className="user__meta">
                <div className="user__name">최유진</div>
                <div className="user__date">2024.01.14</div>
              </div>
            </div>

            <button className="icon-btn icon-btn--muted" type="button" aria-label="더보기">
              <i className="fa-solid fa-ellipsis" aria-hidden="true"></i>
            </button>
          </div>

          <div className="review__body">
            <p className="text">
              모네의 작품을 직접 볼 수 있어서 너무 좋았습니다. 특히 수련 연작은 실물로 보니 더욱 감동적이었어요.
              전시 공간도 넓고 쾌적해서 작품에 집중할 수 있었습니다. 다만 주말에는 사람이 많아서 평일 방문을 추천드립니다.
            </p>
          </div>

          <div className="review__actions">
            <button className="action-btn" type="button">
              <i className="fa-regular fa-heart" aria-hidden="true"></i>
              <span>좋아요 28</span>
            </button>

            <button className="comment-toggle action-btn" type="button">
              <i className="fa-regular fa-comment" aria-hidden="true"></i>
              <span>댓글 3</span>
            </button>
          </div>

          <div className="comments-section hidden" aria-hidden="true">
            <div className="comment-list">
              <div className="comment">
                <div className="avatar avatar--sm"><span>정</span></div>
                <div className="comment__main">
                  <div className="comment__meta">
                    <span className="comment__name">정다은</span>
                    <span className="comment__date">2024.01.14</span>
                  </div>
                  <p className="comment__text">평일 팁 감사합니다! 다음주에 가볼게요.</p>
                </div>
              </div>
            </div>

            <div className="comment-input">
              <div className="avatar avatar--sm"><span>나</span></div>
              <input className="input input--sm" type="text" placeholder="댓글을 입력하세요" />
              <button className="btn btn--dark btn--sm" type="button">등록</button>
            </div>
          </div>
        </article>
      </section>

      <div className="more">
        <button className="btn btn--outline btn--lg" type="button">더보기</button>
      </div>
    </main>
  )
}