import { useMemo, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../css/mypage.css";
import { useAuthStore } from "../../components/auth/useAuthStore";
import { useAuthValidation } from "../../components/auth/useAuthValidation";
import { toast } from "react-toastify";
import { showConfirm } from "../../components/toast/ToastUtils"; 
import axiosApi from "../../api/axiosAPI";
import { wishlist, reviews, purchases, auctions } from "./myPageData";

export default function MyPage() {
  const navigate = useNavigate();
  const { member, token, login, logout } = useAuthStore();
  const { isTelChecked, setIsTelChecked, handleCheckTel } = useAuthValidation();

  // 구글 로그인 타입 확인
  const isSocialUser = member?.loginType?.toLowerCase() === "google";

  const [activeId, setActiveId] = useState("profile-edit");
  const [newPhone, setNewPhone] = useState("");
  const [pwData, setPwData] = useState({
    currentPw: "",
    newPw: "",
    newPwConfirm: "",
  });

  // 사이드바 그룹 구성 (isSocialUser일 때 비밀번호 변경 메뉴 제외)
  const SIDEBAR_GROUPS = [
    {
      title: "내 정보",
      items: [
        { id: "profile-edit", icon: "fa-regular fa-user", label: "연락처 변경" },
        ...(!isSocialUser ? [{ id: "password-change", icon: "fa-solid fa-lock", label: "비밀번호 변경" }] : []),
        { id: "withdrawal", icon: "fa-solid fa-user-slash", label: "회원 탈퇴" },
      ],
    },
    {
      title: "활동 내역",
      items: [
        { id: "wishlist", icon: "fa-regular fa-heart", label: "찜한 리스트" },
        { id: "reviews", icon: "fa-regular fa-comment", label: "작성 후기" },
        { id: "orders", icon: "fa-solid fa-receipt", label: "주문 내역" },
        { id: "auction-history", icon: "fa-solid fa-gavel", label: "경매 내역" },
      ],
    },
  ];

  const formatPhoneNumber = (value) => {
    if (!value) return "";
    const num = value.replace(/[^0-9]/g, "");
    if (num.length <= 3) return num;
    if (num.length <= 7) return `${num.slice(0, 3)}-${num.slice(3)}`;
    return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7, 11)}`;
  };

  useEffect(() => {
    setIsTelChecked(false);
  }, []); // 마이페이지 진입 시(마운트 시) 단 한 번 초기화, 빈 배열이 의도 명확


  const handleNewPhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setNewPhone(formatted);
    setIsTelChecked(false); 
  };

  const handleUpdatePhone = async (e) => {
    if (e) e.preventDefault();
    const rawPhone = newPhone.replace(/[^0-9]/g, "");

    if (!rawPhone) return toast.error("연락처를 입력해주세요.");
    if (!isTelChecked) return toast.error("연락처 중복 확인을 해주세요.");
    if (rawPhone === member?.memberTel) return toast.error("기존 연락처와 동일한 번호입니다.");

    try {
      const res = await axiosApi.post("/auth/updateTel", {
        memberNo: member.memberNo,
        memberTel: rawPhone,
      });
      if (res.status === 200) {
        toast.success("연락처가 변경되었습니다.");
        login({ token, member: { ...member, memberTel: rawPhone } });
        setNewPhone("");
        setIsTelChecked(false);
      }
    } catch (err) {
      toast.error(err?.response?.data || "연락처 변경에 실패했습니다.");
    }
  };


  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!pwData.currentPw) return toast.error("현재 비밀번호를 입력해주세요.");
    
    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
    if (!pwRegex.test(pwData.newPw)) return toast.error(<>비밀번호 형식(8~16자 영문/숫자)을<br />확인해주세요.</>);
    
    try {
      const res = await axiosApi.post("/auth/changePw", {
        memberNo: member.memberNo,
        currentPw: pwData.currentPw,
        newPw: pwData.newPw,
      });
      if (res.status === 200) {

              toast.success(<>비밀번호가 변경되었습니다.<br />다시 로그인 해주세요.</>,{ icon: false });
        setTimeout(() => {
          logout();
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      toast.error(err.response?.data || "비밀번호 변경에 실패했습니다.");
    }
  };


const processWithdrawal = async () => {
try {
    /* ********************** [실제 서버 통신용 - 나중에 주석 해제]
  const res = await axiosApi.post(`/auth/withdraw/${member.memberNo}`);
      if (res.status === 200) {
        toast.success("탈퇴 처리가 완료되었습니다.");
        setTimeout(() => {
          logout();
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "탈퇴 처리 중 오류가 발생했습니다.");
    }
  };

  const handleWithdrawalClick = async () => {
    try {
      const checkRes = await axiosApi.get(`/auth/withdraw-check/${member.memberNo}`);
      const activeCount = checkRes.data.activeCount;

      if (activeCount > 0) {
        toast.error(<>진행 중인 경매나 주문이 ({activeCount}건) 있어<br />탈퇴가 불가능합니다.<br />관리자에게 문의해주세요.</>);
        return;
      }

      await processWithdrawal();

    } catch (err) {
      toast.error("상태 확인 중 오류가 발생했습니다.");
    }
  };
    **************************** */

    // [임시 목업 테스트용] -------------------------------------
    console.log("서버 탈퇴 API 호출 시뮬레이션 (회원번호:", member?.memberNo, ")");
    toast.success("탈퇴 처리가 완료되었습니다. (테스트)");
    
    setTimeout(() => {
      logout();
      navigate("/");
    }, 1500);

  } catch (err) {
    toast.error(err.response?.data || "탈퇴 처리 중 오류가 발생했습니다.");
  }
};

const handleWithdrawalClick = async () => {
  try {
    const mockActiveCount = 5;  // 테스트용, 0일시 탈퇴, 1 이상 탈퇴불가
    if (mockActiveCount > 0) {
      toast.error(<>진행 중인 경매나 주문이 ({mockActiveCount}건) 있어<br />탈퇴가 불가능합니다.<br />관리자에게 문의해주세요.</>);
      return;
    }
    // --------------------------------------------- 여기까지 삭제


    showConfirm(
      "정말 탈퇴하시겠습니까?",
      "탈퇴 시 모든 데이터는 복구가 불가능하며\n즉시 로그아웃됩니다.",
      processWithdrawal,
      "확인"
    );

  } catch (err) {
    toast.error("탈퇴 가능 여부 확인 중 오류가 발생했습니다.");
  }
};

  const handleSideNavClick = (e, id) => {
    if (id === "withdrawal") {
      e.preventDefault();
      handleWithdrawalClick();
    } else {
      setActiveId(id);
    }
  };

  /* 찜 리스트 */
  const [wishItems, setWishItems] = useState(wishlist.items);
  const [wishTab, setWishTab] = useState("all");

  const wishCounts = useMemo(() => ({
    all: wishItems.length,
    musical: wishItems.filter((i) => i.type === "뮤지컬").length,
    exhibit: wishItems.filter((i) => i.type === "전시").length,
  }), [wishItems]);

  const filteredWish = useMemo(() => {
    if (wishTab === "all") return wishItems;
    return wishItems.filter((i) => i.type === (wishTab === "musical" ? "뮤지컬" : "전시"));
  }, [wishTab, wishItems]);

  const toggleWish = (id) => {
    setWishItems((prev) => prev.map((i) => (i.id === id ? { ...i, liked: !i.liked } : i)));
  };

  return (
    <div className="mypage">
      <aside className="sidebar">
        <div className="sidebar__inner">
          <nav className="sidebar__nav">
            {SIDEBAR_GROUPS.map((group) => (
              <div className="nav-group" key={group.title}>
                <p className="nav-group__title">{group.title}</p>
                <ul className="nav-list">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <NavLink
                        to={`/myPage/${item.id}`}
                        className={`nav-link ${activeId === item.id ? "is-active" : ""}`}
                        onClick={(e) => handleSideNavClick(e, item.id)}
                      >
                        <i className={item.icon} />
                        <span>{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      <main className="main">
        <div className="main__inner">
          <section id="profile-edit" className="card">
            <header className="card__head"><h2 className="card__title">연락처 변경</h2></header>
            <div className="card__body">
              <div className="form">
                <div className="field">
                  <label className="label">이메일 {isSocialUser && <span style={{fontSize: '12px', color: '#4285F4', marginLeft: '8px'}}>(Google 계정으로 사용 중 입니다.)</span>}</label>
                  <input className="input input--disabled" value={member?.memberEmail || "정보 없음"} disabled readOnly />
                </div>
                <div className="field">
                  <label className="label">기존 연락처</label>
                  <input className="input input--disabled" value={formatPhoneNumber(member?.memberTel) || "등록된 번호 없음"} disabled readOnly />
                </div>
                <div className="field">
                  <label className="label">새 연락처</label>
                  <div className="tel-group">
                    <input className="input tel-input" type="text" inputMode="numeric" value={newPhone} onChange={handleNewPhoneChange} maxLength={13} />
                    <button type="button" className={`btn btn--check ${isTelChecked ? "is-checked" : ""}`} onClick={() => handleCheckTel(newPhone.replace(/[^0-9]/g, ""))} disabled={isTelChecked}>{isTelChecked ? "확인됨" : "중복 확인"}</button>
                    <button type="button" className="btn btn--primary btn--save" onClick={handleUpdatePhone}>연락처 변경</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {!isSocialUser && (
            <section id="password-change" className="card">
              <header className="card__head"><h2 className="card__title">비밀번호 변경</h2></header>
              <div className="card__body">
                <form className="form form--narrow" onSubmit={handlePasswordChange}>
                  <div className="field">
                    <label className="label">현재 비밀번호</label>
                    <input className="input" type="password" value={pwData.currentPw} onChange={(e) => setPwData({ ...pwData, currentPw: e.target.value })} required />
                  </div>
                  <div className="field">
                    <label className="label">새 비밀번호</label>
                    <input className="input" type="password" placeholder="영문, 숫자 포함 8~16자" value={pwData.newPw} onChange={(e) => setPwData({ ...pwData, newPw: e.target.value })} required />
                  </div>
                  <div className="field">
                    <label className="label">새 비밀번호 확인</label>
                    <input className="input" type="password" value={pwData.newPwConfirm} onChange={(e) => setPwData({ ...pwData, newPwConfirm: e.target.value })} required />
                    {pwData.newPwConfirm.length > 0 && (
                      <p className={`pw-msg ${pwData.newPw === pwData.newPwConfirm ? "is-match" : "is-error"}`}>
                        {pwData.newPw === pwData.newPwConfirm ? "새 비밀번호가 일치합니다." : "새 비밀번호가 일치하지 않습니다."}
                      </p>
                    )}
                  </div>
                  <div className="form__actions">
                    <button className="btn btn--primary" type="submit" disabled={!pwData.newPw || pwData.newPw !== pwData.newPwConfirm}>비밀번호 변경</button>
                  </div>
                </form>
              </div>
            </section>
          )}

          <section id="wishlist" className="card">
            <header className="card__head"><h2 className="card__title">찜한 리스트</h2></header>
            <div className="card__body">
              <div className="chips">
                <button type="button" className={`chip ${wishTab === "all" ? "is-active" : ""}`} onClick={() => setWishTab("all")}>전체 <span className="chip__count">{wishCounts.all}</span></button>
                <button type="button" className={`chip ${wishTab === "musical" ? "is-active" : ""}`} onClick={() => setWishTab("musical")}>뮤지컬 <span className="chip__count">{wishCounts.musical}</span></button>
                <button type="button" className={`chip ${wishTab === "exhibit" ? "is-active" : ""}`} onClick={() => setWishTab("exhibit")}>전시 <span className="chip__count">{wishCounts.exhibit}</span></button>
              </div>
              <div className="grid3">
                {filteredWish.map((w) => (
                  <article className="wish" key={w.id}>
                    <div className="wish__thumb">
                      <img src={w.img} alt={w.alt} />
                      <button type="button" className="wish__heart" onClick={() => toggleWish(w.id)}>
                        <i className={w.liked ? "fa-solid fa-heart" : "fa-regular fa-heart"} />
                      </button>
                    </div>
                    <div className="wish__meta">
                      <p className="wish__tag">{w.type}</p>
                      <h3 className="wish__title">{w.title}</h3>
                      <p className="wish__place">{w.place}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="reviews" className="card">
            <header className="card__head"><h2 className="card__title">작성 후기</h2></header>
            <div className="review-list">
              {reviews.map((r) => (
                <article className="review" key={r.id}>
                  <div className="review__thumb"><img src={r.img} alt={r.alt} /></div>
                  <div className="review__body">
                    <div className="review__top"><h3>{r.title}</h3><span>{r.date}</span></div>
                    <p className="review__text">{r.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="purchase-history" className="card">
            <header className="card__head"><h2 className="card__title">구매 내역</h2></header>
            <div className="order-list">
              {purchases.map((o) => (
                <article className="order" key={o.id}>
                  <div className="order__top"><div><p>{o.orderNo}</p></div><span className={`badge ${o.statusClass}`}>{o.statusLabel}</span></div>
                  <div className="order__body">
                    <div className="order__thumb"><img src={o.img} alt={o.alt} /></div>
                    <div className="order__info"><h3>{o.title}</h3><p className="order__price">{o.price}</p></div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="auction-history" className="card">
            <header className="card__head"><h2 className="card__title">경매 내역</h2></header>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>작품명</th><th>입찰가</th><th>상태</th><th>일시</th></tr></thead>
                <tbody>
                  {auctions.map((a) => (
                    <tr key={a.id}>
                      <td><div className="artcell"><div className="artcell__thumb"><img src={a.img} alt={a.alt} /></div><span>{a.workTitle}</span></div></td>
                      <td className="td-strong">{a.bid}</td>
                      <td><span className={`badge ${a.statusClass}`}>{a.statusLabel}</span></td>
                      <td className="td-date">{a.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}