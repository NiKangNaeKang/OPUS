import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosApi from "../../api/axiosAPI";
import { useAuthStore } from "../../components/auth/useAuthStore";
import "../../css/proposals-detail.css";

const ProposalDetail = () => {
    const { boardNo } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const { isLoggedIn, member } = useAuthStore();
    const isAdmin = isLoggedIn && member?.role === "ADMIN";

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const categoryLabel = {
        musical: "뮤지컬",
        exhibition: "전시",
        auction: "경매",
        goods: "굿즈",
    };

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setIsLoading(true);
                const response = await axiosApi.get(`/api/board/detail/${boardNo}`);

                if (!response.data || response.data.delYn === 'Y') {
                    alert("존재하지 않거나 삭제된 게시글입니다.");
                    navigate("/proposals");
                    return;
                }

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

    const handleDelete = async () => {
        if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) return;
        try {
            await axiosApi.delete(`/api/board/delete/${boardNo}`);
            alert("삭제되었습니다.");
            navigate("/proposals");
        } catch (error) {
            console.error("삭제 실패:", error);
            alert("삭제에 실패했습니다.");
        }
    };

    const formatDate = (iso) => (iso ? iso.split(" ")[0].replaceAll("-", ".") : "");

    // 목록으로 돌아가기 (이전 탭 정보 유지)
    const handleGoList = () => {
        if (!data) return;
        const targetTab = data.boardTypeCode === 2 ? "promotion" : "notice";
        navigate("/proposals", { state: { activeTab: targetTab } });
    };

    if (isLoading) return <div className="loading">로딩 중...</div>;

    // 데이터가 없는 상태에서 아래 return문의 data.xxx를 읽으면 흰 화면이 뜨므로 방어
    if (!data) return null;

    const role = member?.role;
    const isOwner = Number(data.memberNo) === Number(member?.memberNo);
    const canEditDelete =
      isLoggedIn && (role === "ADMIN" || (role === "COMPANY" && data.boardTypeCode === 2 && isOwner));

    return (
        <main className="proposal-detail-page">
            <div className="container detail-container">
                <header className="detail-header">
                    <div className="detail-meta">
                        <h1 className="detail-title">
                            {data.boardCategory && categoryLabel[data.boardCategory]
                                ? `[${categoryLabel[data.boardCategory]}] `
                                : ""}
                            {data.boardTitle}
                        </h1>
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
                    <button className="btn-list" onClick={handleGoList}>
                        목록으로
                    </button>
                    
                    {/* 어드민일 때만 수정/삭제 버튼 노출 */}
                  {canEditDelete && (
                      <div className="btn-group">
                        <button onClick={() => navigate(`/proposals/edit/${boardNo}`, { state: location.state })}>수정</button>
                        <button className="btn-delete" onClick={handleDelete}>삭제</button>
                      </div>
                    )}
                </footer>
            </div>
        </main>
    );
};

export default ProposalDetail;