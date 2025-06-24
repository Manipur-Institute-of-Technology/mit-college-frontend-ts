import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Faculty_Data } from "~/DB_Sample/FacultyData";
import Teacher_Profile_View from "~/Common/Teacher/Teacher_Profile_View";

// Define the type here (no import)
type PaperType = {
  desc: string;
  link: string;
};

type TeacherDataType = {
  id: string;
  name: string;
  position: string;
  email: string;
  phone_No: string;
  Photo: string;
  HOD: boolean;
  Password: string;
  recovery_code: string;
  speacility: string;
  qualification: string;
  department: string;
  deptCode: string;
  papers: PaperType[];
};

// Simulated API call (you can replace this with real API later)
const fetchFacultyData = async (): Promise<typeof Faculty_Data> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Faculty_Data);
    }, 500); // simulate network delay
  });
};

export default function TeacherProfilePage() {
  const { teacherName } = useParams<{ teacherName: string }>();
  const [teacher, setTeacher] = useState<TeacherDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchFacultyData();
        const found = data.find(
          (t) => t.name.toLowerCase() === teacherName?.toLowerCase()
        );

        if (found) {
          // Fix types (convert phone_No to string, HOD to boolean)
          const fixedTeacher = {
            ...found,
            phone_No: String(found.phone_No),
            HOD: Boolean(found.HOD),
          };
          setTeacher(fixedTeacher as TeacherDataType);
        } else {
          setTeacher(null);
        }
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [teacherName]);

  if (loading) return <div className="text-center">Loading...</div>;

  if (!teacher) return <div className="text-center text-red-500">Teacher not found!</div>;

  return <Teacher_Profile_View teachers={[teacher]} />;
}
