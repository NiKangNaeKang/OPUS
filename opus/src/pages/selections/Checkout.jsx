/* Checkout.jsx */
import { useState } from "react";
import "../../css/Checkout.css";
import AddressModal from "./AddressModal";
import { useCartStore } from "../../store/cartStore";
import { useNavigate } from "react-router-dom";

const Checkout = () => {

  const items = useCartStore((state) => state.items);
  const checkedKeys = useCartStore((state) => state.checkedKeys);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onTextarea, setOnTextarea] = useState(false);
  const [form, setForm] = useState({
    recipient: "",
    phone: "",
    zipcode: "",
    addr1: "",
    addr2: "",
    memo: ""
  });

  // 장바구니에서 체크된 상품들
  const selectedItems = items.filter(item => checkedKeys.includes(item.cartKey));

  // 가격 모음
  const goodsTotalChecked = selectedItems.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  let shippingTotalChecked = selectedItems.reduce((sum, i) => sum + (i.deliveryCost ?? 0), 0);
  if (goodsTotalChecked >= 50000) shippingTotalChecked = 0;
  const grandTotalChecked = goodsTotalChecked + shippingTotalChecked;

  const navigate = useNavigate();

  const onGoCart = () => {
    navigate("/selections/cart");
  }

  const handleMemo = (e) => {
    setForm({ ...form, memo: e.target.value })

    if (e.target.value === "직접 입력") {
      setOnTextarea(true);
    } else {
      setOnTextarea(false);
    }

  }

  const [selectedAddressId, setSelectedAddressId] = useState(1);

  const mockAddresses = [
    {
      id: 1,
      recipient: "홍길동",
      phone: "010-1234-5678",
      zipcode: "06236",
      addr1: "서울특별시 강남구 테헤란로 123",
      addr2: "101동 1004호",
      address: "서울특별시 강남구 테헤란로 123 101동 1004호",
      memo: "문 앞에 놓아주세요",
      isDefault : true
    },
    {
      id: 2,
      recipient: "김철수",
      phone: "010-9876-5432",
      zipcode: "04147",
      addr1: "서울특별시 마포구 월드컵북로 56",
      addr2: "3층",
      address: "서울특별시 마포구 월드컵북로 56 3층",
      memo: "배송 전 연락 부탁드려요",
      isDefault : false
    }
  ];


  return (
    <main className="main checkout">
      <section className="checkout_hero">
        <h1 className="checkout_hero_title">결제</h1>
        <p className="checkout_hero_sub">
          배송 정보와 결제 수단을 확인한 뒤 주문을 완료해 주세요.
        </p>
      </section>

      <section className="checkout_wrap">
        <div className="checkout_left">
          {/* 주문 상품 */}
          <section className="checkout_card checkout_orderCard">
            <div className="checkout_card__head">
              <h2 className="checkout_card__title">주문 상품</h2>
              <button className="checkout_card__link" onClick={onGoCart}>장바구니로 돌아가기</button>
            </div>

            {selectedItems.map((item) => (
              <div className="checkout_mini-items" key={item.cartKey}>
                <div className="checkout_mini-item">
                  <div className="checkout_mini-item__thumb">
                    <img
                      src={`${import.meta.env.VITE_API_URL}${item.thumbnail}`}
                      alt={item.goodsName}
                    />
                  </div>
                  <div className="checkout_mini-item__info">
                    <p className="checkout_mini-item__name">{item.goodsName}</p>
                    <p className="checkout_mini-item__meta">
                      수량 <strong>{item.qty}</strong>
                      {item.color && (
                        <>
                          <span className="dot">·</span>
                          <span>
                            {item.color || ""}
                            {item.size
                              ? ` / ${item.size}`
                              : ""}
                          </span>
                        </>
                      )}</p>
                  </div>
                  <p className="checkout_mini-item__price">{Number(item.unitPrice).toLocaleString()}원</p>
                </div>
              </div>
            ))}
          </section>

          {/* 배송 정보 */}
          <section className="checkout_card">
            <div className="checkout_card__head">
              <div>
                <h2 className="checkout_card__title">배송 정보</h2>
                <p className="checkout_card__desc">정확한 배송을 위해 정보를 확인해 주세요.</p>
              </div>

              <button className="ghost-btn" type="button" id="openAddressModal" onClick={() => setIsModalOpen(true)}>
                저장 배송지 불러오기
              </button>
            </div>

            <form className="checkout_form" action="#" method="post">
              <div className="checkout_grid">
                <div className="checkout_field">
                  <label className="checkout_label" htmlFor="receiver">수령인</label>
                  <input className="checkout_input" id="receiver" type="text" placeholder="이름" />
                </div>

                <div className="checkout_field">
                  <label className="checkout_label" htmlFor="phone">연락처</label>
                  <input className="checkout_input" id="phone" type="tel" placeholder="010-0000-0000" />
                </div>
              </div>

              <div className="checkout_grid">
                <div className="checkout_field checkout_field--wide">
                  <label className="checkout_label" htmlFor="addr1">주소</label>
                  <div className="checkout_addr-row">
                    <input className="checkout_input" id="addr1" type="text" placeholder="우편번호" />
                    <button className="checkout_btn checkout_btn--outline checkout_btn--sm" type="button">
                      주소 검색
                    </button>
                  </div>
                </div>

                <div className="checkout_field checkout_field--wide">
                  <input className="checkout_input" type="text" placeholder="기본 주소" />
                </div>

                <div className="checkout_field checkout_field--wide">
                  <input className="checkout_input" type="text" placeholder="상세 주소" />
                </div>
              </div>

              <div className="checkout_field">
                <label className="checkout_label" htmlFor="memo">배송 메모</label>
                <select className="checkout_select" id="memo" value={form.memo} onChange={(e) => handleMemo(e)}>
                  <option value="">선택 안 함</option>
                  <option>문 앞에 놓아주세요</option>
                  <option>경비실에 맡겨주세요</option>
                  <option>배송 전 연락 부탁드려요</option>
                  <option>직접 입력</option>
                </select>
                {onTextarea &&
                  <textarea className="checkout_textarea" placeholder="직접 입력(선택)"
                    rows="3" onChange={(e) => setForm({ ...form, memo: e.target.value })}></textarea>}
              </div>
            </form>
          </section>

          {/* 배송 */}
          <section className="checkout_card">
            <div className="checkout_card__head">
              <h2 className="checkout_card__title">배송</h2>
              <p className="checkout_card__desc">출고 전 품질 점검 후 발송됩니다.</p>
            </div>

            <div className="checkout_ship">
              <div className="checkout_ship__row">
                <span className="checkout_ship__k">배송 방법</span>
                <span className="checkout_ship__v">택배 배송</span>
              </div>
              <div className="checkout_ship__row">
                <span className="checkout_ship__k">배송 지역</span>
                <span className="checkout_ship__v">대한민국 전 지역</span>
              </div>
              <div className="checkout_ship__row">
                <span className="checkout_ship__k">배송비</span>
                <span className="checkout_ship__v">
                  <strong>{Number(shippingTotalChecked).toLocaleString()}원</strong>
                </span>
              </div>
              <div className="checkout_ship__row">
                <span className="checkout_ship__k">배송 기간</span>
                <span className="checkout_ship__v">결제 완료 후 영업일 기준 1–3일 이내 출고</span>
              </div>

              <div className="checkout_notice">
                <i className="fa-solid fa-circle-info"></i>
                <p>
                  주문 폭주, 제작 일정, 택배사 사정에 따라 배송이 지연될 수 있으며,
                  지연 발생 시 개별 안내드립니다.
                </p>
              </div>
            </div>
          </section>

          {/* 결제 수단 */}
          <section className="checkout_card">
            <div className="checkout_card__head">
              <h2 className="checkout_card__title">결제 수단</h2>
              <p className="checkout_card__desc">원하시는 결제 방법을 선택해 주세요.</p>
            </div>

            <div className="checkout_pay">
              <div className="checkout_pay__methods">
                <label className="checkout_radio">
                  <input type="radio" name="payMethod" defaultChecked />
                  <span>카드 결제</span>
                </label>
                <label className="checkout_radio">
                  <input type="radio" name="payMethod" />
                  <span>간편 결제</span>
                </label>
                <label className="checkout_radio">
                  <input type="radio" name="payMethod" />
                  <span>무통장 입금</span>
                </label>
              </div>

              <div className="checkout_pay__box">
                <div className="checkout_grid">
                  <div className="checkout_field">
                    <label className="checkout_label" htmlFor="email">이메일(영수증)</label>
                    <input className="checkout_input" id="email" type="email" placeholder="example@opus.com" />
                  </div>

                  <div className="checkout_field">
                    <label className="checkout_label" htmlFor="name">주문자</label>
                    <input className="checkout_input" id="name" type="text" placeholder="이름" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 정책 */}
          <section className="checkout_card">
            <div className="checkout_card__head">
              <h2 className="checkout_card__title">배송/교환/반품 정책</h2>
              <p className="checkout_card__desc">OPUS는 세련된 경험과 신뢰 가능한 운영 기준을 함께 제공합니다.</p>
            </div>

            <details className="checkout_policy" open>
              <summary className="checkout_policy__summary">배송 안내</summary>
              <div className="checkout_policy__body">
                <ul className="checkout_policy__list">
                  <li><strong>배송 방법:</strong> 택배 배송</li>
                  <li><strong>배송 지역:</strong> 대한민국 전 지역</li>
                  <li><strong>배송 비용:</strong> 기본 배송비 3,000원 / 일정 금액 이상 구매 시 무료(상세 기준은 결제 페이지 참고)</li>
                  <li><strong>배송 기간:</strong> 결제 완료 후 영업일 기준 1–3일 이내 출고 (출고 후 1–2일 추가 소요 가능)</li>
                </ul>
                <p className="checkout_policy__note">
                  ※ 주문 폭주, 제작 일정, 택배사 사정에 따라 배송이 지연될 수 있으며, 지연 발생 시 개별 안내드립니다.
                </p>
              </div>
            </details>

            <details className="checkout_policy">
              <summary className="checkout_policy__summary">교환 및 반품 안내</summary>
              <div className="checkout_policy__body">
                <div className="checkout_policy__cols">
                  <div>
                    <p className="checkout_policy__lead">교환·반품이 가능한 경우</p>
                    <ul className="checkout_policy__list">
                      <li>상품 수령일로부터 7일 이내 요청</li>
                      <li>착용/사용 흔적 및 훼손이 없는 경우</li>
                      <li>구성품(케이스, 포장재, 사은품 등) 보존</li>
                    </ul>
                  </div>
                  <div>
                    <p className="checkout_policy__lead">교환·반품이 불가능한 경우</p>
                    <ul className="checkout_policy__list">
                      <li>부주의로 훼손되거나 가치가 감소한 경우</li>
                      <li>착용 또는 사용 흔적이 확인되는 경우</li>
                      <li>수령 후 7일 경과</li>
                      <li>주문 제작/별도 안내된 교환·반품 불가 상품</li>
                    </ul>
                  </div>
                </div>

                <p className="checkout_policy__note">
                  <strong>배송비:</strong> 단순 변심은 왕복 배송비 고객 부담 / 불량·오배송은 OPUS 부담<br />
                  ※ 반품 배송비는 최초 배송비 결제 여부에 따라 차감 또는 별도 입금 안내될 수 있습니다.
                </p>

                <ol className="checkout_policy__steps">
                  <li>고객센터 또는 마이페이지를 통해 교환·반품 신청</li>
                  <li>안내에 따라 상품 회수 진행</li>
                  <li>상품 상태 확인 후 교환 또는 환불 처리</li>
                </ol>

                <p className="checkout_policy__note">※ 사전 접수 없이 임의 반송 시 처리가 지연될 수 있습니다.</p>
              </div>
            </details>

            <details className="checkout_policy">
              <summary className="checkout_policy__summary">환불 안내</summary>
              <div className="checkout_policy__body">
                <p className="checkout_policy__note">
                  반품 상품이 OPUS에 도착하여 검수 완료 후 영업일 기준 3–5일 이내 환불이 진행됩니다.
                  카드사 및 결제 수단에 따라 실제 환불 시점은 다소 차이가 있을 수 있습니다.
                </p>
                <p className="checkout_policy__note">
                  OPUS는 출고 전 꼼꼼하게 검수하며, 고객님께 전달되는 순간까지 품질을 가장 중요하게 생각합니다.
                  정책 관련 문의는 고객센터로 편하게 문의해 주세요.
                </p>
              </div>
            </details>

            <div className="checkout_agree">
              <label className="checkout_check">
                <input type="checkbox" />
                <span>위 정책 및 결제 진행에 동의합니다.</span>
              </label>
              <label className="checkout_check">
                <input type="checkbox" />
                <span>개인정보 수집·이용 및 제3자 제공에 동의합니다.</span>
              </label>
            </div>
          </section>
        </div>

        {/* 주문 요약 */}
        <aside className="checkout_right" aria-label="주문 요약">
          <div className="checkout_summary">
            <h2 className="checkout_summary__title">주문 요약</h2>

            <div className="checkout_summary__rows">
              <div className="checkout_summary__row">
                <span className="checkout_summary__k">상품금액</span>
                <span className="checkout_summary__v">{Number(goodsTotalChecked).toLocaleString()}원</span>
              </div>
              <div className="checkout_summary__row">
                <span className="checkout_summary__k">배송비</span>
                <span className="checkout_summary__v">{Number(shippingTotalChecked).toLocaleString()}원</span>
              </div>
            </div>

            <div className="checkout_summary__total">
              <span className="checkout_summary__k">총 결제 금액</span>
              <span className="checkout_summary__v checkout_summary__v--big">{Number(grandTotalChecked).toLocaleString()}원</span>
            </div>

            <button className="checkout_btn checkout_btn--solid checkout_btn--block" type="button">
              {Number(grandTotalChecked).toLocaleString()}원 결제하기
            </button>

            <p className="checkout_summary__note">
              결제하기 버튼을 누르면 주문이 확정되며, 결제 수단 인증 단계로 이동할 수 있습니다.
            </p>

            <div className="checkout_secure">
              <div className="checkout_secure__item">
                <i className="fa-solid fa-shield-halved"></i>
                <span>보안 결제</span>
              </div>
              <div className="checkout_secure__item">
                <i className="fa-solid fa-box"></i>
                <span>출고 전 검수</span>
              </div>
              <div className="checkout_secure__item">
                <i className="fa-solid fa-truck-fast"></i>
                <span>빠른 출고</span>
              </div>
            </div>
          </div>
        </aside>
      </section>
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={(id) => console.log("선택된 배송지 ID:", id)}
        addresses={mockAddresses}
        selectedAddressId={selectedAddressId}
        setSelectedAddressId={setSelectedAddressId}
      />
    </main>
  );
};

export default Checkout;
