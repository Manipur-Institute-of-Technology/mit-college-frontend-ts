import Informations from "~/Common/Informations/Informations";


export default function Campus_Info() {
  return (
    <>
      <div className="min-h-screen space-y-6 sm:space-y-8 px-3 sm:px-5 md:px-8 lg:px-10">
        <div className="uppercase text-center text-lg sm:text-xl md:text-2xl font-bold tracking-[0.12em] sm:tracking-widest p-3 sm:p-4 md:p-5 bg-cyan-500 border-2 border-gray-300 rounded shadow-sm text-white">
          Campus
        </div>
        <div className="space-y-6 text-gray-700 leading-7">
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 border-l-4 border-cyan-500 pl-3">Information about CAMPUS</h2>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 border-l-4 border-cyan-400 pl-3">MANIPUR UNIVERSITY CAMPUS (Canchipur):</h3>
            <p className="text-sm sm:text-base md:text-[17px] text-justify leading-7 sm:leading-8">MIT Manipur University Campus is located at Canchipur, Imphal, the capital city of Manipur. The university campus is spread over an area of 287 acres in the historic Canchipur, which is the site of the old palace of Manipur, <span className="font-medium text-gray-900"> "The Langthabal Konung (Palace)" </span>, which was established by Maharaja Ghambhir Singh in 1827 AD just after the liberation of Manipur from Burmese (Myanmar) occupation. Maharaja Gambhir Singh took his last breath at Canchipur. Canchipur is also the birthplace of Dr. Lamabam Kamal, a renowned poet of Manipur. It is located along the National Highway (NH-2), about 8 km from the heart of Imphal City and 12 km from Imphal International Airport.</p>
          </section>
        </div>

        <Informations />
      </div>
    </>
  );
}
