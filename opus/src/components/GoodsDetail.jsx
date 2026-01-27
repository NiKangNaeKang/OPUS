import { useEffect, useState } from "react";
// URL 경로 얻어오기
import { useParams } from "react-router-dom";
import { axiosApi } from "../api/axiosAPI";

const GoodsDetail = () => {

  const { goodsNo } = useParams();
  const goodsId = Number(goodsNo);

  const [goodsDetail, setGoodsDetail] = useState(null);

  const selectGoodsDetail = async () => {

    try {

      const resp = await axiosApi.get(`/goods/selectGoodsDetail?goodsNo=${goodsId}`);

      if (resp.status == 200) {
        setGoodsDetail(resp.data);
      }

    } catch (error) {
      console.error("상품 상세 조회 중 예외 발생 : ", error);
    }

  }

  useEffect(() => {
    selectGoodsDetail();
  }, []);

  return (
    <main className="container">
      <section className="top-grid">
        <div id="product-images" className="gallery">
          <div className="gallery__main">
            <img
              id="mainImage"
              className="gallery__main-img"
              src={goodsDetail.goodsThumbnail}
              alt={goodsDetail.goodsName}
            />
          </div>
        </div>

        <div id="product-info" className="info">
          <div className="info__head">
            <h1 className="title">{goodsDetail.goodsName}</h1>
            <p className="desc">
              {goodsDetail.goodsInfo}
            </p>
          </div>

          <div className="price-box">
            <div className="price-row">
              <span className="label label--strong">상품 가격</span>
              <span className="value value--big" id="unitPriceText">{goodsDetail.goodsPrice}</span>
            </div>
            <div className="price-row">
              <span className="label">배송비</span>
              <span className="value">{goodsDetail.deliveryCost}</span>
            </div>
          </div>

          {/* <div id="product-options" className="options">
            <div className="field">
              <label className="field__label">옵션 선택</label>
              <div className="select-wrap">
                <select id="optionSelect" className="select">
                  <option value="">옵션을 선택해주세요</option>
                  <option value="A4">A4 사이즈 (21 x 29.7cm)</option>
                  <option value="A3">A3 사이즈 (29.7 x 42cm)</option>
                  <option value="A2">A2 사이즈 (42 x 59.4cm)</option>
                </select>
                <i className="fa-solid fa-chevron-down select__icon" aria-hidden="true"></i>
              </div>
            </div>

            <div className="field">
              <label className="field__label">수량</label>
              <div className="qty">
                <button className="qty__btn" type="button" id="qtyMinus" aria-label="minus">
                  <i className="fa-solid fa-minus" aria-hidden="true"></i>
                </button>

                <input className="qty__input" type="number" id="qtyInput" value="1" min="1" />

                <button className="qty__btn" type="button" id="qtyPlus" aria-label="plus">
                  <i className="fa-solid fa-plus" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div> */}

          <div id="product-total" className="total">
            <div className="total__row">
              <span className="label">총 상품금액</span>
              <span className="total__price" id="totalPriceText">{goodsDetail.goodsPrice} * goods</span>
            </div>
          </div>

          <div id="product-actions" className="actions">
            <button className="btn btn--outline" type="button">장바구니</button>
            <button className="btn btn--solid" type="button">바로 구매</button>
          </div>

          <div id="product-seller-info" className="seller">
            <div className="seller__row">
              <span className="seller__label">판매자</span>
              <span className="seller__value seller__value--strong">EMK 뮤지컬컴퍼니</span>
            </div>
            <div className="seller__row">
              <span className="seller__label">배송</span>
              <span className="seller__value">평균 2-3일 소요</span>
            </div>
          </div>
        </div>
      </section>


      <section id="product-detail-tabs" className="tabs">
        <div className="tabs__bar">
          <button className="tab is-active" type="button" data-tab="detail">상세정보</button>
          <button className="tab" type="button" data-tab="shipping">배송/교환/반품</button>
        </div>

        <div className="tabs__content">

          <div className="tab-panel is-active" id="tab-detail">
            <div className="detail-wrap">
              <h2 className="section-title">상품 상세정보</h2>

              <div className="prose">
                <p>
                  2024년 뮤지컬 레미제라블 공식 라이선스 포스터 아트프린트입니다.
                  프리미엄 용지에 고해상도로 인쇄되어 선명하고 생동감 있는 이미지를 제공합니다.
                </p>

                <div className="detail-image">
                  <img
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/a836af4842-f9fc24c0abdad5a48c3c.png"
                    alt="musical les miserables poster art detail high quality print"
                  />
                </div>

                <h3 className="section-subtitle">제품 특징</h3>
                <ul className="checklist">
                  <li><i className="fa-solid fa-check" aria-hidden="true"></i><span>고급 아트지 사용으로 오랜 시간 색상 유지</span></li>
                  <li><i className="fa-solid fa-check" aria-hidden="true"></i><span>프리미엄 액자 구성 (블랙/화이트 선택 가능)</span></li>
                  <li><i className="fa-solid fa-check" aria-hidden="true"></i><span>공식 라이선스 제품으로 정품 보장</span></li>
                  <li><i className="fa-solid fa-check" aria-hidden="true"></i><span>벽걸이 고리 포함으로 간편한 설치</span></li>
                </ul>

                <div className="detail-image">
                  <img
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/7e3b69a2e4-5b2e411b3921c96684f3.png"
                    alt="framed poster hanging on modern white wall interior design"
                  />
                </div>

                <h3 className="section-subtitle">제품 사양</h3>
                <div className="spec">
                  <table className="spec__table">
                    <tbody>
                      <tr>
                        <td className="spec__k">제품명</td>
                        <td className="spec__v">레미제라블 공식 포스터 아트프린트</td>
                      </tr>
                      <tr>
                        <td className="spec__k">재질</td>
                        <td className="spec__v">프리미엄 아트지, 우드 프레임</td>
                      </tr>
                      <tr>
                        <td className="spec__k">사이즈</td>
                        <td className="spec__v">A4 / A3 / A2 (옵션 선택)</td>
                      </tr>
                      <tr>
                        <td className="spec__k">제조국</td>
                        <td className="spec__v">대한민국</td>
                      </tr>
                      <tr>
                        <td className="spec__k">제조사</td>
                        <td className="spec__v">EMK 뮤지컬컴퍼니</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="tab-panel" id="tab-shipping">
            <div className="detail-wrap">
              <h2 className="section-title">배송/교환/반품</h2>
              <p className="muted">여기에 배송/교환/반품 정책 내용을 넣으면 돼.</p>
            </div>
          </div>
        </div>
      </section>
    </main>

  )
}

export default GoodsDetail;