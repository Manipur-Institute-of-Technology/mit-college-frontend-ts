import Informations from "~/Common/Informations/Informations";
import Department from "../DepartmentData";
import "../Department.css";

function CSE() {
  return (
    <div className="min-h-dvh bg-white text-gray-700">
      {/* Department Header */}
      <div className="bg-cyan-500 border-b border-gray-300 text-white text-center px-4 py-5 sm:py-6">
        <h1 className="uppercase text-xl sm:text-2xl lg:text-3xl font-bold tracking-wide sm:tracking-widest leading-relaxed">
          Department of Computer Science and Engineering
        </h1>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Programmes */}
        <section className="mb-7">
          <h2 className="font-bold uppercase mb-3 text-gray-800">
            Computer Science and Engineering department presently offers the
            following programmes:
          </h2>

          <ul className="space-y-1">
            <li className="Department-List-Items">
              B.E. in Computer Science & Engineering
            </li>
            <li className="Department-List-Items">
              M.Tech in Computer Science & Engineering
            </li>
            <li className="Department-List-Items">
              Ph.D. in Computer Science & Engineering
            </li>
          </ul>
        </section>

        {/* Vision */}
        <section className="mb-7">
          <h2 className="font-bold uppercase mb-2 text-gray-800">
            Vision:
          </h2>

          <p className="leading-7 text-sm sm:text-base">
            To be a leader in Computer Science and Engineering education by
            imparting quality technical knowledge and fostering innovation,
            research, and entrepreneurship to achieve excellence in academia,
            industry, and society.
          </p>
        </section>

        {/* Mission */}
        <section className="mb-7">
          <h2 className="font-bold uppercase mb-3 text-gray-800">
            Mission:
          </h2>

          <ul className="space-y-2">
            <li className="Department-List-Items">
              To empower students and faculty with strong knowledge in Computer
              Science and Engineering and its applications.
            </li>

            <li className="Department-List-Items">
              To produce skilled computer science professionals capable of
              addressing technical and societal challenges through innovative
              solutions.
            </li>

            <li className="Department-List-Items">
              To nurture entrepreneurs and innovators capable of developing
              technology solutions to solve present and emerging problems of
              society.
            </li>

            <li className="Department-List-Items">
              To promote research and provide technological solutions that are
              sustainable, ethical, secure, and beneficial to society.
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
              Graduates will be actively engaged in professional careers in
              Computer Science and Engineering or related fields, as
              entrepreneurs, or pursue higher studies and research.
            </li>

            <li className="Department-List-Items">
              Graduates will apply their technical knowledge, problem-solving
              skills, and professional practices to address complex computing
              and societal challenges while demonstrating ethical
              responsibility and lifelong learning.
            </li>

            <li className="Department-List-Items">
              Graduates will understand the impact of computing technologies on
              society and the environment and develop sustainable, secure, and
              responsible technological solutions.
            </li>

            <li className="Department-List-Items">
              Graduates will develop effective communication, teamwork,
              leadership, and professional skills to actively contribute to
              their communities, organizations, and the computing profession.
            </li>
          </ul>
        </section>

        {/* Department Data */}
        <section className="mb-7">
          <Department name="computer science & engineering" />
        </section>

        {/* Laboratories */}
        <section className="mb-7">
          <h2 className="font-bold uppercase mb-3 text-gray-800">
            Lab:
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <img
              src="/Images/Department/CSE/img_1.jpg"
              alt="Computer Science and Engineering Lab 1"
              className="w-full h-auto max-h-96 object-cover rounded-md"
            />

            <img
              src="/Images/Department/CSE/img_2.jpg"
              alt="Computer Science and Engineering Lab 2"
              className="w-full h-auto max-h-96 object-cover rounded-md"
            />
          </div>
        </section>

        {/* Facilities */}
        <section className="mb-7">
          <h2 className="font-bold uppercase mb-3 text-gray-800">
            Facilities:
          </h2>

          <div className="space-y-4 leading-7 text-sm sm:text-base">
            <p>
              The Department has several state-of-the-art Computer Laboratories
              with a host of servers, workstations, and a large number of i3 and
              i5 Desktop Computers connected to the Campus-wide LAN with access
              to the internet through NKN (National Knowledge Network).
            </p>

            <p>
              The system runs on a wide variety of operating systems including
              Linux Red Hat, Windows 7 Professional, Windows 8, high-profile
              Anti-Virus, MySQL, Oracle, Visual Studio, Adobe Premiere, and
              Maya. The laboratories are equipped with up-to-date office
              automation software, file servers, state-of-the-art compilers,
              and programming environments.
            </p>

            <p>
              The department has Hardware Lab, Software Lab, Networking Lab,
              and Graphic Lab, which are well equipped with the latest Core i3
              and i5 PCs. The Network Laboratory is equipped with wireless
              networking systems, LAN trainers, and Wi-Fi connectivity. The
              Hardware Lab is equipped with various training kits,
              experimental setups, and analyzer equipment.
            </p>
          </div>

          <ul className="mt-4 space-y-3">
            <li className="Department-List-Items">
              <span className="font-semibold">PCs:</span> Core i3 and i5
              Desktop Computers and Data Servers are available in various
              laboratories.
            </li>

            <li className="Department-List-Items">
              <span className="font-semibold">INTERNET:</span>

              <ul className="mt-2 ml-5 space-y-2 list-disc">
                <li className="text-sm sm:text-base leading-6">
                  High-speed Internet access with separate cable connectivity
                  for academic departments, hostels, library, and browsing
                  centre.
                </li>

                <li className="text-sm sm:text-base leading-6">
                  Wi-Fi Campus
                </li>
              </ul>
            </li>
          </ul>
        </section>
      </main>

      <Informations />
    </div>
  );
}

export default CSE;