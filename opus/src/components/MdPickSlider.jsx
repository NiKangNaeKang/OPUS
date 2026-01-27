import { useState } from "react";
import Card from "./Card";

function MdPickSlider({ title, data }) {
  const VISIBLE_COUNT = 5;
  const CARD_WIDTH = 260; // 고정 카드 폭
  const GAP = 24;

  const [index, setIndex] = useState(0);

  const total = data.length;
  const canSlide = total > VISIBLE_COUNT;
  const maxIndex = total - VISIBLE_COUNT;

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };

  return (
    <section className="section">
      <div className="wrap">
        <div className="section__head">
          <h2 className="section__title">{title}</h2>
        </div>

        <div className="mdpick-layout">
          <div className="mdpick-hitbox">
            <div className="mdpick-content">
              <div className="slider-viewport">
                <div
                  className="slider-track"
                  style={{
                    transform: `translateX(-${index * (CARD_WIDTH + GAP)}px)`,
                  }}
                >
                  {data.map((item) => (
                    <div className="mdpick-cardwrap" key={item.id}>
                      <Card data={item} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {canSlide && (
              <>
                <button
                  className="slider-btn slider-btn--prev"
                  onClick={handlePrev}
                  type="button"
                  aria-label="Previous"
                >
                  <i className="fa-solid fa-chevron-left" />
                </button>

                <button
                  className="slider-btn slider-btn--next"
                  onClick={handleNext}
                  type="button"
                  aria-label="Next"
                >
                  <i className="fa-solid fa-chevron-right" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MdPickSlider;
