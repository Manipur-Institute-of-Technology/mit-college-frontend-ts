import { VC_data } from "~/DB_Sample/VC";

type commonProps = {
  name: string;
};

export default function Common({ name }: commonProps) {
  return (
    <>
      <div className="uppercase text-2xl font-bold tracking-widest p-4 bg-cyan-500 border-2 border-gray-300 rounded-xs">
        {name}
      </div>
      <AdministrationData name={name} />
    </>
  );
}

function AdministrationData({ name }: commonProps) {
  if (name == "Vice Chancellor")
    return (
      <>
        {VC_data.map((item, index) => {
          return (
            <>
              <div className="min-h-screen flex flex-col justify-center items-center gap-6 ">
                <img
                  src={item?.photo}
                  alt="Vice-Chancler"
                  className="w-60 h-80"
                />
                <div className="flex flex-col justify-center items-center gap-2 text-lg tracking-wide">
                  {item?.about.split("\n").map((line, index) => (
                    <p key={index}>
                      {line}
                      <br />
                    </p>
                  ))}
                </div>
              </div>
            </>
          );
        })}
      </>
    );
  else if ((name = "Principal"))
    return (
      <>
        <div></div>
      </>
    );
}
