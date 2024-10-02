import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminHome from "../../Platforms/Admin/Pages/AdminHome/AdminHome";
import { AdminStorage } from "../Storage/AdminStorage";
import SignINSignUP from "../../Platforms/common/SignInSignUP/SignINSignUP";
import Mail from "../../Platforms/Admin/Pages/Mail/Mail";
import ImageCarousal from "../../Platforms/Admin/Pages/ImageCarousal/ImageCarousal";

function AdminRouter() {
  const { state } = AdminStorage();

  // const validataion = state?.AdminToken;
  const validataion = 1;

  console.log("Admin Token: ", validataion);

  if (validataion === "" || validataion === undefined) {
    return (
      <Routes>
        <Route path="Admin">
          <Route index element={<SignINSignUP />} />
        </Route>
      </Routes>
    );
  } else {
    return (
      <Routes>
        <Route path="Admin/">
          <Route index element={<AdminHome />} />
          <Route path="Mail" element={<Mail />} />
          <Route path="ImageCarousal" element={<ImageCarousal />} />
        </Route>
      </Routes>
    );
  }
}

export default AdminRouter;
