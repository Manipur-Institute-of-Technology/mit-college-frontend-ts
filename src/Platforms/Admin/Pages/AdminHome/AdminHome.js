import React from "react";
import NavBar from "../../Common/NavBar/NavBar";
import TeacherReq from "./TeacherReq";
import Teachers from "./Teachers";
import "./AdminHome.css";

function AdminHome() {
  return (
    <div>
      <NavBar />
      <div className="flex content-center justify-center AdminHomeWrapper">
        <Teachers />
        <TeacherReq />
      </div>
    </div>
  );
}

export default AdminHome;
