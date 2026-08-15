import { useEffect, useState } from "react";
import apiClient, { API_BASE_URL } from "~/utils/apiClient";
import Informations from "~/Common/Informations/Informations";

type CommonProps = {
  name: string;
};

type InfoDoc = {
  _id: string;
  title: string;
  fileName: string;
};

export default function Common({ name }: CommonProps) {
  const [documents, setDocuments] = useState<InfoDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/information")
      .then((res) => {
        const list = res.data?.data || res.data || [];
        setDocuments(Array.isArray(list) ? list : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const matchingDoc = documents.find(
    (doc) => doc.title?.toLowerCase() === name.toLowerCase()
  );

  return (
    <div className="min-h-screen space-y-6">
      <div className="uppercase text-2xl font-bold tracking-widest p-4 bg-cyan-500 border-2 border-gray-300 rounded-xs text-white text-center shadow-xs">
        {name}
      </div>

      <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-4">
        {loading ? (
          <div className="text-center py-10 text-gray-500 font-semibold">
            Loading document information...
          </div>
        ) : matchingDoc ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">{matchingDoc.title}</h2>
            <a
              href={`${API_BASE_URL}/uploads/informations/${matchingDoc.fileName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
            >
              View / Download Official PDF Document
            </a>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            <p className="font-medium text-base">Official {name} details</p>
            <p className="text-xs text-gray-400 mt-1">
              Refer to the notifications panel below for recent official updates.
            </p>
          </div>
        )}
      </div>

      <Informations />
    </div>
  );
}
