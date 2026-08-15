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
        console.error("LIBRARY SIDE ADMIN FETCH ERROR:", error);
        setLibrary(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryData();
  }, []);

  return (
    <>
      {/* Page Heading */}
      <div className="uppercase text-2xl font-bold tracking-widest p-4 bg-cyan-500 border-2 border-gray-300 rounded-xs text-white text-center shadow-xs">
        Library
      </div>

      {/* Library Admin */}
      <div className="w-full px-4 py-8">
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

                  <h3 className="text-2xl font-bold text-gray-800">
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

                  <p className="text-gray-600 text-base leading-7 whitespace-pre-line">
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
    </>
  );
}