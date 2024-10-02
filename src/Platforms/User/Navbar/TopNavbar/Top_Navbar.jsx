import "./Top_Navbar.css";

export function Top_Navbar() {
  return (
    <div className="Top_Navbar">
      <div className="Image_wrapper">
        <img className="mit_logo" src="./images/Main_page/MIT_logo.webp"></img>
      </div>
      <div className="Top_Navbar_align">
        <div className="admin_panel">
          <div className="Link_1">Faculties</div>
          <div className="Link_1">Teaches</div>
        </div>
        {/* <div className="Font_sizer">
          <div className="Link_1 decrease_font"></div>
          <div className="Link_1 normal_font"></div>
          <div className="Link_1 increase_font"></div>
        </div> */}
        <div className="Theme_box">
          <div className="theme_btn">
            <h1>+</h1>
          </div>
          <div className="theme_btn">
            <h1>N</h1>
          </div>
          <div className="theme_btn">
            <h1>-</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
