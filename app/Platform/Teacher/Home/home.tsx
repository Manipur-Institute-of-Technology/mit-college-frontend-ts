import { useState } from "react";
import { useAuth } from "~/context/AuthContext";
import SignIn_SignUP from "~/Common/SignIn_SignUP/SiignIn_Signup";

type PaperType = {
  desc: string;
  link: string;
};

type TeacherDataType = {
  name: string;
  position: string;
  email: string;
  phone_No: string; // As string for validation
  Photo: string | ArrayBuffer | null;
  HOD: boolean;
  Password: string;
  recovery_code: string;
  speacility: string;
  qualification: string;
  department: string;
  deptCode: string;
  papers: PaperType[];
};

export default function Teacher_Home() {
  const { token, role } = useAuth();

  const [teacherData, setTeacherData] = useState<TeacherDataType>({
    name: "Dr. Th. Ibungomacha Singh",
    position: "Associate Professor & HoD (wef 7-11-2023)",
    email: "ibomcha.2007@rediffmail.com",
    phone_No: "9080000000",
    Photo: "Images/Department/CSE/Members/img_1.jpeg",
    HOD: true,
    Password: "",
    recovery_code: "",
    speacility: "Image Processing",
    qualification: "Ph.D.",
    department: "Computer Science and Engineering",
    deptCode: "CSE",
    papers: [{ desc: "Sample Paper", link: "http://example.com" }],
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedData, setEditedData] = useState<TeacherDataType>(teacherData);

  const handleEditOpen = () => {
    setEditedData(teacherData); // Create editable copy
    setIsEditModalOpen(true);
  };
  const handleEditClose = () => setIsEditModalOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "phone_No" && !/^\d{0,10}$/.test(value)) return; // allow max 10 digits
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value === "true" }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEditedData((prev) => ({ ...prev, Photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaperChange = (index: number, field: keyof PaperType, value: string) => {
    const updatedPapers = [...editedData.papers];
    updatedPapers[index][field] = value;
    setEditedData((prev) => ({ ...prev, papers: updatedPapers }));
  };

  const addPaper = () => {
    setEditedData((prev) => ({
      ...prev,
      papers: [...prev.papers, { desc: "", link: "" }],
    }));
  };

  const removePaper = (index: number) => {
    const updatedPapers = editedData.papers.filter((_, i) => i !== index);
    setEditedData((prev) => ({ ...prev, papers: updatedPapers }));
  };

  const handleSave = () => {
    setTeacherData(editedData);
    setIsEditModalOpen(false);
  };

  if (token && role === "faculty") {
    return (
      <div className="p-4 space-y-6">
        <h2 className="text-2xl font-bold text-center">Teacher Profile</h2>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Profile */}
          <div className="flex flex-col items-center bg-white rounded shadow p-4 w-full lg:w-1/3">
            {teacherData.Photo && (
              <img
                src={teacherData.Photo as string}
                alt="Profile"
                className="w-40 h-50 object-fit rounded-md border"
              />
            )}
            <h3 className="text-xl font-semibold mt-4 text-center">{teacherData.name}</h3>
            <p className="text-sm text-gray-600 text-center mt-1">{teacherData.position}</p>
          </div>

          {/* Right Info */}
          <div className="bg-white rounded shadow p-4 w-full lg:w-2/3 space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="w-full sm:w-[45%]"><p className="font-semibold">Email:</p><p>{teacherData.email}</p></div>
              <div className="w-full sm:w-[45%]"><p className="font-semibold">Phone:</p><p>{teacherData.phone_No}</p></div>
              <div className="w-full sm:w-[45%]"><p className="font-semibold">HOD:</p><p>{teacherData.HOD ? "Yes" : "No"}</p></div>
              <div className="w-full sm:w-[45%]"><p className="font-semibold">Qualification:</p><p>{teacherData.qualification}</p></div>
              <div className="w-full"><p className="font-semibold">Speciality:</p><p>{teacherData.speacility}</p></div>
              <div className="w-full"><p className="font-semibold">Department:</p><p>{teacherData.department}</p></div>
            </div>
            <button onClick={handleEditOpen} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Edit Profile</button>
          </div>
        </div>

        {/* Papers */}
        <div className="bg-white rounded shadow p-4 mt-6">
          <h3 className="text-lg font-semibold mb-4">Papers</h3>
          {teacherData.papers.length > 0 && teacherData.papers.some(p => p.desc || p.link) ? (
            <div className="space-y-2 mb-4">
              {teacherData.papers.map((paper, index) => (
                (paper.desc || paper.link) && (
                  <div key={index} className="border p-3 rounded bg-gray-50">
                    <p><span className="font-medium">Description:</span> {paper.desc || "N/A"}</p>
                    <p><span className="font-medium">Link:</span> {paper.link || "N/A"}</p>
                  </div>
                )
              ))}
            </div>
          ) : <p className="text-gray-500 mb-4">No papers added yet.</p>}
        </div>

        {/* Edit Modal */}
{isEditModalOpen && (
  <div className="fixed inset-0 z-[999999] flex items-center justify-center">
    {/* Background Blur Layer */}
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

    {/* Modal Content */}
    <div className="relative bg-white p-6 rounded shadow-lg w-[95%] max-w-5xl space-y-4 overflow-y-auto max-h-[90vh]">
      <h3 className="text-xl font-semibold text-center">Edit Profile</h3>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Block */}
        <div className="flex flex-col items-center bg-gray-50 p-4 rounded w-full lg:w-1/3 space-y-3">
          <label htmlFor="photoUpload" className="cursor-pointer relative">
            {editedData.Photo && (
              <img
                src={editedData.Photo as string}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full border-2 border-cyan-500"
              />
            )}
            <input
              type="file"
              accept="image/*"
              id="photoUpload"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-25 flex items-center justify-center opacity-0 hover:opacity-100 transition">
              <span className="text-white text-sm">Change</span>
            </div>
          </label>
          <div className="w-full">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={editedData.name}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="w-full">
            <label>Position:</label>
            <textarea
              name="position"
              value={editedData.position}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        {/* Right Block */}
        <div className="flex flex-col gap-3 w-full lg:w-2/3">
          {["email", "phone_No", "speacility", "qualification", "department"].map((key) => (
            <div key={key}>
              <label>{key.replace("_", " ")}:</label>
              <input
                type="text"
                name={key}
                value={editedData[key as keyof TeacherDataType] as string}
                onChange={handleInputChange}
                className="border p-2 rounded w-full"
              />
            </div>
          ))}
          <div>
            <label>HOD:</label>
            <select
              name="HOD"
              value={editedData.HOD.toString()}
              onChange={handleSelectChange}
              className="border p-2 rounded w-full"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
      </div>

      {/* Papers Editable */}
      <div>
        <h3 className="text-lg font-semibold mt-4">Papers</h3>
        <div className="max-h-60 overflow-y-auto space-y-3">
          {editedData.papers.map((paper, index) => (
            <div key={index} className="border p-3 rounded relative bg-gray-50">
              <label className="font-medium">Description:</label>
              <input
                type="text"
                value={paper.desc}
                onChange={(e) => handlePaperChange(index, "desc", e.target.value)}
                className="border p-2 w-full rounded mt-1"
              />
              <label className="font-medium mt-2 block">Link:</label>
              <input
                type="text"
                value={paper.link}
                onChange={(e) => handlePaperChange(index, "link", e.target.value)}
                className="border p-2 w-full rounded mt-1"
              />
              <button
                onClick={() => removePaper(index)}
                className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addPaper}
          className="mt-3 bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Paper
        </button>
      </div>

      {/* Modal Buttons */}
      <div className="flex justify-end gap-4 mt-4">
        <button
          onClick={handleEditClose}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    );
  }

  return <SignIn_SignUP role="faculty" />;
}
