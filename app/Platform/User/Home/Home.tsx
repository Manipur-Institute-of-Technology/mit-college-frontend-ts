import { HomeData } from "~/DB_Sample/Home";
import ImageCarousel from "./ImageCarousel/ImageCarrousel";
import Informations from "~/Common/Informations/Informations";

export default function Home() {
  return (
    <div className="relative">
      <ImageCarousel />
      <div className="mt-8">
        {HomeData[0]?.info.split("\n").map((line, index) => {
          return (
            <>
              <p>
                &emsp;{line}
                <br />
              </p>
            </>
          );
        })}
      </div>
      <Informations />
    </div>
  );
}
