import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { unveilingData } from "../data/unveilingData";

const pad2 = (n) => String(n).padStart(2, "0");

function getRemaining(endAt) {
  const end = endAt ? new Date(endAt) : new Date("2024-01-28T15:00:00");
  const now = new Date();
  const diff = end - now;

  if (Number.isNaN(end.getTime()) || diff <= 0) {
    return { done: true, days: "00", hours: "00", minutes: "00" };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { done: false, days: pad2(days), hours: pad2(hours), minutes: pad2(minutes) };
}

const STATUS = {
  LIVE: { text: "진행중", key: "live" },
  UPCOMING: { text: "예정", key: "soon" },
  ENDED: { text: "종료", key: "ended" },
};

export default function UnveilingDetail() {
  const { id } = useParams();

  const item = useMemo(() => {
    const num = Number(id);
    return unveilingData.find((v) => v.id === num);
  }, [id]);

  if (!item) {
    return (
      <div className="page unveiling-detail">
        <main className="container">
          <div className="back-row">
            <Link to="/unveiling" className="back-link">
              <i className="fa-solid fa-chevron-left" />
              <span>경매 목록으로 돌아가기</span>
            </Link>
          </div>
          <p>존재하지 않는 경매입니다.</p>
        </main>
      </div>
    );
  }

  const detail = {
    image: item.image,
    alt: item.alt || "auction item image",

    status: item.status ?? "LIVE",
    title: item.detailTitle ?? item.title ?? "무제 (Untitled)",
    artist: item.artist ? `${item.artist} 작가` : "김현수 작가",

    year: item.year ?? "2023",
    material: item.material ?? "캔버스에 아크릴",
    size: item.size ?? "100 × 80 cm",

    estimate: item.estimate ?? "₩8,000,000 - ₩12,000,000",
    startPrice: item.startPrice ?? "₩6,000,000",
    currentPrice: item.currentPrice ?? item.pricing?.display ?? "₩9,500,000",
    bidCount: item.bidCount ?? item.stats?.count ?? 15,

    endAt: item.endAt ?? "2026-02-28T15:00:00",
    endAtLabel: item.endAtLabel ?? "2026년 2월 28일 오후 3시 마감",

    description: item.description ?? [
      "김현수 작가의 '무제'는 추상표현주의의 영향을 받은 작품으로, 대담한 붓터치와 강렬한 색채의 대비를 통해 내면의 감정을 표현합니다.",
      "이 작품은 2023년 개인전 '침묵의 소리'에서 처음 공개되었으며, 현대미술계에서 주목받는 신진 작가의 대표작 중 하나입니다.",
      "캔버스에 아크릴로 제작된 이 작품은 빛의 각도에 따라 다양한 질감과 색감을 드러내며, 공간에 역동적인 에너지를 부여합니다.",
    ],

    artistName: item.artistName ?? (item.artist ?? "김현수"),
    artistBio:
      item.artistBio ??
      "홍익대학교 미술대학 회화과를 졸업하고, 파리 에콜 데 보자르에서 현대미술을 전공했습니다. 귀국 후 다수의 개인전과 단체전에 참여하며 한국 현대미술계의 주목받는 작가로 자리매김했습니다.",
    exhibitions:
      item.exhibitions ??
      "2023 개인전 '침묵의 소리', 2022 국립현대미술관 단체전",
    awards: item.awards ?? "2021 올해의 젊은 작가상",
  };

  const status = STATUS[detail.status] ?? STATUS.LIVE;

  const [remain, setRemain] = useState(() => getRemaining(detail.endAt));
  useEffect(() => {
    setRemain(getRemaining(detail.endAt));
    const t = setInterval(() => setRemain(getRemaining(detail.endAt)), 60000);
    return () => clearInterval(t);
  }, [detail.endAt]);

  const isEnded = remain.done || detail.status === "ENDED";
  const isSoon = detail.status === "UPCOMING";
  const statusClass = `status status--${status.key}`;
  const timerClass = `timer timer--${status.key}${isEnded ? " is-ended" : ""}`;
  const bidBtnClass = `bid-btn${isSoon ? " is-soon" : ""}${isEnded ? " is-ended" : ""}`;

  return (
    <div className="page unveiling-detail">
      <main className="container">
        <div className="back-row">
          <Link to="/unveiling" className="back-link">
            <i className="fa-solid fa-chevron-left" />
            <span>경매 목록으로 돌아가기</span>
          </Link>
        </div>

        <section id="auction-detail-section" className="detail">
          <div id="image-section" className="image">
            <div className="image__main">
              <img id="mainImage" src={detail.image} alt={detail.alt} />
            </div>
          </div>

          <div id="info-section" className="info">
            <div className="info__top">
              <span className={statusClass}>{status.text}</span>

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
                <p className="pricebox__value pricebox__value--lg">{detail.estimate}</p>
              </div>

              <div className="pricebox__block pricebox__divider">
                <p className="pricebox__label">시작가</p>
                <p className="pricebox__value">{detail.startPrice}</p>
              </div>

              <div className="pricebox__block pricebox__divider">
                <p className="pricebox__label">현재가</p>
                <p className="pricebox__value pricebox__value--xl">{detail.currentPrice}</p>
                <p className="pricebox__hint">응찰 {detail.bidCount}회</p>
              </div>
            </div>

            <div className={timerClass}>
              <div className="timer__row">
                <span className="timer__label">{isSoon ? "시작까지" : "마감까지"}</span>

                <div className="countdown" aria-label="countdown">
                  <div className="countdown__unit">
                    <span>{remain.days}</span>
                    <span className="countdown__txt">일</span>
                  </div>
                  <span className="countdown__sep">:</span>
                  <div className="countdown__unit">
                    <span>{remain.hours}</span>
                    <span className="countdown__txt">시간</span>
                  </div>
                  <span className="countdown__sep">:</span>
                  <div className="countdown__unit">
                    <span>{remain.minutes}</span>
                    <span className="countdown__txt">분</span>
                  </div>
                </div>
              </div>

              <p className="timer__hint">{detail.endAtLabel}</p>
            </div>

            <button className={bidBtnClass} type="button" disabled={isEnded || isSoon}>
              {isEnded ? "마감됨" : isSoon ? "예정" : "응찰하기"}
            </button>

            <div className="notice">
              <div className="notice__row">
                <i className="fa-solid fa-circle-info"></i>
                <p>
                  응찰을 위해서는 본인 인증이 필요합니다.<br></br>경매 참여 전 회원정보에서 실명 인증을 완료해주세요.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="description-section" className="section">
          <h2 className="section__title">작품 설명</h2>

          <div className="prose">
            {(Array.isArray(detail.description) ? detail.description : [detail.description]).map(
              (p, idx) => <p key={idx}>{p}</p>
            )}
          </div>
        </section>

        <section id="artist-section" className="section">
          <h2 className="section__title">작가 소개</h2>

          <div className="artist-box">
            <div className="artist-box__info">
              <h3 className="artist-box__name">{detail.artistName}</h3>
              <p className="artist-box__desc">{detail.artistBio}</p>

              <div className="artist-box__meta">
                <p><strong>주요 전시:</strong> {detail.exhibitions}</p>
                <p><strong>수상:</strong> {detail.awards}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="bidding-guide-section" className="section">
          <h2 className="section__title">응찰 안내</h2>

          <div className="guide-grid">
            {/* TABLE */}
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

            {/* MUST INFO */}
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
      <i className="fa-solid fa-circle"></i>
      <p>{text}</p>
    </div>
  );
}
