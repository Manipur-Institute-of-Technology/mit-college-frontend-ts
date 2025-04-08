import { useState } from "react";
import Informations from "~/Common/Informations/Informations";

export default function Contact_Us() {
  const FloatingInput = ({
    label,
    id,
    type = "text",
    isTextarea = false,
  }: {
    label: string;
    id: string;
    type?: string;
    isTextarea?: boolean;
  }) => {
    const [focused, setFocused] = useState(false);
    const [value, setValue] = useState("");

    const isActive = focused || value;

    return (
      <div className="relative w-full">
        <label
          htmlFor={id}
          className={`absolute left-3 transition-all duration-200 pointer-events-none bg-white px-1
                ${
                  isActive
                    ? "-top-3 text-xs text-blue-600"
                    : "top-2.5 text-gray-500"
                }`}
        >
          {label}
        </label>
        {isTextarea ? (
          <textarea
            id={id}
            rows={4}
            className="w-full px-3 pt-5 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
        ) : (
          <input
            id={id}
            type={type}
            className="w-full px-3 pt-5 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <div className="min-h-dvh">
        <div className="uppercase text-2xl font-bold tracking-widest p-4 bg-cyan-500 border-2 border-gray-300 rounded-xs text-center">
          Contact Us
        </div>
        <div className="flex flex-col md:flex-row m-4 items-center justify-around gap-6">
          {/* Left Section - Address & Map */}
          <div className="flex-1 w-full flex flex-col gap-3 items-start justify-baseline font-semibold tracking-wider text-lg">
            <p className="text-sm md:text-lg">
              &emsp;Manipur Institute of Technology
              <br /> &emsp;(A Constituent College of Manipur University)
              <br /> &emsp;Takyelpat, Imphal - 795001, Manipur , India
            </p>
            <div
              style={{
                width: "100%",
                maxWidth: "600px",
                height: 0,
                paddingBottom: "75%", // Aspect ratio (16:9)
                position: "relative",
                margin: "0 auto",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d771.0319076983468!2d93.90538353858935!3d24.798544329133495!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3749288213100001%3A0x4aab7b12460d98b8!2sMIT%20Main%20Block!5e1!3m2!1sen!2sin!4v1744118204792!5m2!1sen!2sin"
                style={{
                  border: "1px solid gray",
                  borderRadius: "8px",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Right Section - Form */}
          <form className="flex-1 max-w-lg w-full p-6 border-2 border-gray-300 rounded-xl bg-white shadow-md flex flex-col gap-6">
            <FloatingInput label="Your Name" id="name" />
            <FloatingInput label="Email" id="email" type="email" />
            <FloatingInput label="Message" id="message" isTextarea />
            <button
              type="submit"
              className="self-start mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all duration-200"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
      <Informations />
    </>
  );
}
