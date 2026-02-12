import { useState } from "react";
import axiosApi from "../../api/axiosAPI";

export const useAuthValidation = () => {
  const [isTelChecked, setIsTelChecked] = useState(false);

  /**
   * 연락처 중복 확인
   * @param {string} tel - 하이픈이 포함된 연락처 문자열
   */
  const handleCheckTel = async (tel) => {
    const rawPhone = tel.replace(/[^0-9]/g, "");

    if (rawPhone.length < 10) {
      alert("올바른 연락처 형식을 입력해주세요.");
      return false;
    }

    try {
      const res = await axiosApi.post("/auth/check-tel", {
        memberTel: rawPhone,
      });

      if (res.data === true) {
        alert("이미 등록된 연락처입니다.");
        setIsTelChecked(false);
        return false;
      } else {
        alert("사용 가능한 연락처입니다.");
        setIsTelChecked(true);
        return true;
      }
    } catch (err) {
      alert("연락처 중복 확인 중 오류가 발생했습니다.");
      return false;
    }
  };

  
  /* 비밀번호 일치 확인 */
  const checkPwMatch = (pw, confirm) => {
    return pw !== "" && pw === confirm;
  };

  return { 
    isTelChecked, 
    setIsTelChecked, 
    handleCheckTel, 
    checkPwMatch 
  };
};