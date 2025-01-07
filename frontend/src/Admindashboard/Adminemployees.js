import React, { useEffect, useState } from "react";
import SearchIcon from "@rsuite/icons/Search";
import {
  InputGroup,
  Input,
  Modal,
  Button,
  ButtonToolbar,
  toaster,
  Placeholder,
} from "rsuite";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import Addemployee from "../pages/aadEmployee";
import { message, Skeleton } from "antd";
import Adminheader from "./Adminheader";

const AdminEmployees = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [cookies] = useCookies(["token"]);
  const navigatedetailspage = useNavigate();
  const [loading, setLoading] = useState(true);

  // Redirect to signin if token is missing or user is not logged in
  // useEffect(() => {
  //   if (!cookies.token) {
  //     navigate("/signin");
  //     return; // Early return if token doesn't exist
  //   }
  // }, []);
  // If no token, redirect to signin

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [employees, setEmployees] = useState([]);
  const[filteredemployees, setFilteredemployees]=useState([])

  const [searchQuery, setSearchQuery] = useState("");

  const location = useLocation();
  const [hasRefreshed, setHasRefreshed] = useState(false);

  useEffect(() => {
    if (location.state?.refresh && !hasRefreshed) {
      success();
      setHasRefreshed(true);
    }
  }, [location.state, hasRefreshed]);

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Employee deleted successfully",
    });
  };

  // Fetch all employees from the backend
  const GetEmployees = async () => {
    setLoading(true);
    try {
      await axios
        .get("http://127.0.0.1:5000/get_all_employees")
        .then((response) => {
          setEmployees(response.data.visitors);
          setFilteredemployees(response.data.visitors)
          setLoading(false);
        });
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // console.log("employees", employees);

  // Handle search query change
  const handleQuerychange = async (value) => {
    setSearchQuery(value);

    if (value === "") {
      // If the search query is empty, fetch all employees
      setFilteredemployees(employees)
    } else {
      const filtered = employees.filter((person) =>
        person.name.toLowerCase().includes(value.toLowerCase())
      );

      setFilteredemployees(filtered)
    }
  };

  function opendetails(value) {
    navigatedetailspage(`/employeesdetails/?query=${value}`);
  }

  useEffect(() => {
    GetEmployees(); // Fetch all employees when component mounts
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [messageApi, contextHolder] = message.useMessage();

  const updated = () => {
    messageApi.open({
      type: "success",
      content: "employee updated successfully",
    });
  };
  return (
    <div style={{}} className=" ">
      {contextHolder}
      <Adminheader />
      <div className="lg:px-24 md:px-2 sm:px-2 w-full mt-28">
        <div className="font-bold font-sans text-2xl  w-full px-2">
          Employees
        </div>

        <div className="lg:flex lg:flex-row lg:items-center lg:justify-between w-full mt-2">
          {/* Search Input and Add Employee Button */}
          <div className="flex flex-col md:flex-row lg:flex-row w-full mt-16 lg:mt-1 sm:mt-2 px-2">
            {/* Search Input */}
            <div className="lg:w-5/6 md:w-4/5 sm:w-full lg:pr-2  md:pr-3">
              <InputGroup style={{ width: "100%", height: 40 }}>
                <InputGroup.Addon className="bg-slate-100">
                  <SearchIcon />
                </InputGroup.Addon>
                <Input
                  className="bg-slate-100 w-full focus:outline-none"
                  placeholder="Search Employees..."
                  value={searchQuery} // Bind the input to searchQuery state
                  onChange={handleQuerychange} // Handle change
                />
              </InputGroup>
            </div>

            {/* Add Employee Button (unchanged code) */}
            <div className="  lg:w-1/6 md:w-1/5 sm:w-full flex justify-end lg:mt-0 lg:block sm:hidden md:block hidden ">
              <button
                onClick={handleOpen}
                className="bg-blue-500 text-white py-2 px-4 w-full rounded-md hover:bg-blue-600"
                style={{ marginTop: 0, height: 38 }}
              >
                Add Employee
              </button>
            </div>
            <div className="lg:w-1/6 md:w-1/5 sm:w-full flex justify-start lg:mt-0 lg:hidden md:hidden sm:block ">
              <ButtonToolbar
                onClick={handleOpen}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                style={{ marginTop: 10, height: 38 }}
              >
                Add Employee
              </ButtonToolbar>
            </div>
          </div>
        </div>

        {/* Add Employee Modal */}
        <Modal open={open} onClose={handleClose} className="bg-slate-400">
          <Modal.Header>
            <Modal.Title>
              <div className="font-bold text-center">Add a new Employee</div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Addemployee
              handleClose={handleClose}
              Getemployees={GetEmployees}
              updated={updated}
            />
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>

        {/* Employee List */}

        {loading ? (
          <div className="pb-10 w-full mt-3 px-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <div className="shadow-sm rounded-md w-full p-2">
              <div className="w-full h-48 text-center ">
                <Skeleton.Image
                  active
                  className=" w-full"
                  style={{ width: "185px", height: "170px" }}
                />
              </div>
              <div>
                <Skeleton active />
              </div>
            </div>
            <div className="border rounded-md w-full p-2">
              <div className="w-full h-48 text-center ">
                <Skeleton.Image
                  active
                  className=" w-full"
                  style={{ width: "185px", height: "170px" }}
                />
              </div>
              <div>
                <Skeleton active />
              </div>
            </div>
            <div className="border rounded-md w-full p-2">
              <div className="w-full h-48 text-center ">
                <Skeleton.Image
                  active
                  className=" w-full"
                  style={{ width: "185px", height: "170px" }}
                />
              </div>
              <div>
                <Skeleton active />
              </div>
            </div>
            <div className="border rounded-md w-full p-2">
              <div className="w-full h-48 text-center ">
                <Skeleton.Image
                  active
                  className=" w-full"
                  style={{ width: "185px", height: "170px" }}
                />
              </div>
              <div>
                <Skeleton active />
              </div>
            </div>
            <div className="border rounded-md w-full p-2">
              <div className="w-full h-48 text-center ">
                <Skeleton.Image
                  active
                  className=" w-full"
                  style={{ width: "185px", height: "170px" }}
                />
              </div>
              <div>
                <Skeleton active />
              </div>
            </div>
          </div>
        ) : (
          <div className="  pb-10 px-2  mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredemployees?.length > 0 &&
              filteredemployees
                .sort((a, b) => a.name.localeCompare(b.name)) // Sorting the employees by name
                .map((employee) => (
                  <div
                    key={employee._id}
                    onClick={() => opendetails(employee._id)}
                    className="bg-white cursor-pointer rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    {/* Profile Image Section */}
                    <div className="relative h-48 border-b-4 border-gray-100 p-2">
                      <img
                        alt="profile"
                        src={`data:image/jpeg;base64,${employee.base64_image}`}
                        className="w-full h-full object-cover rounded-lg shadow-md"
                      />
                    </div>

                    {/* Employee Info Section */}
                    <div className="px-4 py-3 text-start space-y-2">
                      <h3 className="text-2xl font-semibold text-gray-800 truncate">
                        {employee.name}
                      </h3>
                      <p className="text-sm text-gray-600">{employee.email_id}</p>
                      <p className="text-sm text-gray-600">{employee.phone_number}</p>
                      <p className="text-sm text-gray-600 font-medium">
                        {employee.unique_id}
                      </p>
                    </div>

                    {/* Hovered Border */}
                    <div className="p-3 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-100 opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <button className="text-white bg-indigo-600 py-1 px-3 rounded-md text-sm font-semibold transform hover:scale-105 transition duration-200">
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
          </div>
        )}
        {!filteredemployees.length > 0 && (
          <div className="flex flex-col items-center justify-center w-full h-64   rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700">
              No Results Found
            </h2>
            <p className="text-gray-500 mt-2 text-center">
              Try adjusting your search or applying different filters to find
              what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEmployees;
