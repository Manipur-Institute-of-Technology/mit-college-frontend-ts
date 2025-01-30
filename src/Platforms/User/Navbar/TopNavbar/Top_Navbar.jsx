import "./Top_Navbar.css";

export function Top_Navbar() {
  return (
    <div className="Top_Navbar">
      <div className="Image_wrapper">
        <img className="mit_logo" src="./Images/Main_page/MIT_Logo.png"></img>
      </div>
      <div className="Top_Navbar_align">
        <div className="admin_panel">
          <div className="Link_1">
            <button onClick={() => alert("Under Maintenance")}>
              Faculties
            </button>
          </div>
          <div className="Link_1">
            <button onClick={() => alert("Under Maintenance")}>Teaches</button>
          </div>
        </div>
        <div className="Theme_box">
          <div className="theme_btn">
            <button onClick={() => alert("Under Maintenance")}>-</button>
          </div>
          <div className="theme_btn">
            <button onClick={() => alert("Under Maintenance")}>N</button>
          </div>
          <div className="theme_btn">
            <button onClick={() => alert("Under Maintenance")}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
}
