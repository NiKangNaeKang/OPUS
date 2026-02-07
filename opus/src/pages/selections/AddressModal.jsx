import { useEffect, useState } from "react";
import "../../css/AddressModal.css";

const AddressModal = ({
  isOpen,
  onClose,
  onApply,
  addresses = [],
  selectedAddressId,
  setSelectedAddressId
}) => {

  const [mode, setMode] = useState("SELECT"); // SELECT | MANAGE | FORM
  const [editingAddress, setEditingAddress] = useState(null);
  const [onTextarea, setOnTextarea] = useState(false);

  const [form, setForm] = useState({
    recipient: "",
    phone: "",
    zipcode: "",
    addr1: "",
    addr2: "",
    memo: ""
  });

  /* 모달 열릴 때 초기화 */
  useEffect(() => {
    if (!isOpen) return;
    
    const defaultAddr = addresses.find(a => a.isDefault);
    if (defaultAddr) {
      setSelectedAddressId(defaultAddr.id);
    }
    
    setMode("SELECT");
    setEditingAddress(null);

  }, [isOpen]);

  /* FORM 진입 시 값 세팅 */
  useEffect(() => {
    if (mode !== "FORM") return;

    if (editingAddress) {
      setForm({
        recipient: editingAddress.recipient ?? "",
        phone: editingAddress.phone ?? "",
        zipcode: editingAddress.zipcode ?? "",
        addr1: editingAddress.addr1 ?? "",
        addr2: editingAddress.addr2 ?? "",
        memo: editingAddress.memo ?? ""
      });
    } else {
      setForm({
        recipient: "",
        phone: "",
        zipcode: "",
        addr1: "",
        addr2: "",
        memo: ""
      });
    }
  }, [mode, editingAddress]);

  const handleMemo = (e) => {
    setForm({ ...form, memo: e.target.value })

    if (e.target.value === "직접 입력") {
      setOnTextarea(true);
    } else {
      setOnTextarea(false);
    }

  }

  if (!isOpen) return null;

  return (
    <div className="checkout_modal-overlay">
      <div className="checkout_modal" role="dialog" aria-modal="true">

        {/* Header */}
        <div className="checkout_modal__header">
          <h3 className="checkout_modal__title">저장된 배송지</h3>
          <button type="button" className="checkout_modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Tools */}
        <div className="checkout_modal__tools">
          {mode === "SELECT" && (
            <>
              <input
                className="checkout_input checkout_modal__search"
                placeholder="배송지명/주소 검색"
              />
              <button
                type="button"
                className="addr--btn addr-btn--outline addr-btn--sm"
                onClick={() => setMode("MANAGE")}
              >
                배송지 관리
              </button>
            </>
          )}

          {mode === "MANAGE" && (
            <div className="checkout_modal__tools-right">
              <button
                type="button"
                className="addr-btn addr-btn--outline addr-btn--sm"
                onClick={() => {
                  setEditingAddress(null);
                  setMode("FORM");
                }}
              >
                배송지 추가
              </button>
              <button
                type="button"
                className="addr-btn addr-btn--outline addr-btn--sm"
                onClick={() => setMode("SELECT")}
              >
                취소
              </button>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="checkout_modal__body">

          {/* 주소 리스트 */}
          {(mode === "SELECT" || mode === "MANAGE") && (
            <div className="checkout_addr-list">
              {addresses.map((addr) =>
                mode === "SELECT" ? (
                  <label
                    key={addr.id}
                    className="checkout__addr-item"
                    data-selectable="true"
                  >
                    {/* SELECT일 때만 radio */}
                    <input
                      className="checkout__addr-radio"
                      type="radio"
                      name="savedAddr"
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                    />

                    <div className="checkout__addr-item__box">
                      <div className="checkout_addr-item__top" />

                      <p className="checkout_addr-item__who">
                        {addr.recipient} · {addr.phone}
                      </p>
                      <p className="checkout_addr-item__addr">{addr.address}</p>

                      {addr.isDefault && (
                        <span className="checkout_addr-badge">기본 배송지</span>
                      )}
                    </div>
                  </label>
                ) : (
                  <div
                    key={addr.id}
                    className="checkout__addr-item"
                    data-selectable="false"
                  >
                    <div className="checkout__addr-item__box">
                      <div className="checkout_addr-item__top" />

                      <p className="checkout_addr-item__who">
                        {addr.recipient} · {addr.phone}
                      </p>
                      <p className="checkout_addr-item__addr">{addr.address}</p>

                      {/* MANAGE일 때만 버튼 */}
                      <div className="checkout_addr-actions">
                        {!addr.isDefault && (
                          <button
                            type="button"
                            className="addr-btn addr-btn--outline addr-btn--sm"
                            id="default-btn"
                            onClick={() => handleSetDefault(addr.id)}
                          >
                            기본 배송지로 설정
                          </button>
                        )}

                        <button
                          type="button"
                          className="addr-btn addr-btn--outline addr-btn--sm"
                          onClick={() => {
                            setEditingAddress(addr);
                            setMode("FORM");
                          }}
                        >
                          수정
                        </button>

                        <button
                          type="button"
                          className="checkout_btn checkout_btn--danger addr-btn--sm"
                          onClick={() => handleDelete(addr.id)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}


          {/* FORM (단 하나) */}
          {mode === "FORM" && (
            <div className="checkout_modal__form">
              <form className="checkout_form" onSubmit={(e) => e.preventDefault()}>
                <div className="checkout_grid">
                  <div className="checkout_field">
                    <label className="checkout_label">수령인</label>
                    <input
                      className="checkout__input"
                      type="text"
                      placeholder="이름"
                      value={form.recipient}
                      onChange={(e) => setForm({ ...form, recipient: e.target.value })}
                    />
                  </div>

                  <div className="checkout_field">
                    <label className="checkout_label">연락처</label>
                    <input
                      className="checkout__input"
                      type="tel"
                      placeholder="010-0000-0000"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="checkout__grid">
                  <div className="checkout__field checkout_field--wide">
                    <label className="checkout__label">주소</label>
                    <div className="checkout_addr-row">
                      <input
                        className="checkout__input"
                        type="text"
                        placeholder="우편번호"
                        value={form.zipcode}
                        onChange={(e) => setForm({ ...form, zipcode: e.target.value })}
                      />
                      <button
                        className="addr-btn addr-btn--outline addr-btn--sm"
                        type="button"
                        onClick={() => {
                          // TODO: 주소 검색 로직 연결
                        }}
                      >
                        주소 검색
                      </button>
                    </div>
                  </div>

                  <div className="checkout__field checkout_field--wide">
                    <input
                      className="checkout__input"
                      type="text"
                      placeholder="기본 주소"
                      value={form.addr1}
                      onChange={(e) => setForm({ ...form, addr1: e.target.value })}
                    />
                  </div>

                  <div className="checkout__field checkout_field--wide">
                    <input
                      className="checkout__input"
                      type="text"
                      placeholder="상세 주소"
                      value={form.addr2}
                      onChange={(e) => setForm({ ...form, addr2: e.target.value })}
                    />
                  </div>
                </div>

                <div className="checkout__field">
                  <label className="checkout__label">배송 메모</label>
                  <select
                    className="checkout__select"
                    value={form.memo}
                    onChange={(e) => handleMemo(e)}
                  >
                    <option value="">선택 안 함</option>
                    <option value="문 앞에 놓아주세요">문 앞에 놓아주세요</option>
                    <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
                    <option value="배송 전 연락 부탁드려요">배송 전 연락 부탁드려요</option>
                    <option value="직접 입력">직접 입력</option>
                  </select>
                  {onTextarea &&
                    <textarea className="checkout__textarea" placeholder="직접 입력(선택)" rows="3"></textarea>
                  }
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="checkout_modal__footer">
          {mode === "SELECT" && (
            <>
              <button type="button" className="addr-btn addr-btn--outline" onClick={onClose}>
                취소
              </button>
              <button
                type="button"
                className="addr-btn addr-btn--solid"
                onClick={() => onApply(selectedAddressId)}
              >
                선택한 배송지 적용
              </button>
            </>
          )}

          {mode === "FORM" && (
            <>
              <button
                type="button"
                className="addr-btn addr-btn--outline"
                onClick={() => {
                  setEditingAddress(null);
                  setMode("MANAGE")
                }}
              >
                취소
              </button>
              <button
                type="button"
                className="addr-btn addr-btn--solid"
                onClick={() => handleSave(form)}
              >
                저장
              </button>
            </>
          )}
        </div>

      </div >
    </div >
  );
};

export default AddressModal;
