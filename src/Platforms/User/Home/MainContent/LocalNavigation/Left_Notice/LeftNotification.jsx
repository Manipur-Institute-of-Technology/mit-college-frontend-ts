import "../LocalNavigation.css";
import React from "react";

export function LeftNotification() {
  return (
    <div className="LeftNotification">
      <div className="LeftNavigation_wrapper ">
        <div className="LeftNavigation_Header">
          <h1>News and Notices</h1>
        </div>
        <marquee direction="up" scrollamount="2.6" className="news_n_notices">
          <div className="LeftNavigation_options">
            <a href="Principal_0">Principal</a>
          </div>
          <div className="LeftNavigation_options">
            <a href="Principal_0">Link_1</a>
          </div>
          <div className="LeftNavigation_options">
            <a href="Principal_0">Link_2</a>
          </div>
          <div className="LeftNavigation_options">
            <a href="Principal_0">Link_3</a>
          </div>
          <div className="LeftNavigation_options">
            <a href="Principal_0">Link_4</a>
          </div>
          <div className="LeftNavigation_options">
            <a href="Principal_0">Link_5</a>
          </div>
          <div className="LeftNavigation_options">
            <a href="Principal_0">Link_6</a>
          </div>
          <div className="LeftNavigation_options">
            <a href="Principal_0">Link_7</a>
          </div>
        </marquee>
      </div>
    </div>
  );
}
