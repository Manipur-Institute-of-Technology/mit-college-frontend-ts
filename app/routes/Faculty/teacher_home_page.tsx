import { AuthProvider } from "~/context/AuthContext";
import Teacher_Home from "~/Platform/Teacher/Home/home";

export default function Teacher_Home_Page() {
  return (
    <AuthProvider>
      <Teacher_Home />
    </AuthProvider>
  );
}
