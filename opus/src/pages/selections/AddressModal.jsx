import "../../css/AddressModal.css"; // CSS 분리

const AddressModal = ({ 
  isOpen, 
  onClose, 
  onApply, 
  addresses = [], 
  selectedAddressId, 
  setSelectedAddressId 
}) => {
  if (!isOpen) return null; // 열리지 않으면 렌더링하지 않음

  return (
    <div className="checkout_modal-overlay">
      <div className="checkout_modal" role="dialog" aria-modal="true" aria-labelledby="addressModalTitle">

        {/* Header */}
        <div className="checkout_modal__header">
          <h3 className="checkout_modal__title" id="addressModalTitle">저장된 배송지</h3>
          <button className="checkout_modal__close" type="button" aria-label="닫기" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Body */}
        <div className="checkout_modal__body">
          <div className="checkout_modal__tools">
            <input className="checkout_modal__search input" type="text" placeholder="배송지명/주소 검색" />
            <button className="btn btn--outline btn--sm addr--btn" type="button">배송지 관리</button>
          </div>

          <div className="checkout_addr-list">
            {addresses.map((addr) => (
              <label 
                key={addr.id} 
                className={`checkout_addr-item ${selectedAddressId === addr.id ? "checkout_addr-item--active" : ""}`}
              >
                <input 
                  type="radio" 
                  name="savedAddr" 
                  checked={selectedAddressId === addr.id}
                  onChange={() => setSelectedAddressId(addr.id)}
                />
                <div className="checkout_addr-item__box">
                  <div className="checkout_addr-item__top">
                    <div className="checkout_addr-item__badges">
                      {addr.isDefault && <span className="checkout_badge checkout_badge--dark">기본</span>}
                      {addr.isRecent && <span className="checkout_badge">최근</span>}
                    </div>
                    <span className="checkout_addr-item__name">{addr.name}</span>
                  </div>

                  <p className="checkout_addr-item__who">{addr.recipient} · {addr.phone}</p>
                  <p className="checkout_addr-item__addr">{addr.address}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="checkout_modal__footer">
          <button className="btn btn--outline" type="button" onClick={onClose}>취소</button>
          <button className="btn btn--solid" type="button" onClick={() => onApply(selectedAddressId)}>선택한 배송지 적용</button>
        </div>

      </div>
    </div>
  );
};

export default AddressModal;
