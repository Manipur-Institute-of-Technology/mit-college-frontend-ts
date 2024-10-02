import React, { useRef, useState } from "react";
import ReactCardFlip from "react-card-flip";
import { Box, Modal } from "@mui/material";
import OTPInput from "react-otp-input";
import { FaUserCircle } from "react-icons/fa";
// import { toast } from "react-toastify";
import "./SignInSignUP.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  height: "90%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "12px",
};

function SignINSignUP() {
  const [otp, setOtp] = useState("");
  const [Nextstep, SetNextStep] = useState(false);
  const [ChangePassword, SetChangePassword] = useState();
  const [NewPassword, SetNewPassword] = useState();
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [logInEmail, setLogInEmail] = useState("");
  const [logInPassword, setLogInPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [Photo, SetPhoto] = useState("");
  const photoRef = useRef();

  const [OTPOpen, SetOTPOpen] = useState(false);

  const handleOpenPassword = () => {
    setOpenForgotPassword(!openForgotPassword);
    setLogInEmail("");
  };

  const handleOTPFieldOpen = () => {
    SetOTPOpen(!OTPOpen);
    if (OTPOpen === false) {
      SetChangePassword("");
      SetNewPassword("");
    }
  };

  const handleChangePassword = () => {
    setOtp();
    SetOTPOpen(false);
    setOpenForgotPassword(false);
  };

  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setIsFlipped(!isFlipped);
  };

  const handleOpenNextStep = () => {
    SetNextStep(!Nextstep);
    SetPhoto("");
  };

  if (window.location.pathname === "/Admin") {
    return (
      <div className="flex content-center justify-center min-h-screen w-screen overflow-hidden flex-wrap select-none">
        <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
          <div className="flex flex-wrap flex-col justify-center content-center gap-8 p-5 border border-black rounded-bl-3xl rounded-tr-3xl">
            <img
              src="/Images/CollageLogo.png"
              alt="Collage Logo"
              className="w-9/12 "
            />
            <div className="flex content-center justify-center uppercase tracking-wide font-semibold text-xl">
              Admin
            </div>
            <div className="flex flex-col justify-center content-center gap-4 flex-wrap font-serif tracking-wide font-semibold text-xg  ">
              <div className="flex flex-col justify-center content-center gap-2 w-9/12">
                <label>Email</label>
                <input
                  type="email"
                  value={logInEmail || ""}
                  onChange={(e) => {
                    setLogInEmail(e.target.value);
                  }}
                  className="p-1 outline-none border border-gray-500 font-normal"
                ></input>
              </div>
              <div className="flex flex-col justify-center content-center gap-2 w-9/12">
                <label>Password</label>
                <input
                  type="password"
                  value={logInPassword || ""}
                  onChange={(e) => {
                    setLogInPassword(e.target.value);
                  }}
                  className="p-1 outline-none border border-gray-500 font-normal"
                ></input>
              </div>
            </div>
            <div className="flex content-center justify-center flex-wrap">
              <button className="uppercase tracking-wide SignBtn flex content-center justify-center flex-wrap SignIn">
                Sign IN
              </button>
            </div>
            <div className="flex flex-col content-center justify-center  flex-wrap">
              <div className="cursor-pointer" onClick={handleOpenPassword}>
                Forgot Password?
              </div>
              <Modal
                open={openForgotPassword}
                onClose={handleOpenPassword}
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
                      onClick={handleOpenPassword}
                    >
                      X
                    </div>
                  </div>
                  <div className="EmailBlock  text-xl ">
                    <div></div>
                    <div>
                      <div className="m-4 uppercase font-semibold text-lg">
                        Enter Email
                      </div>
                      <input
                        className="p-2 outline-none border border-gray-700"
                        type="Email"
                        onChange={(e) => {
                          setLogInEmail(e.target.value);
                        }}
                        value={logInEmail || ""}
                      />
                    </div>
                    <div
                      onClick={handleOTPFieldOpen}
                      className="flex flex-wrap content-center justify-center Buttons_API_Call uppercase font-semibold select-none cursor-pointer"
                    >
                      Send OTP
                    </div>
                  </div>
                </Box>
              </Modal>
              <Modal
                open={OTPOpen}
                onClose={handleOTPFieldOpen}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
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
                      onClick={() => {
                        SetOTPOpen(!OTPOpen);
                        setOtp();
                      }}
                    >
                      X
                    </div>
                  </div>
                  <div className="OTPWrapper">
                    <div className="OTPHeader">Enter OTP</div>
                    <OTPInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={6}
                      renderSeparator={<span>-</span>}
                      renderInput={(props) => <input {...props} />}
                      containerStyle={{ gap: "0.5rem" }}
                      inputStyle={{
                        height: "3rem",
                        width: "2.5rem",
                        outline: "none",
                        fontSize: "1.2rem",
                        border: "1px solid grey",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                  <input
                    className="p-2 outline-none border border-gray-700"
                    onChange={(e) => {
                      SetChangePassword(e.target.value);
                    }}
                    value={ChangePassword || ""}
                    placeholder="New Password"
                    type="password"
                  />
                  <div>
                    <input
                      className="p-2 outline-none border border-gray-700"
                      placeholder="Confirm Password"
                      type="password"
                      onChange={(e) => {
                        SetNewPassword(e.target.value);
                      }}
                      value={NewPassword || ""}
                    />
                  </div>
                  <div
                    onClick={handleChangePassword}
                    className="flex flex-wrap content-center justify-center Buttons_API_Call uppercase font-semibold select-none cursor-pointer"
                  >
                    Reset Password
                  </div>
                </Box>
              </Modal>
              <div>
                Don't have an account?&ensp;
                <span onClick={handleClick} className="cursor-pointer">
                  register
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap flex-col justify-center content-center gap-8 p-5 border border-black rounded-bl-3xl rounded-tr-3xl">
            <img
              src="/Images/CollageLogo.png"
              alt="Collage Logo"
              className="w-9/12 "
            />
            <div className="flex content-center justify-center uppercase tracking-wide font-semibold text-xl">
              Admin
            </div>
            <div className="flex flex-col justify-center content-center gap-4 flex-wrap font-serif tracking-wide font-semibold text-xg  ">
              <div className="flex flex-col justify-center content-center gap-2 w-9/12">
                <label>Email</label>
                <input
                  type="email"
                  value={signUpEmail || ""}
                  onChange={(e) => {
                    setSignUpEmail(e.target.value);
                  }}
                  className="p-1 outline-none border border-gray-500 font-normal"
                ></input>
              </div>
              <div className="flex flex-col justify-center content-center gap-2 w-9/12">
                <label>Name</label>
                <input
                  type="text"
                  value={signUpName || ""}
                  onChange={(e) => {
                    setSignUpName(e.target.value);
                  }}
                  className="p-1 outline-none border border-gray-500 font-normal"
                ></input>
              </div>
              <div className="flex flex-col justify-center content-center gap-2 w-9/12">
                <label>Password</label>
                <input
                  type="password"
                  value={signUpPassword || ""}
                  onChange={(e) => {
                    setSignUpPassword(e.target.value);
                  }}
                  className="p-1 outline-none border border-gray-500 font-normal"
                ></input>
              </div>
            </div>
            <div className="flex content-center justify-center flex-wrap">
              <button className="uppercase tracking-wide SignBtn flex content-center justify-center flex-wrap Buttons_API_Call">
                Sign UP
              </button>
            </div>
            <div className="flex flex-col content-center justify-center  flex-wrap">
              <div>
                Already have an account?&ensp;
                <span onClick={handleClick} className="cursor-pointer">
                  Sign In
                </span>
              </div>
            </div>
          </div>
        </ReactCardFlip>
      </div>
    );
  } else
    return (
      <div className="flex content-center justify-center min-h-screen w-screen overflow-hidden flex-wrap select-none">
        <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
          <div className="flex flex-wrap flex-col justify-center content-center gap-8 p-5 border border-black rounded-bl-3xl rounded-tr-3xl">
            <img
              src="/Images/CollageLogo.png"
              alt="Collage Logo"
              className="w-9/12 "
            />
            <div className="flex content-center justify-center uppercase tracking-wide font-semibold text-xl">
              Faculty
            </div>
            <div className="flex flex-col justify-center content-center gap-4 flex-wrap font-serif tracking-wide font-semibold text-xg  ">
              <div className="flex flex-col justify-center content-center gap-2 w-9/12">
                <label>Email</label>
                <input
                  type="email"
                  value={logInEmail || ""}
                  onChange={(e) => {
                    setLogInEmail(e.target.value);
                  }}
                  className="p-1 outline-none border border-gray-500 font-normal"
                ></input>
              </div>
              <div className="flex flex-col justify-center content-center gap-2 w-9/12">
                <label>Password</label>
                <input
                  type="password"
                  value={logInPassword || ""}
                  onChange={(e) => {
                    setLogInPassword(e.target.value);
                  }}
                  className="p-1 outline-none border border-gray-500 font-normal"
                ></input>
              </div>
            </div>
            <div className="flex content-center justify-center flex-wrap">
              <button className="uppercase tracking-wide SignBtn flex content-center justify-center flex-wrap SignIn">
                Sign IN
              </button>
            </div>
            <div className="flex flex-col content-center justify-center  flex-wrap">
              <div className="cursor-pointer" onClick={handleOpenPassword}>
                Forgot Password?
              </div>
              <Modal
                open={openForgotPassword}
                onClose={handleOpenPassword}
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
                      onClick={handleOpenPassword}
                    >
                      X
                    </div>
                  </div>
                  <div className="EmailBlock  text-xl ">
                    <div></div>
                    <div>
                      <div className="m-4 uppercase font-semibold text-lg">
                        Enter Email
                      </div>
                      <input
                        className="p-2 outline-none border border-gray-700"
                        type="Email"
                        onChange={(e) => {
                          setLogInEmail(e.target.value);
                        }}
                        value={logInEmail || ""}
                      />
                    </div>
                    <div
                      onClick={handleOTPFieldOpen}
                      className="flex flex-wrap content-center justify-center Buttons_API_Call uppercase font-semibold select-none cursor-pointer"
                    >
                      Send OTP
                    </div>
                  </div>
                </Box>
              </Modal>
              <Modal
                open={OTPOpen}
                onClose={handleOTPFieldOpen}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
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
                      onClick={() => {
                        SetOTPOpen(!OTPOpen);
                        setOtp();
                      }}
                    >
                      X
                    </div>
                  </div>
                  <div className="OTPWrapper">
                    <div className="OTPHeader">Enter OTP</div>
                    <OTPInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={6}
                      renderSeparator={<span>-</span>}
                      renderInput={(props) => <input {...props} />}
                      containerStyle={{ gap: "0.5rem" }}
                      inputStyle={{
                        height: "3rem",
                        width: "2.5rem",
                        outline: "none",
                        fontSize: "1.2rem",
                        border: "1px solid grey",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                  <input
                    className="p-2 outline-none border border-gray-700"
                    onChange={(e) => {
                      SetChangePassword(e.target.value);
                    }}
                    value={ChangePassword || ""}
                    placeholder="New Password"
                    type="password"
                  />
                  <div>
                    <input
                      className="p-2 outline-none border border-gray-700"
                      placeholder="Confirm Password"
                      type="password"
                      onChange={(e) => {
                        SetNewPassword(e.target.value);
                      }}
                      value={NewPassword || ""}
                    />
                  </div>
                  <div
                    onClick={handleChangePassword}
                    className="flex flex-wrap content-center justify-center Buttons_API_Call uppercase font-semibold select-none cursor-pointer"
                  >
                    Reset Password
                  </div>
                </Box>
              </Modal>
              <div>
                Don't have an account?&ensp;
                <span onClick={handleClick} className="cursor-pointer">
                  register
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap flex-col justify-center content-center gap-8 p-5 border border-black rounded-bl-3xl rounded-tr-3xl">
            <img
              src="/Images/CollageLogo.png"
              alt="Collage Logo"
              className="w-9/12 "
            />
            <div className="flex content-center justify-center uppercase tracking-wide font-semibold text-xl">
              Faculty
            </div>
            <div className="flex flex-col justify-center content-center gap-4 flex-wrap font-serif tracking-wide font-semibold text-xg  ">
              <div className="flex flex-col justify-center content-center gap-2 w-9/12">
                <label>Email</label>
                <input
                  type="email"
                  value={signUpEmail || ""}
                  onChange={(e) => {
                    setSignUpEmail(e.target.value);
                  }}
                  className="p-1 outline-none border border-gray-500 font-normal"
                ></input>
              </div>
              <div className="flex flex-col justify-center content-center gap-2 w-9/12">
                <label>Name</label>
                <input
                  type="text"
                  value={signUpName || ""}
                  onChange={(e) => {
                    setSignUpName(e.target.value);
                  }}
                  className="p-1 outline-none border border-gray-500 font-normal"
                ></input>
              </div>
              <div className="flex flex-col justify-center content-center gap-2 w-9/12">
                <label>Password</label>
                <input
                  type="password"
                  value={signUpPassword || ""}
                  onChange={(e) => {
                    setSignUpPassword(e.target.value);
                  }}
                  className="p-1 outline-none border border-gray-500 font-normal"
                ></input>
              </div>
            </div>
            <div className="flex content-center justify-center flex-wrap">
              <button
                className="uppercase tracking-wide SignBtn flex content-center justify-center flex-wrap NextStep"
                onClick={handleOpenNextStep}
              >
                Next Step
              </button>
              <Modal
                open={Nextstep}
                onClose={handleOpenNextStep}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
              >
                <Box
                  sx={{
                    ...style,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "center",
                    gap: "2rem",
                  }}
                >
                  <div className="Header flex content-end justify-between p-5 min-w-full justify-self-start gap-5 ">
                    <div></div>
                    <div
                      className="text-4xl cursor-pointer select-none"
                      onClick={handleOpenNextStep}
                    >
                      X
                    </div>
                  </div>
                  <div className="flex content-center justify-center flex-wrap min-w-full gap-10 flex-col">
                    <div className="flex content-center justify-center flex-wrap">
                      <div
                        className="flex content-center justify-center flex-wrap TeacherPhotoInput"
                        onClick={() => {
                          photoRef.current.click();
                        }}
                      >
                        {Photo ? (
                          <img
                            className="Photo"
                            src={URL.createObjectURL(Photo)}
                            alt="PersonPhoto"
                          />
                        ) : (
                          <FaUserCircle className="UserIcon" size={100} />
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
                    </div>
                    <div className="grid">
                      <div className="flex content-center justify-between">
                        <label>Department</label>
                        <select className="p-1 outline-none border border-gray-500 font-normal TeacherDataInput">
                          <option value="Civil Engineering">
                            Civil Engineering
                          </option>
                          <option value="Computer Science and Engineering">
                            Computer Science and Engineering
                          </option>
                          <option value="Electrical Engineering">
                            Electrical Engineering
                          </option>
                          <option value="Electronics and Communication Engineering">
                            Electronics and Communication Engineering
                          </option>
                          <option value="Mechanical Engineering">
                            Mechanical Engineering
                          </option>
                          <option value="Basic Science and Humanities">
                            Basic Science and Humanities
                          </option>
                        </select>
                      </div>

                      <div className="flex content-center justify-between">
                        <label>Faculty</label>
                        <select className="p-1 outline-none border border-gray-500 font-normal TeacherDataInput">
                          <option value="Assistant Professor">
                            Assistant Professor
                          </option>
                          <option value="Guest Faculty">Guest Faculty</option>
                        </select>
                      </div>

                      <div className="flex content-center justify-between">
                        <label>Specialist</label>
                        <input
                          type="text"
                          className="p-1 outline-none border border-gray-500 font-normal TeacherDataInput"
                        />
                      </div>

                      <div className="flex content-center justify-between">
                        <label>Qualification</label>
                        <select className="p-1 outline-none border border-gray-500 font-normal TeacherDataInput">
                          <option value="Ph.D.">Ph.D.</option>
                          <option value="M.E.">M.E.</option>
                          <option value="M.Tech.">M.Tech.</option>
                        </select>
                      </div>

                      <div className="flex content-center justify-between">
                        <label>Address</label>
                        <input
                          type="text"
                          className="p-1 outline-none border border-gray-500 font-normal TeacherDataInput"
                        />
                      </div>
                      <div className="flex content-center justify-between">
                        <label>phone number</label>
                        <input
                          type="number"
                          className="p-1 outline-none border border-gray-500 font-normal TeacherDataInput"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <button className="flex flex-wrap content-center justify-center Buttons_API_Call uppercase font-semibold select-none cursor-pointer">
                      Register
                    </button>
                  </div>
                </Box>
              </Modal>
            </div>
            <div className="flex flex-col content-center justify-center  flex-wrap">
              <div>
                Already have an account?&ensp;
                <span onClick={handleClick} className="cursor-pointer">
                  Sign In
                </span>
              </div>
            </div>
          </div>
        </ReactCardFlip>
      </div>
    );
}

export default SignINSignUP;
