import Informations from "~/Common/Informations/Informations";
import Department from "../DepartmentData";
import "../Department.css";

function CE() {
  return (
    <div className="min-h-dvh bg-white text-gray-700">
      {/* Department Header */}
      <div className="bg-cyan-500 border-b border-gray-300 text-white text-center px-4 py-5 sm:py-6">
        <h1 className="uppercase text-xl sm:text-2xl lg:text-3xl font-bold tracking-wide sm:tracking-widest leading-relaxed">
          Department of Civil Engineering
        </h1>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Programmes */}
        <section className="mb-7">
          <h2 className="font-bold uppercase mb-3 text-gray-800">
            Civil Engineering department presently offers the following
            programmes:
          </h2>

          <ul className="space-y-1">
            <li className="Department-List-Items">
              B.E. in Civil Engineering
            </li>

            <li className="Department-List-Items">
              M.Tech. in the following specialisations:

              <ul className="mt-2 ml-5 sm:ml-6 space-y-1">
                <li className="Department-List-Items Department-List-Items-red">
                  Structural Engineering
                </li>
                <li className="Department-List-Items Department-List-Items-red">
                  Geotechnical Engineering
                </li>
                <li className="Department-List-Items Department-List-Items-red">
                  Water Resources Engineering
                </li>
                <li className="Department-List-Items Department-List-Items-red">
                  Transportation Engineering
                </li>
                <li className="Department-List-Items Department-List-Items-red">
                  Environmental Engineering
                </li>
              </ul>
            </li>

            <li className="Department-List-Items">
              Ph.D. in Civil Engineering
            </li>
          </ul>
        </section>

        {/* Vision */}
        <section className="mb-7">
          <h2 className="font-bold uppercase mb-2 text-gray-800">
            Vision:
          </h2>

          <p className="text-sm sm:text-base leading-7">
            To be a leader in Civil Engineering education by imparting quality
            technical knowledge to achieve excellence in academic research,
            industry and entrepreneurship.
          </p>
        </section>

        {/* Mission */}
        <section className="mb-7">
          <h2 className="font-bold uppercase mb-3 text-gray-800">
            Mission:
          </h2>

          <ul className="space-y-2">
            <li className="Department-List-Items">
              To empower students and faculty with broad knowledge in Civil
              Engineering and applications.
            </li>

            <li className="Department-List-Items">
              To produce Civil engineers, capable of handling technical and
              social challenges.
            </li>

            <li className="Department-List-Items">
              To produce entrepreneurs capable of solving present problems of
              the society.
            </li>

            <li className="Department-List-Items">
              To provide technological services which are sustainable and
              environment friendly.
            </li>
          </ul>
        </section>

        {/* PEOs */}
        <section className="mb-7">
          <h2 className="font-bold uppercase mb-3 text-gray-800">
            Programme Educational Objectives (PEOs):
          </h2>

          <ul className="space-y-2">
            <li className="Department-List-Items">
              Graduates will be actively engaged in a professional career as a
              civil engineer or a related field, an entrepreneur or pursuing
              higher study.
            </li>

            <li className="Department-List-Items">
              Graduates will understand professional practice and demonstrate
              a commitment to act as a responsible, effective and ethical
              citizen undertaking lifelong learning.
            </li>

            <li className="Department-List-Items">
              Graduates guided by principles of sustainable development will
              understand how their activities as a civil engineer or an
              entrepreneur or in a related field affect society and environment.
            </li>

            <li className="Department-List-Items">
              Graduates will develop their communication skills when working as
              team members or leaders, so that they can actively participate in
              their communities and their profession.
            </li>
          </ul>
        </section>

        {/* Department Data */}
        <section className="mb-7">
          <Department name="civil engineering" />
        </section>

        {/* Laboratories */}
        <section className="mb-7">
          <h2 className="font-bold uppercase mb-3 text-gray-800">
            Lab:
          </h2>

          {/* First two images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <img
              src="/Images/Department/CE/lab_1.jpg"
              alt="Civil Engineering Lab 1"
              className="w-full h-auto max-h-96 object-cover rounded-md"
            />

            <img
              src="/Images/Department/CE/lab_2.jpg"
              alt="Civil Engineering Lab 2"
              className="w-full h-auto max-h-96 object-cover rounded-md"
            />
          </div>

          {/* Third image - centered */}
          <div className="flex justify-center mt-4 sm:mt-5">
            <img
              src="/Images/Department/CE/lab_3.jpg"
              alt="Civil Engineering Lab 3"
              className="w-full sm:w-1/2 h-auto max-h-96 object-cover rounded-md"
            />
          </div>
        </section>

        {/* Major Equipment */}
        <section className="mb-7">
          <h2 className="font-bold uppercase mb-3 text-gray-800">
            Other Major Equipments are:
          </h2>

          <ul className="space-y-1">
            <li className="Department-List-Items">
              Microprocessor based UV-visible Spectrophotometer
            </li>
            <li className="Department-List-Items">
              Tri-Axial testing Apparatus
            </li>
            <li className="Department-List-Items">
              Portable DO Meter
            </li>
            <li className="Department-List-Items">
              Digital Control BOD Incubator
            </li>
            <li className="Department-List-Items">
              Trimble Total Station
            </li>
            <li className="Department-List-Items">
              Digital Flame Photometer
            </li>
            <li className="Department-List-Items">
              Electrical Analogy Apparatus
            </li>
            <li className="Department-List-Items">
              Hele-Shaw Apparatus
            </li>
            <li className="Department-List-Items">
              Water Hammer Surge Apparatus
            </li>
            <li className="Department-List-Items">
              Marshal Apparatus
            </li>
          </ul>
        </section>
      </main>

      <Informations />
    </div>
  );
}

export default CE;