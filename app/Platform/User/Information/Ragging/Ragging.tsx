import Informations from "~/Common/Informations/Informations";

export default function Ragging() {
  return (
    <>
      <div className="min-h-screen space-y-6 sm:space-y-8 px-3 sm:px-5 md:px-8 lg:px-10">
        <div className="uppercase text-center text-lg sm:text-xl md:text-2xl font-bold tracking-[0.12em] sm:tracking-widest p-3 sm:p-4 md:p-5 bg-cyan-500 border-2 border-gray-300 rounded shadow-sm text-white">
          Ragging
        </div>
        <div className="space-y-6 text-gray-700 leading-7">
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 border-l-4 border-cyan-500 pl-3">Information about Ragging</h2>
            <p className="text-sm sm:text-base md:text-[17px] text-justify leading-7 sm:leading-8">Ragging in any form is totally banned in the entire institution, including its departments, constituent units, all its premises (academic, residential, sports, canteen, etc.) whether located within the campus or outside and in all means of transportation of students whether public or private. The institution shall take strict action against those found guilty of ragging and/or abetting ragging. A student seeking admission to the Institute shall have to submit the undertaking in the prescribed formats of Annexure-I & Annexure-II with his/her Application Form under Clause No. 6.1.7 of the “AICTE/UGC Regulations on Curbing Menace of Ragging in Higher Educational Institutions, 2009”.</p>
          </section>
        </div>

        <Informations />
      </div>
    </>
  );
}
