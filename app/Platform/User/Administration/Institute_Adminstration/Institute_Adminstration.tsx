import { useState, useEffect } from "react";
import Informations from "~/Common/Informations/Informations";
import {
  Building2,
  Users,
  Shield,
  FileText,
  ExternalLink,
} from "lucide-react";
import Swal from "sweetalert2";
import apiClient, { API_BASE_URL } from "~/utils/apiClient";

export type GoverningBodyStructure = {
  _id?: string;
  position: string;
  role: string;
};

export type GoverningBodyMember = {
  _id?: string;
  name: string;
  background: string;
  role: string;
};

export type AdminDocument = {
  _id?: string;
  title: string;
  type: "file" | "link";
  file?: string;
  url?: string;
  uploadedAt?: string;
};

export type InstituteAdministrationData = {
  _id?: string;
  title?: string;
  description?: string;
  governingBodyStructure: GoverningBodyStructure[];
  governingBodyMembers: GoverningBodyMember[];
  documents: AdminDocument[];
  excelFile?: string;
  updatedAt?: string;
};

const isExternalLink = (url: string) => {
  try {
    const linkUrl = new URL(url, window.location.origin);
    return linkUrl.origin !== window.location.origin;
  } catch {
    return false;
  }
};

const handleDocumentClick = (url: string) => {
  if (!url || url === "#") return;

  if (isExternalLink(url)) {
    Swal.fire({
      title: "Leave this site?",
      text: "You are being redirected to an external document / website.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Continue",
      cancelButtonText: "Stay here",
      confirmButtonColor: "#0891b2",
      cancelButtonColor: "#ef4444",
      customClass: {
        popup: "rounded-xl",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    });
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

export default function InstituteAdminstration() {
  const [data, setData] = useState<InstituteAdministrationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/administrator")
      .then((res) => {
        const fetched = res.data?.data;
        if (fetched) {
          setData(fetched);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="uppercase text-2xl font-bold tracking-widest p-4 bg-cyan-500 border-b-2 border-cyan-600 text-white text-center shadow-sm">
          Institute Administration
        </div>

        <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
          {loading ? (
            <div className="text-center py-20 text-gray-500 font-semibold">
              Loading institute administration data...
            </div>
          ) : !data ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-600 font-medium">
              Institute Administration details are currently being updated by the administration.
            </div>
          ) : (
            <>
              {/* Header Card / Description */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-50 text-cyan-800 rounded-full text-xs font-bold uppercase tracking-wider border border-cyan-200">
                  <Building2 className="w-4 h-4 text-cyan-600" />
                  Governing Body & Leadership
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  {data.title || "Institute Administration"}
                </h1>
                <p className="text-gray-700 text-base leading-relaxed">
                  {data.description ||
                    "The Institute is managed by a Governing Body headed by the Hon’ble Vice Chancellor, Manipur University."}
                </p>
              </div>

              {/* Section 1: Structure of the Governing Body */}
              {data.governingBodyStructure && data.governingBodyStructure.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <Shield className="w-5 h-5 text-cyan-600" />
                    <h2 className="text-xl font-bold text-gray-800">
                      Structure of the Governing Body
                    </h2>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-gray-700">
                        <thead className="bg-cyan-500 text-white uppercase text-xs">
                          <tr>
                            <th className="px-6 py-3.5 font-bold w-16 text-center">#</th>
                            <th className="px-6 py-3.5 font-bold">Position (Ex-officio)</th>
                            <th className="px-6 py-3.5 font-bold">Role</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {data.governingBodyStructure.map((item, idx) => (
                            <tr
                              key={idx}
                              className="hover:bg-gray-50/80 transition-colors"
                            >
                              <td className="px-6 py-4 font-mono font-bold text-cyan-700 text-center">
                                {idx + 1}
                              </td>
                              <td className="px-6 py-4 font-semibold text-gray-900">
                                {item.position}
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                                    item.role?.toLowerCase().includes("chairman")
                                      ? "bg-amber-100 text-amber-900 border-amber-300"
                                      : item.role?.toLowerCase().includes("secy")
                                      ? "bg-blue-100 text-blue-900 border-blue-300"
                                      : "bg-gray-100 text-gray-800 border-gray-200"
                                  }`}
                                >
                                  {item.role}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              )}

              {/* Section 2: Governing Body Members */}
              {data.governingBodyMembers && data.governingBodyMembers.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-cyan-600" />
                      <h2 className="text-xl font-bold text-gray-800">
                        Governing Body Members
                      </h2>
                    </div>
                    <span className="text-xs bg-cyan-100 text-cyan-800 font-semibold px-3 py-1 rounded-full">
                      {data.governingBodyMembers.length} Members
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-gray-700">
                        <thead className="bg-cyan-500 text-white uppercase text-xs">
                          <tr>
                            <th className="px-6 py-3.5 font-bold w-16 text-center">#</th>
                            <th className="px-6 py-3.5 font-bold">Name & Professional Background</th>
                            <th className="px-6 py-3.5 font-bold">Role</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {data.governingBodyMembers.map((member, idx) => (
                            <tr
                              key={idx}
                              className="hover:bg-gray-50/80 transition-colors"
                            >
                              <td className="px-6 py-4 font-mono font-bold text-cyan-700 text-center">
                                {idx + 1}
                              </td>
                              <td className="px-6 py-4 space-y-0.5">
                                <p className="font-bold text-gray-900 text-base">
                                  {member.name}
                                </p>
                                {member.background && (
                                  <p className="text-gray-600 text-xs font-medium">
                                    {member.background}
                                  </p>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                                    member.role?.toLowerCase().includes("chairman")
                                      ? "bg-amber-100 text-amber-900 border-amber-300"
                                      : member.role?.toLowerCase().includes("secy")
                                      ? "bg-blue-100 text-blue-900 border-blue-300"
                                      : "bg-gray-100 text-gray-800 border-gray-200"
                                  }`}
                                >
                                  {member.role}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              )}

              {/* Section 3: Proceedings of the BoG/GB Meetings */}
              {data.documents && data.documents.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <FileText className="w-5 h-5 text-cyan-600" />
                    <h2 className="text-xl font-bold text-gray-800">
                      Proceedings of the BoG/GB Meetings & Documents
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.documents.map((doc, idx) => {
                      const docUrl = doc.url
                        ? doc.url
                        : doc.file
                        ? `${API_BASE_URL}/${doc.file}`
                        : "#";

                      return (
                        <button
                          key={doc._id || idx}
                          onClick={() => handleDocumentClick(docUrl)}
                          className="flex items-center justify-between gap-3 p-5 bg-white hover:bg-cyan-50 border border-gray-200 hover:border-cyan-300 rounded-2xl shadow-sm hover:shadow-md transition-all text-left group"
                        >
                          <div className="flex items-start gap-3.5">
                            <div className="p-3 bg-cyan-50 group-hover:bg-cyan-100 text-cyan-600 rounded-xl transition-colors mt-0.5 flex-shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                              <p className="font-bold text-gray-900 text-sm leading-snug group-hover:text-cyan-800 transition-colors">
                                {doc.title}
                              </p>
                              <span className="inline-block text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase">
                                {doc.type === "file" ? "PDF Document" : "Document Link"}
                              </span>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-cyan-600 flex-shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>

      <Informations />
    </>
  );
}
