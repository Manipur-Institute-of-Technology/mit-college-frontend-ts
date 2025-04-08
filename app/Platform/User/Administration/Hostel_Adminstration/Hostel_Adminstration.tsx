import Informations from "~/Common/Informations/Informations";
import { Hostel_Data } from "~/DB_Sample/Hostel_Data";

export default function HostelAdminstration() {
  console.log(Hostel_Data);
  return (
    <>
      <div className="min-h-dvh">
        <div className="uppercase text-2xl font-bold tracking-widest p-4 bg-cyan-500 border-2 border-gray-300 rounded-xs ">
          Hostel Administration
        </div>
        <div className="m-6">
          <div className="text-2xl tracking-wider mb-4">
            &emsp;&emsp;{Hostel_Data[0]?.tittle}
          </div>
          <div className="text-lg leading-9">
            {Hostel_Data[0]?.info.split("\n").map((line, index) => {
              return (
                <p>
                  {line}
                  <br />
                </p>
              );
            })}
          </div>
        </div>
      </div>
      <Informations />
    </>
  );
}
