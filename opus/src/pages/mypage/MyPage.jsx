import { useMemo, useState, useEffect } from "react";
import "../../css/mypage.css";
import { useAuthStore } from "../../components/auth/useAuthStore";
import { toast } from "react-toastify";
import axiosApi from "../../api/axiosAPI";

// 데이터 리스트 가져오기
import {
  wishlist,
  reviews,
  purchases,
  auctions,
} from "./myPageData";

const SIDEBAR_GROUPS = [
  {
    title: "내 정보",
    items: [
      { id: "profile-edit", icon: "fa-regular fa-user", label: "정보 수정" },
      { id: "password-change", icon: "fa-solid fa-lock", label: "비밀번호 변경" },
    ],
  },
  {
    title: "활동 내역",
    items: [
      { id: "wishlist", icon: "fa-regular fa-heart", label: "찜한 리스트" },
      { id: "reviews", icon: "fa-regular fa-comment", label: "작성 후기" },
      { id: "purchase-history", icon: "fa-solid fa-receipt", label: "구매 내역" },
      { id: "auction-history", icon: "fa-solid fa-gavel", label: "경매 내역" },
    ],
  },
];

export default function MyPage() {
  const member = useAuthStore((state) => state.member);
  const setMember = useAuthStore((state) => state.login);
  const token = useAuthStore((state) => state.token);

  const [activeId, setActiveId] = useState("profile-edit");
  const [phone, setPhone] = useState("");

  // 하이픈 자동 포맷팅 함수
  const formatPhoneNumber = (value) => {
    if (!value) return "";
    const num = value.replace(/[^0-9]/g, ""); // 숫자만 추출
    if (num.length <= 3) return num;
    if (num.length <= 7) return `${num.slice(0, 3)}-${num.slice(3)}`;
    return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7, 11)}`;
  };

  // 초기 데이터 로드 시 하이픈 적용
  useEffect(() => {
    if (member?.memberTel) {
      setPhone(formatPhoneNumber(member.memberTel));
    }
  }, [member]);

  // 연락처 입력 시 실시간 하이픈 추가
  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();

    // 저장 시에는 하이픈 제거 (DB 포맷: 숫자만)
    const rawPhone = phone.replace(/[^0-9]/g, "");

    if (rawPhone.length < 10) {
      toast.error("올바른 연락처 형식이 아닙니다.");
      return;
    }

    try {
      const res = await axiosApi.post("/member/updateTel", {
        memberNo: member.memberNo,
        memberTel: rawPhone,
      });

      if (res.status === 200) {
        toast.success("연락처가 수정되었습니다.");
        
        setMember({ 
          token, 
          member: { ...member, memberTel: rawPhone } 
        });
      }
    } catch (err) {
      console.error("수정 실패:", err);
      toast.error(err.response?.data || "연락처 수정에 실패했습니다.");
    }
  };

  const [wishItems, setWishItems] = useState(wishlist.items);
  const [wishTab, setWishTab] = useState("all");

  const wishCounts = useMemo(() => {
    const all = wishItems.length;
    const musical = wishItems.filter((i) => i.type === "뮤지컬").length;
    const exhibit = wishItems.filter((i) => i.type === "전시").length;
    return { all, musical, exhibit };
  }, [wishItems]);

  const filteredWish = useMemo(() => {
    if (wishTab === "all") return wishItems;
    return wishItems.filter((i) => i.type === (wishTab === "musical" ? "뮤지컬" : "전시"));
  }, [wishTab, wishItems]);

  const toggleWish = (id) => {
    setWishItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, liked: !i.liked } : i))
    );
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
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
                      <a
                        href={`#${item.id}`}
                        className={`nav-link ${activeId === item.id ? "is-active" : ""}`}
                        onClick={() => setActiveId(item.id)}
                      >
                        <i className={item.icon} />
                        <span>{item.label}</span>
                      </a>
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
            <header className="card__head">
              <h2 className="card__title">내 정보 수정</h2>
            </header>
            <div className="card__body">
              <form className="form" onSubmit={handleProfileSave}>
                <div className="field">
                  <label className="label">이메일</label>
                  <input
                    className="input input--disabled"
                    value={member?.memberEmail || "정보 없음"}
                    disabled
                    readOnly
                  />
                </div>
                <div className="field">
                  <label className="label">연락처</label>
                  <input
                    className="input"
                    type="text"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="010-0000-0000"
                    maxLength={13} // 하이픈 포함 최대 길이
                  />
                </div>
                <div className="form__actions">
                  <button className="btn btn--primary" type="submit">저장하기</button>
                </div>
              </form>
            </div>
          </section>

          <section id="password-change" className="card">
            <header className="card__head">
              <h2 className="card__title">비밀번호 변경</h2>
            </header>
            <div className="card__body">
              <form className="form form--narrow" onSubmit={handlePasswordChange}>
                <div className="field"><label className="label">현재 비밀번호</label><input className="input" type="password" /></div>
                <div className="field"><label className="label">새 비밀번호</label><input className="input" type="password" /></div>
                <div className="field"><label className="label">새 비밀번호 확인</label><input className="input" type="password" /></div>
                <div className="form__actions"><button className="btn btn--primary">비밀번호 변경</button></div>
              </form>
            </div>
          </section>

              <h2>데이터 적용 중,,</h2>
          <section id="wishlist" className="card">
            <header className="card__head"><h2 className="card__title">찜한 리스트</h2></header>
            <div className="card__body">
              <div className="chips">
                <button className={`chip ${wishTab === "all" ? "is-active" : ""}`} onClick={() => setWishTab("all")}>전체 <span className="chip__count">{wishCounts.all}</span></button>
                <button className={`chip ${wishTab === "musical" ? "is-active" : ""}`} onClick={() => setWishTab("musical")}>뮤지컬 <span className="chip__count">{wishCounts.musical}</span></button>
                <button className={`chip ${wishTab === "exhibit" ? "is-active" : ""}`} onClick={() => setWishTab("exhibit")}>전시 <span className="chip__count">{wishCounts.exhibit}</span></button>
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
                  <div className="order__body"><div className="order__thumb"><img src={o.img} alt={o.alt} /></div><div className="order__info"><h3>{o.title}</h3><p className="order__price">{o.price}</p></div></div>
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