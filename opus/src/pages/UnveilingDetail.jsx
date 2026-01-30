import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { unveilingData } from "../data/unveilingData";

function pad2(n) {
  return String(n).padStart(2, "0");
}

function getRemaining(endAt) {
  const end = endAt ? new Date(endAt) : new Date("2024-01-28T15:00:00");
  const now = new Date();
  const diff = end - now;

  if (Number.isNaN(end.getTime())) {
    // endAt 파싱 실패 시 안전 fallback
    return { done: false, days: "00", hours: "00", minutes: "00" };
  }

  if (diff <= 0) {
    return { done: true, days: "00", hours: "00", minutes: "00" };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return {
    done: false,
    days: pad2(days),
    hours: pad2(hours),
    minutes: pad2(minutes),
  };
}

export default function UnveilingDetail() {
  const { id } = useParams();
  const item = useMemo(
    () => unveilingData.find((v) => v.id === Number(id)),
    [id]
  );

  if (!item) {
    return (
      <div className="page unveiling-detail">
        <main className="container">
          <p>존재하지 않는 경매입니다.</p>
          <Link to="/unveiling" className="back-link">
            <i className="fa-solid fa-chevron-left" />
            <span>경매 목록으로 돌아가기</span>
          </Link>
        </main>
      </div>
    );
  }

  // ===== 데이터 기본값 (UI 깨짐 방지) =====
  const detail = {
    statusText: item.statusLabel ?? "진행중",
    title: item.detailTitle ?? item.title ?? "무제 (Untitled)",
    artist: item.artist ?? "작가 미상",
    year: item.year ?? "2023",
    material: item.material ?? "캔버스에 아크릴",
    size: item.size ?? "100 × 80 cm",

    estimate: item.estimate ?? "₩8,000,000 - ₩12,000,000",
    startPrice: item.startPrice ?? "₩6,000,000",
    currentPrice: item.currentPrice ?? "₩9,500,000",
    bidCount: item.bidCount ?? 15,

    endAt: item.endAt ?? "2024-01-28T15:00:00",
    endAtLabel: item.endAtLabel ?? "2024년 1월 28일 오후 3시 마감",

    description: item.description ?? [
      "작품 설명 데이터가 아직 준비되지 않았습니다.",
    ],

    artistBio:
      item.artistBio ??
      "작가 소개 데이터가 아직 준비되지 않았습니다.",

    exhibitions:
      item.exhibitions ??
      "2023 개인전 '침묵의 소리', 2022 국립현대미술관 단체전",

    awards: item.awards ?? "2021 올해의 젊은 작가상",
  };

  // ===== (2) 썸네일 갤러리 =====
  const images = Array.isArray(item.images) && item.images.length > 0
    ? item.images
    : null;

  const [mainSrc, setMainSrc] = useState(item.image);
  const [mainAlt, setMainAlt] = useState(item.alt ?? "");
  const [activeIdx, setActiveIdx] = useState(0);

  // item 변경 시 메인 이미지 초기화
  useEffect(() => {
    setMainSrc(item.image);
    setMainAlt(item.alt ?? "");
    setActiveIdx(0);
  }, [item.id]); // id로 고정

  // ===== (1) Countdown =====
  const [remain, setRemain] = useState(() => getRemaining(detail.endAt));

  useEffect(() => {
    // 최초 1회
    setRemain(getRemaining(detail.endAt));

    // 60초마다 갱신 (원본 로직 유지)
    const t = setInterval(() => {
      setRemain(getRemaining(detail.endAt));
    }, 60000);

    return () => clearInterval(t);
  }, [detail.endAt]);

  return (
    <div className="page unveiling-detail">
      <main className="container">
        {/* BACK */}
        <div className="back-row">
          <Link to="/unveiling" className="back-link">
            <i className="fa-solid fa-chevron-left" />
            <span>경매 목록으로 돌아가기</span>
          </Link>
        </div>

        {/* DETAIL */}
        <section id="auction-detail-section" className="detail">
          {/* IMAGE */}
          <div id="image-section" className="image">
            <div className="image__main">
              <img id="mainImage" src={mainSrc} alt={mainAlt} />
            </div>

            {/* thumbs: images가 있을 때만 렌더 */}
            {images && (
              <div id="thumbs" className="thumbs">
                {images.map((img, idx) => (
                  <button
                    key={`${img.src}-${idx}`}
                    type="button"
                    className={`thumb ${idx === activeIdx ? "is-active" : ""}`}
                    onClick={() => {
                      setMainSrc(img.src);
                      setMainAlt(img.alt ?? mainAlt);
                      setActiveIdx(idx);
                    }}
                    aria-label={`썸네일 ${idx + 1}`}
                  >
                    <img src={img.src} alt={img.alt ?? ""} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div id="info-section" className="info">
            <div className="info__top">
              <span className="status">{detail.statusText}</span>

              <h1 className="title">{detail.title}</h1>
              <p className="artist">{detail.artist}</p>

              <div className="spec">
                <div className="spec__row">
                  <span className="spec__k">제작연도</span>
                  <span className="spec__v">{detail.year}</span>
                </div>
                <div className="spec__row">
                  <span className="spec__k">재료</span>
                  <span className="spec__v">{detail.material}</span>
                </div>
                <div className="spec__row">
                  <span className="spec__k">크기</span>
                  <span className="spec__v">{detail.size}</span>
                </div>
              </div>
            </div>

            <div className="pricebox">
              <div className="pricebox__block">
                <p className="pricebox__label">추정가</p>
                <p className="pricebox__value pricebox__value--lg">
                  {detail.estimate}
                </p>
              </div>

              <div className="pricebox__block pricebox__divider">
                <p className="pricebox__label">시작가</p>
                <p className="pricebox__value">{detail.startPrice}</p>
              </div>

              <div className="pricebox__block pricebox__divider">
                <p className="pricebox__label">현재가</p>
                <p className="pricebox__value pricebox__value--xl">
                  {detail.currentPrice}
                </p>
                <p className="pricebox__hint">응찰 {detail.bidCount}회</p>
              </div>
            </div>

            {/* TIMER: data-end 지원(구조 유지) */}
            <div className="timer" data-end={detail.endAt}>
              <div className="timer__row">
                <span className="timer__label">마감까지</span>

                <div className="countdown" aria-label="countdown">
                  <div className="countdown__unit">
                    <span id="days">{remain.days}</span>
                    <span className="countdown__txt">일</span>
                  </div>
                  <span className="countdown__sep">:</span>
                  <div className="countdown__unit">
                    <span id="hours">{remain.hours}</span>
                    <span className="countdown__txt">시간</span>
                  </div>
                  <span className="countdown__sep">:</span>
                  <div className="countdown__unit">
                    <span id="minutes">{remain.minutes}</span>
                    <span className="countdown__txt">분</span>
                  </div>
                </div>
              </div>

              <p className="timer__hint">{detail.endAtLabel}</p>
            </div>

            <button className="bid-btn" type="button" disabled={remain.done}>
              {remain.done ? "마감됨" : "응찰하기"}
            </button>

            <div className="notice">
              <div className="notice__row">
                <i className="fa-solid fa-circle-info" />
                <p>
                  응찰을 위해서는 본인 인증이 필요합니다. 경매 참여 전 회원정보에서
                  실명 인증을 완료해주세요.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DESCRIPTION */}
        <section id="description-section" className="section">
          <h2 className="section__title">작품 설명</h2>
          <div className="prose">
            {(Array.isArray(detail.description)
              ? detail.description
              : [detail.description]
            ).map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </section>

        {/* ARTIST */}
        <section id="artist-section" className="section">
          <h2 className="section__title">작가 소개</h2>

          <div className="artist-box">
            <div className="artist-box__info">
              <h3 className="artist-box__name">{detail.artist}</h3>
              <p className="artist-box__desc">{detail.artistBio}</p>

              <div className="artist-box__meta">
                <p>
                  <strong>주요 전시:</strong> {detail.exhibitions}
                </p>
                <p>
                  <strong>수상:</strong> {detail.awards}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* GUIDE */}
        <section id="bidding-guide-section" className="section">
          <h2 className="section__title">응찰 안내</h2>

          <div className="guide-grid">
            <div>
              <h3 className="sub-title">호가표</h3>
              <div className="tick-table">
                <div className="tick-table__head">
                  <div>현재가</div>
                  <div>응찰 단위</div>
                </div>

                <div className="tick-table__row">
                  <div>500만원 미만</div>
                  <div>10만원</div>
                </div>
                <div className="tick-table__row">
                  <div>500만원 ~ 1,000만원</div>
                  <div>50만원</div>
                </div>
                <div className="tick-table__row">
                  <div>1,000만원 ~ 3,000만원</div>
                  <div>100만원</div>
                </div>
                <div className="tick-table__row">
                  <div>3,000만원 ~ 5,000만원</div>
                  <div>200만원</div>
                </div>
                <div className="tick-table__row">
                  <div>5,000만원 이상</div>
                  <div>500만원</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="sub-title">응찰 필수 정보</h3>
              <div className="bullets">
                <Bullet text="경매 참여를 위해서는 실명 인증이 필수입니다." />
                <Bullet text="응찰 후 취소는 불가능하며, 낙찰 시 구매 의무가 발생합니다." />
                <Bullet text="낙찰가 외에 구매 수수료(낙찰가의 15%)가 별도로 부과됩니다." />
                <Bullet text="마감 10분 전 응찰 시 자동으로 10분 연장됩니다." />
                <Bullet text="결제는 낙찰 후 7일 이내에 완료되어야 합니다." />
                <Bullet text="작품 배송은 결제 완료 후 3-5 영업일 소요됩니다." />
              </div>
            </div>
          </div>

          <div className="caution">
            <h3 className="sub-title">유의사항</h3>
            <div className="caution__list">
              <p>• 작품의 상태는 상세 이미지를 통해 확인하실 수 있으며, 추가 문의는 고객센터로 연락 주시기 바랍니다.</p>
              <p>• 경매 마감 후 최고가 응찰자가 낙찰자로 결정되며, 낙찰 확정 메일이 발송됩니다.</p>
              <p>• 작품 인수는 직접 방문 또는 배송 중 선택 가능합니다.</p>
              <p>• 설치 및 보관 비용과 배송비는 공지사항 참고 바랍니다.</p>
              <p>• 모든 작품은 진품 보증서와 함께 제공됩니다.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Bullet({ text }) {
  return (
    <div className="bullet">
      <i className="fa-solid fa-circle" />
      <p>{text}</p>
    </div>
  );
}
