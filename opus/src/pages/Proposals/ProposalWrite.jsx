import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axiosApi from "../../api/axiosAPI";
import axiosUpload from "../../api/axiosUpload";
import { useAuthStore } from "../../components/auth/useAuthStore";
import "../../css/proposalsWrite.css";

const MAX_IMAGES = 5;

const ProposalWrite = () => {

console.log("USING axiosUpload", axiosUpload.defaults.baseURL);


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

  // ✅ 새로 업로드할 이미지 파일들
  const [images, setImages] = useState([]); // File[]

  // ✅ 미리보기 URL 생성
  const previews = useMemo(
    () => images.map((f) => ({ file: f, url: URL.createObjectURL(f) })),
    [images]
  );

  // ✅ objectURL 메모리 해제
  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  // ✅ 권한 체크: ADMIN, COMPANY만 작성/수정 접근
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

  // ✅ COMPANY 신규 작성 기본값: 홍보(2)
  useEffect(() => {
    if (!isEditMode && role === "COMPANY") {
      setFormData((prev) => ({ ...prev, boardTypeCode: 2 }));
    }
  }, [isEditMode, role]);

  // ✅ 수정 모드: 기존 데이터 로드 + COMPANY는 (홍보글 + 내 글)만 수정 가능
  useEffect(() => {
    if (!isEditMode) return;
    if (!isLoggedIn) return;

    const fetchDetail = async () => {
      try {
        const res = await axiosApi.get(`/api/board/detail/${boardNo}`);
        const data = res.data;

        const isOwner = Number(data.memberNo) === Number(member?.memberNo);

        if (role === "COMPANY") {
          if (Number(data.boardTypeCode) !== 2) {
            alert("기업회원은 이벤트/홍보글만 수정할 수 있습니다.");
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
          writerCompany: data.writerCompany ?? "",
          boardTitle: data.boardTitle ?? "",
          boardCategory: data.boardCategory ?? "musical",
          boardTypeCode: Number(data.boardTypeCode) || 1,
          boardContent: data.boardContent ?? "",
        });

        // ✅ 현재 백엔드는 update에 이미지 변경 기능이 없음 → 수정 화면에서는 업로드 비활성화
        setImages([]);
      } catch (e) {
        alert("데이터를 불러올 수 없습니다.");
        navigate("/proposals", { state: location.state });
      }
    };

    fetchDetail();
  }, [
    boardNo,
    isEditMode,
    isLoggedIn,
    role,
    member?.memberNo,
    navigate,
    location.state,
  ]);

  // ✅ 입력 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "boardTypeCode" ? Number(value) : value,
    }));
  };

  // ✅ 파일 선택: 최대 5장
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remain = MAX_IMAGES - images.length;
    const next = files.slice(0, Math.max(0, remain));

    if (files.length > remain) {
      alert(`이미지는 최대 ${MAX_IMAGES}장까지 업로드 가능합니다.`);
    }

    setImages((prev) => [...prev, ...next]);

    // 같은 파일 재선택 가능하도록 초기화
    e.target.value = "";
  };

  // ✅ 선택 이미지 삭제
  const removeImageAt = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("SUBMIT HIT", { role, formData, imagesLen: images.length });

    // COMPANY는 홍보(2)만 작성/수정 가능
    if (role === "COMPANY" && formData.boardTypeCode !== 2) {
      console.log("BLOCK: boardTypeCode", formData.boardTypeCode);
      return alert("기업회원은 이벤트/홍보글만 작성/수정 가능합니다.");
    }

    if (role === "COMPANY" && !formData.writerCompany.trim()) {
      console.log("BLOCK: writerCompany empty", formData.writerCompany);
      return alert("작성자(회사명)를 입력해주세요.");
    }

    if (!formData.boardTitle.trim()) {
      console.log("BLOCK: title empty");
      return alert("제목을 입력해주세요.");
    }

    if (!formData.boardContent.trim()) {
      console.log("BLOCK: content empty");
      return alert("내용을 입력해주세요.");
    }

    const boardPayload = {
      ...formData,
      boardNo: isEditMode ? Number(boardNo) : undefined,
      memberNo: member?.memberNo,
    };

    try {
      if (isEditMode) {
        // ✅ 수정은 현재 백엔드 스펙대로 JSON만
        await axiosApi.put(`/api/board/update/${boardNo}`, boardPayload);
        alert("수정되었습니다.");
      } else {
        // ✅ 등록은 multipart (업로드 전용 axios)
        const fd = new FormData();

        // Spring @RequestPart("board")
        fd.append(
          "board",
          new Blob([JSON.stringify(boardPayload)], { type: "application/json" })
        );

        // Spring @RequestPart("images")
        images.forEach((file) => fd.append("images", file));

        console.log("is FormData?", fd instanceof FormData);
        for (const [k, v] of fd.entries()) console.log("FD", k, v);


        await axiosUpload.post("/api/board/insert", fd);
        alert("등록되었습니다.");
      }

      const targetTab =
        location.state?.activeTab ||
        (formData.boardTypeCode === 2 ? "promotion" : "notice");

      const targetPage = isEditMode ? location.state?.currentPage || 1 : 1;

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

          {!isEditMode ? (
            <p className="write-sub">
              이미지는 최대 {MAX_IMAGES}장까지 업로드할 수 있어요. (포스터 비율 3:4 추천)
            </p>
          ) : (
            <p className="write-sub">
              * 현재는 텍스트만 수정 가능해요. (이미지 수정은 백엔드 기능 추가 필요)
            </p>
          )}
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

          {/* ✅ 이미지 업로드 */}
          <div className="form-group">
            <label className="label-row">
              이미지 업로드{" "}
              <span className="hint">
                ({images.length}/{MAX_IMAGES})
              </span>
            </label>

            <div className="upload-row">
              <label className={`upload-btn ${isEditMode ? "is-disabled" : ""}`}>
                파일 선택
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  disabled={isEditMode}
                />
              </label>

              <div className="upload-help">
                이미지가 없으면 목록에서 기본 포스터가 표시돼요.
              </div>
            </div>

            {images.length > 0 && (
              <div className="preview-grid">
                {previews.map((p, idx) => (
                  <div className="preview-item" key={p.url}>
                    <img src={p.url} alt={`preview-${idx}`} />
                    <button
                      type="button"
                      className="preview-remove"
                      onClick={() => removeImageAt(idx)}
                    >
                      ×
                    </button>
                    {idx === 0 && <div className="preview-badge">썸네일</div>}
                  </div>
                ))}
              </div>
            )}
          </div>

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