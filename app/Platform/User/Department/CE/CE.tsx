import { useEffect, useState } from "react";
import Informations from "~/Common/Informations/Informations";
import "../Department.css";

function CE() {

  return (
      <>
        <div className="min-h-dvh">
          <div className="uppercase text-2xl font-bold tracking-widest p-4 bg-cyan-500 border-2 border-gray-300 rounded-xs text-white text-center shadow-xs">
            Department of Civil Engineering
          </div>
          <div className="ml-1 mt-4 tracking-wide">
            <div className="font-bold uppercase mb-2">Civil Engineering department presently offers the following programmes:</div>
            <ul>
              <li className="Department-List-Items">B.E. in Civil Engineering</li>
              <li className="Department-List-Items">
                M. Tech. in the following specialisations
                <ul>
                  <li className="Department-List-Items Department-List-Items-red">Structural Engineering</li>
                  <li className="Department-List-Items Department-List-Items-red">Geotechnical Engineering</li>
                  <li className="Department-List-Items Department-List-Items-red">Water Resources Engineering</li>
                  <li className="Department-List-Items Department-List-Items-red">Transportation Engineering</li>
                  <li className="Department-List-Items Department-List-Items-red">Environmental Engineering</li>
                </ul>
              </li>
              <li className="Department-List-Items">Ph. D. in Civil Engineering</li>
            </ul>
            <div className="font-bold uppercase mb-2 mt-2">Vision:</div>
            <div>To be a leader in Civil Engineering education by imparting quality technical knowledge to achieve excellence in academic research, industry and entrepreneurship.</div>
            <div className="font-bold uppercase mb-2 mt-2">Mission:</div>
            <ul>
              <li className="Department-List-Items">To empower students and faculty with broad knowledge in Civil Engineering and applications.</li>
              <li className="Department-List-Items">To produce Civil engineers, capable of handling technical and social challenges.</li>
              <li className="Department-List-Items">To produce entrepreneurs capable of solving present problems of the society.</li>
              <li className="Department-List-Items">To provide technological services which are sustainable and environment friendly.</li>
            </ul>
            <div className="font-bold uppercase mb-2 mt-2">Programme Educational Objectives (PEOs):</div>
            <ul>
              <li className="Department-List-Items">Graduates will be actively engaged in a professional career as a civil engineer or a related field, an entrepreneur or pursuing higher study.</li>
              <li className="Department-List-Items">Graduates will understand professional practice and demonstrate a commitment to act as a responsible, effective and ethical citizen undertaking lifelong learning.</li>
              <li className="Department-List-Items">Graduates guided by principles of sustainable development will understand how their activities as a civil engineer or an entrepreneur or in a related field affect society and environment.</li>
              <li className="Department-List-Items">Graduates will develop their communication skills when working as team members or leaders, so that they can actively participate in their communities and their profession.</li>
            </ul>
          </div>
          <Informations />
        </div>
      </>
    );
}

export default CE
