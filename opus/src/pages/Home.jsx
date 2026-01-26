import HeroSlider from "../components/HeroSlider";
import Card from "../components/Card";
import { artData } from "../data/artData";
import { musicalData } from "../data/musicalData";

export default function Home() {
  return (
    <>
      {/* HERO 영역 */}
      <HeroSlider />

      {/* 전시 MD Pick */}
      <section id="art-md-pick" className="section section--alt">
        <div className="wrap">
          <div className="section__head">
            <h2 className="section__title">Exhibitions, you better go</h2>
          </div>

          <div className="card-grid">
            {artData.map((item, index) => (
              <Card
                key={index}
                image={item.image}
                title={item.title}
                period={item.period}
                place={item.place}
                likeable={item.likeable}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 공연 MD Pick */}
      <section id="musical-md-pick" className="section">
        <div className="wrap">
          <div className="section__head">
            <h2 className="section__title">Musicals, you better go</h2>
          </div>

          <div className="card-grid">
            {musicalData.map((item, index) => (
              <Card
                key={index}
                image={item.image}
                title={item.title}
                period={item.period}
                place={item.place}
                likeable={item.likeable}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
