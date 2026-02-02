import "../../css/cart.css"

const Cart = () => {

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
            <input type="checkbox" checked />
            <span>전체 선택</span>
          </label>

          <div className="cart-toolbar__actions">
            <button className="ghost-btn" type="button">선택 삭제</button>
            <button className="ghost-btn" type="button">전체 삭제</button>
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

          {/* <!-- row 1 --> */}
          <article className="cart-row">
            <div className="cart-cell cart-cell--check">
              <input type="checkbox" checked />
            </div>

            <div className="cart-cell cart-cell--item">
              <div className="cart-item">
                <div className="cart-item__thumb">
                  <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/a7f5aa7753-078f8203afee3d340d1f.png"
                    alt="레미제라블 티셔츠" />
                </div>

                <div className="cart-item__info">
                  <p className="cart-item__title">레미제라블 티셔츠</p>
                  <p className="cart-item__meta">의류 · 뮤지컬</p>
                  <p className="cart-item__option">옵션: L / 블랙</p>
                </div>
              </div>
            </div>

            <div className="cart-cell cart-cell--price">
              <p className="money">45,000원</p>
            </div>

            <div className="cart-cell cart-cell--qty">
              <div className="qty">
                <button className="qty__btn" type="button" aria-label="minus">
                  <i className="fa-solid fa-minus"></i>
                </button>
                <input className="qty__input" type="number" value="1" min="1"
                  oninput="this.value = this.value.replace(/[^0-9]/g, '')" />
                <button className="qty__btn" type="button" aria-label="plus">
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>

            <div className="cart-cell cart-cell--sum">
              <p className="money money--strong">45,000원</p>
            </div>
          </article>

          {/* <!-- row 2 --> */}
          <article className="cart-row">
            <div className="cart-cell cart-cell--check">
              <input type="checkbox" checked />
            </div>

            <div className="cart-cell cart-cell--item">
              <div className="cart-item">
                <div className="cart-item__thumb">
                  <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/09fbe5dfb3-854f6874ce67ddda6d1e.png"
                    alt="오페라의 유령 포스터" />
                </div>

                <div className="cart-item__info">
                  <p className="cart-item__title">오페라의 유령 포스터</p>
                  <p className="cart-item__meta">포스터/엽서 · 뮤지컬</p>
                  <p className="cart-item__option">옵션: A3 / 액자(블랙)</p>
                </div>
              </div>
            </div>

            <div className="cart-cell cart-cell--price">
              <p className="money">25,000원</p>
            </div>

            <div className="cart-cell cart-cell--qty">
              <div className="qty">
                <button className="qty__btn" type="button" aria-label="minus">
                  <i className="fa-solid fa-minus"></i>
                </button>
                <input className="qty__input" type="number" value="2" min="1"
                  oninput="this.value = this.value.replace(/[^0-9]/g, '')" />
                <button className="qty__btn" type="button" aria-label="plus">
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>

            <div className="cart-cell cart-cell--sum">
              <p className="money money--strong">50,000원</p>
            </div>
          </article>
        </div>
      </div>

      {/* <!-- right: summary --> */}
      <aside className="cart-right" aria-label="결제 요약">
        <div className="summary">
          <h2 className="summary__title">주문 요약</h2>

          <div className="summary__rows">
            <div className="summary__row">
              <span className="k">상품금액</span>
              <span className="v">95,000원</span>
            </div>
            <div className="summary__row">
              <span className="k">배송비</span>
              <span className="v">0원</span>
            </div>
            <div className="summary__row">
              <span className="k">할인</span>
              <span className="v">0원</span>
            </div>
          </div>

          <div className="summary__total">
            <span className="k">결제 예정 금액</span>
            <span className="v">95,000원</span>
          </div>

          <div className="summary__actions">
            <button className="btn btn--solid" type="button">주문하기</button>
            <button className="btn btn--outline" id="option-order" type="button">선택 상품 주문</button>
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