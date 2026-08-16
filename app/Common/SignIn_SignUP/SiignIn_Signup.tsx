import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEye,
  FaEyeSlash,
  FaCamera,
  FaArrowLeft,
  FaTimes,
  FaEnvelope,
  FaKey,
  FaLock,
  FaCheckCircle,
  FaHome,
} from "react-icons/fa";

import { useAuth } from "~/context/AuthContext";
import apiClient from "~/utils/apiClient";

type Props = {
  role: "admin" | "faculty";
};

type Department = {
  _id: string;
  name: string;
};

type ForgotStep =
  | "email"
  | "otp"
  | "password";

type UserFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  securityCode: string;

  photo: File | null;
  photoPreview: string;
  photoId: string;

  namePrefix: string;
  firstName: string;
  middleName: string;
  lastName: string;

  phoneNumber: string;

  sex:
    | "male"
    | "female"
    | "other"
    | "prefer not to say";

  dob: string;

  departmentName: string;
  highestDegree: string;
  expertFields: string;
  facultyRole: string;
  bios: string;

  otpToken: string;
};

const facultyRoles = [
  "principal",
  "chairman",
  "professor",
  "guest professor",
  "associate professor",
  "guest lecturer",
  "teaching assistant",
  "male warden",
  "female warden",
  "dean",
  "lab technician",
  "administrative assistant",
  "registrar",
  "librarian",
  "vice chancellor",
];

const inputClass =
  "w-full p-3 text-sm border border-gray-300 rounded-xl " +
  "focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 " +
  "focus:outline-none transition";

const initialFormData: UserFormData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  securityCode: "",

  photo: null,
  photoPreview: "",
  photoId: "",

  namePrefix: "",
  firstName: "",
  middleName: "",
  lastName: "",

  phoneNumber: "",

  sex: "prefer not to say",

  dob: "",

  departmentName: "",
  highestDegree: "",
  expertFields: "",
  facultyRole: "professor",
  bios: "",

  otpToken: "",
};

