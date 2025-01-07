import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Image, message, Skeleton } from "antd";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import RemindIcon from "@rsuite/icons/legacy/Remind";

import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";

import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Modal } from "rsuite";
import Editemployee from "../Admindashboard/Editemployee";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import Assignroletoemp from "../Admindashboard/assignroletoemp";
import Sheader from "./Sheader";

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: "absolute",
  "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
    top: theme.spacing(2),
    left: theme.spacing(2),
  },
}));

function Adminemployeedetails() {
  const [name, setName] = React.useState("");
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query"); // Get the 'query' parameter from the URL
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  const [deletemodal, setDeletemodal] = useState(false);
  const handledeletemodalopen = () => setDeletemodal(true);
  const handledeletemodalclose = () => setDeletemodal(false);

  const [assignmodel, setAssignmodel] = useState(false);
  const handleassignmodelopen = () => setAssignmodel(true);
  const handleassignmodelclose = () => setAssignmodel(false);

  const [empname, setEmpname] = useState("");
  const [visitors, setVisitors] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // To handle modal state
  const [loadingImage, setLoadingImage] = useState(true);
  const [selectedImage, setSelectedImage] = useState(""); // To store the image URL
  const [assign, setassign] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const actions = assign
    ? [
        {
          icon: <AssignmentIndOutlinedIcon />,
          name: "Assign Role",
          onClick: handleassignmodelopen,
        },
        {
          icon: <EditIcon />,
          name: "Edit",
          onClick: handleOpen,
        },
        {
          icon: <DeleteOutlinedIcon />,
          name: "Delete",
          onClick: handledeletemodalopen,
        },
      ]
    : [
        {
          icon: <EditIcon />,
          name: "Edit",
          onClick: handleOpen,
        },
        {
          icon: <DeleteOutlinedIcon />,
          name: "Delete",
          onClick: handledeletemodalopen,
        },
      ];

  // Fetch employee details by ID
  const GEtemployee = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/get_employee/${query}`
      );

      console.log("data", response.data.employee)
      const employeeData = response.data.employee;
      setEmployee(employeeData);
      if (employeeData?.length > 0) {
        setEmpname(employeeData[0].name);
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };

  useEffect(()=>{
    GEtemployee()
  },[query])

  //get user by primary id
  const getuserbyid = async () => {
    const response = await axios.get(
      `http://127.0.0.1:5000/get_userbyprimary/${query}`
    );
    

    if (response.data?.success) {
      setassign(false);
    } else {
      setassign(true);
    }
  };

  // Fetch visitors by employee name
  const getvisitors = async (empname) => {
      try {
        if (empname) {
          const response = await axios.get(
            `http://127.0.0.1:5000/visitors/by_employee/${empname}`
          );
  
          
          setVisitors(response.data.visitors); // Set visitors data
        }
      } catch (error) {
        console.error("Error fetching visitors:", error);
      }
    };
  

  // Use effect to call GEtemployee once the component mounts
  useEffect(() => {
    GEtemployee();
    getuserbyid();
  }, [query]);

  // Use effect to call getvisitors when empname is set
  useEffect(() => {
    if (empname) {
      getvisitors(empname); // Fetch visitors after employee name is set
    }
  }, [empname]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12; // Convert to 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Add leading zero if minutes are < 10

    const formattedDate = `${date.toLocaleDateString()} ${formattedHours}:${formattedMinutes} ${ampm}`;

    return formattedDate;
  };

  // Open modal with selected image
  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  console.log("selected",selectedImage)

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleImageLoad = () => {
    setLoadingImage(false); // Set loading to false when the image has loaded
  };

  const [visitorname, setVisitorname] = useState("");

  useEffect(() => {
    employee.map((visitor) => setVisitorname(visitor.name));
  }, [employee]);

  const handleDeleteok = async () => {
    const response = await axios.delete(
      `http://127.0.0.1:5000/delete_employee/${query}`
    );

    console.log("data", response.data)

    if (response.data.success) {
      navigate("/semployees", { state: { refresh: true } });
      handledeletemodalclose();
      await axios.delete(`http://127.0.0.1:5000/delete_user_byprimary/${query}`);
    }
  };

  const assigned = () => {
    messageApi.open({
      type: "success",
      content: "Role assigned successfully",
    });
  };

  const updated = () => {
    messageApi.open({
      type: "success",
      content: "employee updated successfully",
    });
  };

  return (
    <div>
      {contextHolder}
      <Sheader />
      <div className="pt-28">
        <div className="lg:px-20">
          <div className="p-3 rounded-md">
            <Link to={"/semployees"}>
              <button className="bg-slate-50 py-1 px-3 mb-3 rounded-md">
                Back
              </button>
            </Link>
            <div className="mb-5">
              {employee?.map((emp) => (
                <div key={emp._id}>
                  {loadingImage && (
                    <div>
                      <Skeleton.Image
                        style={{ height: "208px", width: "200px" }}
                      />
                    </div>
                  )}
                  <Image
                    width={200}
                    onLoad={handleImageLoad}
                    src={`data:image/jpeg;base64,${emp.base64_image}`}
                    className=" max-h-52"
                    // style={{ maxHeight: "220px" }}
                  />

                  <div className="text-2xl font-bold my-4">{emp.name}</div>
                  <div className="grid lg:grid-cols-3 sm:grid-cols-1 md:grid-cols-2">
                    <div>
                      <div className="text-gray-500 text-md font-semibold">
                        Position
                      </div>
                      <div className="my-2 font-semibold">{emp.designation}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-md font-semibold">
                        Email
                      </div>
                      <div className="my-2 font-semibold">{emp.email_id}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-md font-semibold">
                        Phone number
                      </div>
                      <div className="my-2 font-semibold">{emp.phone_number}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-gray-500 text-md font-semibold">
              Total visitors
            </div>
            <div className="mt-1">
              {visitors.length > 0 ? (
                <div className="text-2xl ">{visitors.length}</div>
              ) : (
                <div>0</div>
              )}
            </div>

            {/* Modal to display the large image */}
            {isModalOpen && (
              <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div onClick={closeModal} className=" btn btn-close"></div>
                <div className="">
                  <img
                    src={selectedImage}
                    alt="Large View"
                    className="max-w-full max-h-full"
                  />
                </div>
              </div>
            )}

            <div className="text-2xl font-bold mt-10 mb-2">Visitors</div>
            {visitors.length > 0 ? (
              <div>
                {visitors
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((visitor) => (
                    <div
                      key={visitor._id}
                      className="bg-gray-300 p-4 mt-4 rounded-md"
                    >
                      <div className="text-xl font-semibold">
                        {visitor.name}
                      </div>
                      <hr />
                      <div className="grid gap-3 xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-1 md:grid-cols-2">
                        <div>
                          <div className="text-gray-500 text-md font-semibold">
                            Address
                          </div>
                          <div className="my-2 font-semibold">
                            {visitor.address}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-md font-semibold">
                            Purpose of visit
                          </div>
                          <div className="my-2 font-semibold">
                            {visitor.purpose}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-md font-semibold">
                            Phone number
                          </div>
                          <div className="my-2 font-semibold">
                            {visitor.phone_number}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-md font-semibold">
                            Checkin time
                          </div>
                          <div className="my-2 font-semibold">
                            {!visitor.checkin_time ? (
                              <div>-</div>
                            ) : (
                              <div>{formatDate(visitor.checkin_time)} </div>
                            )}
                            {/* {formatDate(visitor.checkinTime)} */}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-md font-semibold">
                            Checkout time
                          </div>
                          <div className="my-2 font-semibold">
                            {!visitor.checkout_time ? (
                              <div>-</div>
                            ) : (
                              <div>{formatDate(visitor.checkout_time)} </div>
                            )}
                            {/* {formatDate(visitor.checkouttime)} */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div>No visitors found</div>
            )}
          </div>
        </div>
      </div>
      <Box
        sx={{ transform: "translateZ(0px)", flexGrow: 1 }}
        className="fixed-bottom"
      >
        <Box sx={{ position: "relative", mt: 3, height: 320 }}>
          <StyledSpeedDial
            ariaLabel="SpeedDial playground example"
            icon={<SpeedDialIcon />}
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={action.onClick}
              />
            ))}
          </StyledSpeedDial>
        </Box>
        <div>{name}</div>
      </Box>

      <Modal open={open} onClose={handleClose} className="bg-slate-400">
        <Modal.Header>
          <Modal.Title>
            <div className="font-bold text-center">Edit Employee details</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Editemployee
            query={query}
            handleClose={handleClose}
            Getemployee={GEtemployee}
            updated={updated}
          />
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      {/*Assign Modal */}
      <Modal
        open={assignmodel}
        onClose={handleassignmodelclose}
        className="bg-slate-400"
      >
        <Modal.Header>
          <Modal.Title>
            <div className="font-bold text-center">Add role to Employee</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Assignroletoemp
            query={query}
            handleClose={handleassignmodelclose}
            GetEmployee={getuserbyid}
            updated={assigned}
          />
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      {/*Delete Modal */}

      <Modal
        backdrop="static"
        role="alertdialog"
        open={deletemodal}
        onClose={handledeletemodalclose}
        size="xs"
      >
        <Modal.Body>
          <RemindIcon style={{ color: "#ffb300", fontSize: 24 }} />
          You are about to delete the Employee
          <span className=" mx-1 font-semibold">{visitorname}</span>, are you
          sure?
        </Modal.Body>
        <Modal.Footer className=" flex flex-row gap-3 justify-end">
          <button
            onClick={handledeletemodalclose}
            className="  bg-gray-400 py-1 px-3 rounded-md text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteok}
            className="  bg-red-700 py-1 px-3 rounded-md text-white"
          >
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Adminemployeedetails;
