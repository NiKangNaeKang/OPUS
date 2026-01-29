function getBadgeClass(status) {
  switch (status) {
    case "LIVE":
      return "badge badge--live";
    case "UPCOMING":
      // 원본 HTML이 예정도 badge--soon을 쓰고 있어서 그대로 맞춥니다.
      return "badge badge--soon";
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
      return "전체";
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

function getStatsIcon(statsType) {
  return statsType === "ALERT" ? "fa-solid fa-bell" : "fa-solid fa-gavel";
}

export default function AuctionCard({ item }) {
  if (!item) return null;

  const badgeClass = getBadgeClass(item.status);
  const badgeText = getBadgeText(item.status);
  const dueClass = getDueClass(item.status);
  const statsIcon = getStatsIcon(item.statsType);

  return (
    <article
      id={`auction-card-${item.id}`}
      className={`card ${item.ended ? "is-ended" : ""}`}
    >
      <div className="card__media">
        <img className="card__img" src={item.image} alt={item.alt || item.title} />
        <span className={badgeClass}>{badgeText}</span>

        {/* 종료 카드에는 hover 버튼 없음(원본 그대로) */}
        {!item.ended && item.actionText && (
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
            <p className="card__label">{item.priceLabel}</p>
            <p className="card__price">{item.priceText}</p>
          </div>

          <div className="card__right">
            <p className="card__label">{item.dueLabel}</p>
            <p className={dueClass}>{item.dueText}</p>
          </div>
        </div>

        <div className="card__stats">
          <i className={statsIcon} />
          <p>
            {item.statsText} <strong>{item.statsCount}</strong>건
            {item.statsType === "ALERT" ? "" : ""}
          </p>
        </div>
      </div>
    </article>
  );
}
