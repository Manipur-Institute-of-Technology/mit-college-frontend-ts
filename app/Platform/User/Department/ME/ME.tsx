import Informations from "~/Common/Informations/Informations";
import Department from "../DepartmentData"

function ME() {
  return (
    <div className="min-h-screen space-y-6 sm:space-y-8 px-3 sm:px-5 md:px-8 lg:px-10">
    <div className="uppercase text-center text-lg sm:text-xl md:text-2xl font-bold tracking-[0.12em] sm:tracking-widest p-3 sm:p-4 md:p-5 bg-cyan-500 border-2 border-gray-300 rounded shadow-sm text-white">
      Department of Mecanical Engineering
    </div>
      <Department name="Mechanical Engineering" />
      <Informations />
    </div>
  );
}

export default ME;
