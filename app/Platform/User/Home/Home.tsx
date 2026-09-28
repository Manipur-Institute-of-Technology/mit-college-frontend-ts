import ImageCarousel from "./ImageCarousel/ImageCarrousel";
import Informations from "~/Common/Informations/Informations";
import "./Home.css";
import NewNotificationMarquee from "./Marquee/marque";

export default function Home() {
  return (
    <div className="relative">
      <ImageCarousel />
      <div className="mt-0.5 ">
        <NewNotificationMarquee/>
      </div>
      <div className="mt-8 mb-10 px-3 sm:px-5 md:px-8 lg:px-10 space-y-6 text-sm sm:text-base md:text-[17px] leading-7 sm:leading-8 text-gray-700">
        <div className="font-bold flex align-middle justify-center min-w-full text-lg sm:text-xl md:text-2xl leading-normal text-center">Welcome to Manipur Institute of Technology (AICTE-NEQIP funded)</div>
        <div className="text-justify">The Manipur Institute of Technology (erstwhile Government College of Technology) was established on 28th August 1998 by the Government of Manipur as Pioneer Engineering College in the State. On 31st December 2003, the College was renamed as Manipur College of Technology and the management of the College was handed over to a Society headed by the Hon’ble Chief Minister of Manipur as Chairman. Further, the Institute was renamed as Manipur Institute of Technology (MIT) since 4th February 2005. MIT became a Constituent College of Manipur University w.e.f. 13th October 2005.</div>
        <div className="font-bold text-base sm:text-lg md:text-xl uppercase border-l-4 border-cyan-500 pl-3">OUR VISION</div>
        <div className="text-justify">Excellence in engineering and technology education with good leadership in Human Resource Development.</div>
        <div className="font-bold text-base sm:text-lg md:text-xl uppercase border-l-4 border-cyan-500 pl-3">OUR MISSION</div>
        <ul className="list-disc list-outside ml-5 sm:ml-7 space-y-2">
        <li className="Home-List-Items">To produce technically strong, innovative, research oriented, all round developed engineers capable to solve modern challenges by adopting student centric teaching learning methods.</li>
        <li className="Home-List-Items">To impart engineering and technology education for all round development</li>
        <li className="Home-List-Items">To produce good engineering professionals with social commitment.</li>
        </ul>
        <div className="font-bold text-base sm:text-lg md:text-xl uppercase border-l-4 border-cyan-500 pl-3">CAMPUS INFORMATION</div>
        <div className="font-bold mt-4">Takyelpat Campus</div>
        <div className="text-justify">MIT Takyelpat campus is located just adjacent to NH 37 (New Cachar Road) approximately 4 Kms. from the heart of Imphal City. It is about 6 Kms from Imphal International Airport, Tulihal, Imphal</div>
        <div className="font-bold mt-4">Manipur University Campus (Canchipur)</div>
        <div className="text-justify">MIT Manipur University Campus is located at Canchipur, Imphal, the capital city of Manipur. The University campus is spread over an area of 287 acres in the historic Canchipur which is the site of the old palace of Manipur “The Langthabal Konung (Palace)” which was established by Maharaja Ghambhir Singh in 1827 AD just after the liberation of Manipur from Burmese (Myanmar) occupation. Maharaja Gambhir Singh took his last breath at Canchipur. Canchipur is located along the National Highway (NH-2) at about 8 km. from the heart of the Imphal City and 12 km. from Imphal International Airport.</div>


      </div>
      <Informations />
    </div>
  );
}
