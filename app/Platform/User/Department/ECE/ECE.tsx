import Informations from "~/Common/Informations/Informations";
import Department from "../Department"

function ECE() {
  return (
    <>
    <div className="uppercase text-2xl font-bold tracking-widest p-4 bg-cyan-500 border-2 border-gray-300 rounded-xs text-white text-center shadow-xs">
      Department of Electronics and Communication engineering
    </div>
      <Department name="ECE" />
      <Informations />
    </>
  );
}

export default ECE