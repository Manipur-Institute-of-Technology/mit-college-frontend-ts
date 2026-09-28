import Informations from "~/Common/Informations/Informations";


export default function Campus_Info() {
  return (
    <>
      <div className="min-h-screen space-y-6">
        <div className="uppercase text-2xl font-bold tracking-widest p-4 bg-cyan-500 border-2 border-gray-300 rounded-xs text-white text-center shadow-xs">
          CLASSROOM
        </div>
        <div className="space-y-5 text-gray-700 leading-7">
          <div> 
            <span className="text-xl sm:text-2xl font-bold text-gray-900"> Information about CAMPUS </span> 
          </div>
          <div> 
            <span className="block text-base sm:text-lg font-semibold text-gray-800"> &nbsp;&nbsp;&nbsp;&nbsp;MANIPUR UNIVERSITY CAMPUS (Canchipur): </span> 
          </div>
          <div className="text-sm sm:text-base text-justify"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MIT Manipur University Campus is located at Canchipur, Imphal, the capital city of Manipur. The university campus is spread over an area of 287 acres in the historic Canchipur, which is the site of the old palace of Manipur, <span className="font-medium text-gray-900"> "The Langthabal Konung (Palace)" </span>, which was established by Maharaja Ghambhir Singh in 1827 AD just after the liberation of Manipur from Burmese (Myanmar) occupation. Maharaja Gambhir Singh took his last breath at Canchipur. Canchipur is also the birthplace of Dr. Lamabam Kamal, a renowned poet of Manipur. It is located along the National Highway (NH-2), about 8 km from the heart of Imphal City and 12 km from Imphal International Airport. 
          </div> 
        </div>

        <Informations />
      </div>
    </>
  );
}
