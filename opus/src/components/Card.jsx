import { useState } from "react";

export default function Card({ image, title, period, place, likeable }) {
  const [liked, setLiked] = useState(false);

  return (
    <article className="card">
      <div className="card__thumb card__thumb--white">
        <img src={image} alt={title} />
        {likeable && (
          <button
            className="like-btn"
            type="button"
            aria-label="찜"
            onClick={() => setLiked(!liked)}
          >
            <i
              className={`${liked ? "fa-solid" : "fa-regular"} fa-heart`}
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      <h3 className="card__title">{title}</h3>
      <p className="card__meta">{period}</p>
      <p className="card__sub">{place}</p>
    </article>
  );
}
