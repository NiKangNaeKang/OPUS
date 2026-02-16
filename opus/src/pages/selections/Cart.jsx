import { useEffect } from "react";
import { useCartStore } from "../../store/useCartStore";
import { useNavigate } from "react-router-dom";
import "../../css/Cart.css"

const Cart = () => {

  const items = useCartStore((state) => state.items);
  const setQty = useCartStore((state) => state.setQty);
  const removeItems = useCartStore((state) => state.removeItems);
  const clearCart = useCartStore((state) => state.clearCart);
  const checkedKeys = useCartStore((state) => state.checkedKeys);
  const setCheckedKeys = useCartStore((state) => state.setCheckedKeys);

  // 기본값으로 전체 체크
  useEffect(() => {
    if (items.length > 0) {
      setCheckedKeys(items.map(item => item.cartKey));
    } else {
      setCheckedKeys([]);
    }
  }, [items, setCheckedKeys]);

  // 개별 체크박스 클릭
  const handleChecked = (cartKey) => {
    setCheckedKeys(
      checkedKeys.includes(cartKey)
        ? checkedKeys.filter((key) => key !== cartKey)
        : [...checkedKeys, cartKey]
    );
  };

  // 전체 선택 여부 (전체 체크인 경우 true)
  const isAllChecked = items.length > 0 && checkedKeys.length === items.length;

  // 전체 선택 클릭
  const handleAllChecked = (e) => {
    setCheckedKeys(e.target.checked ? items.map(item => item.cartKey) : []);
  };

  const handleDeleteSelected = () => {
    removeItems(checkedKeys);
    setCheckedKeys([]);
  };

  const selectedItems = items.filter(item => checkedKeys.includes(item.cartKey));

  // 가격 모음
  const goodsTotalChecked = selectedItems.reduce(
    (sum, i) => sum + i.unitPrice * i.qty,
    0
  );

  // 배송비는 한 번만
  let shippingTotalChecked = 0;

  if (selectedItems.length > 0) {
    shippingTotalChecked = selectedItems[0].deliveryCost ?? 0;
  }

  // 무료배송 조건
  if (goodsTotalChecked >= 50000) {
    shippingTotalChecked = 0;
  }

  const grandTotalChecked = goodsTotalChecked + shippingTotalChecked;


  // 상품을 하나라도 선택했는지 여부
  const hasSelectedItems = items.length > 0 && checkedKeys.length > 0;

  // 결제 페이지 이동 함수
  const navigate = useNavigate();

  const onGoCheckout = () => {
    if (checkedKeys.length === 0) return; // 선택 없으면 무시
    navigate("/selections/checkout");
  }

  return (
    // <!-- MAIN -->
    <main className="main cart">
      {/* <!-- title --> */}
      <section className="cart-hero">
        <h1 className="cart-hero__title">장바구니</h1>
        <p className="cart-hero__sub">선택한 상품을 한 번에 확인하고 결제할 수 있어요.</p>
      </section>

      {/* <!-- content --> */}
      <section className="cart-wrap">
        {/* <!-- left: list --> */}
        <div className="cart-left">
          <div className="cart-toolbar">
            <label className="check">
              <input type="checkbox"
                checked={isAllChecked}
                onChange={handleAllChecked} />
              <span>전체 선택</span>
            </label>

            <div className="cart-toolbar__actions">
              <button className="ghost-btn" type="button" onClick={handleDeleteSelected}>선택 삭제</button>
              <button className="ghost-btn" type="button" onClick={clearCart}>전체 삭제</button>
            </div>
          </div>

          <div className="cart-box">
            <div className="cart-head">
              <div className="cart-head__cell cart-head__check">선택</div>
              <div className="cart-head__cell cart-head__item">상품</div>
              <div className="cart-head__cell cart-head__price">가격</div>
              <div className="cart-head__cell cart-head__qty">수량</div>
              <div className="cart-head__cell cart-head__sum">합계</div>
            </div>

            {items.map((item) => (
              <article className="cart-row" key={item.cartKey}>
                <div className="cart-cell cart-cell--check">
                  <input type="checkbox"
                    checked={checkedKeys.includes(item.cartKey)}
                    onChange={() => handleChecked(item.cartKey)} />
                </div>

                <div className="cart-cell cart-cell--item">
                  <div className="cart-item">
                    <div className="cart-item__thumb">
                      <img src={`${import.meta.env.VITE_API_URL}${item.thumbnail}`}
                        alt={item.goodsName} />
                    </div>

                    <div className="cart-item__info">
                      <p className="cart-item__title">{item.goodsName}</p>
                      <p className="cart-item__option">{item.goodsSize && item.goodsColor ? `옵션 : ${item.goodsSize} / ${item.goodsColor}` : item.goodsSize
                        ? `옵션 : ${item.goodsSize}` : item.goodsColor
                          ? `옵션 : ${item.goodsColor}` : ""}</p>
                    </div>
                  </div>
                </div>

                <div className="cart-cell cart-cell--price">
                  <p className="money">{Number(item.unitPrice).toLocaleString()}원</p>
                </div>

                <div className="cart-cell cart-cell--qty">
                  <div className="qty">
                    <button className="qty__btn" type="button" aria-label="minus" onClick={() => setQty(item.cartKey, item.qty - 1)}>
                      <i className="fa-solid fa-minus"></i>
                    </button>
                    <input className="qty__input" type="number" value={item.qty} min="1" readOnly />
                    <button className="qty__btn" type="button" aria-label="plus" onClick={() => setQty(item.cartKey, item.qty + 1)}>
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                </div>

                <div className="cart-cell cart-cell--sum">
                  <p className="money money--strong">{Number(item.unitPrice * item.qty).toLocaleString()}원</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* <!-- right: summary --> */}
        <aside className="cart-right" aria-label="결제 요약">
          <div className="summary">
            <h2 className="summary__title">주문 요약</h2>

            <div className="summary__rows">
              <div className="summary__row">
                <span className="k">상품금액</span>
                <span className="v">{Number(goodsTotalChecked).toLocaleString()}원</span>
              </div>
              <div className="summary__row">
                <span className="k">배송비</span>
                <span className="v">{Number(shippingTotalChecked).toLocaleString()}원</span>
              </div>
            </div>

            <div className="summary__total">
              <span className="k">결제 예정 금액</span>
              <span className="v">{Number(grandTotalChecked).toLocaleString()}원</span>
            </div>

            <div className="summary__actions">
              <button className="btn btn-solid" type="button" disabled={!hasSelectedItems} onClick={onGoCheckout} >
                {hasSelectedItems ? "주문하기" : "상품을 선택해주세요"}</button>
            </div>

            <p className="summary__note">
              주문하기 버튼을 누르면 결제 페이지로 이동합니다.
            </p>
          </div>
        </aside>
      </section>
    </main>
  )
};

export default Cart;