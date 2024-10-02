import React from "react";
import { SamplePaperList } from "../../Teacher/samplePaperList";
import { FaUser } from "react-icons/fa";

function Teachers() {
  const Faculty = [];

  return (
    <div className="TeacherProfileWrapper">
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
    </div>
  );
}

export default Teachers;
