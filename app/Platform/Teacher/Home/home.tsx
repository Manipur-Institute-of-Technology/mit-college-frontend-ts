import { useAuth } from "~/context/AuthContext";
import SignIn_SignUP from "~/Common/SignIn_SignUP/SiignIn_Signup";

export default function Teacher_Home() {
  const { token, role } = useAuth();

  //   if (token && role === "faculty") {
  if (0) {
    return (
      <>
        <div>asd</div>
      </>
    ); // Or redirect / show dashboard
  }

  return <SignIn_SignUP role="faculty" />;
}
