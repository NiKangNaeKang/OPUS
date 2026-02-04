import { useState, useEffect } from "react";
import "../../css/loginModal.css"; 
import axiosApi from "../../api/axiosAPI";

export default function SignupModal({ open, onClose }) {
  const [formData, setFormData] = useState({
    memberEmail: "",
    memberPw: "",
    memberPwConfirm: "",
    memberTel: "",
  });

  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setFormData({ memberEmail: "", memberPw: "", memberPwConfirm: "", memberTel: "" });
      setIsEmailChecked(false);
    }
  }, [open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "memberEmail") setIsEmailChecked(false);
  };

  const checkDuplicate = async () => {
    if (!formData.memberEmail) return alert("이메일을 입력해주세요.");
    try {
         const res = await axiosApi.get(`/auth/check-email?email=${formData.memberEmail}`);
      if (res.data === true) {
        alert("이미 사용 중인 이메일입니다.");
        setIsEmailChecked(false);
      } else {
        alert("사용 가능한 이메일입니다.");
        setIsEmailChecked(true);
      }
    } catch (err) {
      alert("중복 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmailChecked) return alert("이메일 중복 확인을 해주세요.");
    if (formData.memberPw !== formData.memberPwConfirm) return alert("비밀번호가 일치하지 않습니다.");
    
    setLoading(true);

    try {
      const cleanPhone = formData.memberTel.replace(/[^0-9]/g, "");
      
      await axiosApi.post("/auth/signup", {
        memberEmail: formData.memberEmail,
        memberPw: formData.memberPw,
        memberTel: cleanPhone,
      });

      alert("회원가입이 완료되었습니다!");
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "회원가입 실패");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="lm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="lm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="lm-header">
          <h2 className="lm-title">회원가입</h2>
          <button className="lm-close" onClick={onClose}>✕</button>
        </div>

        <form className="lm-body" onSubmit={handleSubmit}>

          <label className="lm-label">
            이메일 주소
            <div className="lm-input-group">
              <input
                className="lm-input"
                style={{ flex:1}}
                name="memberEmail"
                type="email"
                placeholder="example@gmail.com"
                value={formData.memberEmail}
                onChange={handleChange}
                required
              />
              <button type="button" onClick={checkDuplicate} className="lm-link">중복확인</button>
            </div>
          </label>

          <label className="lm-label">
            비밀번호
            <input
              className="lm-input"
              name="memberPw"
              type="password"
              placeholder="비밀번호 입력"
              value={formData.memberPw}
              onChange={handleChange}
              required
            />
          </label>

          <label className="lm-label">
            비밀번호 확인
            <input
              className="lm-input"
              name="memberPwConfirm"
              type="password"
              placeholder="비밀번호 재입력"
              value={formData.memberPwConfirm}
              onChange={handleChange}
              required
            />
          </label>

          <label className="lm-label">
            연락처
            <input
              className="lm-input"
              name="memberTel"
              type="tel"
              placeholder="010-0000-0000"
              value={formData.memberTel}
              onChange={handleChange}
              required
            />
          </label>

          <button className="lm-submit" type="submit" disabled={loading}>
            {loading ? "처리 중..." : "가입하기"}
          </button>
        </form>
      </div>
    </div>
  );
}