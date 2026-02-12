import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { orderApi } from "../../api/orderAPI";
import Loading from "../../components/common/Loading";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isConfirming, setIsConfirming] = useState(true);
  const [orderInfo, setOrderInfo] = useState(null);

  useEffect(() => {
    const confirmPayment = async () => {
      // URL에서 파라미터 추출
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");

      if (!paymentKey || !orderId || !amount) {
        alert("잘못된 접근입니다.");
        navigate("/selections/cart");
        return;
      }

      try {
        // 백엔드에 최종 승인 요청
        const response = await orderApi.confirmPayment({
          paymentKey,
          orderId,
          amount: parseInt(amount)
        });

        setOrderInfo(response.data);
        setIsConfirming(false);

        // 장바구니 비우기
        // useCartStore.getState().clear();

      } catch (error) {
        console.error("결제 승인 실패:", error);
        alert(error.response?.data?.message || "결제 승인에 실패했습니다.");
        navigate("/payment/fail");
      }
    };

    confirmPayment();
  }, [searchParams, navigate]);

  if (isConfirming) {
    return (
      <div className="payment-loading">
        <Loading />
        <p>결제를 확인하고 있습니다...</p>
      </div>
    );
  }

  return (
    <main className="main payment-success">
      <section className="payment-result">
        <div className="payment-result__icon">
          <i className="fa-solid fa-circle-check"></i>
        </div>
        
        <h1 className="payment-result__title">결제가 완료되었습니다</h1>
        
        <div className="payment-result__info">
          <div className="info-row">
            <span className="info-label">주문번호</span>
            <span className="info-value">{orderInfo?.orderId}</span>
          </div>
          <div className="info-row">
            <span className="info-label">결제 금액</span>
            <span className="info-value">
              {Number(orderInfo?.totalAmount).toLocaleString()}원
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">결제 수단</span>
            <span className="info-value">{orderInfo?.method}</span>
          </div>
          
          {/* 가상계좌인 경우 계좌 정보 표시 */}
          {orderInfo?.method === "가상계좌" && orderInfo?.virtualAccount && (
            <>
              <div className="info-row">
                <span className="info-label">입금 은행</span>
                <span className="info-value">{orderInfo.virtualAccount.bankName}</span>
              </div>
              <div className="info-row">
                <span className="info-label">계좌번호</span>
                <span className="info-value">{orderInfo.virtualAccount.accountNumber}</span>
              </div>
              <div className="info-row">
                <span className="info-label">입금 기한</span>
                <span className="info-value">
                  {new Date(orderInfo.virtualAccount.dueDate).toLocaleString()}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="payment-result__actions">
          <button 
            className="btn btn--outline"
            onClick={() => navigate("/mypage/orders")}
          >
            주문 내역 보기
          </button>
          <button 
            className="btn btn--solid"
            onClick={() => navigate("/")}
          >
            홈으로 가기
          </button>
        </div>
      </section>
    </main>
  );
};

export default PaymentSuccess;