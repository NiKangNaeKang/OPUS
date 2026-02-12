import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentFail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");

  return (
    <main className="main payment-fail">
      <section className="payment-result">
        <div className="payment-result__icon payment-result__icon--error">
          <i className="fa-solid fa-circle-xmark"></i>
        </div>
        
        <h1 className="payment-result__title">결제에 실패했습니다</h1>
        
        <div className="payment-result__error">
          <p className="error-code">오류 코드: {errorCode}</p>
          <p className="error-message">{errorMessage}</p>
        </div>

        <div className="payment-result__actions">
          <button 
            className="btn btn--outline"
            onClick={() => navigate("/selections/cart")}
          >
            장바구니로 돌아가기
          </button>
          <button 
            className="btn btn--solid"
            onClick={() => navigate("/selections/checkout")}
          >
            다시 시도하기
          </button>
        </div>
      </section>
    </main>
  );
};

export default PaymentFail;