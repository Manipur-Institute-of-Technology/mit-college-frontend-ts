import { Footer } from "../../../Footer/Footer";
import { Navbar } from "../../../Navbar/Navbar";
import { LeftDownload } from "../../MainContent/LocalNavigation/Left_Download/LeftDownload";
import { LeftInformation } from "../../MainContent/LocalNavigation/Left_Information/LeftInformation";
import { LeftNotification } from "../../MainContent/LocalNavigation/Left_Notice/LeftNotification";
import "../Information.css";
function Campus() {
  return (
    <div className="Information_container">
      <Navbar />

      <div className="Information_align">
        <div className="Information_Tittle">
          <h1>Information</h1>
        </div>
        <div className="Information_wrapper">
          <div className="Information_Header_container">
            <h2>CAMPUS : </h2>
          </div>
          <div className="Information_body">
            <div className="Information_main">
              <div className="text_box info_text_box">
                <h2>Information about CAMPUS </h2>
                <p className="info_text">
                  MAIN CAMPUS (Takyelpat): MIT main campus at Takyelpat is
                  located just adjacent to NH 37 (New Cachar Road) approximately
                  4 kms. from the heart of Imphal City. It is 6 kms from Imphal
                  International Airport, Imphal
                </p>
                <h3>MANIPUR UNIVERSITY CAMPUS (Canchipur):</h3>
                <p className="info_text">
                  MIT Manipur University Campus is located at Canchipur, Imphal,
                  the capital city of Manipur. The university campus is spread
                  over an area of 287 acres in the historic canchipur which is
                  the site of the old palace of Manipur "The Langthabal Konung
                  (Palace)" Which was established by Maharaja Ghambhir Singh in
                  1827 AD just after the liberation of Manipur from Burmese
                  (Myanmar) occupation. Maharaja Gambhir Singh took his last
                  breath at Canchipur. Canchipur is also the Birth Place of Dr
                  Lamabam Kamal, a renowned poet of Manipur. It is located along
                  the National Highway (NH-2) at about 8 km. from the heart of
                  the Imphal City and 12 km. from Imphal International Airport.
                </p>
              </div>
            </div>
            <div className="Information_right">
              <LeftNotification />
              <LeftInformation />
              <LeftDownload />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Campus;