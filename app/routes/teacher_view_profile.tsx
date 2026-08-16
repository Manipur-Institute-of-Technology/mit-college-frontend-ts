import { useLocation, useNavigate } from "react-router-dom";
import Teacher_Profile_View, {
  type TeacherDataType,
} from "~/Common/Teacher/Teacher_Profile_View";

type TeacherProfileLocationState = {
  teacher?: TeacherDataType;
};

export default function Teacher_View_Profile() {
  const location = useLocation();
  const navigate = useNavigate();

  const state =
    location.state as TeacherProfileLocationState | null;

  const teacher = state?.teacher;

  // ==========================================
  // NO TEACHER DATA
  // ==========================================

  if (!teacher) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div
          className="
            text-center
            py-12
            bg-white
            rounded-2xl
            border
            border-gray-200
            text-gray-500
          "
        >
          <p className="font-semibold">
            Faculty profile not available.
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              mt-4
              px-4
              py-2
              rounded-lg
              bg-gray-100
              hover:bg-gray-200
              text-gray-700
              font-semibold
              text-sm
              transition
            "
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // PROFILE
  // ==========================================

  return (
    <div className="p-6 max-w-6xl mx-auto">

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="
          mb-5
          inline-flex
          items-center
          gap-2
          px-4
          py-2
          rounded-lg
          bg-gray-100
          hover:bg-gray-200
          text-gray-700
          font-semibold
          text-sm
          transition
        "
      >
        ← Back to Faculty List
      </button>

      <Teacher_Profile_View
        teachers={[teacher]}
      />

    </div>
  );
}