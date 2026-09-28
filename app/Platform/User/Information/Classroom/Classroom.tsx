import Informations from "~/Common/Informations/Informations";

export default function Classroom_Info() {
  return (
    <>
      <div className="min-h-screen space-y-6 sm:space-y-8 px-3 sm:px-5 md:px-8 lg:px-10">
        {/* Page Title */}
        <div className="uppercase text-center text-lg sm:text-xl md:text-2xl font-bold tracking-[0.12em] sm:tracking-widest p-3 sm:p-4 md:p-5 bg-cyan-500 border-2 border-gray-300 rounded shadow-sm text-white">
          Classroom
        </div>

        {/* Introduction */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 border-l-4 border-cyan-500 pl-3">
            Classroom Facilities
          </h2>

          <p className="text-sm sm:text-base md:text-[17px] text-gray-700 text-justify leading-7 sm:leading-8">
            The classrooms are provided with audio visual aids to avail the
            facility of e-learning and latest teaching methods using overhead
            projectors under the funding of AICTE-NEQIP. There is also one
            Digital Classroom in addition to the above facility.
          </p>
        </section>

        {/* Classroom Images */}
        <section className="space-y-4">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 border-l-4 border-cyan-400 pl-3">
            Classroom
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {/* Classroom 1 */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <img
                src="/Images/Classroom/class_1.jpg"
                alt="Classroom 1"
                className="w-full h-56 sm:h-64 md:h-72 lg:h-80 object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Classroom 2 */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <img
                src="/Images/Classroom/class_2.jpg"
                alt="Classroom 2"
                className="w-full h-56 sm:h-64 md:h-72 lg:h-80 object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Classroom 3 */}
          <div className="flex justify-center">
            <div className="w-full sm:w-2/3 md:w-1/2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <img
                src="/Images/Classroom/class_3.jpg"
                alt="Classroom 3"
                className="w-full h-56 sm:h-64 md:h-72 lg:h-80 object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <Informations />
      </div>
    </>
  );
}
