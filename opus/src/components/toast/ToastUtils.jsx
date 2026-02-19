import { toast } from "react-toastify";

// 1. 토스트 내부에 들어갈 커스텀 UI (ConfirmContent)
const ConfirmContent = ({ closeToast, title, message, onConfirm, confirmText }) => (
  <div style={{ padding: "4px" }}>
    <p style={{ 
      fontWeight: "500", 
      fontSize: "16px", 
      marginBottom: "16px", 
      color: "#111",
      whiteSpace: "pre-wrap", 
      lineHeight: "1.5"
    }}>
      {title}
    </p>
    {message && (
      <p style={{ fontSize: "14px", color: "#666", marginBottom: "16px", whiteSpace: "pre-wrap" }}>
        {message}
      </p>
    )}
    <div style={{ display: "flex", gap: "8px" }}>
      <button onClick={closeToast} style={{ flex: 1, padding: "10px", cursor: "pointer",
        background: "#eee", border: "none", borderRadius: "6px", fontWeight: "600" }}>
        취소
      </button>
      <button onClick={() => { onConfirm(); closeToast(); }} style={{ flex: 1, padding: "10px", cursor: "pointer",
        background: "#000", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "600" }}>
        {confirmText}
      </button>
    </div>
  </div>
);

// 2. 외부에서 불러다 쓸 함수 (showConfirm)
export const showConfirm = (title, message, onConfirm, confirmText = "확인") => {
  toast(
    <ConfirmContent 
      title={title} 
      message={message} 
      onConfirm={onConfirm} 
      confirmText={confirmText} 
    />, 
    {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
      style: { width: "400px" },
      toastId: "confirm-toast" 
    }
  );
};