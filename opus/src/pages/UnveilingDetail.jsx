import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { unveilingData } from "../data/unveilingData";
import "../css/UnveilingDetail.css";
import { useAuthStore } from "../components/auth/useAuthStore";
import axiosApi from "../api/axiosAPI";

// (권장) 실제 경로에 맞게 CSS import 확인
// import "./UnveilingDetail.css";

const pad2 = (n) => String(n).padStart(2, "0");

function getRemaining(endAt) {
  const end = endAt ? new Date(endAt) : null;
  if (!end || Number.isNaN(end.getTime())) {
    return { done: false, days: "00", hours: "00", minutes: "00" };
  }

  const now = new Date();
  const diff = end - now;

  if (diff <= 0) {
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

function normalizeFromDummy(item) {
  return {
    unveilingNo: item.id,

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
}

/**
 * API 스펙 확정 전: 유연 파서
 * - 확정되면 이 함수만 단일 DTO 스펙으로 정리하면 됨
 */
function normalizeFromApi(data, fallbackUnveilingNo, fallbackDetail) {
  const pricing = data?.pricing ?? {};
  const production = data?.production ?? {};
  const artistObj = data?.artist ?? {};

  const firstImgUrl =
    Array.isArray(data?.images) && data.images.length > 0 ? data.images[0]?.url : null;

  const formatKRW = (n) => `₩${Number(n).toLocaleString("ko-KR")}`;

  const startPriceDisplay =
    pricing.startPriceDisplay ??
    data.startPriceDisplay ??
    (typeof pricing.startPrice === "number" ? formatKRW(pricing.startPrice) : null) ??
    (typeof data.startPrice === "number" ? formatKRW(data.startPrice) : null) ??
    data.startPrice ??
    fallbackDetail?.startPrice ??
    "";

  const currentPriceDisplay =
    pricing.currentPriceDisplay ??
    data.currentPriceDisplay ??
    (typeof pricing.currentPrice === "number" ? formatKRW(pricing.currentPrice) : null) ??
    (typeof data.currentPrice === "number" ? formatKRW(data.currentPrice) : null) ??
    data.currentPrice ??
    fallbackDetail?.currentPrice ??
    "";

  const estimateText =
    pricing.estimateText ??
    data.estimateDisplay ??
    data.estimate ??
    fallbackDetail?.estimate ??
    "";

  return {
    unveilingNo: data.unveilingNo ?? data.id ?? fallbackUnveilingNo,

    image: firstImgUrl ?? data.imageUrl ?? data.image ?? fallbackDetail?.image ?? "",
    alt: data.alt ?? fallbackDetail?.alt ?? "auction item image",

    status: data.status ?? fallbackDetail?.status ?? "LIVE",
    title: data.title ?? data.detailTitle ?? fallbackDetail?.title ?? "무제 (Untitled)",
    artist: data.artistName
      ? `${data.artistName} 작가`
      : data.artist
        ? `${data.artist} 작가`
        : fallbackDetail?.artist ?? "김현수 작가",

    year: production.year ?? data.productionYear ?? data.year ?? fallbackDetail?.year ?? "",
    material:
      production.material ?? data.productionMaterial ?? data.material ?? fallbackDetail?.material ?? "",
    size:
      production.sizeText ?? data.productionSize ?? data.sizeText ?? data.size ?? fallbackDetail?.size ?? "",

    estimate: estimateText,
    startPrice: startPriceDisplay,
    currentPrice: currentPriceDisplay,
    bidCount: pricing.bidCount ?? data.biddingCount ?? data.bidCount ?? fallbackDetail?.bidCount ?? 0,

    endAt: data.finishAt ?? data.finishDate ?? data.endAt ?? fallbackDetail?.endAt ?? null,
    endAtLabel:
      data.finishAtLabel ??
      data.finishDateLabel ??
      data.endAtLabel ??
      fallbackDetail?.endAtLabel ??
      "",

    description:
      production.description ??
      data.productionDetail ??
      data.description ??
      fallbackDetail?.description ??
      [],

    artistName: data.artistName ?? data.artist ?? fallbackDetail?.artistName ?? "",
    artistBio: artistObj.bio ?? data.artistBio ?? data.artistDetail ?? fallbackDetail?.artistBio ?? "",
    exhibitions: artistObj.exhibitions ?? data.exhibitions ?? fallbackDetail?.exhibitions ?? "",
    awards: artistObj.awards ?? data.awards ?? fallbackDetail?.awards ?? "",
  };
}

export default function UnveilingDetail() {
  const { id } = useParams();
  const unveilingNo = useMemo(() => Number(id), [id]);

  // ===== 더미 아이템 찾기 =====
  const dummyItem = useMemo(() => {
    if (!Number.isFinite(unveilingNo)) return null;
    return unveilingData.find((v) => v.id === unveilingNo) ?? null;
  }, [unveilingNo]);

  // 없는 id 접근
  if (!dummyItem) {
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

  // ===== detail state =====
  const dummyDetail = useMemo(() => normalizeFromDummy(dummyItem), [dummyItem]);
  const [detail, setDetail] = useState(dummyDetail);

  // 라우트 이동 시 detail 리셋(더미 기준)
  useEffect(() => {
    setDetail(dummyDetail);
  }, [dummyDetail]);

  // ===== API 상세(있으면 덮어쓰기) =====
  const fetchDetail = useCallback(async () => {
    // 백엔드 전이면 조용히 더미 유지
    try {
      const res = await fetch(`/api/unveilings/${unveilingNo}`);
      if (!res.ok) return;
      const data = await res.json();
      setDetail((prev) => normalizeFromApi(data, unveilingNo, prev));
    } catch {
      // noop
    }
  }, [unveilingNo]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // ===== Countdown =====
  const [remain, setRemain] = useState(() => getRemaining(detail.endAt));
  useEffect(() => {
    const tick = () => setRemain(getRemaining(detail.endAt));
    tick();

    const t = setInterval(tick, 60000);
    return () => clearInterval(t);
  }, [detail.endAt]);

  // ===== 상태 파생 =====
  const status = STATUS[detail.status] ?? STATUS.LIVE;
  const isSoon = detail.status === "UPCOMING";
  const isEnded = detail.status === "ENDED" || remain.done;

  const statusClass = `status status--${status.key}`;
  const timerClass = `timer timer--${status.key}${isEnded ? " is-ended" : ""}`;
  const bidBtnClass = `bid-btn${isSoon ? " is-soon" : ""}${isEnded ? " is-ended" : ""}`;

  // ===== Top button =====
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

const { token, isLoggedIn } = useAuthStore();

const onBid = useCallback(async () => {
  if (isEnded || isSoon) return;

  // axiosApi가 토큰을 자동으로 붙이지만,
  // 로그인 여부 UX를 위해 프론트에서 한 번 더 막는 건 OK
  if (!isLoggedIn) {
    alert("로그인 후 응찰할 수 있습니다.");
    return;
  }

  try {
    const { data } = await axiosApi.post(`/api/bids/${unveilingNo}`, {}); // memberNo 제거

    setCurrentPrice(data.currentPrice);
    setBidCount(data.biddingCount);
    setStatus(data.unveilingStatus);

  } catch (err) {
    const status = err?.response?.status;
    const serverData = err?.response?.data;

    const msg =
      typeof serverData === "string"
        ? serverData
        : serverData?.message || err?.message || "응찰에 실패했습니다.";

    alert(`응찰 실패(${status ?? "?"}): ${msg}`);
  }
}, [isEnded, isSoon, isLoggedIn, unveilingNo]);


  return (
    <div className="page unveiling-detail">
      <main className="container">
        {/* back-row는 header와 분리된 영역(현재 CSS에서 해결된 상태 유지) */}
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
              <img id="mainImage" src={detail.image} alt={detail.alt} />
            </div>
          </div>

          {/* INFO */}
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

            <button className={bidBtnClass} type="button" disabled={isEnded || isSoon} onClick={onBid}>
              {isEnded ? "마감됨" : isSoon ? "예정" : "응찰하기"}
            </button>

            <div className="notice">
              <div className="notice__row">
                <i className="fa-solid fa-circle-info"></i>
                <p>
                  응찰을 위해서는 본인 인증이 필요합니다.
                  <br />
                  경매 참여 전 회원정보에서 실명 인증을 완료해주세요.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DESCRIPTION */}
        <section id="description-section" className="section">
          <h2 className="section__title">작품 설명</h2>
          <div className="prose">
            {(Array.isArray(detail.description) ? detail.description : [detail.description]).map(
              (p, idx) => <p key={idx}>{p}</p>
            )}
          </div>
        </section>

        {/* ARTIST */}
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

        {/* SERVICE INFO */}
        <section id="service-info-section" className="section">
          <h2 className="section__title">경매 이용 안내</h2>

          <div className="service-info">
            <div className="service-info__item">
              <h3 className="service-info__title">낙찰 수수료</h3>
              <p className="service-info__desc">
                낙찰가의 <strong>15%</strong>가 구매 수수료로 별도 부과됩니다.
                수수료는 부가세가 포함된 금액이며, 낙찰 확정 후 최종 결제 금액에 합산됩니다.
              </p>
            </div>

            <div className="service-info__item">
              <h3 className="service-info__title">출고 및 수령</h3>
              <p className="service-info__desc">
                작품 인도는 <strong>직접 출고(대면 수령)</strong>를 원칙으로 진행됩니다.
              </p>

              <ul className="service-info__list">
                <li>출고 가능 요일: 매주 월요일 ~ 금요일</li>
                <li>직접 수령 가능 시간: 10:00 ~ 18:00</li>
                <li>출고 요청 마감: 출고 요청일 기준 2일 전까지 접수</li>
              </ul>

              <p className="service-info__desc">
                낙찰자 승용차로 작품 상차 시, 작품 전체 크기 90 × 118cm까지 적재가 가능합니다
                (캔버스 50호 기준).
              </p>

              <p className="service-info__desc">
                부득이하게 배송, 설치 또는 보관이 필요한 경우에는
                낙찰 확정 후 고객센터를 통해 별도 문의가 가능합니다.
              </p>
            </div>

            <div className="service-info__item">
              <h3 className="service-info__title">설치 및 보관</h3>
              <p className="service-info__desc">
                설치 서비스 또는 장기 보관이 필요한 경우,
                낙찰 후 고객센터를 통해 별도 문의가 가능합니다.
              </p>
            </div>
          </div>
        </section>

        {/* TO TOP */}
        <button
          type="button"
          className={`to-top ${showTop ? "is-show" : ""}`}
          onClick={onTop}
          aria-label="페이지 최상단으로 이동"
        >
          <i className="fa-solid fa-arrow-up" />
        </button>
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
