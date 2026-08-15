import { useState, useEffect } from "react";
import apiClient from "~/utils/apiClient";
import Informations from "~/Common/Informations/Informations";

type SideAdminData = {
  _id?: string;
  facility?: string;
  key?: string;
  name: string;
  position?: string;
  info: string;
};

export default function HostelAdminstration() {
  const [admins, setAdmins] = useState<SideAdminData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/sideadmin")
      .then((res) => {
        const list: SideAdminData[] = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];

        const hostelList = list.filter(
          (item) =>
            (item.facility
              ? item.facility.toLowerCase().includes("hostel")
              : true) &&
            !item.info?.toLowerCase().includes("librarian")
        );

        setAdmins(hostelList);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="uppercase text-2xl font-bold tracking-widest p-4 bg-cyan-500 border-b-2 border-cyan-600 text-white text-center shadow-sm">
          Hostel Administration
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          {loading ? (
            <div className="text-center py-20 text-gray-500 font-semibold">
              Loading hostel administration details...
            </div>
          ) : admins.length > 0 ? (
            admins.map((admin, idx) => (
              <div
                key={admin._id || idx}
                className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4"
              >
                <div className="border-b border-gray-200 pb-3">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {admin.name}
                  </h2>
                  {admin.position && (
                    <span className="inline-block mt-1 text-xs font-semibold bg-cyan-100 text-cyan-800 px-3 py-0.5 rounded-full">
                      {admin.position}
                    </span>
                  )}
                </div>

                <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                  {admin.info}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-600 font-medium">
              Hostel Administration information is currently being updated.
            </div>
          )}
        </div>
      </div>

      <Informations />
    </>
  );
}