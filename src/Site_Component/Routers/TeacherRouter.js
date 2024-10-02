import React from "react";
import { Route, Routes } from "react-router-dom";
import TeacherProfile from "../../Platforms/Teacher/TeacherProfile";
import { TeacherStorage } from "../Storage/TeacherStorage";
import SignINSignUP from "../../Platforms/common/SignInSignUP/SignINSignUP";

function TeacherRouter() {
  const { state } = TeacherStorage();

  // const validataion = state?.UserToken;
  const validataion = 1;

  console.log("Teacher Token: ", validataion);

  if (validataion === "" || validataion === undefined) {
    return (
      <Routes>
        <Route path="Faculty">
          <Route index element={<SignINSignUP />} />
        </Route>
      </Routes>
    );
  } else {
    return (
      <Routes>
        <Route path="Faculty">
          <Route index element={<TeacherProfile />} />
        </Route>
      </Routes>
    );
  }
}

export default TeacherRouter;
