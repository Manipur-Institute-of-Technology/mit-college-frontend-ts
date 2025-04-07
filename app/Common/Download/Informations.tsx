import "./Informations.css"
import { Download_data } from "~/DB_Sample/Download";
import { Information_data } from "~/DB_Sample/Information";
import { News_notification_data } from "~/DB_Sample/News_Notification";

export default function Informations() {
    return (
        <>
            <div className="flex flex-wrap justify-center items-center w-full gap-4 m-2">
                <div className="flex-[1_1_300px] max-w-full flex justify-center">
                    <News_Notification />
                </div>
                <div className="flex-[1_1_300px] max-w-full flex justify-center">
                    <Information />
                </div>
                <div className="flex-[1_1_300px] max-w-full flex justify-center">
                    <Download />
                </div>
            </div>
        </>
    );
}


function Download() {
    return(
        <>
            <div className="flex flex-col gap-4 w-3xs p-4 border-2 border-gray-400 rounded-br-2xl rounded-tl-2xl h-64">
               <div className="border-b-2 border-green-700 uppercase font-bold text-lg text-gray-700">News & Notification</div>
               <div className=" h-48 overflow-hidden">
                    <div className="py-12 animate-marquee whitespace-nowrap flex flex-col gap-2">
                    {News_notification_data.map((item, index) => (
                        <a key={index} href={item?.Links} target="_blank" rel="noopener noreferrer" className="text-teal-950">
                            {item?.File_name}
                        </a>
                        ))}
                    </div>
               </div>
            </div>
        </>
    );
}

function Information() {
    return(
        <>
            <div className="flex flex-col gap-4 w-3xs p-4 border-2 border-gray-400 rounded-br-2xl rounded-tl-2xl h-64">
               <div className="border-b-2 border-green-700 uppercase font-bold text-lg text-gray-700">Information</div>
               <div className=" h-48 overflow-hidden">
                    <div className="py-12 animate-marquee whitespace-nowrap flex flex-col gap-2">
                        {Information_data.map((item, index) => (
                            <a key={index} href={item?.Links} target="_blank" rel="noopener noreferrer" className="text-teal-950">
                                {item?.File_name}
                            </a>
                            ))}
                    </div>
               </div>
            </div>
        </>
    );
}

function News_Notification() {
    return (
        <>
            <div className="flex flex-col gap-4 w-3xs p-4 border-2 border-gray-400 rounded-br-2xl rounded-tl-2xl h-64">
               <div className="border-b-2 border-green-700 uppercase font-bold text-lg text-gray-700">Download</div>
               <div className=" h-48 overflow-hidden">
                    <div className="py-12 animate-marquee whitespace-nowrap flex flex-col gap-2">
                        {Download_data.map((item, index) => (
                            <a key={index} href={item?.Links} target="_blank" rel="noopener noreferrer" className="text-teal-950">
                                {item?.File_name}
                            </a>
                            ))}
                    </div>
               </div>
            </div>
        </>
    );
}