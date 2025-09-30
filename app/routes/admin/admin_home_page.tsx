import { AuthProvider } from "~/context/AuthContext";
import Admin_Home from "~/Platform/Admin/Home/home";

export default function Admin_Home_Page() {
  return (
    <AuthProvider>
      <Admin_Home />
    </AuthProvider>
  );
}
