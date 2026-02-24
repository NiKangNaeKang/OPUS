import { useState } from "react";
import { adminApi } from "../../api/adminAPI";
import "../../css/GoodsRegist.css";

const EMPTY_OPTION = { goodsSize: "", goodsColor: "", stock: 0 };

const GoodsRegist = () => {

  const [form, setForm] = useState({
    goodsName: "",
    goodsSort: "exhibition",
    goodsCategory: "poster",
    goodsPrice: "",
    deliveryCost: "3000",
    goodsSeller: "",
    goodsInfo: ""
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [detailImgs, setDetailImgs] = useState([]);
  const [detailPreviews, setDetailPreviews] = useState([]);

  const [options, setOptions] = useState([{ ...EMPTY_OPTION }]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleDetailImgs = (e) => {
    const files = Array.from(e.target.files);
    setDetailImgs(prev => [...prev, ...files]);
    setDetailPreviews(prev => [
      ...prev,
      ...files.map(f => URL.createObjectURL(f))
    ]);
  };

  const removeDetailImg = (idx) => {
    setDetailImgs(prev => prev.filter((_, i) => i !== idx));
    setDetailPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleOptionChange = (idx, field, value) => {
    setOptions(prev => prev.map((opt, i) =>
      i === idx ? { ...opt, [field]: value } : opt
    ));
  };

  const addOptionRow = () => {
    setOptions(prev => [...prev, { ...EMPTY_OPTION }]);
  };

  const removeOptionRow = (idx) => {
    setOptions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!form.goodsName || !thumbnail) {
      alert("상품명과 썸네일은 필수입니다.");
      return;
    }

    const formData = new FormData();

    Object.entries(form).forEach(([key, val]) => formData.append(key, val));

    formData.append("thumbnail", thumbnail);
    detailImgs.forEach(img => formData.append("detailImgs", img));

    formData.append("optionsJson", JSON.stringify(options));

    try {
      await adminApi.registGoods(formData);
      alert("상품이 등록되었습니다.");
      
      // 초기화
      setForm({
        goodsName: "", goodsSort: "exhibition", goodsCategory: "poster",
        goodsPrice: "", deliveryCost: "3000", goodsSeller: "", goodsInfo: ""
      });
      setThumbnail(null);
      setThumbnailPreview(null);
      setDetailImgs([]);
      setDetailPreviews([]);
      setOptions([{ ...EMPTY_OPTION }]);
    } catch (error) {
      console.error(error);
      alert("상품 등록에 실패했습니다.");
    }
  };

  return (
    <div className="goods-regist">
      <h2 className="regist-title">상품 등록</h2>

      {/* 기본 정보 */}
      <section className="regist-section">
        <h3 className="regist-section__title">기본 정보</h3>

        <div className="regist-grid">
          <div className="regist-field regist-field--wide">
            <label className="regist-label">상품명 *</label>
            <input className="regist-input" name="goodsName"
              value={form.goodsName} onChange={handleChange} 
              placeholder="상품명 입력" />
          </div>

          <div className="regist-field">
            <label className="regist-label">장르</label>
            <select className="regist-select" name="goodsSort" 
              value={form.goodsSort} onChange={handleChange}>
              <option value="exhibition">전시</option>
              <option value="musical">뮤지컬</option>
            </select>
          </div>

          <div className="regist-field">
            <label className="regist-label">카테고리</label>
            <select className="regist-select" name="goodsCategory" 
              value={form.goodsCategory} onChange={handleChange}>
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
              value={form.goodsPrice} onChange={handleChange} 
              placeholder="0" />
          </div>

          <div className="regist-field">
            <label className="regist-label">배송비 (원)</label>
            <input className="regist-input" name="deliveryCost" type="number"
              value={form.deliveryCost} onChange={handleChange} 
              placeholder="3000" />
          </div>

          <div className="regist-field">
            <label className="regist-label">판매자</label>
            <input className="regist-input" name="goodsSeller"
              value={form.goodsSeller} onChange={handleChange} 
              placeholder="판매자명" />
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
        <h3 className="regist-section__title">대표 이미지 (썸네일) *</h3>
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
                <button className="regist-preview__remove"
                  onClick={() => removeDetailImg(idx)}>
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
              <button className="regist-option-remove" 
                onClick={() => removeOptionRow(idx)}>
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
        <button className="regist-submit-btn" onClick={handleSubmit}>
          상품 등록하기
        </button>
      </div>
    </div>
  );
};

export default GoodsRegist;