import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastConfig() {
  return (
    <ToastContainer 
      position="top-right"   // 헤더 아래 우측 위치
      autoClose={2000}        // 2초 후 자동 종료
      hideProgressBar={true}  // 하단 진행 바 제거
      theme="light" 
      limit={1}               // 한 번에 1개만 표시
      closeOnClick            // 클릭 시 닫기
      pauseOnHover            // 마우스 올리면 시간정지되며 토스트고정
      style={{ zIndex: 99999 }} // 쌓임 맥락(Stacking Context)에서 맨 앞으로 강제순서부여
    />
  );
}

/* 해당 파일에 css 임포트돼있고, App.jsx에 임포트돼있음
  다른 컴포넌트 사용시 아래처럼 사용하면 됨
  import { toast } from "react-toastify";,
  toast.success("환영합니다!"", { icon: false });
*/