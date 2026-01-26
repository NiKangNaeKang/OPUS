import { useState } from "react";
import Card from "./Card";

const VISIBLE_COUNT = 5;

export default function MdPickSlider({ title, data }) {
  const [startIndex, setStartIndex] = useState(0);
  const total = data.length;

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setStartIndex((prev) =>
      prev === 0 ? total - 1 : prev - 1
    );
  };

  const visibleItems = Array.from({ length: VISIBLE_COUNT }).map(
    (_, i) => data[(startIndex + i) % total]
  );

  return (
    <section className="section">
      <div className="wrap">
        <div className="section__head section__head--slider">
          <h2 className="section__title">{title}</h2>

          <div className="slider__controls">
            <button onClick={handlePrev} aria-label="이전">
              ‹
            </button>
            <button onClick={handleNext} aria-label="다음">
              ›
            </button>
          </div>
        </div>

        <div className="card-grid">
          {visibleItems.map((item) => (
            <Card key={item.id} data={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
