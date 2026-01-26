import Card from "../components/Card";
import { artData } from "../data/artData";

export default function Art() {
  return (
    <section className="section section--alt">
      <div className="wrap">
        <div className="section__head">
          <h2 className="section__title">전시</h2>
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
  );
}
