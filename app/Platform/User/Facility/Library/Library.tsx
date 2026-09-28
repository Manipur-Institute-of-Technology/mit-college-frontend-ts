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

export default function Library_Facility() {
  const [library, setLibrary] = useState<SideAdminData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        setLoading(true);

        const response = await apiClient.get<SideAdminData>(
          "/sideadmin/library"
        );

        if (response.data?.isActive) {
          setLibrary(response.data);
        } else {
          setLibrary(null);
        }
      } catch (error) {
        setLibrary(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryData();
  }, []);

  return (
    <div className="min-h-screen space-y-6 sm:space-y-8 px-3 sm:px-5 md:px-8 lg:px-10">
      {/* Page Heading */}
      <div className="uppercase text-center text-lg sm:text-xl md:text-2xl font-bold tracking-[0.12em] sm:tracking-widest p-3 sm:p-4 md:p-5 bg-cyan-500 border-2 border-gray-300 rounded shadow-sm text-white">
        Library
      </div>

      {/* Library Admin */}
      <div className="w-full py-4 sm:py-6">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <p className="text-gray-500 text-lg">
              Loading library information...
            </p>
          </div>
        ) : library ? (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              
              {/* Card Header */}
              <div className="bg-cyan-500 px-6 py-5">
                <h2 className="text-xl font-bold text-white">
                  Library Administration
                </h2>
              </div>

              {/* Card Content */}
              <div className="p-6 md:p-8">

                {/* Name */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-cyan-600 uppercase tracking-wide mb-1">
                    Name
                  </p>

                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                    {library.name}
                  </h3>
                </div>

                {/* Position */}
                {library.position && (
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-cyan-600 uppercase tracking-wide mb-1">
                      Position
                    </p>

                    <p className="text-lg font-medium text-gray-700">
                      {library.position}
                    </p>
                  </div>
                )}

                {/* Information */}
                <div>
                  <p className="text-sm font-semibold text-cyan-600 uppercase tracking-wide mb-2">
                    Information
                  </p>

                  <p className="text-sm sm:text-base md:text-[17px] text-gray-600 leading-7 sm:leading-8 whitespace-pre-line">
                    {library.info}
                  </p>
                </div>

              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-10">
            <div className="text-center">
              <p className="text-gray-500 text-lg">
                Library information is currently unavailable.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Information */}
      <Informations />
    </div>
  );
}
