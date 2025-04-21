// import { Administration_data } from "~/DB_Sample/Admin";

// type commonProps = {
//   name: string;
// };

// export default function Common({ name }: commonProps) {
//   return (
//     <>
//       <div className="uppercase text-2xl font-bold tracking-widest p-4 bg-cyan-500 border-2 border-gray-300 rounded-xs">
//         {name}
//       </div>
//       <AdministrationData name={name} />
//     </>
//   );
// }

// function AdministrationData({ name }: commonProps) {
//   const selectedAdmin = Administration_data.find(
//     (item) => item.Admin.toLowerCase() === name.toLowerCase()
//   );

//   return (
//     selectedAdmin && (
//       <div className="min-h-screen flex flex-col justify-center items-center gap-6">
//             <span>About The {selectedAdmin.Admin}</span>
//       </div>
//     )
//   );
// }


import { Information_data } from "~/DB_Sample/Information";

type commonProps = {
  name: string;
};

export default function Common({ name }: commonProps) {
  return (
    <>
      <div className="uppercase text-2xl font-bold tracking-widest p-4 bg-cyan-500 border-2 border-gray-300 rounded-xs">
        {name}
      </div>
      <InformationData name={name} />
    </>
  );
}

function InformationData({ name }: commonProps) {
  const selectedInfo = Information_data.find(
    (item) => item.File_name.toLowerCase() === name.toLowerCase()
  );

  return (
    selectedInfo && (
      <div className="min-h-screen flex flex-col items-top">
        <span>Information about {selectedInfo.File_name}</span>
      </div>
    )
  );
}
