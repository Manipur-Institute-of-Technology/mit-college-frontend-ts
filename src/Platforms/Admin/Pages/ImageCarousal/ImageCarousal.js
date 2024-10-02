import React, { useState, useRef, useEffect } from "react";
import NavBar from "../../Common/NavBar/NavBar";
import "./ImageCarousel.css";

function ImageCarousal() {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showFileInput, setShowFileInput] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const imageRef = useRef(null);

  const handleImageLinkClick = () => {
    setShowLinkInput(true);
    setShowFileInput(false);
    setImageSrc("");
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.src = imageSrc;
    }
  }, [imageSrc]);

  return (
    <div>
      <NavBar />
      <div className="CarousalMainWrapper">
        <div className="CarousalImageSetup flex flex-col gap-5 text-lg">
          <div className="CarousalImageSetupHeader text-xl uppercase font-semibold tracking-wider underline">
            Carousel Image Setup
          </div>
          <div className="flex content-center justify-start gap-6">
            <div>Caption</div>
            <input
              type="text"
              className="w-4/5 border border-black outline-none p-1"
            />
          </div>
          <div className="flex flex-col gap-8 h-4/5">
            <div className="flex gap-4">
              <div
                className="cursor-pointer text-red-600 p-1 bg-slate-200 rounded-sm border border-slate-400"
                onClick={handleImageLinkClick}
              >
                Image Link
              </div>
              <div className="p-1">Or</div>
              <label
                className="cursor-pointer text-blue-600 p-1 bg-slate-200 rounded-sm border border-slate-400"
                onClick={() => {
                  setShowFileInput(true);
                  setShowLinkInput(false);
                }}
              >
                Select from file
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <input
                type="text"
                className={
                  showLinkInput
                    ? "outline-none border border-gray-400 w-3/4 p-2 bg-gray-300"
                    : "hidden"
                }
              />
              <div
                className={
                  showFileInput
                    ? "flex content-center justify-center flex-wrap"
                    : "hidden"
                }
              >
                {imageSrc ? (
                  <img
                    ref={imageRef}
                    alt="Carousel Selected Pic"
                    className="ImageAdd"
                  />
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </div>
          <div className="flex content-center items-end justify-center">
            <div className="flex content-center justify-center pt-2 pb-2 pr-14 pl-14 font-semibold rounded-md bg-slate-400 uppercase">
              Add
            </div>
          </div>
        </div>
        <div>
          <div>Carousel Active Images</div>
          <div>
            <div>slno.</div>
            <div>Caption</div>
            <div>Image</div>
            <div>Action</div>
          </div>
          <div>
            <div>1</div>
            <div>Hello duhhh</div>
            <div>image</div>
            <div>Action</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageCarousal;
