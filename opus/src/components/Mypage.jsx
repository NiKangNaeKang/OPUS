import { useMemo, useState, memo } from "react";
import "../css/myPage.css";

import {
  sidebarGroups,
  userProfile,
  wishlist,
  reviews,
  purchases,
  auctions,
} from "../data/myPageData";

export default function MyPage() {
  // sidebar
  const [activeId, setActiveId] = useState("profile-edit");

  // profile
  // 초기값만 세팅됨. userProfile.phone이 바뀐다고 phone이 자동 변경되진 않음.
  const [phone, setPhone] = useState(userProfile.phone);

  const handleProfileSave = (e) => {
    e.preventDefault();
    console.log("저장:", phone);
  };

  // wishlist
  const [wishTab, setWishTab] = useState("all");
  const [wishItems, setWishItems] = useState(wishlist.items);

  const wishCounts = useMemo(() => {
    const all = wishItems.length;
    const musical = wishItems.filter((i) => i.type === "뮤지컬").length;
    const exhibit = wishItems.filter((i) => i.type === "전시").length;
    return { all, musical, exhibit };
  }, [wishItems]);

  const filteredWish = useMemo(() => {
    if (wishTab === "all") return wishItems;
    if (wishTab === "musical") return wishItems.filter((i) => i.type === "뮤지컬");
    return wishItems.filter((i) => i.type === "전시");
  }, [wishTab, wishItems]);

  const toggleWish = (id) => {
    setWishItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, liked: !i.liked } : i))
    );
  };

  // password
  const handlePasswordChange = (e) => {
    e.preventDefault();
    console.log("비밀번호 변경");
  };

  return (
    <div className="mypage">
      <Sidebar
        sidebarGroups={sidebarGroups}
        activeId={activeId}
        onChangeActive={setActiveId}
      />

      <main className="main">
        <div className="main__inner">
          <ProfileSection
            email={userProfile.email}
            phone={phone}
            onChangePhone={setPhone}
            onSubmit={handleProfileSave}
          />

          <PasswordSection onSubmit={handlePasswordChange} />

          <WishlistSection
            wishTab={wishTab}
            onChangeTab={setWishTab}
            wishCounts={wishCounts}
            items={filteredWish}
            onToggleWish={toggleWish}
          />

          <ReviewsSection reviews={reviews} />

          <PurchaseSection purchases={purchases} />

          <AuctionSection auctions={auctions} />
        </div>
      </main>
    </div>
  );
}

// Sidebar
const Sidebar = memo(function Sidebar({ sidebarGroups, activeId, onChangeActive }) {
  const handleNavClick = (e, id) => {
    e.preventDefault();

    onChangeActive(id);

    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
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
                      className={`nav-link ${activeId === item.id ? "is-active" : ""}`}
                      onClick={(e) => handleNavClick(e, item.id)}
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
  );
});

// Sections
function ProfileSection({ email, phone, onChangePhone, onSubmit }) {
  return (
    <section id="profile-edit" className="card">
      <header className="card__head">
        <h2 className="card__title">내 정보 수정</h2>
        <p className="card__desc">기본 정보를 수정할 수 있습니다</p>
      </header>

      <div className="card__body">
        <form className="form" onSubmit={onSubmit}>
          <div className="field">
            <label className="label">이메일</label>
            <input className="input input--disabled" value={email} disabled readOnly />
          </div>

          <div className="field">
            <label className="label">연락처</label>
            <input
              className="input"
              value={phone}
              onChange={(e) => onChangePhone(e.target.value)}
            />
          </div>

          <div className="form__actions">
            <button type="submit" className="btn btn--primary">
              저장하기
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function PasswordSection({ onSubmit }) {
  return (
    <section id="password-change" className="card">
      <header className="card__head">
        <h2 className="card__title">비밀번호 변경</h2>
        <p className="card__desc">안전한 비밀번호로 주기적으로 변경해주세요</p>
      </header>

      <div className="card__body">
        <form className="form form--narrow" onSubmit={onSubmit}>
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
            <button type="submit" className="btn btn--primary">
              비밀번호 변경
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function WishlistSection({ wishTab, onChangeTab, wishCounts, items, onToggleWish }) {
  return (
    <section id="wishlist" className="card">
      <header className="card__head">
        <h2 className="card__title">찜한 리스트</h2>
        <p className="card__desc">관심있는 공연과 전시를 모아보세요</p>
      </header>

      <div className="card__body">
        <div className="chips">
          <Chip
            active={wishTab === "all"}
            onClick={() => onChangeTab("all")}
            label="전체"
            count={wishCounts.all}
          />
          <Chip
            active={wishTab === "musical"}
            onClick={() => onChangeTab("musical")}
            label="뮤지컬"
            count={wishCounts.musical}
          />
          <Chip
            active={wishTab === "exhibit"}
            onClick={() => onChangeTab("exhibit")}
            label="전시"
            count={wishCounts.exhibit}
          />
        </div>

        <div className="grid3">
          {items.map((w) => (
            <WishCard key={w.id} item={w} onToggle={() => onToggleWish(w.id)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Chip({ active, onClick, label, count }) {
  return (
    <button
      type="button"
      className={`chip ${active ? "is-active" : ""}`}
      onClick={onClick}
    >
      {label} <span className="chip__count">{count}</span>
    </button>
  );
}

const WishCard = memo(function WishCard({ item, onToggle }) {
  return (
    <article className="wish">
      <div className="wish__thumb">
        <img src={item.img} alt={item.alt} />
        {/* ✅ 클릭용 버튼은 무조건 type="button" */}
        <button type="button" className="wish__heart" onClick={onToggle}>
          <i className={item.liked ? "fa-solid fa-heart" : "fa-regular fa-heart"} />
        </button>
      </div>

      <div className="wish__meta">
        <p className="wish__tag">{item.type}</p>
        <h3 className="wish__title">{item.title}</h3>
        <p className="wish__place">{item.place}</p>
        <p className="wish__date">{item.date}</p>
      </div>
    </article>
  );
});

function ReviewsSection({ reviews }) {
  return (
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
  );
}

function PurchaseSection({ purchases }) {
  return (
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
              <span className={`badge ${o.statusClass}`}>{o.statusLabel}</span>
            </div>

            <div className="order__body">
              <div className="order__thumb">
                <img src={o.img} alt={o.alt} />
              </div>

              <div className="order__info">
                <h3 className="order__title">{o.title}</h3>
                {o.subs.map((s) => (
                  <p key={s} className="order__sub">
                    {s}
                  </p>
                ))}
                <p className="order__price">{o.price}</p>
              </div>

              <div className="order__actions">
                {o.actions.map((a) => (
                  // ✅ 클릭용 버튼은 type="button"
                  <button type="button" key={a} className="btn btn--outline">
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AuctionSection({ auctions }) {
  return (
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
                <td className={a.win === "-" ? "td-dash" : "td-strong2"}>{a.win}</td>
                <td>
                  <span className={`badge ${a.statusClass}`}>{a.statusLabel}</span>
                </td>
                <td className="td-date">{a.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
