import { useState, useEffect } from "react";
import { useAuth } from "~/context/AuthContext";
import SignIn_SignUP from "~/Common/SignIn_SignUP/SiignIn_Signup";
import apiClient from "~/utils/apiClient";
import { toast } from "react-toastify";
import { alertSuccess } from "~/utils/alert_utils";

import {
  Mail,
  UserCheck,
  Trash2,
  Check,
  RefreshCw,
  Building2,
  Phone,
  GraduationCap,
  BriefcaseBusiness,
  CalendarDays,
  X,
  AlertTriangle,
} from "lucide-react";

/**
 * =========================================================
 * CONTACT MAIL TYPE
 * =========================================================
 */
export type ContactMail = {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt?: string;
};

/**
 * =========================================================
 * FACULTY REQUEST TYPE
 * =========================================================
 */
export type FacultyRequest = {
  _id: string;
  email: string;
  username: string;

  phoneNumber?: string;

  namePrefix?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;

  sex?: string;
  startDate?: string;

  departmentId?: {
    _id?: string;
    name?: string;
  } | null;

  hod?: boolean;

  highestDegree?: string;

  expertFields?: string[];

  roles?: string[];

  bios?: string;

  createdAt?: string;
};

/**
 * =========================================================
 * CONFIRMATION ACTION TYPE
 * =========================================================
 */
type ConfirmationAction =
  | {
      type: "deleteMail";
      id: string;
      name: string;
    }
  | {
      type: "acceptFaculty";
      id: string;
      name: string;
    }
  | {
      type: "deleteFaculty";
      id: string;
      name: string;
    }
  | null;

/**
 * =========================================================
 * COMPONENT
 * =========================================================
 */
