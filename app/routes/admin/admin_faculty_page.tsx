import { AuthProvider } from "~/context/AuthContext";
import Admin_Faculty from "~/Platform/Admin/Faculty/faculties";

export default function Admin_Faculty_Page() {
  return (
    <AuthProvider>
      <Admin_Faculty />
    </AuthProvider>
  );
}
