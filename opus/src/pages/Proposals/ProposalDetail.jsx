import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosApi from "../../api/axiosAPI";
import { useAuthStore } from "../../components/auth/useAuthStore";
import "../../css/proposals-detail.css";

const ProposalDetail = () => {
  const { boardNo } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoggedIn, member } = useAuthStore();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const categoryLabel = {
    musical: "뮤지컬",
    exhibition: "전시",
    auction: "경매",
    goods: "굿즈",
  };

  // ✅ 상세 조회
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);

        const response = await axiosApi.get(`/api/board/detail/${boardNo}`);
        const detail = response.data;

        // ✅ 삭제 플래그는 boardDelFl (DTO: private String boardDelFl)
        if (!detail || detail.boardDelFl === "Y") {
          alert("존재하지 않거나 삭제된 게시글입니다.");
          navigate("/proposals");
          return;
        }

        setData(detail);
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

  // ✅ 이미지 리스트 (0~5장) : 백엔드가 내려주는 키에 맞춰 유연하게 처리
  const images = useMemo(() => {
    const list = data?.imageList ?? [];

    return list
      .map((img) => {
        // 케이스1) 백엔드에서 fullpath를 만들어 내려주는 경우
        if (img.boardImgFullpath) return img.boardImgFullpath;

        // 케이스2) path + rename 으로 조합해야 하는 경우
        if (img.boardImgPath && img.boardImgRe) return img.boardImgPath + img.boardImgRe;

        // 케이스3) 다른 키로 내려오는 경우 대비 (선택)
        if (img.imgPath && img.imgRename) return img.imgPath + img.imgRename;

        return "";
      })
      .filter(Boolean);
  }, [data]);

  // ✅ 삭제
  const handleDelete = async () => {
    if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) return;

    try {
      await axiosApi.delete(`/api/board/delete/${boardNo}`);
      alert("삭제되었습니다.");
      navigate("/proposals", { state: location.state });
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  // ✅ 날짜 포맷
  const formatDate = (iso) => (iso ? iso.split(" ")[0].replaceAll("-", ".") : "");

  // ✅ 목록으로 (탭/페이지 유지)
  const handleGoList = () => {
    if (!data) return;

    const targetTab = data.boardTypeCode === 2 ? "promotion" : "notice";
    navigate("/proposals", {
      state: {
        activeTab: targetTab,
        currentPage: location.state?.currentPage ?? 1,
      },
    });
  };

  if (isLoading) return <div className="loading">로딩 중...</div>;
  if (!data) return null;

  // ✅ 수정/삭제 권한
  const role = member?.role;
  const isOwner = Number(data.memberNo) === Number(member?.memberNo);
  const canEditDelete =
    isLoggedIn &&
    (role === "ADMIN" || (role === "COMPANY" && data.boardTypeCode === 2 && isOwner));

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

        {/* ✅ 이미지 갤러리 (0~5장) */}
        {images.length > 0 && (
          <section className="detail-gallery">
            <div className="gallery-grid">
              {images.map((src, idx) => (
                <div className="gallery-item" key={`${src}-${idx}`}>
                  <img
                    src={src}
                    alt={`image-${idx + 1}`}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/images/no-image.png";
                    }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        <hr />

        <section className="detail-content">
          <div dangerouslySetInnerHTML={{ __html: data.boardContent }} />
        </section>

        <footer className="detail-footer">
          <button className="btn-list" onClick={handleGoList}>
            목록으로
          </button>

          {canEditDelete && (
            <div className="btn-group">
              <button
                className="btn-edit"
                onClick={() =>
                  navigate(`/proposals/edit/${boardNo}`, { state: location.state })
                }
              >
                수정
              </button>
              <button className="btn-delete" onClick={handleDelete}>
                삭제
              </button>
            </div>
          )}
        </footer>
      </div>
    </main>
  );
};

export default ProposalDetail;