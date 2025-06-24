import { Link } from "react-router-dom";
import { Faculty_Data } from "~/DB_Sample/FacultyData";

type DepartmentDataProps = {
  name: string;
};

export default function DepartmentData({ name }: DepartmentDataProps) {
  const selectedFaculty = Faculty_Data.filter(
    (item) => item.deptCode.toLowerCase() === name.toLowerCase()
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Faculty Members :
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {selectedFaculty.map((teacher, index) => (
          <Link
            key={index}
            to={`/teacher/${teacher.name}`}
            className="cursor-pointer relative flex bg-white rounded-xl shadow-md p-4 items-center space-x-4 border border-gray-300"
          >
            {teacher.HOD === 1 && (
              <div className="absolute top-0 right-0 bg-red-600 text-white text-xs px-2 py-1 rounded-bl-md font-bold">
                HOD
              </div>
            )}

            <img
              src={teacher.Photo}
              alt={teacher.name}
              className="w-24 h-28 object-cover rounded-md border"
            />

            <div className="flex-1 text-sm">
              <h3 className="font-semibold text-base">{teacher.name}</h3>
              <p className="text-gray-700">{teacher.position}</p>
              <p className="text-gray-500">{teacher.email.trim()}</p>
              <p className="text-gray-700">{teacher.qualification}</p>
              <p className="text-gray-700">{teacher.speacility}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