export default function Admin_Home() {
  const { token, role } = useAuth();

  /**
   * =======================================================
   * STATE
   * =======================================================
   */

  const [mails, setMails] = useState<ContactMail[]>([]);

  const [facultyRequests, setFacultyRequests] =
    useState<FacultyRequest[]>([]);

  const [loading, setLoading] = useState(false);

  /**
   * =======================================================
   * CONFIRMATION MODAL STATE
   * =======================================================
   */

  const [confirmationAction, setConfirmationAction] =
    useState<ConfirmationAction>(null);

  const [confirmationLoading, setConfirmationLoading] =
    useState(false);

  /**
   * =========================================================
   * FETCH DASHBOARD DATA
   * =========================================================
   */
  const fetchDashboardData = async () => {
    if (!token || role !== "admin") {
      return;
    }

    setLoading(true);

    /**
     * =======================================================
     * FETCH CONTACT MAILS
     * =======================================================
     */

    try {
      const mailRes = await apiClient.get("/mail/GetMails");

      const mailData = Array.isArray(mailRes.data)
        ? mailRes.data
        : mailRes.data?.data || [];

      setMails(mailData);
    } catch (error: any) {
      setMails([]);

      toast.error(
        error?.response?.status === 403
          ? "You do not have permission to view contact messages."
          : "Failed to load contact messages."
      );
    }

    /**
     * =======================================================
     * FETCH FACULTY REQUESTS
     * =======================================================
     */

    try {
      const reqRes = await apiClient.get(
        "/account/requestfaculty"
      );

      const reqData =
        reqRes.data?.data?.requests ||
        reqRes.data?.requests ||
        [];

      setFacultyRequests(reqData);
    } catch (error: any) {
      setFacultyRequests([]);

      toast.error(
        error?.response?.status === 403
          ? "You do not have permission to view faculty requests."
          : "Failed to load faculty requests."
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * =========================================================
   * INITIAL LOAD
   * =========================================================
   */
  useEffect(() => {
    if (token && role === "admin") {
      fetchDashboardData();
    }
  }, [token, role]);

  /**
   * =========================================================
   * OPEN DELETE MAIL CONFIRMATION
   * =========================================================
   */
  const handleDeleteMail = (
    id: string,
    name: string
  ) => {
    setConfirmationAction({
      type: "deleteMail",
      id,
      name,
    });
  };

  /**
   * =========================================================
   * OPEN ACCEPT FACULTY CONFIRMATION
   * =========================================================
   */
  const handleAcceptFaculty = (
    id: string,
    name: string
  ) => {
    setConfirmationAction({
      type: "acceptFaculty",
      id,
      name,
    });
  };

  /**
   * =========================================================
   * OPEN DELETE FACULTY CONFIRMATION
   * =========================================================
   */
  const handleDeleteFaculty = (
    id: string,
    name: string
  ) => {
    setConfirmationAction({
      type: "deleteFaculty",
      id,
      name,
    });
  };

  /**
   * =========================================================
   * CLOSE CONFIRMATION MODAL
   * =========================================================
   */
  const closeConfirmationModal = () => {
    if (confirmationLoading) {
      return;
    }

    setConfirmationAction(null);
  };

  /**
   * =========================================================
   * CONFIRM ACTION
   * =========================================================
   */
  const handleConfirmAction = async () => {
    if (!confirmationAction) {
      return;
    }

    setConfirmationLoading(true);

    try {
      /**
       * =====================================================
       * DELETE CONTACT MAIL
       * =====================================================
       */
      if (
        confirmationAction.type ===
        "deleteMail"
      ) {
        const {
          id,
          name,
        } = confirmationAction;

        await apiClient.delete(
          `/mail/DeleteMail/${id}`
        );

        /**
         * Remove deleted mail from UI
         */
        setMails((previous) =>
          previous.filter(
            (mail) => mail._id !== id
          )
        );

        /**
         * Close custom confirmation modal
         */
        setConfirmationAction(null);

        /**
         * Show SweetAlert success message
         */
        await alertSuccess(
          `Message from ${name} has been deleted successfully.`
        );
      }

      /**
       * =====================================================
       * ACCEPT FACULTY
       * =====================================================
       */
      else if (
        confirmationAction.type ===
        "acceptFaculty"
      ) {
        const {
          id,
          name,
        } = confirmationAction;

        const response =
          await apiClient.post(
            `/account/requestfaculty/accept/${id}`
          );

        /**
         * Remove request from pending list
         */
        setFacultyRequests(
          (previous) =>
            previous.filter(
              (request) =>
                request._id !== id
            )
        );

        /**
         * Close custom confirmation modal
         */
        setConfirmationAction(null);

        /**
         * Show SweetAlert success message
         */
        await alertSuccess(
          response.data?.message ||
            response.data?.data?.message ||
            `Faculty registration for ${name} approved successfully.`
        );
      }

      /**
       * =====================================================
       * DELETE FACULTY REQUEST
       * =====================================================
       */
      else if (
        confirmationAction.type ===
        "deleteFaculty"
      ) {
        const {
          id,
          name,
        } = confirmationAction;

        const response =
          await apiClient.delete(
            `/account/requestfaculty/delete/${id}`
          );

        /**
         * Remove request from UI
         */
        setFacultyRequests(
          (previous) =>
            previous.filter(
              (request) =>
                request._id !== id
            )
        );

        /**
         * Close custom confirmation modal
         */
        setConfirmationAction(null);

        /**
         * Show SweetAlert success message
         */
        await alertSuccess(
          response.data?.data?.message ||
            response.data?.message ||
            `Faculty request for ${name} has been deleted successfully.`
        );
      }
    } catch (error: any) {
      /**
       * =====================================================
       * BACKEND ERROR MESSAGE
       * =====================================================
       */
      const backendMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.response?.data?.error?.message;

      toast.error(
        backendMessage ||
          "The requested action failed."
      );
    } finally {
      setConfirmationLoading(false);
    }
  };

  /**
   * =========================================================
   * GET FACULTY NAME
   * =========================================================
   */
  const getFacultyName = (
    request: FacultyRequest
  ) => {
    const name = [
      request.namePrefix,
      request.firstName,
      request.middleName,
      request.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    return name || request.username;
  };

  /**
   * =========================================================
   * FORMAT DATE
   * =========================================================
   */
  const formatDate = (
    date?: string
  ) => {
    if (!date) {
      return "Not provided";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      undefined,
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  /**
   * =========================================================
   * FORMAT EXPERT FIELDS
   * =========================================================
   */
  const getExpertFields = (
    fields?: string[]
  ) => {
    if (
      !fields ||
      fields.length === 0
    ) {
      return "Not provided";
    }

    return fields.join(", ");
  };

  /**
   * =========================================================
   * FORMAT ROLES
   * =========================================================
   */
  const getRoles = (
    roles?: string[]
  ) => {
    if (
      !roles ||
      roles.length === 0
    ) {
      return "Not provided";
    }

    return roles.join(", ");
  };

  /**
   * =========================================================
   * AUTH CHECK
   * =========================================================
   */
  if (!token || role !== "admin") {
    return (
      <div className="p-4 space-y-6">
        <SignIn_SignUP role="admin" />
      </div>
    );
  }

  /**
   * =========================================================
   * MODAL TEXT
   * =========================================================
   */

  const getConfirmationTitle = () => {
    if (!confirmationAction) {
      return "";
    }

    switch (
      confirmationAction.type
    ) {
      case "deleteMail":
        return "Delete Contact Message?";

      case "acceptFaculty":
        return "Approve Faculty Registration?";

      case "deleteFaculty":
        return "Delete Faculty Request?";

      default:
        return "Are you sure?";
    }
  };

  const getConfirmationMessage = () => {
    if (!confirmationAction) {
      return "";
    }

    switch (
      confirmationAction.type
    ) {
      case "deleteMail":
        return `Are you sure you want to delete the contact message from ${confirmationAction.name}?`;

      case "acceptFaculty":
        return `Are you sure you want to approve the faculty registration for ${confirmationAction.name}?`;

      case "deleteFaculty":
        return `Are you sure you want to delete the faculty registration request for ${confirmationAction.name}?`;

      default:
        return "Are you sure you want to continue?";
    }
  };

  const getConfirmButtonText = () => {
    if (!confirmationAction) {
      return "Yes";
    }

    switch (
      confirmationAction.type
    ) {
      case "deleteMail":
        return "Yes, Delete";

      case "acceptFaculty":
        return "Yes, Approve";

      case "deleteFaculty":
        return "Yes, Delete";

      default:
        return "Yes, Continue";
    }
  };

  const getConfirmButtonClass = () => {
    if (!confirmationAction) {
      return "bg-green-600 hover:bg-green-700";
    }

    switch (
      confirmationAction.type
    ) {
      case "acceptFaculty":
        return "bg-green-600 hover:bg-green-700";

      case "deleteMail":
      case "deleteFaculty":
        return "bg-red-600 hover:bg-red-700";

      default:
        return "bg-green-600 hover:bg-green-700";
    }
  };

  /**
   * =========================================================
   * RENDER
   * =========================================================
   */
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 border-gray-200">

        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Admin Dashboard Overview
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage incoming contact queries and
            pending faculty account registrations.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="
            flex
            items-center
            gap-2
            px-4
            py-2
            bg-gray-100
            hover:bg-gray-200
            disabled:opacity-60
            text-gray-700
            text-sm
            font-semibold
            rounded-xl
            border
            border-gray-300
            transition-colors
          "
        >
          <RefreshCw
            className={`w-4 h-4 ${
              loading
                ? "animate-spin"
                : ""
            }`}
          />

          {loading
            ? "Refreshing..."
            : "Refresh Data"}
        </button>
      </div>

      {/* =====================================================
          FACULTY REQUESTS
      ===================================================== */}

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">

        <div className="flex items-center justify-between border-b pb-3">

          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-rose-700" />

            Pending Faculty Requests
          </h2>

          <span className="text-xs bg-rose-100 text-rose-800 font-bold px-3 py-1 rounded-full">
            {facultyRequests.length} Pending
          </span>
        </div>

        {facultyRequests.length === 0 ? (
          <p className="text-center py-8 text-gray-500 text-sm">
            No pending faculty registration
            requests.
          </p>
        ) : (
          <div className="space-y-4">

            {facultyRequests.map(
              (request) => {
                const facultyName =
                  getFacultyName(
                    request
                  );

                return (
                  <div
                    key={request._id}
                    className="
                      p-5
                      bg-gray-50
                      rounded-2xl
                      border
                      border-gray-200
                    "
                  >

                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="font-bold text-gray-900 text-lg">
                            {facultyName}
                          </h3>

                          {request.hod && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-1 rounded-full uppercase">
                              HOD
                            </span>
                          )}

                          {request.sex && (
                            <span className="text-[10px] bg-gray-200 text-gray-700 font-bold px-2 py-1 rounded-full">
                              {request.sex}
                            </span>
                          )}

                        </div>

                        <p className="text-xs text-gray-600 font-mono mt-1">
                          Username:{" "}
                          {request.username}
                        </p>

                        <p className="text-xs text-gray-600 font-mono mt-1">
                          {request.email}
                        </p>

                      </div>

                      {/* ACTIONS */}

                      <div className="flex items-center gap-2 flex-shrink-0">

                        <button
                          onClick={() =>
                            handleAcceptFaculty(
                              request._id,
                              facultyName
                            )
                          }
                          className="
                            flex
                            items-center
                            justify-center
                            gap-1.5
                            px-4
                            py-2
                            bg-green-600
                            hover:bg-green-700
                            text-white
                            text-xs
                            font-bold
                            rounded-lg
                            transition-colors
                            shadow-sm
                          "
                        >
                          <Check className="w-4 h-4" />

                          Approve
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteFaculty(
                              request._id,
                              facultyName
                            )
                          }
                          className="
                            flex
                            items-center
                            justify-center
                            gap-1.5
                            px-4
                            py-2
                            bg-red-600
                            hover:bg-red-700
                            text-white
                            text-xs
                            font-bold
                            rounded-lg
                            transition-colors
                            shadow-sm
                          "
                        >
                          <Trash2 className="w-4 h-4" />

                          Delete
                        </button>

                      </div>
                    </div>

                    {/* FACULTY INFORMATION */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">

                      <div className="bg-white rounded-xl border border-gray-100 p-3">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <Phone className="w-4 h-4" />

                          <span className="text-[10px] font-bold uppercase">
                            Phone
                          </span>
                        </div>

                        <p className="text-sm font-semibold text-gray-800">
                          {request.phoneNumber ||
                            "Not provided"}
                        </p>
                      </div>

                      <div className="bg-white rounded-xl border border-gray-100 p-3">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <Building2 className="w-4 h-4" />

                          <span className="text-[10px] font-bold uppercase">
                            Department
                          </span>
                        </div>

                        <p className="text-sm font-semibold text-gray-800">
                          {request.departmentId?.name ||
                            "Not provided"}
                        </p>
                      </div>

                      <div className="bg-white rounded-xl border border-gray-100 p-3">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <GraduationCap className="w-4 h-4" />

                          <span className="text-[10px] font-bold uppercase">
                            Highest Degree
                          </span>
                        </div>

                        <p className="text-sm font-semibold text-gray-800">
                          {request.highestDegree ||
                            "Not provided"}
                        </p>
                      </div>

                      <div className="bg-white rounded-xl border border-gray-100 p-3">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <BriefcaseBusiness className="w-4 h-4" />

                          <span className="text-[10px] font-bold uppercase">
                            Faculty Role
                          </span>
                        </div>

                        <p className="text-sm font-semibold text-gray-800">
                          {getRoles(
                            request.roles
                          )}
                        </p>
                      </div>

                      <div className="bg-white rounded-xl border border-gray-100 p-3">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <CalendarDays className="w-4 h-4" />

                          <span className="text-[10px] font-bold uppercase">
                            Start Date
                          </span>
                        </div>

                        <p className="text-sm font-semibold text-gray-800">
                          {formatDate(
                            request.startDate
                          )}
                        </p>
                      </div>

                      <div className="bg-white rounded-xl border border-gray-100 p-3">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <GraduationCap className="w-4 h-4" />

                          <span className="text-[10px] font-bold uppercase">
                            Expertise
                          </span>
                        </div>

                        <p className="text-sm font-semibold text-gray-800">
                          {getExpertFields(
                            request.expertFields
                          )}
                        </p>
                      </div>

                    </div>

                    {/* BIO */}

                    {request.bios && (
                      <div className="mt-3 bg-white rounded-xl border border-gray-100 p-4">

                        <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">
                          Biography
                        </p>

                        <p className="text-sm text-gray-700 leading-relaxed">
                          {request.bios}
                        </p>

                      </div>
                    )}

                    {/* CREATED DATE */}

                    {request.createdAt && (
                      <p className="text-[11px] text-gray-400 mt-3">
                        Registration request
                        received:{" "}
                        {new Date(
                          request.createdAt
                        ).toLocaleString()}
                      </p>
                    )}

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>

      {/* =====================================================
          CONTACT MESSAGES
      ===================================================== */}

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">

        <div className="flex items-center justify-between border-b pb-3">

          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">

            <Mail className="w-5 h-5 text-rose-700" />

            Contact Messages

          </h2>

          <span className="text-xs bg-cyan-100 text-cyan-800 font-bold px-3 py-1 rounded-full">
            {mails.length} Messages
          </span>

        </div>

        {mails.length === 0 ? (
          <p className="text-center py-6 text-gray-500 text-sm">
            No contact messages received.
          </p>
        ) : (
          <div className="space-y-3">

            {mails.map((msg) => (

              <div
                key={msg._id}
                className="
                  flex
                  flex-col
                  md:flex-row
                  md:items-center
                  justify-between
                  gap-4
                  p-4
                  bg-gray-50
                  rounded-xl
                  border
                  border-gray-200
                "
              >

                <div className="space-y-1">

                  <div className="flex items-center gap-2 flex-wrap">

                    <span className="font-bold text-gray-900 text-sm">
                      {msg.name}
                    </span>

                    <span className="text-xs text-gray-500 font-mono">
                      ({msg.email})
                    </span>

                  </div>

                  {msg.subject && (
                    <p className="text-xs font-semibold text-cyan-800">
                      Subject:{" "}
                      {msg.subject}
                    </p>
                  )}

                  <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-100 mt-2">
                    {msg.message}
                  </p>

                  {msg.createdAt && (
                    <p className="text-[11px] text-gray-400">
                      Received:{" "}
                      {new Date(
                        msg.createdAt
                      ).toLocaleString()}
                    </p>
                  )}

                </div>

                <button
                  onClick={() =>
                    handleDeleteMail(
                      msg._id,
                      msg.name
                    )
                  }
                  className="
                    flex
                    items-center
                    justify-center
                    gap-1.5
                    px-3
                    py-1.5
                    bg-red-50
                    hover:bg-red-100
                    text-red-700
                    text-xs
                    font-bold
                    rounded-lg
                    border
                    border-red-200
                    transition-colors
                    self-start
                    md:self-auto
                    flex-shrink-0
                  "
                >
                  <Trash2 className="w-4 h-4" />

                  Delete
                </button>

              </div>

            ))}

          </div>
        )}

      </div>

      {/* =====================================================
          CONFIRMATION MODAL
      ===================================================== */}

      {confirmationAction && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/50
            backdrop-blur-sm
            px-4
          "
          onClick={closeConfirmationModal}
        >
          <div
            className="
              w-full
              max-w-md
              bg-white
              rounded-2xl
              shadow-2xl
              border
              border-gray-100
              p-6
              animate-in
              fade-in
              zoom-in-95
              duration-200
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* =================================================
                CLOSE BUTTON
            ================================================= */}

            <div className="flex justify-end">

              <button
                type="button"
                onClick={
                  closeConfirmationModal
                }
                disabled={
                  confirmationLoading
                }
                className="
                  w-8
                  h-8
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-gray-400
                  hover:text-gray-700
                  hover:bg-gray-100
                  disabled:opacity-50
                "
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* =================================================
                ICON
            ================================================= */}

            <div className="flex justify-center -mt-2 mb-4">

              <div
                className={`
                  w-16
                  h-16
                  rounded-full
                  flex
                  items-center
                  justify-center
                  ${
                    confirmationAction.type ===
                    "acceptFaculty"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }
                `}
              >

                {confirmationAction.type ===
                "acceptFaculty" ? (
                  <Check
                    className="
                      w-8
                      h-8
                      text-green-600
                    "
                  />
                ) : (
                  <AlertTriangle
                    className="
                      w-8
                      h-8
                      text-red-600
                    "
                  />
                )}

              </div>

            </div>

            {/* =================================================
                TITLE
            ================================================= */}

            <h2
              className="
                text-xl
                font-bold
                text-gray-900
                text-center
              "
            >
              {getConfirmationTitle()}
            </h2>

            {/* =================================================
                MESSAGE
            ================================================= */}

            <p
              className="
                text-sm
                text-gray-600
                text-center
                mt-3
                leading-relaxed
              "
            >
              {getConfirmationMessage()}
            </p>

            {/* =================================================
                TARGET NAME
            ================================================= */}

            <div
              className="
                mt-4
                px-4
                py-3
                bg-gray-50
                border
                border-gray-200
                rounded-xl
                text-center
              "
            >

              <p className="text-xs text-gray-500">
                Selected
              </p>

              <p className="text-sm font-bold text-gray-800 mt-1">
                {confirmationAction.name}
              </p>

            </div>

            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="flex gap-3 mt-6">

              {/* NO */}

              <button
                type="button"
                onClick={
                  closeConfirmationModal
                }
                disabled={
                  confirmationLoading
                }
                className="
                  flex-1
                  px-4
                  py-3
                  rounded-xl
                  bg-gray-100
                  hover:bg-gray-200
                  text-gray-700
                  font-semibold
                  transition
                  disabled:opacity-50
                "
              >
                No
              </button>

              {/* YES */}

              <button
                type="button"
                onClick={
                  handleConfirmAction
                }
                disabled={
                  confirmationLoading
                }
                className={`
                  flex-1
                  px-4
                  py-3
                  rounded-xl
                  text-white
                  font-semibold
                  transition
                  disabled:opacity-60
                  ${getConfirmButtonClass()}
                `}
              >
                {confirmationLoading
                  ? "Processing..."
                  : getConfirmButtonText()}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}