export default function SignIn_SignUP({
  role,
}: Props) {
  // =========================================================
  // NAVIGATION
  // =========================================================

  const navigate = useNavigate();

  // =========================================================
  // AUTH
  // =========================================================

  const {
    setToken,
    setRole,
    setUser,
  } = useAuth();

  const getMinimumDOB = () => {
    const today = new Date();

    today.setFullYear(
      today.getFullYear() - 24
    );

    return today
      .toISOString()
      .split("T")[0];
  };

  // =========================================================
  // MODE
  // =========================================================

  const [isSignUp, setIsSignUp] =
    useState(false);

  // =========================================================
  // FACULTY LOGIN METHOD
  // =========================================================

  const [loginMethod, setLoginMethod] =
    useState<
      "password" | "securityCode"
    >("password");

  // =========================================================
  // SIGNUP STEP
  // =========================================================

  const [signupStep, setSignupStep] =
    useState(1);

  // =========================================================
  // FORM
  // =========================================================

  const [formData, setFormData] =
    useState<UserFormData>(
      initialFormData
    );

  // =========================================================
  // DEPARTMENTS
  // =========================================================

  const [departments, setDepartments] =
    useState<Department[]>([]);

  const [
    loadingDepartments,
    setLoadingDepartments,
  ] = useState(false);

  // =========================================================
  // GENERAL UI
  // =========================================================

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [successMsg, setSuccessMsg] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  // =========================================================
  // FORGOT PASSWORD MODAL
  // =========================================================

  const [
    showForgotModal,
    setShowForgotModal,
  ] = useState(false);

  const [
    forgotStep,
    setForgotStep,
  ] = useState<ForgotStep>("email");

  const [
    forgotEmail,
    setForgotEmail,
  ] = useState("");

  const [
    forgotOtp,
    setForgotOtp,
  ] = useState("");

  const [
    forgotPassword,
    setForgotPassword,
  ] = useState("");

  const [
    forgotConfirmPassword,
    setForgotConfirmPassword,
  ] = useState("");

  const [forgotOtpId, setForgotOtpId] =
    useState("");

  const [
    forgotVerifiedToken,
    setForgotVerifiedToken,
  ] = useState("");

  const [
    resendCountdown,
    setResendCountdown,
  ] = useState(0);

  const [
    forgotLoading,
    setForgotLoading,
  ] = useState(false);

  const [
    forgotMessage,
    setForgotMessage,
  ] = useState("");

  const [
    forgotSuccess,
    setForgotSuccess,
  ] = useState("");

  const [
    forgotShowPassword,
    setForgotShowPassword,
  ] = useState(false);

  const [
    forgotShowConfirmPassword,
    setForgotShowConfirmPassword,
  ] = useState(false);

  // =========================================================
  // OTP COUNTDOWN
  // =========================================================

  useEffect(() => {
    if (resendCountdown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendCountdown((previous) =>
        previous > 0
          ? previous - 1
          : 0
      );
    }, 1000);

    return () =>
      window.clearInterval(timer);
  }, [resendCountdown]);

  // =========================================================
  // LOAD DEPARTMENTS
  // =========================================================

  useEffect(() => {
    if (
      !isSignUp ||
      role !== "faculty"
    ) {
      return;
    }

    const loadDepartments =
      async () => {
        setLoadingDepartments(true);

        try {
          const response =
            await apiClient.get(
              "/department"
            );

          const responseData =
            response.data?.data;

          setDepartments(
            responseData?.departments || []
          );
        } catch (error) {
          setMessage(
            "Unable to load departments."
          );
        } finally {
          setLoadingDepartments(false);
        }
      };

    loadDepartments();
  }, [isSignUp, role]);

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
        HTMLSelectElement |
        HTMLTextAreaElement
    >
  ) => {
    const {
      name,
      value,
      type,
    } = e.target;

    if (type === "checkbox") {
      const checkbox =
        e.target as HTMLInputElement;

      setFormData((previous) => ({
        ...previous,
        [name]: checkbox.checked,
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // PROFILE PHOTO
  // =========================================================

  const handlePhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setMessage("");
    setSuccessMsg("");

    if (!file.type.startsWith("image/")) {
      setMessage(
        "Please select a valid image file."
      );

      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage(
        "Profile photo must be smaller than 10 MB."
      );

      e.target.value = "";
      return;
    }

    const reader =
      new FileReader();

    reader.onload = (event) => {
      setFormData((previous) => ({
        ...previous,

        photo: file,

        photoPreview:
          event.target?.result as string,

        photoId: "",
      }));
    };

    reader.onerror = () => {
      setMessage(
        "Failed to read the selected image."
      );

      e.target.value = "";
    };

    reader.readAsDataURL(file);
  };

  // =========================================================
  // SIGN IN
  // =========================================================

  const handleSignIn = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setSuccessMsg("");

    try {
      const loginData: {
        email: string;
        accountType:
          | "admin"
          | "faculty";
        password?: string;
        securityCode?: string;
      } = {
        email:
          formData.email
            .trim()
            .toLowerCase(),

        accountType: role,
      };

      if (role === "admin") {
        loginData.password =
          formData.password;
      }

      if (role === "faculty") {
        if (
          loginMethod ===
          "password"
        ) {
          loginData.password =
            formData.password;
        } else {
          loginData.securityCode =
            formData.securityCode.trim();
        }
      }

      const response =
        await apiClient.post(
          "/account/login",
          loginData
        );

      const data =
        response.data?.data;

      const token =
        data?.token;

      const account =
        data?.account;

      if (!token || !account) {
        setMessage(
          "Invalid response from server."
        );

        return;
      }

      setToken(token);

      setRole(
        account.accountType ||
          role
      );

      setUser(account);

      setSuccessMsg(
        "Signed in successfully!"
      );
    } catch (error: any) {
      const backendError =
        error.response?.data
          ?.error;

      setMessage(
        backendError?.message ||
          error.response?.data
            ?.message ||
          "Invalid email, password, or security code."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // STEP 1 VALIDATION
  // =========================================================

  const nextFromAccount = () => {
    setMessage("");
    setSuccessMsg("");

    if (!formData.username.trim()) {
      setMessage(
        "Username is required."
      );

      return;
    }

    if (!formData.email.trim()) {
      setMessage(
        "Email is required."
      );

      return;
    }

    if (!formData.password) {
      setMessage(
        "Password is required."
      );

      return;
    }

    if (
      formData.password.length < 6
    ) {
      setMessage(
        "Password must contain at least 6 characters."
      );

      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setMessage(
        "Passwords do not match."
      );

      return;
    }

    setSignupStep(2);
  };

  // =========================================================
  // STEP 2 VALIDATION
  // =========================================================

  const nextFromPersonal = () => {
    setMessage("");
    setSuccessMsg("");

    if (!formData.photo) {
      setMessage(
        "Please upload a profile photo."
      );

      return;
    }

    if (!formData.firstName.trim()) {
      setMessage(
        "First name is required."
      );

      return;
    }

    if (!formData.lastName.trim()) {
      setMessage(
        "Last name is required."
      );

      return;
    }

    if (
      !formData.phoneNumber.trim()
    ) {
      setMessage(
        "Phone number is required."
      );

      return;
    }

    if (!formData.dob) {
      setMessage(
        "Date of birth is required."
      );

      return;
    }

    setSignupStep(3);
  };

  // =========================================================
  // FACULTY SIGNUP
  // =========================================================

  const handleSignUp = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setSuccessMsg("");

    try {
      if (!formData.photo) {
        throw new Error(
          "Please upload a profile photo."
        );
      }

      if (!formData.departmentName) {
        throw new Error(
          "Please select a department."
        );
      }

      if (
        !formData.highestDegree.trim()
      ) {
        throw new Error(
          "Highest degree is required."
        );
      }

      if (
        !formData.expertFields.trim()
      ) {
        throw new Error(
          "At least one expert field is required."
        );
      }

      if (!formData.facultyRole) {
        throw new Error(
          "Faculty role is required."
        );
      }

      const expertFields =
        formData.expertFields
          .split(",")
          .map((field) =>
            field.trim()
          )
          .filter(Boolean);

      const payload =
        new FormData();

      payload.append(
        "email",
        formData.email
          .trim()
          .toLowerCase()
      );

      payload.append(
        "username",
        formData.username
          .trim()
          .toLowerCase()
      );

      payload.append(
        "password",
        formData.password
      );

      payload.append(
        "photo",
        formData.photo
      );

      payload.append(
        "phoneNumber",
        formData.phoneNumber.trim()
      );

      payload.append(
        "namePrefix",
        formData.namePrefix.trim()
      );

      payload.append(
        "firstName",
        formData.firstName.trim()
      );

      payload.append(
        "middleName",
        formData.middleName.trim()
      );

      payload.append(
        "lastName",
        formData.lastName.trim()
      );

      payload.append(
        "sex",
        formData.sex
      );

      payload.append(
        "dob",
        formData.dob
      );

      payload.append(
        "departmentName",
        formData.departmentName
      );

      payload.append(
        "hod",
        "false"
      );

      payload.append(
        "highestDegree",
        formData.highestDegree.trim()
      );

      payload.append(
        "expertFields",
        JSON.stringify(expertFields)
      );

      payload.append(
        "bios",
        formData.bios.trim()
      );

      payload.append(
        "roles",
        formData.facultyRole
      );

      const response =
        await apiClient.post(
          "/account/requestfaculty",
          payload
        );

      setSuccessMsg(
        response.data?.data
          ?.message ||
          "Faculty registration request submitted successfully."
      );

      setSignupStep(1);

      setFormData({
        ...initialFormData,
      });

      setIsSignUp(false);
    } catch (error: any) {
      const backendError =
        error.response?.data
          ?.error;

      setMessage(
        backendError?.message ||
          error.response?.data
            ?.message ||
          error.message ||
          "Faculty registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // OPEN FORGOT PASSWORD
  // =========================================================

  const openForgotPassword = () => {
    setForgotEmail(
      formData.email.trim()
    );

    setForgotOtp("");

    setForgotPassword("");

    setForgotConfirmPassword("");

    setForgotOtpId("");

    setForgotVerifiedToken("");

    setForgotStep("email");

    setForgotMessage("");

    setForgotSuccess("");

    setResendCountdown(0);

    setShowForgotModal(true);
  };

  // =========================================================
  // CLOSE FORGOT PASSWORD
  // =========================================================

  const closeForgotPassword = () => {
    if (forgotLoading) {
      return;
    }

    setShowForgotModal(false);

    setForgotStep("email");

    setForgotEmail("");

    setForgotOtp("");

    setForgotPassword("");

    setForgotConfirmPassword("");

    setForgotOtpId("");

    setForgotVerifiedToken("");

    setForgotMessage("");

    setForgotSuccess("");

    setResendCountdown(0);
  };

  // =========================================================
  // SEND OTP
  // =========================================================

  const sendForgotPasswordOTP =
    async () => {
      setForgotMessage("");
      setForgotSuccess("");

      const email =
        forgotEmail
          .trim()
          .toLowerCase();

      if (!email) {
        setForgotMessage(
          "Please enter your email address."
        );

        return;
      }

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        setForgotMessage(
          "Please enter a valid email address."
        );

        return;
      }

      setForgotLoading(true);

      try {
        const response =
          await apiClient.post(
            "/account/forgotpassword",
            {
              email,
              accountType: role,
            }
          );

        const data =
          response.data?.data;

        const otpId =
          data?.otpId;

        if (!otpId) {
          throw new Error(
            "OTP ID was not returned by the server."
          );
        }

        setForgotOtpId(otpId);

        setForgotStep("otp");

        setForgotSuccess(
          data?.message ||
            "OTP has been sent to your registered email."
        );

        setResendCountdown(60);
      } catch (error: any) {
        const backendError =
          error.response?.data
            ?.error;

        setForgotMessage(
          backendError?.message ||
            error.response?.data
              ?.message ||
            "Unable to send OTP. Please try again."
        );
      } finally {
        setForgotLoading(false);
      }
    };

  // =========================================================
  // VERIFY OTP
  // =========================================================

  const verifyForgotPasswordOTP =
    async () => {
      setForgotMessage("");
      setForgotSuccess("");

      if (
        !/^\d{6}$/.test(
          forgotOtp.trim()
        )
      ) {
        setForgotMessage(
          "Please enter the 6-digit OTP."
        );

        return;
      }

      if (!forgotOtpId) {
        setForgotMessage(
          "OTP request is missing. Please request a new OTP."
        );

        return;
      }

      setForgotLoading(true);

      try {
        const response =
          await apiClient.post(
            "/account/forgotpassword/verify/otp",
            {
              otpToken:
                forgotOtp.trim(),

              otpId:
                forgotOtpId,
            }
          );

        const data =
          response.data?.data;

        const verifiedToken =
          data?.token;

        if (!verifiedToken) {
          throw new Error(
            "Verification token was not returned."
          );
        }

        setForgotVerifiedToken(
          verifiedToken
        );

        setForgotStep("password");

        setForgotSuccess(
          "OTP verified successfully. You can now create a new password."
        );
      } catch (error: any) {
        const backendError =
          error.response?.data
            ?.error;

        setForgotMessage(
          backendError?.message ||
            error.response?.data
              ?.message ||
            "Invalid or expired OTP."
        );
      } finally {
        setForgotLoading(false);
      }
    };

  // =========================================================
  // RESET PASSWORD
  // =========================================================

  const resetForgotPassword =
    async () => {
      setForgotMessage("");
      setForgotSuccess("");

      if (!forgotPassword) {
        setForgotMessage(
          "Please enter a new password."
        );

        return;
      }

      if (
        forgotPassword.length < 7
      ) {
        setForgotMessage(
          "Password must contain at least 7 characters."
        );

        return;
      }

      if (
        forgotPassword !==
        forgotConfirmPassword
      ) {
        setForgotMessage(
          "Passwords do not match."
        );

        return;
      }

      if (!forgotVerifiedToken) {
        setForgotMessage(
          "OTP verification is required."
        );

        return;
      }

      setForgotLoading(true);

      try {
        const response =
          await apiClient.post(
            "/account/forgotpassword/otp",
            {
              otpToken:
                forgotVerifiedToken,

              password:
                forgotPassword,
            }
          );

        const data =
          response.data?.data;

        setForgotSuccess(
          data?.message ||
            response.data?.message ||
            "Password changed successfully."
        );

        window.setTimeout(() => {
          closeForgotPassword();

          setSuccessMsg(
            "Password changed successfully. Please sign in with your new password."
          );

          setFormData(
            (previous) => ({
              ...previous,
              email:
                forgotEmail,
              password: "",
              confirmPassword: "",
            })
          );
        }, 1200);
      } catch (error: any) {
        const backendError =
          error.response?.data
            ?.error;

        setForgotMessage(
          backendError?.message ||
            error.response?.data
              ?.message ||
            "Unable to change password."
        );
      } finally {
        setForgotLoading(false);
      }
    };

  // =========================================================
  // RESEND OTP
  // =========================================================

  const resendForgotPasswordOTP =
    async () => {
      if (
        resendCountdown > 0 ||
        forgotLoading
      ) {
        return;
      }

      await sendForgotPasswordOTP();
    };

  // =========================================================
  // STEP HEADER
  // =========================================================

  const renderStepHeader =
    () => {
      const steps = [
        {
          number: 1,
          title: "Account",
        },
        {
          number: 2,
          title: "Personal",
        },
        {
          number: 3,
          title: "Professional",
        },
      ];

      return (
        <div className="mb-7">
          <div className="flex items-center">
            {steps.map(
              (
                step,
                index
              ) => (
                <div
                  key={
                    step.number
                  }
                  className="flex items-center flex-1 last:flex-none"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                        signupStep >=
                        step.number
                          ? "bg-cyan-700 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {
                        step.number
                      }
                    </div>

                    <span
                      className={`text-[10px] mt-1 font-semibold ${
                        signupStep >=
                        step.number
                          ? "text-cyan-700"
                          : "text-gray-400"
                      }`}
                    >
                      {
                        step.title
                      }
                    </span>
                  </div>

                  {index <
                    steps.length -
                      1 && (
                    <div
                      className={`h-1 flex-1 mx-2 rounded-full mb-5 ${
                        signupStep >
                        step.number
                          ? "bg-cyan-700"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              )
            )}
          </div>
        </div>
      );
    };

  // =========================================================
  // FORGOT PASSWORD MODAL
  // =========================================================

  const renderForgotPasswordModal =
    () => {
      if (!showForgotModal) {
        return null;
      }

      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* BACKDROP */}

          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            onClick={() => {
              if (!forgotLoading) {
                closeForgotPassword();
              }
            }}
          />

          {/* MODAL */}

          <motion.div
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 0.25,
            }}
          >
            {/* HEADER */}

            <div className="bg-gradient-to-r from-cyan-800 to-cyan-600 px-6 py-5 text-white">
              <button
                type="button"
                onClick={
                  closeForgotPassword
                }
                disabled={
                  forgotLoading
                }
                className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center disabled:opacity-50"
              >
                <FaTimes />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                  {forgotStep ===
                  "email" ? (
                    <FaEnvelope />
                  ) : forgotStep ===
                    "otp" ? (
                    <FaKey />
                  ) : (
                    <FaLock />
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-extrabold">
                    Forgot Password
                  </h3>

                  <p className="text-xs text-cyan-100 mt-1">
                    {role ===
                    "admin"
                      ? "Admin Account"
                      : "Faculty Account"}
                  </p>
                </div>
              </div>
            </div>

            {/* PROGRESS */}

            <div className="px-6 pt-5">
              <div className="flex items-center gap-2">
                {[
                  {
                    key: "email",
                    label: "Email",
                  },
                  {
                    key: "otp",
                    label: "OTP",
                  },
                  {
                    key: "password",
                    label: "Password",
                  },
                ].map(
                  (
                    item,
                    index
                  ) => {
                    const stepOrder = {
                      email: 1,
                      otp: 2,
                      password: 3,
                    };

                    const current =
                      stepOrder[
                        forgotStep
                      ];

                    const itemStep =
                      stepOrder[
                        item.key as ForgotStep
                      ];

                    return (
                      <React.Fragment
                        key={
                          item.key
                        }
                      >
                        <div
                          className={`flex items-center gap-1.5 text-[10px] font-bold ${
                            current >=
                            itemStep
                              ? "text-cyan-700"
                              : "text-gray-400"
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              current >=
                              itemStep
                                ? "bg-cyan-700 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            {
                              itemStep
                            }
                          </span>

                          <span className="hidden sm:inline">
                            {
                              item.label
                            }
                          </span>
                        </div>

                        {index <
                          2 && (
                          <div className="flex-1 h-px bg-gray-200" />
                        )}
                      </React.Fragment>
                    );
                  }
                )}
              </div>
            </div>

            {/* BODY */}

            <div className="p-6">
              {/* MESSAGE */}

              {forgotMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
                  {forgotMessage}
                </div>
              )}

              {forgotSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-xs font-semibold flex items-start gap-2">
                  <FaCheckCircle className="mt-0.5 flex-shrink-0" />

                  <span>
                    {
                      forgotSuccess
                    }
                  </span>
                </div>
              )}

              <AnimatePresence
                mode="wait"
              >
                {/* EMAIL STEP */}

                {forgotStep ===
                  "email" && (
                  <motion.div
                    key="forgot-email"
                    initial={{
                      opacity: 0,
                      x: 20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: -20,
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Email Address
                      </label>

                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />

                        <input
                          type="email"
                          value={
                            forgotEmail
                          }
                          onChange={(
                            e
                          ) =>
                            setForgotEmail(
                              e.target
                                .value
                            )
                          }
                          placeholder="example@gmail.com"
                          className={`${inputClass} pl-10`}
                          autoFocus
                        />
                      </div>

                      <p className="text-[10px] text-gray-400 mt-1.5">
                        Enter the email
                        address registered
                        with this{" "}
                        {role} account.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={
                        sendForgotPasswordOTP
                      }
                      disabled={
                        forgotLoading
                      }
                      className="w-full bg-cyan-700 hover:bg-cyan-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl"
                    >
                      {forgotLoading
                        ? "Sending OTP..."
                        : "Send OTP"}
                    </button>
                  </motion.div>
                )}

                {/* OTP STEP */}

                {forgotStep ===
                  "otp" && (
                  <motion.div
                    key="forgot-otp"
                    initial={{
                      opacity: 0,
                      x: 20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: -20,
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Verification OTP
                      </label>

                      <div className="relative">
                        <FaKey className="absolute left-3 top-3.5 text-gray-400" />

                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={
                            forgotOtp
                          }
                          onChange={(
                            e
                          ) => {
                            const value =
                              e.target.value.replace(
                                /\D/g,
                                ""
                              );

                            setForgotOtp(
                              value
                            );
                          }}
                          placeholder="Enter 6-digit OTP"
                          className={`${inputClass} pl-10 text-center tracking-[0.5em] font-bold`}
                          autoFocus
                        />
                      </div>

                      <div className="mt-2 space-y-1">
                        <p className="text-[10px] text-gray-400">
                          OTP sent to{" "}
                          <strong className="text-gray-600">
                            {forgotEmail}
                          </strong>
                        </p>

                        <p className="text-[10px] text-amber-600 font-semibold">
                          Please check your Spam or Junk folder if you
                          don't see the OTP in your inbox.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={
                        verifyForgotPasswordOTP
                      }
                      disabled={
                        forgotLoading ||
                        forgotOtp.length !==
                          6
                      }
                      className="w-full bg-cyan-700 hover:bg-cyan-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl"
                    >
                      {forgotLoading
                        ? "Verifying..."
                        : "Verify OTP"}
                    </button>

                    <div className="text-center">
                      {resendCountdown >
                      0 ? (
                        <p className="text-xs text-gray-500">
                          Resend OTP in{" "}
                          <span className="font-bold text-cyan-700">
                            {
                              resendCountdown
                            }
                            s
                          </span>
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={
                            resendForgotPasswordOTP
                          }
                          disabled={
                            forgotLoading
                          }
                          className="text-xs text-cyan-700 font-bold hover:underline disabled:opacity-50"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setForgotStep(
                          "email"
                        );

                        setForgotMessage(
                          ""
                        );

                        setForgotSuccess(
                          ""
                        );
                      }}
                      disabled={
                        forgotLoading
                      }
                      className="w-full text-xs text-gray-500 hover:text-cyan-700"
                    >
                      Change Email
                    </button>
                  </motion.div>
                )}

                {/* PASSWORD STEP */}

                {forgotStep ===
                  "password" && (
                  <motion.div
                    key="forgot-password"
                    initial={{
                      opacity: 0,
                      x: 20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: -20,
                    }}
                    className="space-y-4"
                  >
                    {/* NEW PASSWORD */}

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        New Password
                      </label>

                      <div className="relative">
                        <FaLock className="absolute left-3 top-3.5 text-gray-400" />

                        <input
                          type={
                            forgotShowPassword
                              ? "text"
                              : "password"
                          }
                          value={
                            forgotPassword
                          }
                          onChange={(
                            e
                          ) =>
                            setForgotPassword(
                              e.target
                                .value
                            )
                          }
                          placeholder="Enter new password"
                          className={`${inputClass} pl-10 pr-11`}
                          autoFocus
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setForgotShowPassword(
                              (
                                previous
                              ) =>
                                !previous
                            )
                          }
                          className="absolute right-3 top-3.5 text-gray-400"
                        >
                          {forgotShowPassword ? (
                            <FaEyeSlash />
                          ) : (
                            <FaEye />
                          )}
                        </button>
                      </div>

                      <p className="text-[10px] text-gray-400 mt-1">
                        Minimum 7 characters.
                      </p>
                    </div>

                    {/* CONFIRM PASSWORD */}

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Confirm Password
                      </label>

                      <div className="relative">
                        <FaLock className="absolute left-3 top-3.5 text-gray-400" />

                        <input
                          type={
                            forgotShowConfirmPassword
                              ? "text"
                              : "password"
                          }
                          value={
                            forgotConfirmPassword
                          }
                          onChange={(
                            e
                          ) =>
                            setForgotConfirmPassword(
                              e.target
                                .value
                            )
                          }
                          placeholder="Confirm new password"
                          className={`${inputClass} pl-10 pr-11`}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setForgotShowConfirmPassword(
                              (
                                previous
                              ) =>
                                !previous
                            )
                          }
                          className="absolute right-3 top-3.5 text-gray-400"
                        >
                          {forgotShowConfirmPassword ? (
                            <FaEyeSlash />
                          ) : (
                            <FaEye />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={
                        resetForgotPassword
                      }
                      disabled={
                        forgotLoading
                      }
                      className="w-full bg-cyan-700 hover:bg-cyan-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl"
                    >
                      {forgotLoading
                        ? "Changing Password..."
                        : "Change Password"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      );
    };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-slate-900 to-cyan-900 flex items-center justify-center px-4 py-12">
        <motion.div
          className={`bg-white p-8 rounded-3xl shadow-2xl w-full border border-cyan-100 ${
            isSignUp &&
            role === "faculty"
              ? "max-w-2xl"
              : "max-w-md"
          }`}
          initial={{
            scale: 0.95,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
          }}
        >
          {/* =====================================================
              HOME BUTTON
          ===================================================== */}

          <div className="flex justify-start mb-5">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-xl transition"
            >
              <FaHome />
              Home
            </button>
          </div>

          {/* =====================================================
              HEADER
          ===================================================== */}

          <div className="text-center mb-6">
            <span className="px-3 py-1 bg-cyan-100 text-cyan-800 text-xs font-bold uppercase rounded-full tracking-wider">
              {role.toUpperCase()} Portal
            </span>

            <h2 className="text-2xl font-extrabold mt-3 text-gray-900">
              {isSignUp
                ? "Faculty Registration"
                : `Sign In to ${
                    role ===
                    "admin"
                      ? "Admin"
                      : "Faculty"
                  } CMS`}
            </h2>
          </div>

          {/* =====================================================
              ERROR
          ===================================================== */}

          {message && (
            <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl text-center">
              {message}
            </div>
          )}

          {/* =====================================================
              SUCCESS
          ===================================================== */}

          {successMsg && (
            <div className="p-3 mb-4 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-xl text-center">
              {successMsg}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* =================================================
                SIGN IN
            ================================================= */}

            {!isSignUp ? (
              <motion.form
                key="signin"
                onSubmit={
                  handleSignIn
                }
                className="space-y-4"
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: 20,
                }}
              >
                {/* EMAIL */}

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email
                  </label>

                  <input
                    name="email"
                    type="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your email"
                    required
                    className={
                      inputClass
                    }
                  />
                </div>

                {/* FACULTY LOGIN METHOD */}

                {role ===
                  "faculty" && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Login Method
                    </label>

                    <select
                      value={
                        loginMethod
                      }
                      onChange={(e) => {
                        const value =
                          e.target
                            .value as
                            | "password"
                            | "securityCode";

                        setLoginMethod(
                          value
                        );

                        setFormData(
                          (
                            previous
                          ) => ({
                            ...previous,
                            password:
                              "",
                            securityCode:
                              "",
                          })
                        );

                        setMessage(
                          ""
                        );

                        setSuccessMsg(
                          ""
                        );
                      }}
                      className={
                        inputClass
                      }
                    >
                      <option value="password">
                        Password
                      </option>

                      <option value="securityCode">
                        Security Code
                      </option>
                    </select>
                  </div>
                )}

                {/* PASSWORD */}

                {(role ===
                  "admin" ||
                  loginMethod ===
                    "password") && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-gray-700">
                        Password
                      </label>

                      <button
                        type="button"
                        onClick={
                          openForgotPassword
                        }
                        className="text-xs text-cyan-700 font-semibold hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        name="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={
                          formData.password
                        }
                        onChange={
                          handleChange
                        }
                        required
                        className={`${inputClass} pr-11`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (
                              previous
                            ) =>
                              !previous
                          )
                        }
                        className="absolute right-3 top-3.5 text-gray-400"
                      >
                        {showPassword ? (
                          <FaEyeSlash />
                        ) : (
                          <FaEye />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* SECURITY CODE */}

                {role ===
                  "faculty" &&
                  loginMethod ===
                    "securityCode" && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-bold text-gray-700">
                          Security Code
                        </label>

                        <button
                          type="button"
                          onClick={
                            openForgotPassword
                          }
                          className="text-xs text-cyan-700 font-semibold hover:underline"
                        >
                          Forgot Password?
                        </button>
                      </div>

                      <input
                        name="securityCode"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        pattern="[0-9]{6}"
                        value={
                          formData.securityCode
                        }
                        onChange={(e) => {
                          const value =
                            e.target.value.replace(
                              /\D/g,
                              ""
                            );

                          setFormData(
                            (
                              previous
                            ) => ({
                              ...previous,
                              securityCode:
                                value,
                            })
                          );
                        }}
                        placeholder="Enter 6-digit security code"
                        required
                        className={
                          inputClass
                        }
                      />

                      <p className="text-[10px] text-gray-400 mt-1">
                        Enter the 6-digit
                        security code provided
                        by the administrator.
                      </p>
                    </div>
                  )}

                {/* SIGN IN */}

                <button
                  type="submit"
                  disabled={
                    loading
                  }
                  className="w-full bg-cyan-700 hover:bg-cyan-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl shadow-md"
                >
                  {loading
                    ? "Authenticating..."
                    : "Sign In"}
                </button>
              </motion.form>
            ) : (
              /* =================================================
                 SIGNUP
              ================================================= */

              <motion.div
                key="signup"
                initial={{
                  opacity: 0,
                  x: 20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -20,
                }}
              >
                {renderStepHeader()}

                {/* =================================================
                    STEP 1
                ================================================= */}

                {signupStep ===
                  1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Username *
                      </label>

                      <input
                        name="username"
                        value={
                          formData.username
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Enter username"
                        required
                        className={
                          inputClass
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Email *
                      </label>

                      <input
                        name="email"
                        type="email"
                        value={
                          formData.email
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Enter email"
                        required
                        className={
                          inputClass
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Password *
                      </label>

                      <div className="relative">
                        <input
                          name="password"
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          value={
                            formData.password
                          }
                          onChange={
                            handleChange
                          }
                          required
                          className={`${inputClass} pr-11`}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(
                              (
                                previous
                              ) =>
                                !previous
                            )
                          }
                          className="absolute right-3 top-3.5 text-gray-400"
                        >
                          {showPassword ? (
                            <FaEyeSlash />
                          ) : (
                            <FaEye />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Confirm Password *
                      </label>

                      <div className="relative">
                        <input
                          name="confirmPassword"
                          type={
                            showConfirmPassword
                              ? "text"
                              : "password"
                          }
                          value={
                            formData.confirmPassword
                          }
                          onChange={
                            handleChange
                          }
                          required
                          className={`${inputClass} pr-11`}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(
                              (
                                previous
                              ) =>
                                !previous
                            )
                          }
                          className="absolute right-3 top-3.5 text-gray-400"
                        >
                          {showConfirmPassword ? (
                            <FaEyeSlash />
                          ) : (
                            <FaEye />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={
                        nextFromAccount
                      }
                      className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-3 rounded-xl"
                    >
                      Continue
                    </button>
                  </div>
                )}

                {/* =================================================
                    STEP 2
                ================================================= */}

                {signupStep ===
                  2 && (
                  <div className="space-y-4">
                    {/* PHOTO */}

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">
                        Profile Photo *
                      </label>

                      <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                        <div className="flex-shrink-0">
                          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-200 flex items-center justify-center">
                            {formData.photoPreview ? (
                              <img
                                src={
                                  formData.photoPreview
                                }
                                alt="Profile preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FaCamera className="text-3xl text-gray-400" />
                            )}
                          </div>
                        </div>

                        <div className="flex-1 w-full">
                          <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl text-sm font-bold cursor-pointer">
                            <FaCamera />

                            {formData.photo
                              ? "Change Photo"
                              : "Choose Photo"}

                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={
                                handlePhotoChange
                              }
                              className="hidden"
                            />
                          </label>

                          {formData.photo && (
                            <p className="text-xs text-gray-600 mt-2 break-all">
                              {
                                formData
                                  .photo
                                  .name
                              }
                            </p>
                          )}

                          <p className="text-[10px] text-gray-400 mt-1">
                            JPG, PNG or WebP ·
                            Maximum 10 MB
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* PREFIX */}

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Name Prefix
                      </label>

                      <select
                        name="namePrefix"
                        value={
                          formData.namePrefix
                        }
                        onChange={
                          handleChange
                        }
                        className={
                          inputClass
                        }
                      >
                        <option value="">
                          Select Prefix
                        </option>

                        <option value="Dr.">
                          Dr.
                        </option>

                        <option value="Prof.">
                          Prof.
                        </option>

                        <option value="Mr.">
                          Mr.
                        </option>

                        <option value="Ms.">
                          Ms.
                        </option>

                        <option value="Mrs.">
                          Mrs.
                        </option>
                      </select>
                    </div>

                    {/* FIRST + MIDDLE */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          First Name *
                        </label>

                        <input
                          name="firstName"
                          value={
                            formData.firstName
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="First name"
                          required
                          className={
                            inputClass
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Middle Name
                        </label>

                        <input
                          name="middleName"
                          value={
                            formData.middleName
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="Optional"
                          className={
                            inputClass
                          }
                        />
                      </div>
                    </div>

                    {/* LAST NAME */}

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Last Name *
                      </label>

                      <input
                        name="lastName"
                        value={
                          formData.lastName
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Last name"
                        required
                        className={
                          inputClass
                        }
                      />
                    </div>

                    {/* PHONE */}

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Phone Number *
                      </label>

                      <input
                        name="phoneNumber"
                        type="tel"
                        value={
                          formData.phoneNumber
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="+91 9876543210"
                        required
                        className={
                          inputClass
                        }
                      />
                    </div>

                    {/* SEX */}

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Gender
                      </label>

                      <select
                        name="sex"
                        value={
                          formData.sex
                        }
                        onChange={
                          handleChange
                        }
                        className={
                          inputClass
                        }
                      >
                        <option value="prefer not to say">
                          Prefer not to say
                        </option>

                        <option value="male">
                          Male
                        </option>

                        <option value="female">
                          Female
                        </option>

                        <option value="other">
                          Other
                        </option>
                      </select>
                    </div>

                    {/* DATE OF BIRTH */}

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Date of Birth *
                      </label>

                      <input
                        name="dob"
                        type="date"
                        value={
                          formData.dob
                        }
                        onChange={
                          handleChange
                        }
                        max={
                          getMinimumDOB()
                        }
                        required
                        className={
                          inputClass
                        }
                      />

                      <p className="text-[10px] text-gray-400 mt-1">
                        You must be at least 24 years old.
                      </p>
                    </div>

                    {/* NAVIGATION */}

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMessage("");

                          setSignupStep(
                            1
                          );
                        }}
                        className="w-1/3 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl"
                      >
                        <FaArrowLeft />
                        Back
                      </button>

                      <button
                        type="button"
                        onClick={
                          nextFromPersonal
                        }
                        className="flex-1 bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-3 rounded-xl"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {/* =================================================
                    STEP 3
                ================================================= */}

                {signupStep ===
                  3 && (
                  <form
                    onSubmit={
                      handleSignUp
                    }
                    className="space-y-4"
                  >
                    {/* DEPARTMENT */}

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Department *
                      </label>

                      <select
                        name="departmentName"
                        value={
                          formData.departmentName
                        }
                        onChange={
                          handleChange
                        }
                        required
                        disabled={
                          loadingDepartments
                        }
                        className={
                          inputClass
                        }
                      >
                        <option value="">
                          {loadingDepartments
                            ? "Loading departments..."
                            : "Select Department"}
                        </option>

                        {departments.map(
                          (
                            department
                          ) => (
                            <option
                              key={
                                department._id
                              }
                              value={
                                department.name
                              }
                            >
                              {
                                department.name
                              }
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* DEGREE */}

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Highest Degree *
                      </label>

                      <input
                        name="highestDegree"
                        value={
                          formData.highestDegree
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="e.g. Ph.D. in Computer Science"
                        required
                        className={
                          inputClass
                        }
                      />
                    </div>

                    {/* EXPERT FIELDS */}

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Areas of Expertise *
                      </label>

                      <input
                        name="expertFields"
                        value={
                          formData.expertFields
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="e.g. AI, Machine Learning, NLP"
                        required
                        className={
                          inputClass
                        }
                      />

                      <p className="text-[10px] text-gray-400 mt-1">
                        Separate multiple
                        fields with commas.
                      </p>
                    </div>

                    {/* ROLE */}

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Faculty Role *
                      </label>

                      <select
                        name="facultyRole"
                        value={
                          formData.facultyRole
                        }
                        onChange={
                          handleChange
                        }
                        required
                        className={
                          inputClass
                        }
                      >
                        {facultyRoles.map(
                          (
                            facultyRole
                          ) => (
                            <option
                              key={
                                facultyRole
                              }
                              value={
                                facultyRole
                              }
                            >
                              {facultyRole
                                .charAt(
                                  0
                                )
                                .toUpperCase() +
                                facultyRole.slice(
                                  1
                                )}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* BIO */}

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Biography
                      </label>

                      <textarea
                        name="bios"
                        value={
                          formData.bios
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Tell us briefly about your professional background..."
                        rows={4}
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    {/* NAVIGATION */}

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMessage("");

                          setSignupStep(
                            2
                          );
                        }}
                        className="w-1/3 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl"
                      >
                        <FaArrowLeft />
                        Back
                      </button>

                      <button
                        type="submit"
                        disabled={
                          loading
                        }
                        className="flex-1 bg-cyan-700 hover:bg-cyan-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl"
                      >
                        {loading
                          ? "Submitting..."
                          : "Submit Registration"}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* =====================================================
              SIGNUP / SIGNIN SWITCH
          ===================================================== */}

          {role ===
            "faculty" && (
            <p className="text-xs text-center mt-6 text-gray-600">
              {isSignUp
                ? "Already have an account?"
                : "Don't have a faculty account?"}{" "}
              <button
                type="button"
                className="text-cyan-700 font-bold hover:underline"
                onClick={() => {
                  setIsSignUp(
                    !isSignUp
                  );

                  setSignupStep(
                    1
                  );

                  setMessage("");

                  setSuccessMsg("");

                  setLoginMethod(
                    "password"
                  );

                  setFormData({
                    ...initialFormData,
                  });
                }}
              >
                {isSignUp
                  ? "Sign In"
                  : "Register Faculty Account"}
              </button>
            </p>
          )}
        </motion.div>
      </div>

      {/* =====================================================
          FORGOT PASSWORD MODAL
      ===================================================== */}

      {renderForgotPasswordModal()}
    </>
  );
}