import { BrowserRouter } from "react-router-dom";
import MainRouter from "./Site_Component/Routers/UserRouter";
import TeacherRouter from "./Site_Component/Routers/TeacherRouter";
import { AdminProvider } from "./Site_Component/Storage/AdminStorage";
import { TeacherProvider } from "./Site_Component/Storage/TeacherStorage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import AdminRouter from "./Site_Component/Routers/AdminRouter";

function App() {
  return (
    <AdminProvider>
      <TeacherProvider>
        <BrowserRouter>
          <ToastContainer
            position="bottom-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <MainRouter />
          <TeacherRouter />
          <AdminRouter />
        </BrowserRouter>
      </TeacherProvider>
    </AdminProvider>
  );
}

export default App;
