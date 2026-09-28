import Informations from "~/Common/Informations/Informations";
import Department from "../DepartmentData"

function ECE() {
  return (
    <div className="min-h-screen space-y-6 sm:space-y-8 px-3 sm:px-5 md:px-8 lg:px-10">
    <div className="uppercase text-center text-lg sm:text-xl md:text-2xl font-bold tracking-[0.12em] sm:tracking-widest p-3 sm:p-4 md:p-5 bg-cyan-500 border-2 border-gray-300 rounded shadow-sm text-white">
      Department of Electronics and Communication engineering
    </div>
      <Department name="Electronics & Communication Engineering" />

      <section className="mb-7">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 border-l-4 border-cyan-400 pl-3 mb-3">
            Lab:
          </h2>

          {/* First two images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <img
              src="Images/Department/ECE/img1.jpg"
              alt="Electronics and Communication Engineering Lab 1"
              className="w-full h-auto max-h-96 object-cover rounded-lg border border-gray-200 shadow-sm"
            />

            <img
              src="/Images/Department/ECE/img2.png"
              alt="Electronics and Communication Engineering Lab 2"
              className="w-full h-auto max-h-96 object-cover rounded-lg border border-gray-200 shadow-sm"
            />
          </div>

          {/* Third image - centered */}
          <div className="flex justify-center mt-4 sm:mt-5">
            <img
              src="/Images/Department/ECE/img3.png"
              alt="Electronics and Communication Engineering Lab 3"
              className="w-full sm:w-1/2 h-auto max-h-96 object-cover rounded-lg border border-gray-200 shadow-sm"
            />
          </div>
        </section>
      <Informations />
    </div>
  );
}

export default ECE
