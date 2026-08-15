import Informations from "~/Common/Informations/Informations";
import Department from "../DepartmentData"

function ME() {
  return (
    <>
    <div className="uppercase text-2xl font-bold tracking-widest p-4 bg-cyan-500 border-2 border-gray-300 rounded-xs text-white text-center shadow-xs">
      Department of Mecanical Engineering
    </div>
      <Department name="mechanical engineering" />
      <Informations />
    </>
  );
}

export default ME;