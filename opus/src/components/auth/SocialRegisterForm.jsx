// src/components/auth/SocialRegisterForm.jsx
export default function SocialRegisterForm({
  email,
  phoneNumber,
  setPhoneNumber,
  isTelChecked,
  telMsg,
  onCheckTel,
  handlePhoneChange, // useAuthValidation에서 가져온 함수 추가
}) {
  return (
    <>
      <p style={{ fontSize: "15px", marginBottom: "15px", color: "#666", lineHeight: "1.5" }}>
        <strong>{email}</strong>
        <br />
        해당 사이트 이용을 위해 연락처 추가가 필요합니다.
      </p>

      <label className="lm-label">연락처</label>

      <div style={{ display: "flex", gap: "5px", marginBottom: "5px" }}>
        <input
          className="lm-input"
          type="tel"
          placeholder="010-1234-5678" // 하이픈 포함 형식으로 변경
          maxLength="13" // 하이픈 포함 최대 13자까지만 입력 가능하도록 제한
          value={phoneNumber}
          onChange={(e) => handlePhoneChange(e.target.value, setPhoneNumber)}
          style={{ flex: 1, marginBottom: 0 }}
        />

        <button
          type="button"
          onClick={onCheckTel}
          style={{
            width: "80px",
            padding: "0 10px",
            fontSize: "12px",
            backgroundColor: "#333",
            color: "#fff",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          중복확인
        </button>
      </div>

      {telMsg && (
        <p style={{ 
          fontSize: "12px", 
          color: isTelChecked ? "blue" : "red", 
          marginBottom: "15px",
          marginTop: "2px" 
        }}>
          {telMsg}
        </p>
      )}
    </>
  );
}