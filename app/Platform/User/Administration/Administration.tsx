import { useState, useEffect } from "react";
import apiClient, { API_BASE_URL } from "~/utils/apiClient";

type CommonProps = {
  name: string;
};

type AuthorityItem = {
  _id?: string;
  position: string;
  name: string;
  info: string;
  bios: string;
  photo: string;
};

export default function Common({ name }: CommonProps) {
  return (
    <>
      <div className="uppercase text-2xl font-bold tracking-widest p-4 bg-cyan-500 border-2 border-gray-300 rounded-xs text-white text-center shadow-xs">
        {name}
      </div>
      <AdministrationData name={name} />
    </>
  );
}

function AdministrationData({ name }: CommonProps) {
  const [authority, setAuthority] = useState<AuthorityItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const roleKey =
      name.toLowerCase().includes("chancellor") || name.toLowerCase().includes("vc")
        ? "vc"
        : "principal";

    apiClient
      .get(`/authority/role/${roleKey}`)
      .then((res) => {
        const fetched = res.data?.data;
        if (fetched) {
          setAuthority(fetched);
        }
      })
      .catch(() => {
        // Fallback: search in full list
        apiClient
          .get("/authority")
          .then((res) => {
            const list: AuthorityItem[] = res.data?.data || res.data || [];
            const found = list.find(
              (item) =>
                item.position?.toLowerCase().includes(roleKey) ||
                item.name?.toLowerCase().includes(roleKey)
            );
            if (found) setAuthority(found);
          })
          .catch(() => {});
      })
      .finally(() => {
        setLoading(false);
      });
  }, [name]);

  const photoSrc = authority?.photo
    ? authority.photo.startsWith("http")
      ? authority.photo
      : `${API_BASE_URL}/uploads/authority/${authority.photo}`
    : "/Images/Authority/placeholder.jpg";

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-8 py-10 px-4 max-w-4xl mx-auto">
      {loading ? (
        <div className="text-center py-20 text-gray-500 font-semibold">
          Loading administration details...
        </div>
      ) : (
        <>
          {authority?.photo && (
            <div className="relative group">
              <img
                src={photoSrc}
                alt={authority.name || name}
                className="w-64 h-80 object-cover rounded-2xl shadow-lg border-4 border-white transition-transform group-hover:scale-[1.02]"
              />
            </div>
          )}

          <div className="flex flex-col justify-center items-center gap-2 text-center max-w-2xl">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-wide">
              {authority?.name ? authority.name : `About The ${name}`}
            </h1>
            {authority?.position && (
              <p className="text-sm font-semibold text-cyan-800 uppercase tracking-wide">
                {authority.position}
              </p>
            )}
            {authority?.info && (
              <div className="text-gray-700 font-medium leading-relaxed whitespace-pre-line text-base bg-cyan-50/60 border border-cyan-100 p-4 rounded-xl w-full mt-2">
                {authority.info}
              </div>
            )}
          </div>

          {authority?.bios && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base text-justify w-full">
              {authority.bios.split("\n").map((line, index) => (
                <p key={index} dangerouslySetInnerHTML={{ __html: line }} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
