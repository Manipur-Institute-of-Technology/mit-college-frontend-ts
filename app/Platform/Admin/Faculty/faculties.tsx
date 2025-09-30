import { Faculty_Data } from "~/DB_Sample/FacultyData";
import { Link } from "react-router-dom";
import { FacultyRequest_Data } from "~/DB_Sample/FacultyRequest";
import { BellIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import "./faculties.css";
import { toast } from "react-toastify";
import { useRef } from "react";

type FacultyMember = typeof Faculty_Data[number];

export default function Admin_Faculty_Page() {
  const [showModal, setShowModal] = useState(false);
  const [requests, setRequests] = useState(FacultyRequest_Data);
  const [facultyList, setFacultyList] = useState(Faculty_Data);
  const deleteTimeouts = useRef<{[key: string]: NodeJS.Timeout}>({});
  const [pendingDelete, setPendingDelete] = useState<{name: string, email: string} | null>(null);

  const handleRequestAction = (id: number, action: "approved" | "rejected") => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: action } : req
      )
    );
    if (action === "approved") {
      toast.success("Request accepted successfully!");
    } else {
      toast.error("Request declined.");
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");

  return (
    <div className="p-6">
      {/* End Facility Requests Summary Block */}
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold mr-4">Faculty</h1>
        <button
          className="relative"
          onClick={() => setShowModal(true)}
          aria-label="View Facility Requests"
        >
          <BellIcon className="w-7 h-7 text-blue-600" />
          {pendingRequests.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
              {pendingRequests.length}
            </span>
          )}
        </button>
      </div>
      {/* Modal for Facility Requests */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-transparent"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl h-[75vh] flex flex-col relative border-2 border-blue-200"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl transition-colors duration-200"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-700 tracking-wide drop-shadow">Pending Facility Requests</h2>
            {pendingRequests.length === 0 ? (
              <div className="text-gray-500 text-center flex-1 flex items-center justify-center">No pending requests.</div>
            ) : (
              <ul className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                {pendingRequests.map((req) => (
                  <li key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 rounded-lg p-4 gap-2 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex-1">
                      <span className="font-semibold text-blue-900">{req.facultyName}</span> <span className="text-gray-700">requested</span> <span className="font-semibold text-blue-700">{req.facilityRequested}</span>
                      <span className="ml-2 text-xs text-gray-400">({req.dateRequested})</span>
                    </div>
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <button
                        className="px-4 py-1 bg-gradient-to-r from-green-400 to-green-600 text-white rounded shadow hover:from-green-500 hover:to-green-700 text-sm font-semibold transition-colors duration-200"
                        onClick={() => handleRequestAction(req.id, "approved")}
                      >
                        Accept
                      </button>
                      <button
                        className="px-4 py-1 bg-gradient-to-r from-red-400 to-red-600 text-white rounded shadow hover:from-red-500 hover:to-red-700 text-sm font-semibold transition-colors duration-200"
                        onClick={() => handleRequestAction(req.id, "rejected")}
                      >
                        Decline
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {facultyList.map((teacher: FacultyMember, index: number) => {
          const facultyKey = teacher.name + teacher.email;
          return (
            <div key={facultyKey} className="relative flex flex-col bg-white rounded-xl shadow-md p-4 items-center border border-gray-300 min-h-[220px] w-[80%] mx-auto">
              <Link
                to={`/teacher/${teacher.name}`}
                className="cursor-pointer flex-1 w-full flex items-center space-x-4"
              >
                {teacher.HOD === 1 && (
                  <div className="absolute top-0 right-0 bg-red-600 text-white text-xs px-2 py-1 rounded-bl-md font-bold">
                    HOD
                  </div>
                )}
                <img
                  src={`/${teacher.Photo}`}
                  alt={teacher.name}
                  className="w-24 h-28 object-cover rounded-md border"
                />
                <div className="flex-1 text-sm">
                  <h3 className="font-semibold text-base">{teacher.name}</h3>
                  <p className="text-gray-700">{teacher.position}</p>
                  <p className="text-gray-500">{teacher.email.trim()}</p>
                  <p className="text-gray-700">{teacher.qualification}</p>
                  <p className="text-gray-700">{teacher.speacility}</p>
                </div>
              </Link>
              {/* Bottom section: Recovery code and Delete button */}
              <div className="w-full flex flex-col sm:flex-row items-center justify-between mt-2 gap-1 border-t pt-1 pb-0.5">
                <span className="text-gray-700 font-mono text-xs">Recovery Code: <span className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700">{teacher.recovery_code || 'N/A'}</span></span>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white text-xs px-2.5 py-0.5 rounded shadow font-bold transition-colors duration-200"
                  style={{ minHeight: 0, minWidth: 0, lineHeight: 1.2 }}
                  onClick={() => {
                    // Show a toast with undo option
                    if (deleteTimeouts.current[facultyKey]) return; // Prevent double delete
                    setPendingDelete({ name: teacher.name, email: teacher.email });
                    const toastId = toast(
                      <div>
                        <span>Confirm delete faculty?</span>
                        <button
                          style={{ marginLeft: 12, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                          onClick={() => {
                            clearTimeout(deleteTimeouts.current[facultyKey]);
                            delete deleteTimeouts.current[facultyKey];
                            setPendingDelete(null);
                            toast.dismiss(toastId);
                          }}
                        >Undo</button>
                      </div>,
                      {
                        autoClose: 3000,
                        onClose: () => {
                          if (pendingDelete && pendingDelete.name === teacher.name && pendingDelete.email === teacher.email) {
                            setFacultyList((prev) => prev.filter(f => !(f.name === teacher.name && f.email === teacher.email)));
                            toast.success('Faculty deleted successfully!');
                            setPendingDelete(null);
                          }
                        },
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: false,
                      }
                    );
                    // Set timeout to auto-delete if not undone
                    deleteTimeouts.current[facultyKey] = setTimeout(() => {
                      if (pendingDelete && pendingDelete.name === teacher.name && pendingDelete.email === teacher.email) {
                        setFacultyList((prev) => prev.filter(f => !(f.name === teacher.name && f.email === teacher.email)));
                        toast.success('Faculty deleted successfully!');
                        setPendingDelete(null);
                      }
                      toast.dismiss(toastId);
                      delete deleteTimeouts.current[facultyKey];
                    }, 3000);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}