import Informations from "~/Common/Informations/Informations";

export default function FDP_Info() {
  return (
    <>
      <div className="min-h-screen space-y-6 sm:space-y-8 px-3 sm:px-5 md:px-8 lg:px-10">
        {/* Page Title */}
        <div className="uppercase text-center text-lg sm:text-xl md:text-2xl font-bold tracking-[0.12em] sm:tracking-widest p-3 sm:p-4 md:p-5 bg-cyan-500 border-2 border-gray-300 rounded shadow-sm text-white">
          Faculty Development Program
        </div>

        {/* Main Content */}
        <div className="space-y-6 text-gray-700 leading-7">
          {/* Introduction */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 border-l-4 border-cyan-500 pl-3">
              Information about Faculty Development Program
            </h2>

            <p className="text-sm sm:text-base md:text-[17px] text-justify leading-7 sm:leading-8">
              The Institute is actively involved in upgradation of its human
              resources by deputing faculty and staff members for higher studies
              and to attend Staff Development Programme in different fields at
              NITTTR, Kolkata, Manipur University, Imphal, and other reputed
              Institutes. Faculty and staff members are also encouraged to
              pursue higher studies in order to improve the quality of
              Education.
            </p>
          </section>

          {/* Research & Development */}
          <section className="space-y-3">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 border-l-4 border-cyan-400 pl-3">
              Research & Development
            </h3>

            <p className="text-sm sm:text-base md:text-[17px] text-justify leading-7 sm:leading-8">
              The Faculty members and students of this Institute are actively
              involved in many Research Works and Consultancy works. Many
              research papers are published in the highly rated National &
              International Journals.
            </p>
          </section>

          {/* Publications */}
          <section className="space-y-4">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 border-l-4 border-cyan-400 pl-3">
              Some of the major publications are:
            </h3>

            {/* International Journals */}
            <div className="space-y-3">
              <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
                International Journals
              </h4>

              <ol className="list-decimal list-outside ml-5 sm:ml-7 space-y-2 text-sm sm:text-base md:text-[16px] leading-6 sm:leading-7">
                <li className="pl-1">
                  International Journal of Pavement Engineering, Taylor and
                  Francis Publications.
                </li>
                <li className="pl-1">
                  International Journal of Road Materials and Pavement Design,
                  Taylor and Francis Publications.
                </li>
                <li className="pl-1">Geosciences Journal, South Korea</li>
                <li className="pl-1">Engineering Optimization, U.K.</li>
                <li className="pl-1">
                  ASCE Journal of Hydrology Engineering, USA
                </li>
                <li className="pl-1">
                  International Journal of Geotechnical, Maney Publication
                </li>
                <li className="pl-1">
                  International Journal of Earth Science & Engineering,
                  Geo-Ref Information Services, USA
                </li>
                <li className="pl-1">
                  International Journal of Engineering Research & Technology,
                  ESRSA Publication
                </li>
                <li className="pl-1">
                  Journal of Civil Engineering & Management, Taylor & Francis
                  Publications
                </li>
                <li className="pl-1">
                  Canadian Journal of Civil Engineering, NRC Press
                </li>
                <li className="pl-1">
                  Arabian Journal for Science & Engineering, SPRINGER
                  Publication
                </li>
                <li className="pl-1">Wulfenia Journal, Austria</li>
                <li className="pl-1">
                  Journal of Engineering Science & Technology Review
                </li>
                <li className="pl-1">IEEE Transaction of Nano Technology</li>
                <li className="pl-1">
                  Journal of Computational Electronics, SPRINGER
                </li>
                <li className="pl-1">
                  Optical & Quantum Electronics, SPRINGER
                </li>
                <li className="pl-1">
                  Solid State Electronics, ELSEVIER
                </li>
                <li className="pl-1">
                  Journal of Computational & Theoretical Nano Science
                </li>
                <li className="pl-1">
                  Micro Electronics Reliability, ELSEVIER
                </li>
                <li className="pl-1">
                  Journal of Nano-Electronics & Opto-Electronics
                </li>
                <li className="pl-1">
                  Physica B Condensed Matter, ELSEVIER
                </li>
                <li className="pl-1">
                  Expert System with Application, ELSEVIER
                </li>
                <li className="pl-1">
                  International Journal of Electronics, Taylor & Francis
                </li>
                <li className="pl-1">
                  International Journal of Computer Science and Network
                  Security, Korea
                </li>
                <li className="pl-1">
                  International Journal on Natural Language Computing
                </li>
              </ol>
            </div>

            {/* National Journals */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
                National Journals
              </h4>

              <ol className="list-decimal list-outside ml-5 sm:ml-7 space-y-2 text-sm sm:text-base md:text-[16px] leading-6 sm:leading-7">
                <li className="pl-1">
                  Indian Highways, Indian Road Congress, New Delhi
                </li>
                <li className="pl-1">
                  Journal of Indian Geotechnical Society, SPRINGER
                </li>
                <li className="pl-1">
                  Journal of Earth System Science, Indian Academy of Science
                </li>
              </ol>
            </div>
          </section>
        </div>

        {/* Additional Information */}
        <Informations />
      </div>
    </>
  );
}