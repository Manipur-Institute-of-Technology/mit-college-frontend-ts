import React from "react";
import NavBar from "../../Common/NavBar/NavBar";
import { MailSample } from "./MailSample";
import "./Mail.css";

function Mail() {
  return (
    <div>
      <NavBar />
      <div className="MailWrapper">
        <div
          className="MailHeaderWrapper flex flex-wrap text-xl content-center justify-center font-semibold tracking-wide
        text-white uppercase"
        >
          Mail
        </div>
        <div className="MailBodyWrapper flex flex-col p-5">
          {MailSample.map((item, index) => {
            return (
              <div key={index} className="MailBodyItem">
                <div className="flex content-center justify-center flex-wrap">
                  {item.Name}
                </div>
                <div className="flex content-center justify-center flex-wrap">
                  <textarea
                    className="flex content-center justify-center flex-wrap MailItemMessage"
                    value={item.Message}
                    readOnly
                  ></textarea>
                </div>
                <div className="flex content-center justify-center flex-wrap">
                  Action
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Mail;
