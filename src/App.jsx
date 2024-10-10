import Register from "./pages/Register/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login/Login";
import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Messages from "./pages/messages/index.jsx";
import Notification from "./pages/notification/index.jsx";
import Settings from "./pages/settings/index.jsx";
import NavigationSideBar from "./pages/NavigationBar/index.jsx";
import NotFound404 from "./pages/404NotFound/404.jsx";
import Modal from "react-modal";

// Set the app element

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route path="/registration" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<NavigationSideBar />}>
          <Route path="/" element={<Home />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound404 />}></Route>
      </Route>
    )
  );
  Modal.setAppElement("#root");

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
      {/* <Login /> */}
    </>
  );
}

export default App;
