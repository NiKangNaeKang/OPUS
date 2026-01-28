import HeroSlider from "../components/HeroSlider";
import MdPickSlider from "../components/MdPickSlider";
import { artData } from "../data/artData";
import { musicalData } from "../data/musicalData";

export default function Home() {
  return (
    <>
      <MdPickSlider
        title="Exhibitions, you better go"
        data={artData}
      />

      <MdPickSlider
        title="Musicals, you better go"
        data={musicalData}
      />
    </>
  );
}
