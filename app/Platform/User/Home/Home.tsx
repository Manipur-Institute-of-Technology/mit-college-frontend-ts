import { HomeData } from "~/DB_Sample/Home";
import ImageCarousel from "./ImageCarousel/ImageCarrousel";
import Informations from "~/Common/Informations/Informations";
import "./Home.css";

export default function Home() {
  return (
    <div className="relative">
      <ImageCarousel />
      <div className="mt-8 leading-8 tracking-wide mb-10">
        <div className="font-bold flex align-middle justify-center min-w-full text-4xl leading-normal mb-2 mt-11">Welcome to Manipur Institute of Technology (AICTE-NEQIP funded)</div>
        <div >&nbsp;&nbsp;&nbsp;The Manipur Institute of Technology (erstwhile Government College of Technology) was established on 28th August 1998 by the Government of Manipur as Pioneer Engineering College in the State. On 31st December 2003, the College was renamed as Manipur College of Technology and the management of the College was handed over to a Society headed by the Hon’ble Chief Minister of Manipur as Chairman. Further, the Institute was renamed as Manipur Institute of Technology (MIT) since 4th February 2005. MIT became a Constituent College of Manipur University w.e.f. 13th October 2005.</div>
        <div className="font-bold mt-10 mb-4 text-2xl uppercase">OUR VISION</div>
        <div>&nbsp;&nbsp;&nbsp;Excellence in engineering and technology education with good leadership in Human Resource Development.</div>
        <div className="font-bold mt-10 mb-4 text-2xl uppercase">OUR MISSION</div>
        <ul>
        <li className="Home-List-Items">To produce technically strong, innovative, research oriented, all round developed engineers capable to solve modern challenges by adopting student centric teaching learning methods.</li>
        <li className="Home-List-Items">To impart engineering and technology education for all round development</li>
        <li className="Home-List-Items">To produce good engineering professionals with social commitment.</li>
        </ul>
        <div className="font-bold mt-10 mb-4 text-2xl uppercase">CAMPUS INFORMATION</div>
        <div className="font-bold mt-4 ">&nbsp;&nbsp;&nbsp;Takyelpat Campus</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MIT Takyelpat campus is located just adjacent to NH 37 (New Cachar Road) approximately 4 Kms. from the heart of Imphal City. It is about 6 Kms from Imphal International Airport, Tulihal, Imphal</div>
        <div className="font-bold mt-4 ">&nbsp;&nbsp;&nbsp;Manipur University Campus (Canchipur)</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MIT Manipur University Campus is located at Canchipur, Imphal, the capital city of Manipur. The University campus is spread over an area of 287 acres in the historic Canchipur which is the site of the old palace of Manipur “The Langthabal Konung (Palace)” which was established by Maharaja Ghambhir Singh in 1827 AD just after the liberation of Manipur from Burmese (Myanmar) occupation. Maharaja Gambhir Singh took his last breath at Canchipur. Canchipur is located along the National Highway (NH-2) at about 8 km. from the heart of the Imphal City and 12 km. from Imphal International Airport.</div>


      </div>
      <Informations />
    </div>
  );
}
