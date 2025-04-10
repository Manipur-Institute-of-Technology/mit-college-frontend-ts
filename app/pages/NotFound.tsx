import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="relative w-full min-h-[80vh] text-center text-gray-100 flex items-center">
      <div className="m-auto w-full backdrop-blur-sm">
        <div className="relative m-auto max-w-fit w-[32rem] p-4  shadow-lg rounded-lg">
          <div className="text-[2rem] font-bold ">ERROR</div>
          <div className="text-[8rem] font-bold ">404</div>
          <div className="text-[2rem]">Hmmm… we can't find that page.</div>
          <div className="my-2">
            It may have moved or may no longer exist. If you reached this error
            from a link on our site, please leave us{" "}
            <Link to={"github.com"}> feedback</Link>, so we can fix the problem.
            Regardless, let's help you get where you want to go.
          </div>
          <div className="my-2 mt-8">
            <Link
              to={"/"}
              className="p-3 font-bold bg-blue-500 rounded-lg text-blue-50 text-lg"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
