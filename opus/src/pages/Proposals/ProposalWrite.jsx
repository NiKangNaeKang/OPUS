import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axiosApi from "../../api/axiosAPI";
import { useAuthStore } from "../../components/auth/useAuthStore";
import "../../css/proposalsWrite.css";

const ProposalWrite = () => {
  const { boardNo } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, member } = useAuthStore();

  const isEditMode = !!boardNo;
  const role = member?.role;

  const [formData, setFormData] = useState({
    writerCompany: "", 
    boardTitle: "",
    boardCategory: "musical",
    boardTypeCode: 1,
    boardContent: "",
  });

  // ADMIN, COMPANY만 허용
  useEffect(() => {
    if (isLoggedIn === false) {
      alert("로그인이 필요합니다.");
      navigate("/proposals");
      return;
    }

    if (!isLoggedIn) return;

    if (role === "ADMIN" || role === "COMPANY") return;

    alert("권한이 없습니다.");
    navigate("/proposals");
  }, [isLoggedIn, role, navigate]);

  // COMPANY가 '신규 작성'으로 들어오면 기본을 홍보로 고정
  useEffect(() => {
    if (!isEditMode && role === "COMPANY") {
      setFormData((prev) => ({ ...prev, boardTypeCode: 2 }));
    }
  }, [isEditMode, role]);

  // 수정 모드일 때 기존 데이터 로드 + COMPANY는 (홍보글 + 내 글)만 수정 가능
  useEffect(() => {
    if (!isEditMode) return;
    if (!isLoggedIn) return;

    const fetchDetail = async () => {
      try {
        const response = await axiosApi.get(`/api/board/detail/${boardNo}`);
        const { writerCompany, boardTitle, boardCategory, boardTypeCode, boardContent } = response.data;

        // 작성자 번호 필드가 memberNo가 맞다는 전제
        const isOwner = Number(response.data.memberNo) === Number(member?.memberNo);

        if (role === "COMPANY") {
          if (Number(boardTypeCode) !== 2) {
            alert("기업회원은 홍보글만 수정할 수 있습니다.");
            navigate("/proposals", { state: location.state });
            return;
          }
          if (!isOwner) {
            alert("본인 글만 수정할 수 있습니다.");
            navigate("/proposals", { state: location.state });
            return;
          }
        }

        setFormData({
          writerCompany: writerCompany ?? "",
          boardTitle: boardTitle ?? "",
          boardCategory: boardCategory ?? "musical",
          boardTypeCode: Number(boardTypeCode) || 1,
          boardContent: boardContent ?? "",
        });
      } catch (error) {
        alert("데이터를 불러올 수 없습니다.");
        navigate("/proposals", { state: location.state });
      }
    };

    fetchDetail();
  }, [boardNo, isEditMode, isLoggedIn, role, member?.memberNo, navigate, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "boardTypeCode" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // COMPANY : 홍보(2)만 작성/수정 가능
    if (role === "COMPANY" && formData.boardTypeCode !== 2) {
      return alert("기업회원은 홍보글만 작성/수정 가능합니다.");
    }

    if (role === "COMPANY" && !formData.writerCompany.trim()) { return alert("작성자(회사명)를 입력해주세요.");}
    if (!formData.boardTitle.trim()) return alert("제목을 입력해주세요.");
    if (!formData.boardContent.trim()) return alert("내용을 입력해주세요.");

    const payload = {
      ...formData,
      boardNo: isEditMode ? Number(boardNo) : undefined,
      memberNo: member?.memberNo,
    };

    try {
      if (isEditMode) {
        await axiosApi.put(`/api/board/update/${boardNo}`, payload);
        alert("수정되었습니다.");
      } else {
        await axiosApi.post("/api/board/insert", payload);
        alert("등록되었습니다.");
      }

      // 돌아갈 탭/페이지 유지
      const targetTab =
        location.state?.activeTab ||
        (formData.boardTypeCode === 2 ? "promotion" : "notice");

      const targetPage = isEditMode ? (location.state?.currentPage || 1) : 1;

      navigate("/proposals", {
        state: { activeTab: targetTab, currentPage: targetPage },
      });
    } catch (error) {
      console.error("저장 실패 상세:", error.response?.data);
      const errorMsg = error.response?.data?.message || "서버 오류가 발생했습니다.";
      alert(`저장 실패: ${errorMsg}`);
    }
  };

  return (
    <main className="proposals-write-page">
      <div className="container write-container">
        <header className="write-header">
          <h1>{isEditMode ? "게시글 수정" : "새 게시글 작성"}</h1>
        </header>

        <form onSubmit={handleSubmit} className="write-form">
          <div className="form-section">
            <div className="form-group">
              <label>구분</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="boardTypeCode"
                    value="1"
                    disabled={role === "COMPANY"}
                    checked={formData.boardTypeCode === 1}
                    onChange={handleChange}
                  />
                  공지사항
                </label>

                <label className="radio-label">
                  <input
                    type="radio"
                    name="boardTypeCode"
                    value="2"
                    checked={formData.boardTypeCode === 2}
                    onChange={handleChange}
                  />
                  홍보
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>카테고리</label>
              <select
                name="boardCategory"
                value={formData.boardCategory}
                onChange={handleChange}
                className="pp-select"
              >
                <option value="musical">뮤지컬</option>
                <option value="exhibition">전시</option>
                <option value="auction">경매</option>
                <option value="goods">굿즈</option>
              </select>
            </div>
          </div>

            {role === "COMPANY" && (
            <div className="form-group">
                <label>작성자(회사명)</label>
                <input
                type="text"
                name="writerCompany"
                value={formData.writerCompany}
                onChange={handleChange}
                placeholder="회사명을 입력하세요"
                className="pp-input"
                />
            </div>
            )}

          <div className="form-group">
            <label>제목</label>
            <input
              type="text"
              name="boardTitle"
              value={formData.boardTitle}
              onChange={handleChange}
              placeholder="제목을 입력하세요"
              className="pp-input"
            />
          </div>

          <div className="form-group">
            <label>내용</label>
            <textarea
              name="boardContent"
              value={formData.boardContent}
              onChange={handleChange}
              placeholder="내용을 입력하세요"
              className="pp-textarea"
            />
          </div>

          <div className="write-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/proposals", { state: location.state })}
            >
              취소
            </button>
            <button type="submit" className="btn-submit">
              {isEditMode ? "수정완료" : "등록하기"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ProposalWrite;