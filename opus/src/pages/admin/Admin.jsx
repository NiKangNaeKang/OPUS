import { useEffect, useState } from "react";
import axiosApi from "../../api/axiosAPI";
import "../../css/Orders.css";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("report");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        if (activeTab === "report") {
          const resp = await axiosApi.get("/admin/report");
          if (resp.status === 200) {
            setItems(resp.data);
          }
        } else if (activeTab === "restore") {
          const resp = await axiosApi.get("/admin/restore");
          if (resp.status === 200) {
            setItems(resp.data);
          }
        } else if (activeTab === "inquiry") {
          const resp = await axiosApi.get("/admin/inquire");
          if (resp.status === 200) {
            setItems(resp.data);
          }
        }
      } catch (error) {
        console.error(error);
        setItems([]);
      }
    };

    fetchAdminData();
  }, [activeTab]);

  return (
    <main className="main orders-page">
      {/* 헤더 */}
      <section className="orders-header">
        <h1 className="orders-title">관리자 페이지</h1>
        <p className="orders-subtitle">
          신고 / 복구 / 문의를 관리할 수 있습니다.
        </p>
      </section>

      {/* 탭 버튼 */}
      <section className="orders-header">
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="detail-btn" onClick={() => setActiveTab("report")}>
            신고 관리
          </button>
          <button className="detail-btn" onClick={() => setActiveTab("restore")}>
            복구 관리
          </button>
          <button className="detail-btn" onClick={() => setActiveTab("inquiry")}>
            문의 관리
          </button>
        </div>
      </section>

      {/* 목록 */}
      <section className="orders-list">
        <h2 style={{ marginBottom: "10px" }}>
          {activeTab === "report"
            ? "신고 관리"
            : activeTab === "restore"
            ? "복구 관리"
            : "문의 관리"}
        </h2>

        {items.length === 0 ? (
          <div className="orders-empty">
            <i className="fa-solid fa-database"></i>
            <p>
              {activeTab === "report"
                ? "신고 내역이 없습니다."
                : activeTab === "restore"
                ? "복구 요청이 없습니다."
                : "등록된 문의가 없습니다."}
            </p>
          </div>
        ) : (
          items.map((item, idx) => (
            <div key={idx} className="order-card">
              <div className="order-card__header">
                <div className="order-info">
                  <span className="order-date">
                    {activeTab === "report"
                      ? "신고된 후기"
                      : activeTab === "restore"
                      ? "복구 요청"
                      : "1:1 문의"}
                  </span>
                  <span className="order-id">
                    작성자: {item.reporterNo}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  {activeTab === "report" && (
                    <>
                      <button className="detail-btn">승인</button>
                      <button className="detail-btn cancel-btn">취소</button>
                    </>
                  )}
                
                  {activeTab === "restore" && (
                    <>
                      <button className="detail-btn">승인</button>
                      <button className="detail-btn cancel-btn">취소</button>
                    </>
                  )}
                
                  {activeTab === "inquiry" && (
                    <button className="detail-btn">답변 처리</button>
                  )}
                </div>
              </div>

              <div className="order-card__body">
                <div className="order-product">
                  <div className="product-info">
                    <p className="product-name">
                      {item.reportReason || "신고 사유 없음"}
                    </p>
                    <p className="product-price">
                      {item.reportDetail || "신고 상세 내용 없음"}
                    </p>
                    <p className="product-price">
                      신고 상태: {item.reportStatus}
                    </p>
                    <p className="product-price">
                      신고일: {item.reportDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default Admin;