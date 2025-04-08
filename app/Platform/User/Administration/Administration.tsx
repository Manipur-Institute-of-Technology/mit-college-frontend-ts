import { Administration_data } from "~/DB_Sample/Admin";

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
  const selectedAdmin = Administration_data.find(
    (item) => item.Admin.toLowerCase() === name.toLowerCase()
  );

  return (
    selectedAdmin && (
      <div className="min-h-screen flex flex-col justify-center items-center gap-6">
        <img
          src={selectedAdmin.photo}
          alt={selectedAdmin.Admin}
          className="w-60 h-80"
        />

        <div className="flex flex-col justify-center items-center gap-0.5 text-lg tracking-wide">
          <p className="font-bold tracking-wide">
            <span>About The {selectedAdmin.Admin}</span>
          </p>
          {selectedAdmin.about.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>

        {selectedAdmin.message && (
          <div className="leading-7 tracking-wide">
            {selectedAdmin.message.split("\n").map((line, index) => (
              <p key={index}>&emsp;&emsp;{line}</p>
            ))}
          </div>
        )}
      </div>
    )
  );
}
