import { useAuth } from "~/context/AuthContext";
import SignIn_SignUP from "~/Common/SignIn_SignUP/SiignIn_Signup";
import { contactMessages } from "~/DB_Sample/ContactMessages";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Admin_Home() {
  const { token, role } = useAuth();
  const [messages, setMessages] = useState(contactMessages);

  // Show sign-in if not authenticated as admin
  if (!token || role !== "admin") {
    return (
      <div className="p-4 space-y-6">
        <SignIn_SignUP role="admin" />
      </div>
    );
  }

  // Show admin functions if authenticated
  return (
    <div className="p-4 space-y-6">
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-center">Contact Messages</h3>
        <ul className="space-y-4">
          {messages.length === 0 ? (
            <li className="text-center text-gray-500">No contact messages.</li>
          ) : (
            messages.map((msg) => (
              <li key={msg.id} className="border rounded p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="font-bold">{msg.name} ({msg.email})</div>
                  <div className="text-gray-700 mt-1">{msg.message}</div>
                  <div className="text-xs text-gray-500 mt-2">Received: {new Date(msg.createdAt).toLocaleString()}</div>
                </div>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-2 md:mt-0"
                  onClick={() => {
                    setMessages((prev) => prev.filter((m) => m.id !== msg.id));
                    toast.success(`Deleted message from ${msg.name}`);
                  }}
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
