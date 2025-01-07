import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../components/Home";
import Emloyeespage from "../pages/Emloyeespage";
import Addvisitorpage from "../pages/Addvisitorpage";
import Signin from "../pages/signinpage";
import Profilepage from "../pages/Profilepage";
import Employeedetails from "../pages/Employeedetails";
import Adminhome from "../Admindashboard/Adminhome";
import AdminEmployees from "../Admindashboard/Adminemployees";
import Adminemployeedetails from "../Admindashboard/Employeedetails";
import Users from "../Admindashboard/Users";
import Shome from "../superAdmindashboard/Shome";
import Semployees from "../superAdmindashboard/Semployees";
import Susers from "../superAdmindashboard/Susers";
import Sprofile from "../superAdmindashboard/saprofilepage";
import Adminprofile from "../Admindashboard/Profilepage";
import Semployeedetails from "../superAdmindashboard/Semployeedetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "employees",
        element: <Emloyeespage />,
      },
      {
        path: "addvisitor",
        element: <Addvisitorpage />,
      },

      {
        path: "profile",
        element: <Profilepage />,
      },
      {
        path: "employedetails", // Fixed the typo here
        element: <Employeedetails />,
      },
      {
        path: "admindashboard",
        element: <Adminhome />,
      },
      { path: "adminemployees", element: <AdminEmployees /> },
      { path: "employeesdetails", element: <Adminemployeedetails /> },
      { path: "users", element: <Users /> },
      { path: "aprofile", element: <Adminprofile /> },
      {
        path: "superadmindashboard",
        element: <Shome />,
      },
      {
        path: "semployees",
        element: <Semployees />,
      },
      {
        path: "susers",
        element: <Susers />,
      },
      {
        path: "sprofile",
        element: <Sprofile />,
      },
      {
        path: "semployeedetails",
        element: <Semployeedetails />,
      },
    ],
  },
  {
    path: "signin",
    element: <Signin />,
  },
]);

export default router;
