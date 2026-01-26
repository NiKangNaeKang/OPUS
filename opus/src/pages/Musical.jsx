import Card from "../components/Card";
import { musicalData } from "../data/musicalData";

export default function Musical() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="section__head">
          <h2 className="section__title">공연</h2>
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
  );
}
