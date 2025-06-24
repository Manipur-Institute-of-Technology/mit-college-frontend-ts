import React from "react";
import { FaUserCircle } from "react-icons/fa";

export type PaperType = {
  desc: string;
  link: string;
};

export type TeacherDataType = {
  name: string;
  position: string;
  email: string;
  phone_No: string;
  Photo: string;
  HOD: boolean;
  speacility: string;
  qualification: string;
  department: string;
  papers: PaperType[];
};

type TeacherProfileViewProps = {
  teachers: TeacherDataType[];
};

const Teacher_Profile_View: React.FC<TeacherProfileViewProps> = ({ teachers }) => {
  return (
    <div className="p-4 space-y-6 bg-gray-50 rounded-lg shadow">
      {teachers.map((teacher, index) => {
        console.log("Photo URL:", teacher.Photo);
        const photoSrc = teacher.Photo && teacher.Photo.trim() !== "" ? "/" + teacher.Photo : null;
        console.log(photoSrc)

        return (
          <div key={index} className="space-y-6">
            <h2 className="text-xl font-bold text-center uppercase">Faculty Profile</h2>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex flex-col items-center bg-white rounded shadow p-4 w-full lg:w-1/3">
                {photoSrc ? (
                  <img
                    src={photoSrc}
                    alt="Profile"
                    className="w-40 h-50 object-fit rounded-md border"
                  />
                ) : (
                  <FaUserCircle className="w-40 h-40 text-gray-400" />
                )}

                <h3 className="text-xl font-semibold mt-4 text-center">{teacher.name}</h3>
                <p className="text-sm text-gray-600 text-center">{teacher.position}</p>
              </div>

              <div className="bg-white rounded shadow p-4 w-full lg:w-2/3 space-y-4">
                <div className="flex flex-wrap gap-4">
                  <div className="w-full sm:w-[45%]">
                    <p className="font-semibold">Email:</p>
                    <p>{teacher.email}</p>
                  </div>
                  <div className="w-full sm:w-[45%]">
                    <p className="font-semibold">Phone:</p>
                    <p>{teacher.phone_No}</p>
                  </div>
                  <div className="w-full sm:w-[45%]">
                    <p className="font-semibold">Qualification:</p>
                    <p>{teacher.qualification}</p>
                  </div>
                  <div className="w-full">
                    <p className="font-semibold">Speciality:</p>
                    <p>{teacher.speacility}</p>
                  </div>
                  <div className="w-full">
                    <p className="font-semibold">Department:</p>
                    <p>{teacher.department}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h3 className="text-lg font-semibold mb-4">Papers</h3>
              {teacher.papers.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {teacher.papers.map((paper, paperIndex) => (
                    <div key={paperIndex} className="border p-3 rounded bg-gray-50">
                      <p>
                        <span className="font-medium">Description:</span> {paper.desc || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Link:</span>{" "}
                        {paper.link ? (
                          <a
                            href={paper.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            {paper.link}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No papers available.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Teacher_Profile_View;
