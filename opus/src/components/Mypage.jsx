import { useMemo, useState } from "react";
import "../css/mypage.css";

import {
  sidebarGroups,
  userProfile,
  wishlist,
  reviews,
  purchases,
  auctions,
} from "../data/mypageData";

export default function Mypage() {

  // sidebar active
  const [activeId, setActiveId] = useState("profile-edit");

  // profile
  const [phone, setPhone] = useState(userProfile.phone);

  const handleProfileSave = (e) => {
    e.preventDefault();
    console.log("저장:", phone);
  };

  // wishlist
  const [wishTab, setWishTab] = useState("all");
  const [wishItems, setWishItems] = useState(wishlist.items);

  // counts 자동 계산
  const wishCounts = useMemo(() => {
    const all = wishItems.length;
    const musical = wishItems.filter((i) => i.type === "뮤지컬").length;
    const exhibit = wishItems.filter((i) => i.type === "전시").length;
    return { all, musical, exhibit };
  }, [wishItems]);

  const filteredWish = useMemo(() => {
    if (wishTab === "all") return wishItems;
    if (wishTab === "musical")
      return wishItems.filter((i) => i.type === "뮤지컬");
    return wishItems.filter((i) => i.type === "전시");
  }, [wishTab, wishItems]);

  const toggleWish = (id) => {
    setWishItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, liked: !i.liked } : i
      )
    );
  };

  // password
  const handlePasswordChange = (e) => {
    e.preventDefault();
    console.log("비밀번호 변경");
  };

  return (
    <div className="mypage">

      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">
        <div className="sidebar__inner">
          <nav className="sidebar__nav">
            {sidebarGroups.map((group) => (
              <div className="nav-group" key={group.title}>
                <p className="nav-group__title">{group.title}</p>

                <ul className="nav-list">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={`nav-link ${
                          activeId === item.id ? "is-active" : ""
                        }`}
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

      {/* ================= MAIN ================= */}
      <main className="main">
        <div className="main__inner">

          {/* ===== 1. PROFILE ===== */}
          <section id="profile-edit" className="card">
            <header className="card__head">
              <h2 className="card__title">내 정보 수정</h2>
              <p className="card__desc">기본 정보를 수정할 수 있습니다</p>
            </header>

            <div className="card__body">
              <form className="form" onSubmit={handleProfileSave}>
                <div className="field">
                  <label className="label">이메일</label>
                  <input
                    className="input input--disabled"
                    value={userProfile.email}
                    disabled
                    readOnly
                  />
                </div>

                <div className="field">
                  <label className="label">연락처</label>
                  <input
                    className="input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="form__actions">
                  <button className="btn btn--primary">저장하기</button>
                </div>
              </form>
            </div>
          </section>

          {/* ===== 2. PASSWORD ===== */}
          <section id="password-change" className="card">
            <header className="card__head">
              <h2 className="card__title">비밀번호 변경</h2>
              <p className="card__desc">
                안전한 비밀번호로 주기적으로 변경해주세요
              </p>
            </header>

            <div className="card__body">
              <form className="form form--narrow" onSubmit={handlePasswordChange}>
                <div className="field">
                  <label className="label">현재 비밀번호</label>
                  <input className="input" type="password" />
                </div>

                <div className="field">
                  <label className="label">새 비밀번호</label>
                  <input className="input" type="password" />
                </div>

                <div className="field">
                  <label className="label">새 비밀번호 확인</label>
                  <input className="input" type="password" />
                </div>

                <div className="form__actions">
                  <button className="btn btn--primary">비밀번호 변경</button>
                </div>
              </form>
            </div>
          </section>

          {/* ===== 3. WISHLIST ===== */}
          <section id="wishlist" className="card">
            <header className="card__head">
              <h2 className="card__title">찜한 리스트</h2>
              <p className="card__desc">
                관심있는 공연과 전시를 모아보세요
              </p>
            </header>

            <div className="card__body">
              <div className="chips">
                <button
                  className={`chip ${wishTab === "all" ? "is-active" : ""}`}
                  onClick={() => setWishTab("all")}
                >
                  전체 <span className="chip__count">{wishCounts.all}</span>
                </button>

                <button
                  className={`chip ${wishTab === "musical" ? "is-active" : ""}`}
                  onClick={() => setWishTab("musical")}
                >
                  뮤지컬{" "}
                  <span className="chip__count">{wishCounts.musical}</span>
                </button>

                <button
                  className={`chip ${wishTab === "exhibit" ? "is-active" : ""}`}
                  onClick={() => setWishTab("exhibit")}
                >
                  전시{" "}
                  <span className="chip__count">{wishCounts.exhibit}</span>
                </button>
              </div>

              <div className="grid3">
                {filteredWish.map((w) => (
                  <article className="wish" key={w.id}>
                    <div className="wish__thumb">
                      <img src={w.img} alt={w.alt} />
                      <button
                        className="wish__heart"
                        onClick={() => toggleWish(w.id)}
                      >
                        <i
                          className={
                            w.liked
                              ? "fa-solid fa-heart"
                              : "fa-regular fa-heart"
                          }
                        />
                      </button>
                    </div>

                    <div className="wish__meta">
                      <p className="wish__tag">{w.type}</p>
                      <h3 className="wish__title">{w.title}</h3>
                      <p className="wish__place">{w.place}</p>
                      <p className="wish__date">{w.date}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* ===== 4. REVIEWS ===== */}
          <section id="reviews" className="card">
            <header className="card__head">
              <h2 className="card__title">작성 후기</h2>
            </header>

            <div className="review-list">
              {reviews.map((r) => (
                <article className="review" key={r.id}>
                  <div className="review__thumb">
                    <img src={r.img} alt={r.alt} />
                  </div>

                  <div className="review__body">
                    <div className="review__top">
                      <div>
                        <h3 className="review__title">{r.title}</h3>
                        <p className="review__sub">{r.sub}</p>
                      </div>
                      <span className="review__date">{r.date}</span>
                    </div>

                    <p className="review__text">{r.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ===== 5. PURCHASE ===== */}
          <section id="purchase-history" className="card">
            <header className="card__head">
              <h2 className="card__title">구매 내역</h2>
            </header>

            <div className="order-list">
              {purchases.map((o) => (
                <article className="order" key={o.id}>
                  <div className="order__top">
                    <div>
                      <p className="order__no">주문번호: {o.orderNo}</p>
                      <p className="order__time">{o.time}</p>
                    </div>
                    <span className={`badge ${o.statusClass}`}>
                      {o.statusLabel}
                    </span>
                  </div>

                  <div className="order__body">
                    <div className="order__thumb">
                      <img src={o.img} alt={o.alt} />
                    </div>

                    <div className="order__info">
                      <h3 className="order__title">{o.title}</h3>
                      {o.subs.map((s) => (
                        <p key={s} className="order__sub">{s}</p>
                      ))}
                      <p className="order__price">{o.price}</p>
                    </div>

                    <div className="order__actions">
                      {o.actions.map((a) => (
                        <button key={a} className="btn btn--outline">
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ===== 6. AUCTION ===== */}
          <section id="auction-history" className="card">
            <header className="card__head">
              <h2 className="card__title">경매 내역</h2>
            </header>

            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>작품명</th>
                    <th>작가</th>
                    <th>입찰가</th>
                    <th>낙찰가</th>
                    <th>상태</th>
                    <th>일시</th>
                  </tr>
                </thead>

                <tbody>
                  {auctions.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <div className="artcell">
                          <div className="artcell__thumb">
                            <img src={a.img} alt={a.alt} />
                          </div>
                          <div className="artcell__info">
                            <p className="artcell__title">{a.workTitle}</p>
                            <p className="artcell__sub">{a.workSub}</p>
                          </div>
                        </div>
                      </td>
                      <td className="td-muted">{a.artist}</td>
                      <td className="td-strong">{a.bid}</td>
                      <td className={a.win === "-" ? "td-dash" : "td-strong2"}>
                        {a.win}
                      </td>
                      <td>
                        <span className={`badge ${a.statusClass}`}>
                          {a.statusLabel}
                        </span>
                      </td>
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
