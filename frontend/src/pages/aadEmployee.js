import axios from "axios";
import React, { useState, useEffect } from "react";
import { Alert, message, Spin } from "antd";
import RemindOutlineIcon from "@rsuite/icons/RemindOutline";
import { LoadingOutlined } from "@ant-design/icons";

const Addemployee = ({ handleClose, Getemployees, updated }) => {
  const [filename, setFlename] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email_id: "",
    phone_number: "",
    unique_id: "",
    images: "",
    designation: "",
    gender:""
  });
  const [saveloader, setSaveloader] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email_id: "",
    phone_number: "",
    unique_id: "",
    designation: "",
    images: "",
    gender:""
  });
  console.log("data", formData)

  const [submitted, setSubmitted] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value, // Dynamically update the corresponding field in the state
    }));

    // Only validate the changed field after submit
    if (submitted) {
      validateField(name, value);
    }
  };

  // Handle file input change (profile picture)
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    console.log("file", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFlename(file);

        const base64Data = reader.result.replace(/^data:image\/[a-z]+;base64,/, '');

        const imageArray = [base64Data]; 

        setFormData((prevState) => ({
          ...prevState,
          images: imageArray, // Store base64 string
        }));

        // Only validate after submit
        if (submitted) {
          validateField("images", reader.result);
        }
      };
      reader.readAsDataURL(file); // Read the file as base64
    }
  };

  // Validate individual fields
  const validateField = (field, value) => {
    let error = "";
    if (field === "name" && !value) {
      error = "Name is required";
    }
    if (field === "email_id") {
      if (!value) {
        error = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = "Email is not valid";
      }
    }


    if (field === "gender" && !value) {
      error = "Gender is required";
    }

    if (field === "phone_number") {
      if (!value) {
        error = "Mobile number is required";
      } else if (!/^\d{10}$/.test(value)) {
        error = "Mobile number should be 10 digits";
      }
    }
    if (field === "unique_id" && !value) {
      error = "Employee ID is required";
    }
    if (field === "designation" && !value) {
      error = "Position is required";
    }
    if (field === "images" && !value) {
      error = "Profile picture is required";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error,
    }));
  };

  // Validate the form data
  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    // Name validation
    if (!formData.name) {
      newErrors.name = "Name is required";
      valid = false;
    }

    // Email validation
    if (!formData.email_id) {
      newErrors.email_id= "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email_id)) {
      newErrors.email_id = "Email is not valid";
      valid = false;
    }

    // Mobile validation
    if (!formData.phone_number) {
      newErrors.phone_number = "Mobile number is required";
      valid = false;
    } else if (!/^\d{10}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Mobile number should be 10 digits";
      valid = false;
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
      valid = false;
    }

    // Employee ID validation
    if (!formData.unique_id) {
      newErrors.unique_id = "Employee ID is required";
      valid = false;
    }

    // Position validation
    if (!formData.designation) {
      newErrors.designation = "Position is required";
      valid = false;
    }

    // Profile picture validation (optional)
    if (!formData.images) {
      newErrors.images = "Profile picture is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true); // Mark the form as submitted

    const valid = validateForm();

    if (valid) {
      setSaveloader(true);
      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/register_employee",
          formData
        );
        const responseData = response.data;

        // if (responseData.message === "employee already exist") {
        //   messageApi.open({
        //     type: "warning",
        //     content: "employee already exist",
        //   });
        //   setSaveloader(false);
        // }

        if(responseData.embeddingerror || responseData.nofaceerror){
          alert("no face detected in image , please reupload image")
        }

        if(responseData.unique_id){
          // alert(responseData.message)
          setSaveloader(false)
           messageApi.open({
            type: "warning",
            content: "Unique ID already exists",
          });
        }

        if(responseData.name){
          // alert(responseData.message)
          setSaveloader(false)
           messageApi.open({
            type: "warning",
            content: "Name already exists",
          });
        }


        if(responseData.email_id){
          // alert(responseData.message)
          setSaveloader(false)
           messageApi.open({
            type: "warning",
            content: "Email ID already exists",
          });
        }

        if (responseData.success) {
          // alert("Employee created successfully!");
          // messageApi.open({
          //   type: "success",
          //   content: "employee Created successfully",
          // });
          updated();

          setFormData({
            name: "",
            email_id: "",
            phone_number: "",
            unique_id: "",
            images: "",
            designation: "",
            gender:""
          });
          handleClose();
          setSaveloader(false);
          Getemployees();
          // window.location.reload(); // Close modal after submission
        }
      } catch (error) {
        console.error("Error creating employee:", error);
      }
    }
  };

  return (
    <div>
      {contextHolder}
      <form onSubmit={handleSubmit}>
        <div className=" font-semibold">Employee Id:</div>
        <input
          type="text"
          name="unique_id"
          value={formData.unique_id}
          onChange={handleInputChange}
          className={`${
            !errors.unique_id ? "mb-10 " : "mb-0 border-danger"
          } w-full px-3 py-2  border    rounded-md outline-none`}
          placeholder="Employee ID"
        />
        {submitted && errors.unique_id && (
          <div className="text-red-500 mb-3 flex gap-2 items-center">
            <RemindOutlineIcon className="w-3" />
            {errors.unique_id}
          </div>
        )}

        <div className=" font-semibold">Name:</div>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={`${
            !errors.name ? "mb-10" : "mb-0 border-danger"
          } w-full px-3 py-2  border  rounded-md outline-none`}
          placeholder="Name"
          // required
        />
        {submitted && errors.name && (
          <div className="text-red-500 mb-3 flex gap-2 items-center">
            <RemindOutlineIcon className="w-3" />
            {errors.name}
          </div>
        )}


<div>
       <div  
      //  className=" flex  flex-row items-center gap-3 "
      className={`${
        !errors.gender ? "mb-10" : "mb-0 "
      } w-full  py-2    flex  flex-row items-center gap-3 `}
       >
       <label className="font-semibold">Gender:</label>
       <label>
        <input  type="radio" name="gender" value="male" onChange={handleInputChange} ></input>
        <span className=" ms-1">Male</span>
      </label> 
      <label>
        <input  type="radio" name="gender" value="female"  onChange={handleInputChange} ></input>
        <span className=" ms-1">Female</span></label> 
       </div>
       {submitted && errors.gender && (
          <div className="text-red-500 mb-3 flex gap-2 items-center">
            <RemindOutlineIcon className="w-3" />
            {errors.gender}
          </div>
        )}
     
       </div>

        <div className=" font-semibold">Email:</div>
        <input
          type="email"
          name="email_id"
          value={formData.email_id}
          onChange={handleInputChange}
          className={`${
            !errors.email_id ? "mb-10" : "mb-0 border-danger"
          } w-full px-3 py-2  border  rounded-md outline-none`}
          placeholder="Email"
          // required
        />
        {submitted && errors.email_id && (
          <div className="text-red-500 mb-3 flex gap-2 items-center">
            <RemindOutlineIcon className="w-3" />
            {errors.email_id}
          </div>
        )}

        <div className=" font-semibold">Mobile:</div>
        <input
          type="text"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleInputChange}
          className={`${
            !errors.phone_number ? "mb-10" : "mb-0 border-danger"
          } w-full px-3 py-2  border  rounded-md outline-none`}
          placeholder="Mobile"
          // required
        />
        {submitted && errors.phone_number && (
          <div className="text-red-500 mb-3 flex gap-2 items-center">
            <RemindOutlineIcon className="w-3" />
            {errors.phone_number}
          </div>
        )}

        <div className=" font-semibold">Position:</div>
        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleInputChange}
          className={`${
            !errors.designation ? "mb-10" : "mb-0 border-danger"
          } w-full px-3 py-2  border  rounded-md outline-none`}
          placeholder="Position"
          // required
        />
        {submitted && errors.designation && (
          <div className="text-red-500 mb-3 flex gap-2 items-center">
            <RemindOutlineIcon className="w-3" />
            {errors.designation}
          </div>
        )}

        <div className=" font-semibold">Profile:</div>
        <input
          type="file"
          name="images"
          id="file-input"
          onChange={handleFileChange}
          className={`${
            !errors.images ? "mb-4" : "mb-0 border-danger"
          } w-full px-3 py-2  border  rounded-md outline-none hidden`}
        />

        <label
          htmlFor="file-input"
          className={`
            ${
              errors.images
                ? "bg-red-100 border-red-500"
                : "bg-gray-100 border-blue-400"
            }
           block cursor-pointer px-6 py-2 text-center rounded-md border transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300  w-full`}
        >
          {" "}
          {filename ? `File Selected: ${filename.name}` : "Choose a file"}
        </label>
        {submitted && errors.images && (
          <div className="text-red-500 mb-3 flex gap-2 items-center">
            <RemindOutlineIcon className="w-3" />
            {errors.images}
          </div>
        )}

        <div className=" flex flex-row gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="mt-4 px-4 py-2 bg-gray-300 text-black rounded w-full"
          >
            Cancel
          </button>

          {saveloader ? (
            <button
              type="button"
              disabled={true}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded w-full"
            >
              Add Employee
              <Spin
                indicator={
                  <LoadingOutlined spin className=" ms-2 text-white" />
                }
              />
            </button>
          ) : (
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded w-full"
            >
              Add Employee
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Addemployee;
