import React from "react";
import Teachers from "./Teachers";

function TeachersMain() {
  return (
    <div className="min-h-screen w-screen flex content-center justify-center flex-wrap">
      <div className=" flex content-center justify-center flex-wrap flex-col gap-10 TeacherProfileBlock">
        <Teachers />
      </div>
    </div>
  );
}

export default TeachersMain;
