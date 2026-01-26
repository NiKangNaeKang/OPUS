import { useState, useEffect } from "react";

const SLIDES = [
  { title: "OPUS" },
  { title: "ART" },
  { title: "MUSICAL" },
  { title: "EXHIBITION" },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const prev = () =>
    setIndex((index - 1 + SLIDES.length) % SLIDES.length);
  const next = () =>
    setIndex((index + 1) % SLIDES.length);

  return (
    <section id="hero-banner" className="hero">
      <div className="hero__bg" />

      <button className="hero__nav hero__nav--left" onClick={prev}>
        <i className="fa-solid fa-chevron-left" />
      </button>

      <button className="hero__nav hero__nav--right" onClick={next}>
        <i className="fa-solid fa-chevron-right" />
      </button>

      <div className="hero__content">
        <div className="wrap">
          <div className="hero__text">
            <h1 className="hero__title">{SLIDES[index].title}</h1>
            <p className="hero__place">
              작품을 보는 새로운 관점을 열고, 숨겨진 예술의 무대를 드러내다.
            </p>
            <p className="hero__date"><b>O</b>pening</p>
            <p className="hero__date"><b>P</b>erspective</p>
            <p className="hero__date"><b>U</b>nveiling</p>
            <p className="hero__date"><b>S</b>cene</p>
          </div>
        </div>
      </div>

      <div className="hero__bottom">
        <div className="dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === index ? "is-active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>

        <div className="hero__count">
          <span>{index + 1}</span> / {SLIDES.length}
        </div>
      </div>
    </section>
  );
}
