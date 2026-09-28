import Informations from "~/Common/Informations/Informations";

export default function Ragging() {
  return (
    <>
      <div className="min-h-screen space-y-6">
        <div className="uppercase text-2xl font-bold tracking-widest p-4 bg-cyan-500 border-2 border-gray-300 rounded-xs text-white text-center shadow-xs">
          Ragging
        </div>
        <div className="space-y-5 text-gray-700 leading-7">
          <div> 
            <span className="text-xl sm:text-2xl font-bold text-gray-900">Information about Ragging</span> 
          </div>
          <div className="text-sm sm:text-base text-justify"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ragging in any form is totally banned in the entire institution, including its departments, constituent units, all its premises (academic, residential, sports, canteen, etc.) whether located within the campus or outside and in all means of transportation of students whether public or private. The institution shall take strict action against those found guilty of ragging and/or abetting ragging. A student seeking admission to the Institute shall have to submit the undertaking in the prescribed formats of Annexure-I & Annexure-II with his/her Application Form under Clause No. 6.1.7 of the “AICTE/UGC Regulations on Curbing Menace of Ragging in Higher Educational Institutions, 2009”. 
          </div> 
        </div>

        <Informations />
      </div>
    </>
  );
}
