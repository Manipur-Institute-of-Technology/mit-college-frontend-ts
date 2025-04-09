import { Department_data } from "~/DB_Sample/Department";

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
                <div className="flex flex-col justify-center items-center gap-2 text-lg tracking-wide">
                  {item?.about.split("\n").map((line, index) => (
                    <p key={index}>
                      {line}
                      <br />
                    </p>
                  ))}
                </div>
              <h1>{item.DeptCode}</h1>
              
            </>
          );
        })}
      </>
    );
}
