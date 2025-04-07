import ImageCarousel from "./ImageCarousel/ImageCarrousel";
import Informations from "~/Common/Informations/Informations";

export default function Home() {
  return (
    <div className="relative">
      <ImageCarousel />
      <h1>This is Home</h1>
      <Informations />
    </div>
  );
}
