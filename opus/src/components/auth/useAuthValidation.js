import { useState } from "react";
import axiosApi from "../../api/axiosAPI";
import { toast } from "react-toastify";

export const useAuthValidation = () => {
  const [isTelChecked, setIsTelChecked] = useState(false);

  // 1. [신규] 입력 시 하이픈 자동 추가 로직
  const handlePhoneChange = (value, setPhoneNumber) => {
    // 숫자 이외 제거
    const rawValue = value.replace(/[^0-9]/g, "");
    let formattedValue = "";

    // 길이에 따른 하이픈 위치 세팅
    if (rawValue.length <= 3) {
      formattedValue = rawValue;
    } else if (rawValue.length <= 7) {
      formattedValue = `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`;
    } else {
      formattedValue = `${rawValue.slice(0, 3)}-${rawValue.slice(3, 7)}-${rawValue.slice(7, 11)}`;
    }

    setPhoneNumber(formattedValue);
    setIsTelChecked(false); // 번호 수정 시 중복확인 다시 하도록 초기화
  };

  // 2. 기존 중복 확인 로직 (rawPhone 추출은 그대로 유지)
  const handleCheckTel = async (tel) => {
    const rawPhone = tel.replace(/[^0-9]/g, "");

    if (!rawPhone) {
      toast.error("연락처를 입력해주세요.");
      return false;
    }

    if (rawPhone.length < 10) {
      toast.error("올바른 연락처를 입력해주세요.");
      return false;
    }

    try {
      const res = await axiosApi.post("/auth/check-tel", {
        memberTel: rawPhone,
      });

      if (res.data === true) {
        toast.error("이미 등록된 연락처입니다.");
        setIsTelChecked(false);
        return false;
      } else {
        toast.success("사용 가능한 연락처입니다.");
        setIsTelChecked(true);
        return true;
      }
    } catch (err) {
      const errorMsg = err.response?.data || "연락처 중복 확인 중 오류가 발생했습니다.";
      toast.error(errorMsg);
      setIsTelChecked(false);
      return false;
    }
  };

  const checkPwMatch = (pw, confirm) => {
    return pw !== "" && pw === confirm;
  };

  return { 
    isTelChecked, 
    setIsTelChecked, 
    handleCheckTel, 
    handlePhoneChange, // 리턴에 추가!
    checkPwMatch 
  };
};