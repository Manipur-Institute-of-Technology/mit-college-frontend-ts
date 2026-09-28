import Informations from "~/Common/Informations/Informations";
import Department from "../DepartmentData"

function ECE() {
  return (
    <>
    <div className="uppercase text-2xl font-bold tracking-widest p-4 bg-cyan-500 border-2 border-gray-300 rounded-xs text-white text-center shadow-xs">
      Department of Electronics and Communication engineering
    </div>
      <Department name="Electronics & Communication Engineering" />

      <section className="mb-7">
          <h2 className="font-bold uppercase mb-3 text-gray-800">
            Lab:
          </h2>

          {/* First two images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <img
              src="Images/Department/ECE/img1.jpg"
              alt="Electronics and Communication Engineering Lab 1"
              className="w-full h-auto max-h-96 object-cover rounded-md"
            />

            <img
              src="/Images/Department/ECE/img2.png"
              alt="Electronics and Communication Engineering Lab 2"
              className="w-full h-auto max-h-96 object-cover rounded-md"
            />
          </div>

          {/* Third image - centered */}
          <div className="flex justify-center mt-4 sm:mt-5">
            <img
              src="/Images/Department/ECE/img3.png"
              alt="Electronics and Communication Engineering Lab 3"
              className="w-full sm:w-1/2 h-auto max-h-96 object-cover rounded-md"
            />
          </div>
        </section>
      <Informations />
    </>
  );
}

export default ECE