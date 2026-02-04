import { useEffect, useMemo, useState } from "react";
// URL 경로 얻어오기
import { useParams } from "react-router-dom";
import { axiosApi } from "../../api/axiosAPI";
import Loading from "../../components/common/Loading";
import "../../css/Selections-detail.css";
import pic1 from "../../assets/exhibitionExam.png";


const SelectionsDetail = () => {

  const { goodsNo } = useParams(); // url에 적혀있는 상품 번호 얻어옴
  const goodsId = Number(goodsNo); // 문자열 형태로 넘어오기 때문에 숫자로 형변환

  const [goodsDetail, setGoodsDetail] = useState(null); // 상품 상세
  const [goodsOptions, setGoodsOptions] = useState([]); // 상품 옵션 배열
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [goodsImgList, setGoodsImgList] = useState(null); // 상품 이미지 배열

  const [selectedColor, setSelectedColor] = useState(""); // 사용자가 선택한 색상
  const [selectedSize, setSelectedSize] = useState(""); // 사용자가 선택한 사이즈
  const [qty, setQty] = useState(1);

  const [tab, setTab] = useState("info"); // 상세 정보 or 정책 탭

  const selectGoodsDetail = async () => {

    try {

      const resp = await axiosApi.get(`/selections/selectGoodsDetail?goodsNo=${goodsId}`);

      if (resp.status === 200) {
        setGoodsDetail(resp.data);
      }

    } catch (error) {
      console.error("상품 상세 조회 중 예외 발생 : ", error);
    }

  }

  const selectGoodsOptions = async () => {

    try {
      const resp = await axiosApi.get(`/selections/selectGoodsOptions?goodsNo=${goodsId}`);
      if (resp.status === 200) setGoodsOptions(resp.data);
    } catch (error) {
      console.error("상품 옵션 조회 중 예외 발생 : ", error);
    }

  };

  const selectGoodsImgList = async () => {
    try {
      const resp = await axiosApi.get(`/selections/selectGoodsImgList?goodsNo=${goodsId}`);

      if (resp.status === 200) {
        setGoodsImgList(resp.data)
      }
    } catch (error) {
      console.error("상품 이미지 조회 중 예외 발생 : ", error)
    }
  }

  useEffect(() => {
    selectGoodsDetail();
    selectGoodsOptions();
    selectGoodsImgList();
  }, [goodsId]);

  useEffect(() => {

    if (goodsDetail != null && goodsImgList != null && goodsOptions != null) setIsLoading(false);

  }, [goodsDetail, goodsImgList, goodsOptions])

  const handleQty = (nextQty) => {

    if (!selectedOptionRow) {
      alert("옵션을 먼저 선택해주세요.");
      return;
    }

    if (nextQty < 1) {
      alert("최소 수량은 1개입니다.");
      return;
    }

    if (nextQty > selectedOptionRow.stock) {
      alert("선택 가능한 재고 수량을 초과했습니다.");
      return;
    }

    setQty(nextQty);

  }

  const handleTab = (tab) => setTab(tab);

  // 옵션 존재 여부
  const hasSize = useMemo(() => goodsOptions.some((opt) => opt.goodsSize), [goodsOptions]);
  const hasColor = useMemo(() => goodsOptions.some((opt) => opt.goodsColor), [goodsOptions]);

  // 사이즈 목록(중복 제거)
  const sizeList = useMemo(() => {
    if (!hasSize) return [];
    return [...new Set(goodsOptions.map((o) => o.goodsSize).filter(Boolean))];
  }, [goodsOptions, hasSize]);

  // 선택된 사이즈에 해당하는 색상 목록(중복 제거)
  const colorList = useMemo(() => {
    if (!hasColor) return [];
    // 사이즈가 있는 구조면 사이즈 기준으로 필터링
    if (hasSize) {
      if (!selectedSize) return [];
      return [
        ...new Set(
          goodsOptions
            .filter((o) => o.goodsSize === selectedSize)
            .map((o) => o.goodsColor)
            .filter(Boolean)
        ),
      ];
    }
    // 사이즈가 없고 색상만 있으면 전체 색상 중복 제거
    return [...new Set(goodsOptions.map((o) => o.goodsColor).filter(Boolean))];
  }, [goodsOptions, hasColor, hasSize, selectedSize]);

  // 최종 선택된 옵션 row 찾기
  const selectedOptionRow = useMemo(() => {
    // 사이즈/색상 둘 다 있는 경우
    if (hasSize && hasColor) {
      if (!selectedSize || !selectedColor) return null;
      return goodsOptions.find(
        (o) => o.goodsSize === selectedSize && o.goodsColor === selectedColor
      );
    }

    // 사이즈만 있는 경우
    if (hasSize && !hasColor) {
      if (!selectedSize) return null;
      return goodsOptions.find((o) => o.goodsSize === selectedSize);
    }

    // 색상만 있는 경우
    if (!hasSize && hasColor) {
      if (!selectedColor) return null;
      return goodsOptions.find((o) => o.goodsColor === selectedColor);
    }

    return null;
  }, [goodsOptions, hasSize, hasColor, selectedSize, selectedColor]);

  // 옵션 변경 시 재고와 선택 수량 비교 (옵션마다 재고가 다르기 때문!)
  useEffect(() => {

    if (selectedOptionRow != null && qty > selectedOptionRow.stock) {
      alert("재고 이하의 수량만 선택 가능합니다.");
      setQty(1);
    }

  }, [selectedOptionRow])

  return (
    isLoading ? (
      <div className="loading-box">
        <Loading />
        <p className="loading_msg">상품 상세정보를 로딩 중입니다.</p>
      </div>
    ) : (
      <main className="container">
        <section className="top-grid">
          <div id="product-images" className="gallery">
            <div className="gallery__main">
              <img
                id="mainImage"
                className="gallery__main-img"
                src={pic1}
                alt={goodsDetail.goodsName}
              />
            </div>
          </div>

          <div id="product-info" className="goods_info">
            <div className="info__head">
              <h1 className="title">{goodsDetail.goodsName}</h1>
              <p className="desc">
                {goodsDetail.goodsInfo}
              </p>
            </div>

            <div className="price-box">
              <div className="price-row">
                <span className="label label--strong">상품 가격</span>
                <span className="value value--big" id="unitPriceText">{Number(goodsDetail.goodsPrice).toLocaleString()}원</span>
              </div>
              <div className="price-row">
                <span className="label">배송비</span>
                <span className="value">{goodsDetail.deliveryCost == 0 ? "무료" : (Number(goodsDetail.deliveryCost).toLocaleString()) + '원'}</span>
              </div>
            </div>


            <div id="product-options" className="options">
              {/* 사이즈 선택: 중복 제거된 sizeList로 출력 */}
              {hasSize && (
                <div className="field">
                  <label className="field__label">사이즈 선택</label>
                  <div className="select-wrap">
                    <select
                      className="option_select"
                      value={selectedSize}
                      onChange={(e) => {
                        setSelectedSize(e.target.value);
                        setSelectedColor(""); // 사이즈 바뀌면 색상 초기화
                      }}
                    >
                      <option value="">사이즈 선택</option>
                      {sizeList.map((s) => (
                        <option key={s} value={s} className="option">
                          {s}
                        </option>
                      ))}
                    </select>
                    <i className="fa-solid fa-chevron-down select__icon" aria-hidden="true"></i>
                  </div>
                </div>
              )}

              {/* 색상 선택: size 선택 후 colorList 출력 */}
              {hasColor && (
                <div className="field">
                  <label className="field__label">색상 선택</label>
                  <div className="select-wrap">
                    <select
                      className="option_select"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      disabled={hasSize && !selectedSize} // 사이즈가 있으면 사이즈 먼저 선택
                    >
                      <option value="">색상 선택</option>
                      {colorList.map((c) => (
                        <option key={c} value={c} className="option">
                          {c}
                        </option>
                      ))}
                    </select>
                    <i className="fa-solid fa-chevron-down select__icon" aria-hidden="true"></i>
                  </div>
                </div>
              )}

            </div>

            {/* 선택 박스: 옵션 row가 확정되면 표시 */}
            {(selectedOptionRow || (!hasSize && !hasColor)) && (
              <div className="field selected-field">
                {selectedOptionRow && (
                  <div className="selected-box">
                    선택된 옵션:
                    {hasSize ? ` ${selectedOptionRow.goodsSize}` : ""}
                    {hasColor ? ` / ${selectedOptionRow.goodsColor}` : ""}
                    {` (재고: ${selectedOptionRow.stock})`}
                  </div>
                )}

                <label className="field__label">수량</label>
                <div className="qty">
                  <button className="qty__btn" type="button" id="qtyMinus" aria-label="minus" onClick={() => handleQty(qty - 1)}>
                    <i className="fa-solid fa-minus" aria-hidden="true"></i>
                  </button>

                  <input className="qty_input" type="number" id="qtyInput" value={qty} />

                  <button className="qty__btn" type="button" id="qtyPlus" aria-label="plus" onClick={() => handleQty(qty + 1)}>
                    <i className="fa-solid fa-plus" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            )}

            <div id="product-total" className="total">
              <div className="total__row">
                <span className="label">총 상품금액</span>
                <span className="total__price" id="totalPriceText">{Number(goodsDetail.goodsPrice * qty).toLocaleString()}원</span>
              </div>
            </div>

            <div id="product-actions" className="actions">
              <button className="goods_btn goods_btn--outline" type="button">장바구니</button>
              <button className="goods_btn goods_btn--solid" type="button">바로 구매</button>
            </div>

            <div id="product-seller-info" className="seller">
              <div className="seller__row">
                <span className="seller__label">판매자</span>
                <span className="seller__value seller__value--strong">{goodsDetail.goodsSeller}</span>
              </div>
              <div className="seller__row">
                <span className="seller__label">배송</span>
                <span className="seller__value">평균 2-3일 소요</span>
              </div>
            </div>
          </div>
        </section>


        <section id="product-detail-tabs" className="goods_tabs">
          <div className="tabs_bar">
            <button className={`goods_tab ${tab === "info" ? "is-active" : ""}`}
              type="button" data-tab="detail" onClick={() => handleTab("info")}>상세정보</button>
            <button className={`goods_tab ${tab === "policy" ? "is-active" : ""}`}
              type="button" data-tab="shipping" onClick={() => handleTab("policy")}>배송/교환/반품</button>
          </div>

          <div className="tabs_content">

            <div className={`goods_tab-panel ${tab == "info" ? "is-active" : ""}`} id="tab-detail">
              <div className="detail-wrap">
                <h2 className="section-title">상품 상세정보</h2>

                <div className="prose">
                  <p>
                    {goodsDetail.goodsInfo}
                  </p>

                  <div>
                    {goodsImgList?.map((img) => (
                      <div className="detail-image" key={img.goodsImgNo}>
                        <img src={img.goodsImgFullpath} />
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>

            <div className={`goods_tab-panel ${tab == "policy" ? "is-active" : ""}`} id="tab-shipping">
              <div className="detail-wrap">
                {/*  OPUS 배송/교환/반품 정책 (Copy & Paste) */}
                <header className="policy__header">
                  <h2 className="policy__title">배송/교환/반품 정책</h2>
                  <p className="policy__subtitle">OPUS는 세련된 경험과 신뢰 가능한 운영 기준을 함께 제공합니다.</p>
                </header>
                <section className="policy policy--opus" aria-label="OPUS 배송/교환/반품 정책">
                  <article className="policy__section" id="shipping">
                    <h3 className="policy__section-title">배송 안내</h3>
                    <p className="policy__text">
                      OPUS는 주문 확인 후, 상품의 품질을 한 번 더 점검한 뒤 출고됩니다.
                    </p>

                    <ul className="policy__list">
                      <li><strong>배송 방법</strong>: 택배 배송</li>
                      <li><strong>배송 지역</strong>: 대한민국 전 지역</li>
                      <li>
                        <strong>배송 비용</strong>:
                        <ul className="policy__sublist">
                          <li>기본 배송비 3,000원</li>
                          <li>일정 금액 이상 구매 시 무료 배송 (상세 기준은 결제 페이지 참고)</li>
                        </ul>
                      </li>
                      <li>
                        <strong>배송 기간</strong>:
                        <ul className="policy__sublist">
                          <li>결제 완료 후 영업일 기준 1–3일 이내 출고</li>
                          <li>출고 후 배송까지는 지역에 따라 1–2일 정도 소요될 수 있습니다.</li>
                        </ul>
                      </li>
                    </ul>

                    <p className="policy__note">
                      ※ 주문 폭주, 제작 일정, 택배사 사정에 따라 배송이 지연될 수 있으며, 지연이 발생할 경우 개별 안내드립니다.
                    </p>
                  </article>

                  <article className="policy__section" id="exchange-return">
                    <h3 className="policy__section-title">교환 및 반품 안내</h3>
                    <p className="policy__text">
                      OPUS는 고객님의 만족스러운 쇼핑 경험을 위해 아래와 같은 기준으로 교환·반품을 운영합니다.
                    </p>

                    <div className="policy__grid">
                      <section className="policy__card" aria-label="교환·반품 가능">
                        <h4 className="policy__card-title">교환·반품이 가능한 경우</h4>
                        <ul className="policy__list">
                          <li>상품 수령일로부터 <strong>7일 이내</strong> 교환·반품 요청 시</li>
                          <li>상품의 <strong>착용 흔적, 사용 흔적, 훼손</strong>이 없는 경우</li>
                          <li>구성품(케이스, 포장재, 사은품 등)이 모두 보존된 상태</li>
                        </ul>
                      </section>

                      <section className="policy__card" aria-label="교환·반품 불가">
                        <h4 className="policy__card-title">교환·반품이 불가능한 경우</h4>
                        <ul className="policy__list">
                          <li>고객님의 부주의로 상품이 훼손되거나 가치가 감소한 경우</li>
                          <li>착용 또는 사용 흔적이 확인되는 경우</li>
                          <li>상품 수령 후 7일이 경과한 경우</li>
                          <li>주문 제작 상품 또는 별도 안내된 교환·반품 불가 상품</li>
                        </ul>
                      </section>
                    </div>
                  </article>

                  <article className="policy__section" id="fees">
                    <h3 className="policy__section-title">교환·반품 배송비 안내</h3>

                    <ul className="policy__list">
                      <li>
                        <strong>단순 변심</strong>에 의한 교환·반품:
                        <span>왕복 배송비 고객 부담</span>
                      </li>
                      <li>
                        <strong>상품 불량 또는 오배송</strong>의 경우:
                        <span>배송비 전액 OPUS 부담</span>
                      </li>
                    </ul>

                    <p className="policy__note">
                      ※ 반품 배송비는 최초 배송비 결제 여부에 따라 차감 또는 별도 입금 안내될 수 있습니다.
                    </p>
                  </article>

                  <article className="policy__section" id="process">
                    <h3 className="policy__section-title">교환·반품 절차</h3>

                    <ol className="policy__steps">
                      <li>고객센터 또는 마이페이지를 통해 교환·반품 신청</li>
                      <li>안내에 따라 상품 회수 진행</li>
                      <li>상품 상태 확인 후 교환 또는 환불 처리</li>
                    </ol>

                    <p className="policy__note">
                      ※ 사전 접수 없이 임의로 반송하신 경우 처리가 지연될 수 있습니다.
                    </p>
                  </article>

                  <article className="policy__section" id="refund">
                    <h3 className="policy__section-title">환불 안내</h3>

                    <ul className="policy__list">
                      <li>반품 상품이 OPUS에 도착하여 검수 완료 후 <strong>영업일 기준 3–5일 이내</strong> 환불이 진행됩니다.</li>
                      <li>카드사 및 결제 수단에 따라 실제 환불 시점은 다소 차이가 있을 수 있습니다.</li>
                    </ul>
                  </article>

                  <footer className="policy__footer">
                    <h3 className="policy__section-title">안내사항</h3>
                    <p className="policy__text">
                      OPUS는 모든 상품을 출고 전 꼼꼼하게 검수하고 있으며, 고객님께 전달되는 순간까지 품질을 가장 중요하게 생각합니다.<br />
                      정책 관련 문의는 언제든 고객센터를 통해 편하게 문의해 주세요.
                    </p>
                  </footer>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  )
}

export default SelectionsDetail;