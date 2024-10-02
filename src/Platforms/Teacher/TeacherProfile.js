import React, { useEffect, useRef, useState } from "react";
import { SamplePaperList } from "./samplePaperList";
import "./TeacherProfile.css";
import { FaUser } from "react-icons/fa";
import { Box } from "@mui/system";
import { Modal } from "@mui/material";
import Teachers from "../common/Teachers/Teachers";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  height: "90%",
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "12px",
};

function TeacherProfile() {
  const [OpenEditProfile, SetOpenEditProfile] = useState(false);
  const [OpenPaper, SetOpenPaper] = useState(false);
  const photoRef = useRef();
  const [Photo, SetPhoto] = useState("");

  useEffect(() => {
    if (Photo) {
      const objectUrl = URL.createObjectURL(Photo);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [Photo]);

  const handleOpenPaper = () => {
    SetOpenPaper(!OpenPaper);
  };

  const handleEditProfile = () => {
    SetOpenEditProfile(!OpenEditProfile);
  };

  const Faculty = [];

  return (
    <div className="min-h-screen w-screen flex content-center justify-center flex-wrap">
      <div className=" flex content-center justify-center flex-wrap flex-col gap-10 TeacherProfileBlock">
        <Teachers />
        {/* <div className="TeacherProfileWrapper">
          <div className="flex content-center justify-center flex-wrap ">
            {Faculty?.picture ? (
              <img
                src={Faculty.picture}
                alt="Teacher"
                className="TeacherProfilePictureWrapper"
              />
            ) : (
              <FaUser className="TeacherProfilePictureWrapper" />
            )}
          </div>
          <div className="TeacherDataWrapper">
            <div className="flex justify-between content-start gap-5">
              <div>Name:</div>
              <div>Real Name</div>
            </div>
            <div className="flex justify-between content-start gap-5">
              <div>Facluty:</div>
              <div>Faculty Name</div>
            </div>
            <div className="flex justify-between content-start gap-5">
              <div>Subject:</div>
              <div>Subject Name</div>
            </div>
            <div className="flex justify-between content-start gap-5">
              <div>Qualification:</div>
              <div>Qualification Name</div>
            </div>
            <div className="flex justify-between content-start gap-5">
              <div>Field Of Study:</div>
              <div>Field Name</div>
            </div>
            <div className="flex justify-between content-start gap-5">
              <div>Email:</div>
              <div>Email Name</div>
            </div>
            <div className="flex justify-between content-start gap-5">
              <div>Phone Number</div>
              <div>Phone Number</div>
            </div>
            <div className="flex justify-between content-start gap-5 AddressWrapper">
              <div>Address</div>
              <div>Kontha Khabam Maning Leikai</div>
            </div>
            <div className="flex justify-between content-start gap-5 PaperBlock">
              <div>Papers:</div>
              <div className="PapersItems flex content-center justify-start flex-col">
                {SamplePaperList.map((item, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        window.location.href = item?.links;
                      }}
                      className="flex content-center justify-start gap-3 PaperItem"
                    >
                      <div>{index + 1}.</div>
                      <div>{item?.paperName}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div> */}
        <div className="flex content-center justify-center flex-wrap gap-10">
          <button
            className=" UpdateTeacher AddPaperTeacher flex content-center justify-center flex-wrap font-semibold tracking-wide uppercase "
            onClick={handleOpenPaper}
          >
            Add Paper
          </button>
          <Modal
            open={OpenPaper}
            onClose={handleOpenPaper}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box
              sx={{
                ...style,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "2rem",
                width: "50%",
                height: "60%",
              }}
            >
              <div className="Header flex content-end justify-between p-5 min-w-full justify-self-start gap- ">
                <div></div>
                <div
                  className="text-4xl cursor-pointer select-none"
                  onClick={handleOpenPaper}
                >
                  X
                </div>
              </div>
              <div className="flex flex-col content-start justify-start flex-wrap gap-4 w-3/4 h-3/4 text-lg">
                <div className="flex flex-col content-start justify-start gap-2 w-full">
                  <label className="font-semibold">
                    Enther the title of the paper
                  </label>
                  <input
                    value={""}
                    type="text"
                    className="p-1 border-black outline-none border w-full"
                  />
                </div>
                <div className="flex flex-col content-start justify-start gap-2 w-full">
                  <label className="font-semibold">
                    Provide the link to the paper
                  </label>
                  <input
                    value={""}
                    type="text"
                    className="p-1 border-black outline-none border w-full"
                  />
                </div>
              </div>
              <button className="AddPaperTeacher flex content-center justify-center flex-wrap font-semibold tracking-wide uppercase pt-4 pb-4 pl-16 pr-16 rounded-xl">
                Add Paper
              </button>
            </Box>
          </Modal>
          <button
            className="UpdateTeacher flex content-center justify-center flex-wrap font-semibold tracking-wide uppercase cursor-pointer"
            onClick={handleEditProfile}
          >
            Update Profile
          </button>
          <Modal
            open={OpenEditProfile}
            onClose={handleEditProfile}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box
              sx={{
                ...style,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "2rem",
              }}
            >
              <div className="Header flex content-end justify-between p-5 min-w-full justify-self-start gap- ">
                <div></div>
                <div
                  className="text-4xl cursor-pointer select-none"
                  onClick={handleEditProfile}
                >
                  X
                </div>
              </div>
              <div className="flex content-center justify-center flex-wrap w-full">
                <div className=" UpdateTeacherProfileWrapper">
                  <div
                    className="EditTeacherWrapper flex content-center justify-center flex-wrap"
                    onClick={() => {
                      photoRef.current.click();
                    }}
                  >
                    {Faculty?.picture ? (
                      <img
                        src={Faculty.picture}
                        alt="Teacher"
                        className="flex content-center justify-center flex-wrap TeacherProfilePictureWrapper"
                      />
                    ) : (
                      Photo && (
                        <img
                          className="flex content-center justify-center flex-wrap TeacherProfilePictureWrapper"
                          src={URL.createObjectURL(Photo)}
                          alt="PersonPhoto"
                        />
                      )
                    )}
                    <input
                      type="file"
                      alt=""
                      style={{ display: "none" }}
                      ref={photoRef}
                      accept="image/png, image/jpeg"
                      onChange={(e) => {
                        SetPhoto(e.target.files[0]);
                      }}
                    />
                  </div>
                  <div className="TeacherDataWrapper w-full">
                    <div className="flex flex-col content-center justify-center gap-2 text-lg tracking-wider">
                      <div className="font-semibold uppercase">Name</div>
                      <input
                        type="text"
                        value={"duhhh"}
                        className="outline-none p-1 border-black border"
                      />
                    </div>
                    <div className="flex flex-col content-center justify-center gap-2 text-lg tracking-wider">
                      <div className="font-semibold uppercase">Facluty</div>
                      <input
                        type="text"
                        value={"duhhh"}
                        className="outline-none p-1 border-black border"
                      />
                    </div>
                    <div className="flex flex-col content-center justify-center gap-2 text-lg tracking-wider">
                      <div className="font-semibold uppercase">Subject</div>
                      <input
                        type="text"
                        value={"duhhh"}
                        className="outline-none p-1 border-black border"
                      />
                    </div>
                    <div className="flex flex-col content-center justify-center gap-2 text-lg tracking-wider">
                      <div className="font-semibold uppercase">
                        Qualification
                      </div>
                      <input
                        type="text"
                        value={"duhhh"}
                        className="outline-none p-1 border-black border"
                      />
                    </div>
                    <div className="flex flex-col content-center justify-center gap-2 text-lg tracking-wider">
                      <div className="font-semibold uppercase">
                        Field Of Study
                      </div>
                      <input
                        type="text"
                        value={"duhhh"}
                        className="outline-none p-1 border-black border"
                      />
                    </div>
                    <div className="flex flex-col content-center justify-center gap-2 text-lg tracking-wider">
                      <div className="font-semibold uppercase">Address</div>
                      <input
                        type="text"
                        value={"duhhh"}
                        className="outline-none p-1 border-black border"
                      />
                    </div>
                    <div className="flex flex-col content-center justify-center gap-2 text-lg tracking-wider">
                      <div className="font-semibold uppercase">
                        Phone Number
                      </div>
                      <input
                        type="text"
                        value={"duhhh"}
                        className="outline-none p-1 border-black border"
                      />
                    </div>
                    <div className="flex flex-col content-center justify-center gap-2 text-lg tracking-wider">
                      <div className="font-semibold uppercase">Email</div>
                      <input
                        type="text"
                        value={"duhhh"}
                        className="outline-none p-1 border-black border"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex content-center justify-center flex-wrap font-semibold uppercase text-xl tracking-wider UpdateTeacher cursor-pointer">
                Update
              </div>
            </Box>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default TeacherProfile;
