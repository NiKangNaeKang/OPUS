import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/proposals-detail.css";

const ProposalDetail = () => {
  const { boardNo } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost/api/board/detail/${boardNo}`, {
          withCredentials: true,
        });
        setData(response.data);
      } catch (error) {
        console.error("상세 정보 로드 실패:", error);
        alert("게시글을 불러올 수 없습니다.");
        navigate("/proposals");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [boardNo, navigate]);

  const formatDate = (iso) => (iso ? iso.split(" ")[0].replaceAll("-", ".") : "");

  if (isLoading) return <div className="loading">로딩 중...</div>;
  if (!data) return <div className="empty-state">데이터가 없습니다.</div>;

  return (
    <main className="proposal-detail-page">
      <div className="container detail-container">
        <header className="detail-header">
          <div className="detail-meta">
            <span className="detail-category">{data.boardCategory}</span>
            <h1 className="detail-title">{data.boardTitle}</h1>
            <div className="detail-info">
              <span>{data.writerCompany}</span>
              <span>{formatDate(data.boardWriteDate)}</span>
              <span>조회수 {data.boardViewCount}</span>
            </div>
          </div>
        </header>

        <hr />

        <section className="detail-content">
          <div dangerouslySetInnerHTML={{ __html: data.boardContent }} />
        </section>

        <footer className="detail-footer">
          <button className="btn-list" onClick={() => navigate(-1)}>
            목록으로
          </button>
          {/* 본인 글일 경우만 노출하도록 처리 필요 */}
          <div className="btn-group">
            <button className="btn-edit">수정</button>
            <button className="btn-delete">삭제</button>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default ProposalDetail;