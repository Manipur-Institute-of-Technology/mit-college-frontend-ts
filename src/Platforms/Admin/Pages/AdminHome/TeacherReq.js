import React from "react";
import { AdminReq } from "./AdminReqSample";

function TeacherReq() {
  return (
    <div className="TeacherReqMainWrapper">
      <div className="TeacherWrapperTableHeader">
        <div className="flex content-center justify-center flex-wrap">Name</div>
        <div className="flex content-center justify-center flex-wrap">
          Department
        </div>
        <div className="flex content-center justify-center flex-wrap">
          Faculty
        </div>
        <div className="flex content-center justify-center flex-wrap">
          Specialist
        </div>
        <div className="flex content-center justify-center flex-wrap">
          Action
        </div>
      </div>
      <div className="TeacherWrapperTableBody">
        {AdminReq.map((item, index) => {
          return (
            <div key={index} className="TeacherTableItems">
              <div className="flex content-center justify-center flex-wrap">
                {item.name}
              </div>
              <div className="flex content-center justify-center flex-wrap">
                {item.Dept}
              </div>
              <div className="flex content-center justify-center flex-wrap">
                {item.faculty}
              </div>
              <div className="flex content-center justify-center flex-wrap">
                {item.specialist}
              </div>
              <div className="flex content-center justify-center flex-wrap">
                Action
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TeacherReq;
