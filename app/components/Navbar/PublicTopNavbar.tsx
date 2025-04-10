import { AArrowUp, AArrowDown, LanguagesIcon, User, Moon } from "lucide-react";
import { Link } from "react-router";

export default function TopNavbar() {
  return (
    <div>
      <div className="relative w-full bg-rose-700 text-gray-100 p-1 font-semibold gap-2 overflow-x-auto">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8  flex flex-row flex-nowrap items-center justify-end">
          <div className="border-r border-rose-300">
            <button className="outline-none border-none text-center px-2">
              <Moon size={18} />
            </button>
          </div>

          <div className="border-r border-rose-300">
            <button className="outline-none border-none text-center px-2">
              <AArrowUp size={18} />
            </button>
          </div>
          <div className="border-r border-rose-300">
            <button className="outline-none border-none text-center px-2">
              <AArrowDown size={18} />
            </button>
          </div>
          <div className="border-r border-rose-300">
            <button className="outline-none border-none px-2 text-center">
              <LanguagesIcon size={18} />
            </button>
          </div>
          <div className=" border-rose-300">
            <Link to="/cms/">
              <button className="text-slate-50 outline-none border-none m-auto relative flex flex-row flex-nowrap items-center gap-1 justify-center px-2">
                <User size={18} />
                System Login
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row flex-wrap text-center md:flex-nowrap justify-center items-center relative">
          <div className="select-none w-max min-w-[18rem]">
            <img
              src="/MIT_logo.png"
              alt="MIT full logo"
              className="h-[80px] w-auto"
            />
          </div>
          <div className="hidden md:block h-[50px] w-[2px] bg-gray-700 mx-2"></div>
          <div className="w-max">
            <div className="text-rose-800 select-none text-nowrap">
              A Constituent College of Manipur University
            </div>
            <div className="font-bold text-rose-800 select-none text-nowrap">
              Takyelpat, Imphal-795004, Manipur
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
