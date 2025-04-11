import { Department_data } from "~/DB_Sample/Department";
import { Faculty_Data } from "~/DB_Sample/FacultyData";

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
  const selectedFaculty = Faculty_Data.filter(
    (item) => item.deptCode.toLowerCase() === name.toLowerCase()
  );
  const selectedDepartment = Department_data.filter(
    (item) => item.DeptCode.toLowerCase() === name.toLowerCase()
  );
  return (
    <>
      {selectedDepartment.map((item, index) => {
        return (
          <>
            <h1>{item.DeptCode}</h1>
          </>
        );
      })}
    </>
  );
}
