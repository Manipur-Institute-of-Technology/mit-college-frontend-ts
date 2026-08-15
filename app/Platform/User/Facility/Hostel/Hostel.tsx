import { useEffect, useState } from "react";
import apiClient from "~/utils/apiClient";
import Informations from "~/Common/Informations/Informations";

interface SideAdminData {
  _id: string;
  key: string;
  name: string;
  position?: string;
  info: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function Hostel_Facility() {
  const [hostels, setHostels] = useState<SideAdminData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHostelData = async () => {
      try {
        setLoading(true);

        const response = await apiClient.get<SideAdminData[]>(
          "/sideadmin/hostel"
        );

        // Only show active hostel admins
        const activeHostels = response.data.filter(
          (hostel) => hostel.isActive
        );

        setHostels(activeHostels);
      } catch (error) {
        console.error("HOSTEL SIDE ADMIN FETCH ERROR:", error);
        setHostels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHostelData();
  }, []);

  return (
    <>
      {/* Page Heading */}
      <div className="uppercase text-2xl font-bold tracking-widest p-4 bg-cyan-500 border-2 border-gray-300 rounded-xs text-white text-center shadow-xs">
        Hostel
      </div>

      {/* Hostel Admin Section */}
      <div className="w-full px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <p className="text-gray-500 text-lg">
              Loading hostel information...
            </p>
          </div>
        ) : hostels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {hostels.map((hostel) => (
              <div
                key={hostel._id}
                className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Hostel Type Header */}
                <div className="bg-cyan-500 px-6 py-4">
                  <h2 className="text-xl font-bold text-white">
                    {hostel.key === "boys_hostel"
                      ? "Boys Hostel"
                      : hostel.key === "girls_hostel"
                        ? "Girls Hostel"
                        : "Hostel"}
                  </h2>
                </div>

                {/* Admin Details */}
                <div className="p-6">
                  {/* Name */}
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {hostel.name}
                    </h3>
                  </div>

                  {/* Position */}
                  {hostel.position && (
                    <div className="mb-5">
                      <p className="text-sm font-semibold text-cyan-600 uppercase tracking-wide">
                        Position
                      </p>

                      <p className="text-lg font-medium text-gray-700 mt-1">
                        {hostel.position}
                      </p>
                    </div>
                  )}

                  {/* Information */}
                  <div>
                    <p className="text-sm font-semibold text-cyan-600 uppercase tracking-wide mb-2">
                      Information
                    </p>

                    <p className="text-gray-600 leading-7 whitespace-pre-line">
                      {hostel.info}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center py-10">
            <div className="text-center">
              <p className="text-gray-500 text-lg">
                Hostel information is currently unavailable.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Information */}
      <Informations />
    </>
  );
}