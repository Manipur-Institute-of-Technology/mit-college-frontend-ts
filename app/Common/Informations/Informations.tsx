import "./Informations.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import { Download_data } from "~/DB_Sample/Download";
import { Information_data } from "~/DB_Sample/Information";
import { News_notification_data } from "~/DB_Sample/News_Notification";

type DataType = { File_name: string; Links: string }[];

export default function Informations() {
  const [downloadData, setDownloadData] = useState<DataType>([]);
  const [informationData, setInformationData] = useState<DataType>([]);
  const [newsNotificationData, setNewsNotificationData] = useState<DataType>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [downloadRes, infoRes, newsRes] = await Promise.all([
          axios.get("/api/download"),
          axios.get("/api/information"),
          axios.get("/api/news"),
        ]);

        setDownloadData(downloadRes.data);
        setInformationData(infoRes.data);
        setNewsNotificationData(newsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-wrap justify-around items-start w-full gap-4 m-2 border-t-2 border-y-neutral-500 pt-8">
      <div className="flex-[1_1_300px] flex justify-center">
        <News_Notification />
      </div>
      <div className="flex-[1_1_300px] flex justify-center">
        <Information />
      </div>
      <div className="flex-[1_1_300px] flex justify-center">
        <Download />
      </div>
    </div>
  );
}

/* ------------------ HELPERS ------------------ */

const isExternalLink = (url: string) => {
  try {
    const linkUrl = new URL(url, window.location.origin);
    return linkUrl.origin !== window.location.origin;
  } catch {
    return false;
  }
};

const handleExternalClick = (
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string
) => {
  if (!isExternalLink(href)) return;

  e.preventDefault();

  Swal.fire({
    title: "Leave this site?",
    text: "You are being redirected to an external website.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Continue",
    cancelButtonText: "Stay here",
    confirmButtonColor: "#22c55e",
    cancelButtonColor: "#ef4444",
    customClass: {
      popup: "rounded-xl",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  });
};

/* ------------------ DOWNLOAD ------------------ */

function Download() {
  return (
    <div className="flex flex-col gap-4 p-4 border-2 border-gray-400 rounded-br-2xl rounded-tl-2xl h-96 w-5/6 max-w-3xl">
      <div className="border-b-2 border-green-700 uppercase font-bold text-lg text-gray-700">
        Download
      </div>

      <div className="flex flex-col gap-5 overflow-y-scroll hide-scrollbar">
        {Download_data.map((item, index) => (
          <a
            key={index}
            href={item.Links}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => handleExternalClick(e, item.Links)}
            className="text-teal-950 underline cursor-pointer hover:text-teal-700"
          >
            {item.File_name}
          </a>
        ))}
      </div>
    </div>
  );
}

/* ------------------ INFORMATION ------------------ */

function Information() {
  return (
    <div className="flex flex-col gap-4 p-4 border-2 border-gray-400 rounded-br-2xl rounded-tl-2xl h-96 w-5/6 max-w-3xl">
      <div className="border-b-2 border-green-700 uppercase font-bold text-lg text-gray-700">
        Information
      </div>

      <div className="flex flex-col gap-5 overflow-y-scroll hide-scrollbar">
        {Information_data.map((item, index) => (
          <a
            key={index}
            href={item.Links}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => handleExternalClick(e, item.Links)}
            className="text-teal-950 underline cursor-pointer hover:text-teal-700"
          >
            {item.File_name}
          </a>
        ))}
      </div>
    </div>
  );
}

/* ------------------ NEWS & NOTIFICATION ------------------ */

function News_Notification() {
  return (
    <div className="flex flex-col gap-4 p-4 border-2 border-gray-400 rounded-br-2xl rounded-tl-2xl h-96 w-5/6 max-w-3xl">
      <div className="border-b-2 border-green-700 uppercase font-bold text-lg text-gray-700">
        News & Notification
      </div>

      <div className="h-80 overflow-hidden">
        <div className="py-12 animate-marquee flex flex-col gap-5">
          {News_notification_data.map((item, index) => (
            <a
              key={index}
              href={item.Links}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleExternalClick(e, item.Links)}
              className="text-teal-950 underline cursor-pointer hover:text-teal-700"
            >
              {item.File_name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
