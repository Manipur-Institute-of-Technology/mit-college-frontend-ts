import { Department_data } from "~/DB_Sample/Department";
import { Teachers } from "~/DB_Sample/Department";

type commonProps = {
  name: string;
};

export default function Common({ name }: commonProps) {
  return (
    <>
      <div className="uppercase text-2xl font-bold tracking-widest p-4 bg-cyan-500 border-2 border-gray-300 rounded-xs">
        {name}
      </div>
      <DepartmentData name={name} />
    </>
  );
}

function DepartmentData({ name }: commonProps) {
  if (name == "Computer Science & Engineering")
    return (
      <>
        {Department_data.map((item, index) => {
          return (
            <>
              <div
                style={{ whiteSpace: "pre-wrap" }}
                className="flex flex-col justify-center gap-2 text-lg tracking-wide "
              >
                {item?.Desc.split("\n").map((line, index) => (
                  <p key={index}>
                    {line}
                    <br />
                  </p>
                ))}
              </div>
              <div className=" min-h-screen p-6">
                <h2 className="text-2xl font-semibold mb-6">
                  Faculty Members :
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {Teachers.map((teacher, index) => (
                    <div
                      key={index}
                      className="relative flex bg-white rounded-xl shadow-md p-4 items-center space-x-4 border border-gray-300"
                    >
                      {/* HOD Ribbon */}
                      {teacher.HOD === 1 && (
                        <div className="absolute top-0 right-0 bg-red-600 text-white text-xs px-2 py-1 rounded-bl-md font-bold">
                          HOD
                        </div>
                      )}

                      {/* Image */}
                      <img
                        src={teacher.Image}
                        alt={teacher.name}
                        className="w-24 h-28 object-cover rounded-md border"
                      />

                      {/* Details */}
                      <div className="flex-1 text-sm">
                        <h3 className="font-semibold text-base">
                          {teacher.name}
                        </h3>
                        <p className="text-gray-700">{teacher.position}</p>
                        <p className="text-gray-500">{teacher.email.trim()}</p>
                        <p className="text-gray-700">{teacher.qualification}</p>
                        <p className="text-gray-700">
                          {teacher.Specialization}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Lab and Facilities Section */}
              {item.DeptCode === "CSE" && (
                <div className="p-6 mt-6 space-y-6 rounded-lg">
                  {/* Lab Section */}
                  <h2 className="text-xl font-semibold">Lab</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {item.Images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.link}
                        alt={img.caption}
                        className="rounded-md shadow-md border object-cover"
                      />
                    ))}
                  </div>

                  {/* Facilities Section */}
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Facilities</h2>
                    <p style={{ whiteSpace: "pre-wrap" }} className="text-justify text-gray-800 whitespace-pre-line">
                      {item.MoreInfo[0].Facilities}
                    </p>
                  </div>
                </div>
              )}

              <h1>{item.DeptCode}</h1>
            </>
          );
        })}
      </>
    );
}
