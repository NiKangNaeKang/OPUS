function getBadgeClass(status) {
  switch (status) {
    case "LIVE":
      return "badge badge--live";
    case "UPCOMING":
      return "badge badge--soon"; // 기존 css 네이밍 유지
    case "ENDED":
      return "badge badge--ended";
    default:
      return "badge";
  }
}

function getBadgeText(status) {
  switch (status) {
    case "LIVE":
      return "진행중";
    case "UPCOMING":
      return "예정";
    case "ENDED":
      return "종료";
    default:
      return "";
  }
}

function getDueClass(status) {
  switch (status) {
    case "LIVE":
      return "card__due is-live";
    case "UPCOMING":
      return "card__due is-soon";
    case "ENDED":
      return "card__due is-ended";
    default:
      return "card__due";
  }
}

function getStatsIconClass(type) {
  return type === "ALERT" ? "fa-solid fa-bell" : "fa-solid fa-gavel";
}

export default function AuctionCard({ item }) {
  if (!item) return null;

  const isEnded = item.status === "ENDED";
  const badgeClass = getBadgeClass(item.status);
  const badgeText = getBadgeText(item.status);
  const dueClass = getDueClass(item.status);
  const statsIcon = getStatsIconClass(item.stats?.type);

  return (
    <article id={`auction-card-${item.id}`} className={`card ${isEnded ? "is-ended" : ""}`}>
      <div className="card__media">
        <img className="card__img" src={item.image} alt={item.alt || item.title} />
        <span className={badgeClass}>{badgeText}</span>

        {/* 종료가 아니고 actionText가 있을 때만 hover 버튼 */}
        {!isEnded && item.actionText && (
          <div className="card__hover">
            <button className="btn btn-light" type="button">
              {item.actionText}
            </button>
          </div>
        )}
      </div>

      <div className="card__body">
        <h3 className="card__title">{item.title}</h3>
        <p className="card__artist">{item.artist}</p>

        <div className="card__priceRow">
          <div>
            <p className="card__label">{item.pricing?.label ?? "-"}</p>
            <p className="card__price">{item.pricing?.display ?? "-"}</p>
          </div>

          <div className="card__right">
            <p className="card__label">{item.timing?.label ?? "-"}</p>
            <p className={dueClass}>{item.timing?.display ?? "-"}</p>
          </div>
        </div>

        <div className="card__stats">
          <i className={statsIcon} />
          <p>
            {item.stats?.label ?? ""} <strong>{item.stats?.count ?? 0}</strong>
            {item.stats?.type === "ALERT" ? "명" : "건"}
          </p>
        </div>
      </div>
    </article>
  );
}
