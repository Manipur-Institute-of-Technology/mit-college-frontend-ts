import React from "react";
import { AdminReq } from "./AdminReqSample";

function Teachers() {
  return (
    <div className="AdminTeacherMainWrapper">
      <div className="AdminTeachersHeader">Teachers</div>
      <div className="AdminTeachersWrapper">
        {AdminReq.map((item, index) => {
          return (
            <div
              onClick={() => {
                window.location.href = "/Teachers";
              }}
              key={index}
              className="AdminTeachersItem flex justify-center content-center flex-wrap flex-col"
            >
              <div className="flex justify-center content-center gap-5">
                <div className="flex justify-center content-center flex-wrap">
                  Photo
                </div>
                <div>
                  <div className="break-words">Name: {item.name}</div>
                  <div className="break-words">Faculty: {item.faculty}</div>
                  <div className="break-words">
                    Specialist: {item.specialist}
                  </div>
                  <div>Secret Code: {item.scret}</div>
                </div>
              </div>
              <div className="flex justify-center content-center">Action</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Teachers;
