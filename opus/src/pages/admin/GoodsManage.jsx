import { useState, useEffect } from "react";
import axiosApi from "../../api/axiosAPI";
import "../../css/GoodsRegist.css";

const EMPTY_OPTION = { goodsSize: "", goodsColor: "", stock: 0 };

const SORT_LABEL = { exhibition: "전시", musical: "뮤지컬" };
const CATEGORY_LABEL = {
  poster: "포스터/엽서", accessories: "액세서리", clothes: "의류",
  etc: "잡화", archive: "아카이브", record: "음반/DVD",
};

// ─────────────────────────────────────────────
// 상품 등록 / 수정 폼
// ─────────────────────────────────────────────
const GoodsForm = ({ editTarget, onSuccess, onCancel }) => {
  const isEdit = !!editTarget;

  const [form, setForm] = useState(
    isEdit
      ? {
          goodsName:    editTarget.goodsName    || "",
          goodsSort:    editTarget.goodsSort    || "exhibition",
          goodsCategory:editTarget.goodsCategory|| "poster",
          goodsPrice:   editTarget.goodsPrice   || "",
          deliveryCost: editTarget.deliveryCost ?? "3000",
          goodsSeller:  editTarget.goodsSeller  || "",
          goodsInfo:    editTarget.goodsInfo    || "",
        }
      : {
          goodsName: "", goodsSort: "exhibition", goodsCategory: "poster",
          goodsPrice: "", deliveryCost: "3000", goodsSeller: "", goodsInfo: "",
        }
  );

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(
    isEdit && editTarget.goodsThumbnail
      ? `${import.meta.env.VITE_API_URL}${editTarget.goodsThumbnail}`
      : null
  );
  const [detailImgs, setDetailImgs] = useState([]);
  const [detailPreviews, setDetailPreviews] = useState([]);
  const [options, setOptions] = useState([{ ...EMPTY_OPTION }]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleDetailImgs = (e) => {
    const files = Array.from(e.target.files);
    setDetailImgs((prev) => [...prev, ...files]);
    setDetailPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeDetailImg = (idx) => {
    setDetailImgs((prev) => prev.filter((_, i) => i !== idx));
    setDetailPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleOptionChange = (idx, field, value) => {
    setOptions((prev) => prev.map((opt, i) => (i === idx ? { ...opt, [field]: value } : opt)));
  };

  const addOptionRow = () => setOptions((prev) => [...prev, { ...EMPTY_OPTION }]);
  const removeOptionRow = (idx) => setOptions((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    if (!form.goodsName) { alert("상품명은 필수입니다."); return; }
    if (!isEdit && !thumbnail) { alert("썸네일 이미지는 필수입니다."); return; }

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    if (thumbnail) formData.append("thumbnail", thumbnail);
    detailImgs.forEach((img) => formData.append("detailImgs", img));
    formData.append("optionsJson", JSON.stringify(options));

    try {
      if (isEdit) {
        await axiosApi.put(`/admin/goods/${editTarget.goodsNo}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("상품이 수정되었습니다.");
      } else {
        await axiosApi.post("/admin/goods", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("상품이 등록되었습니다.");
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      alert(isEdit ? "상품 수정에 실패했습니다." : "상품 등록에 실패했습니다.");
    }
  };

  return (
    <div className="goods-regist">
      {/* 상단 네비 */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <button
          onClick={onCancel}
          style={{
            background: "none", border: "1px solid #e5e7eb", borderRadius: "8px",
            padding: "8px 16px", fontSize: "13px", cursor: "pointer", color: "#6b7280",
          }}
        >
          ← 목록으로
        </button>
        <h2 className="regist-title" style={{ margin: 0 }}>
          {isEdit ? "상품 수정" : "상품 등록"}
        </h2>
      </div>

      {/* 기본 정보 */}
      <section className="regist-section">
        <h3 className="regist-section__title">기본 정보</h3>
        <div className="regist-grid">
          <div className="regist-field regist-field--wide">
            <label className="regist-label">상품명 *</label>
            <input className="regist-input" name="goodsName"
              value={form.goodsName} onChange={handleChange} placeholder="상품명 입력" />
          </div>
          <div className="regist-field">
            <label className="regist-label">장르</label>
            <select className="regist-select" name="goodsSort" value={form.goodsSort} onChange={handleChange}>
              <option value="exhibition">전시</option>
              <option value="musical">뮤지컬</option>
            </select>
          </div>
          <div className="regist-field">
            <label className="regist-label">카테고리</label>
            <select className="regist-select" name="goodsCategory" value={form.goodsCategory} onChange={handleChange}>
              <option value="poster">포스터/엽서</option>
              <option value="accessories">액세서리</option>
              <option value="clothes">의류</option>
              <option value="etc">잡화</option>
              <option value="archive">아카이브</option>
              <option value="record">음반/DVD</option>
            </select>
          </div>
          <div className="regist-field">
            <label className="regist-label">판매 가격 (원)</label>
            <input className="regist-input" name="goodsPrice" type="number"
              value={form.goodsPrice} onChange={handleChange} placeholder="0" />
          </div>
          <div className="regist-field">
            <label className="regist-label">배송비 (원)</label>
            <input className="regist-input" name="deliveryCost" type="number"
              value={form.deliveryCost} onChange={handleChange} placeholder="3000" />
          </div>
          <div className="regist-field">
            <label className="regist-label">판매자</label>
            <input className="regist-input" name="goodsSeller"
              value={form.goodsSeller} onChange={handleChange} placeholder="판매자명" />
          </div>
          <div className="regist-field regist-field--wide">
            <label className="regist-label">상품 설명</label>
            <textarea className="regist-textarea" name="goodsInfo"
              value={form.goodsInfo} onChange={handleChange}
              placeholder="상품 상세 설명을 입력하세요." rows={5} />
          </div>
        </div>
      </section>

      {/* 썸네일 */}
      <section className="regist-section">
        <h3 className="regist-section__title">
          대표 이미지 (썸네일){!isEdit && " *"}
        </h3>
        {isEdit && (
          <p className="regist-desc">새 이미지를 선택하지 않으면 기존 이미지가 유지됩니다.</p>
        )}
        <div className="regist-upload-area">
          <label className="regist-upload-btn" htmlFor="thumbnail">
            <i className="fa-solid fa-plus"></i> 이미지 선택
          </label>
          <input id="thumbnail" type="file" accept="image/*"
            style={{ display: "none" }} onChange={handleThumbnail} />
          {thumbnailPreview && (
            <div className="regist-preview regist-preview--single">
              <img src={thumbnailPreview} alt="썸네일" />
            </div>
          )}
        </div>
      </section>

      {/* 상세 이미지 */}
      <section className="regist-section">
        <h3 className="regist-section__title">상세 이미지 (복수 가능)</h3>
        {isEdit && (
          <p className="regist-desc">새로 추가한 이미지가 기존 상세 이미지에 추가됩니다.</p>
        )}
        <div className="regist-upload-area">
          <label className="regist-upload-btn" htmlFor="detailImgs">
            <i className="fa-solid fa-plus"></i> 이미지 추가
          </label>
          <input id="detailImgs" type="file" accept="image/*" multiple
            style={{ display: "none" }} onChange={handleDetailImgs} />
          <div className="regist-preview-list">
            {detailPreviews.map((src, idx) => (
              <div className="regist-preview" key={idx}>
                <img src={src} alt={`상세${idx + 1}`} />
                <button className="regist-preview__remove" onClick={() => removeDetailImg(idx)}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 옵션 */}
      <section className="regist-section">
        <h3 className="regist-section__title">옵션 설정</h3>
        <p className="regist-desc">옵션이 없는 상품은 재고만 입력하세요.</p>
        <div className="regist-option-list">
          <div className="regist-option-header">
            <span>사이즈</span>
            <span>색상/타입</span>
            <span>재고</span>
            <span></span>
          </div>
          {options.map((opt, idx) => (
            <div className="regist-option-row" key={idx}>
              <input className="regist-input" placeholder="S, M, L"
                value={opt.goodsSize}
                onChange={(e) => handleOptionChange(idx, "goodsSize", e.target.value)} />
              <input className="regist-input" placeholder="Black, White"
                value={opt.goodsColor}
                onChange={(e) => handleOptionChange(idx, "goodsColor", e.target.value)} />
              <input className="regist-input" type="number" placeholder="0"
                value={opt.stock}
                onChange={(e) => handleOptionChange(idx, "stock", Number(e.target.value))} />
              <button className="regist-option-remove" onClick={() => removeOptionRow(idx)}>
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ))}
          <button className="regist-option-add" onClick={addOptionRow}>
            <i className="fa-solid fa-plus"></i> 옵션 추가
          </button>
        </div>
      </section>

      {/* 제출 */}
      <div className="regist-actions">
        <button
          onClick={onCancel}
          style={{
            padding: "14px 32px", background: "#fff", border: "1px solid #e5e7eb",
            borderRadius: "8px", fontSize: "15px", fontWeight: 700,
            cursor: "pointer", marginRight: "12px", color: "#374151",
          }}
        >
          취소
        </button>
        <button className="regist-submit-btn" onClick={handleSubmit}>
          {isEdit ? "수정 저장" : "상품 등록하기"}
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// 상품 목록 (메인)
// ─────────────────────────────────────────────
const GoodsManage = () => {
  const [view, setView] = useState("list");           // "list" | "form"
  const [editTarget, setEditTarget] = useState(null); // null=신규등록, object=수정
  const [goodsList, setGoodsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGoods = async () => {
    try {
      setIsLoading(true);
      const resp = await axiosApi.get("/admin/goods");
      setGoodsList(resp.data);
    } catch (e) {
      console.error(e);
      alert("상품 목록 조회에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoods();
  }, []);

  const handleDelete = async (goodsNo, goodsName) => {
    if (!window.confirm(`"${goodsName}" 상품을 삭제하시겠습니까?\n삭제된 상품은 사용자 화면에서 숨겨집니다.`))
      return;
    try {
      await axiosApi.delete(`/admin/goods/${goodsNo}`);
      alert("상품이 삭제되었습니다.");
      fetchGoods();
    } catch (e) {
      alert("삭제에 실패했습니다.");
    }
  };

  const handleFormSuccess = () => {
    setView("list");
    setEditTarget(null);
    fetchGoods();
  };

  // ── 폼 화면 ──
  if (view === "form") {
    return (
      <GoodsForm
        editTarget={editTarget}
        onSuccess={handleFormSuccess}
        onCancel={() => { setView("list"); setEditTarget(null); }}
      />
    );
  }

  // ── 목록 화면 ──
  return (
    <div className="goods-regist">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 className="regist-title" style={{ margin: 0 }}>상품 관리</h2>
        <button
          className="regist-submit-btn"
          style={{ padding: "10px 24px", fontSize: "14px" }}
          onClick={() => { setEditTarget(null); setView("form"); }}
        >
          <i className="fa-solid fa-plus" style={{ marginRight: "6px" }}></i>
          상품 등록
        </button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>
          상품 목록을 불러오는 중...
        </div>
      ) : goodsList.length === 0 ? (
        <div className="orders-empty">
          <i className="fa-solid fa-box-open"></i>
          <p>등록된 상품이 없습니다.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {goodsList.map((goods) => (
            <div
              key={goods.goodsNo}
              style={{
                display: "flex", alignItems: "center", gap: "16px",
                border: "1px solid #e5e7eb", borderRadius: "12px",
                background: goods.goodsDelFl === "Y" ? "#f9fafb" : "#fff",
                padding: "16px 20px",
                opacity: goods.goodsDelFl === "Y" ? 0.6 : 1,
              }}
            >
              {/* 썸네일 */}
              <div style={{
                width: "72px", height: "72px", borderRadius: "8px",
                overflow: "hidden", flexShrink: 0, border: "1px solid #f3f4f6",
                background: "#f9fafb",
              }}>
                {goods.goodsThumbnail ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${goods.goodsThumbnail}`}
                    alt={goods.goodsName}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="fa-regular fa-image" style={{ color: "#d1d5db", fontSize: "20px" }}></i>
                  </div>
                )}
              </div>

              {/* 상품 정보 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <p style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: "#111827" }}>
                    {goods.goodsName}
                  </p>
                  {goods.goodsDelFl === "Y" && (
                    <span style={{
                      fontSize: "11px", fontWeight: 700, padding: "2px 8px",
                      borderRadius: "999px", background: "#fee2e2", color: "#991b1b",
                    }}>
                      삭제됨
                    </span>
                  )}
                </div>
                <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 4px" }}>
                  {SORT_LABEL[goods.goodsSort] || goods.goodsSort}
                  {" · "}
                  {CATEGORY_LABEL[goods.goodsCategory] || goods.goodsCategory}
                  {" · "}
                  {Number(goods.goodsPrice).toLocaleString()}원
                </p>
                {goods.goodsSeller && (
                  <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
                    판매자: {goods.goodsSeller}
                  </p>
                )}
              </div>

              {/* 버튼 */}
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <button
                  className="detail-btn"
                  disabled={goods.goodsDelFl === "Y"}
                  onClick={() => { setEditTarget(goods); setView("form"); }}
                  style={{ opacity: goods.goodsDelFl === "Y" ? 0.4 : 1 }}
                >
                  수정
                </button>
                {goods.goodsDelFl !== "Y" && (
                  <button
                    style={{
                      padding: "8px 20px", border: "1px solid #fca5a5",
                      borderRadius: "8px", background: "#fff", fontSize: "13px",
                      fontWeight: 700, color: "#ef4444", cursor: "pointer",
                    }}
                    onClick={() => handleDelete(goods.goodsNo, goods.goodsName)}
                  >
                    삭제
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoodsManage;
