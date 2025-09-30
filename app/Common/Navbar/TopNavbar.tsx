import { useState, useEffect } from "react";
import { AArrowUp, AArrowDown, LanguagesIcon, User, Moon } from "lucide-react";
import { Link } from "react-router";
import "./navbar.css";

export default function TopNavbar() {
  const [fontSize, setFontSize] = useState(16); // base 16px
  const [colorModeIndex, setColorModeIndex] = useState(0);
  const colorBlindModes = ["normal", "grayscale", "high-contrast"];

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    document.documentElement.classList.remove(
      "grayscale-mode",
      "high-contrast-mode"
    );
    const mode = colorBlindModes[colorModeIndex];
    if (mode === "grayscale") {
      document.documentElement.classList.add("grayscale-mode");
    } else if (mode === "high-contrast") {
      document.documentElement.classList.add("high-contrast-mode");
    }
  }, [colorModeIndex]);

  const increaseFont = () => setFontSize((prev) => Math.min(prev + 0.7, 20));
  const decreaseFont = () => setFontSize((prev) => Math.max(prev - 0.7, 12));
  const cycleColorBlindMode = () =>
    setColorModeIndex((prev) => (prev + 1) % colorBlindModes.length);

  return (
    <div>
      <div className="relative w-full bg-rose-700 text-gray-100 p-1 font-semibold gap-2 overflow-x-auto">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-row flex-nowrap items-center justify-end">
          <div className="border-r border-rose-300">
            <button
              onClick={cycleColorBlindMode}
              className="outline-none border-none text-center px-2 cursor-pointer"
              title={`Mode: ${colorBlindModes[colorModeIndex]}`}
            >
              <Moon size={18} />
            </button>
          </div>

          <div className="border-r border-rose-300">
            <button
              onClick={increaseFont}
              className="outline-none border-none text-center px-2 cursor-pointer"
            >
              <AArrowUp size={18} />
            </button>
          </div>
          <div className="border-r border-rose-300">
            <button
              onClick={decreaseFont}
              className="outline-none border-none text-center px-2 cursor-pointer"
            >
              <AArrowDown size={18} />
            </button>
          </div>
          <div className="border-r border-rose-300">
            <Link to="/faculty">
              <button className="text-slate-50 outline-none border-none m-auto relative flex flex-row flex-nowrap items-center gap-1 justify-center px-2 cursor-pointer">
                <User size={18} />
                Faculty
              </button>
            </Link>
          </div>
          <div className=" border-rose-300">
            <Link to="/admin">
              <button className="text-slate-50 outline-none border-none m-auto relative flex flex-row flex-nowrap items-center gap-1 justify-center px-2 cursor-pointer">
                <User size={18} />
                Admin
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
