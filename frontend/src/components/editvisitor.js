import { Button, message, Select } from "antd";
import axios from "axios";
import React, { useState, useEffect } from "react";

const Editvisitor = ({
  handleClose,
  editid,
  getvisitors,
  getload,
  updated,
}) => {
  const [employees, setEmployees] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false); // Add a loading state
  const [formData, setFormdata] = useState({
    name: "",
    phone_number: "",
    address: "",
    purpose: "",
    meet_employee: "",
    base64_image: "",
  });
  const [errors, setErrors] = useState({}); // State for form validation errors

  // Options for the purpose of visit
  const purposeVisitOptions = [
    { value: "Business", label: "Business" },
    { value: "Personal", label: "Personal" },
  ];

  // Employee options for the "Visiting Person" dropdown
  const employeeOptions = employees.map((employee) => ({
    value: employee.name,
    label: employee.name,
  }));

  // Fetch visitor data by ID when the component mounts or editid changes
  const Getvisitorbyid = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/get_visitor/${editid}`
      );


      const data = response.data?.visitor;

      if (data) {
        const visitordata = {
          name: data.name || "",
          phone_number: data.phone_number || "",
          address: data.address || "",
          purpose: data.purpose || "",
          meet_employee: data.meet_employee || "",
        };
        setFormdata(visitordata);
        setInitialData(visitordata);
      } else {
        console.error("No visitor data found.");
      }
    } catch (error) {
      console.error("Error fetching visitor data:", error);
    }
  };

  // Fetch employees data for the select dropdown
  const GetEmployees = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await axios.get("http://127.0.0.1:5000/get_all_employees");
      setEmployees(response.data.visitors);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle select changes for visiting person and purpose
  const handleSelectChange = (name, value) => {
    setFormdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate Fullname
    if (!formData.name.trim()) {
      newErrors.name = "Fullname is required.";
      isValid = false;
    }

    // Validate phone_number
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "phone_number number is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone_number)) {
      newErrors.phone_number = "phone_number number must be a 10-digit number.";
      isValid = false;
    }

    // Validate Address
    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
      isValid = false;
    }

    // Validate Visiting Person
    if (!formData.meet_employee) {
      newErrors.meet_employee = "Visiting person is required.";
      isValid = false;
    }

    // Validate Purpose of Visit
    if (!formData.purpose) {
      newErrors.purpose = "Purpose of visit is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const [messageApi, contextHolder] = message.useMessage();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before submitting
    if (!validateForm()) {
      return; // Stop if validation fails
    }

    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/update_visitor/${editid}`,
        formData
      );

      const responseData = response.data;

      if (responseData.message === "No changes were made.") {
        messageApi.open({
          type: "warning",
          content: "No changes made",
        });
        // alert("No changes made");
      }

      if (JSON.stringify(formData) === JSON.stringify(initialData)) {
        messageApi.open({
          type: "warning",
          content: "No changes made",
        });
        return; // Stop form submission if no changes
      }

      if (responseData.message === "Visitor updated successfully.") {
        updated();
        // messageApi.open({
        //   type: "success",
        //   content: "Updated successfully",
        // });
        // alert("Updated successfully");
        getload();
        getvisitors();
      }

      handleClose();
    } catch (error) {
      console.error("Error updating visitor:", error);
    }
  };

  // Fetch data on mount or when editid changes
  useEffect(() => {
    if (editid) {
      Getvisitorbyid();
    }
    GetEmployees();
  }, [editid]);


  console.log("formdata", formData)

  return (
    <div>
      {contextHolder}
      <form
        className="flex flex-col gap-3 lg:w-1/2 m-auto"
        onSubmit={handleSubmit}
      >
        {/* Fullname Input */}
        <div>
          <label className="font-semibold">Fullname:</label>
          <input
            type="text"
            name="name"
            className="w-full px-3 py-2 border rounded-md outline-none"
            placeholder="Enter Fullname"
            value={formData.name}
            onChange={handleInputChange}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* phone_number Input */}
        <div>
          <label className="font-semibold">phone_number:</label>
          <input
            type="text"
            name="phone_number"
            className="w-full px-3 py-2 border rounded-md outline-none"
            placeholder="Enter phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
          />
          {errors.phone_number && (
            <p className="text-red-500 text-sm">{errors.phone_number}</p>
          )}
        </div>

        {/* Address Input */}
        <div>
          <label className="font-semibold">Address:</label>
          <input
            type="text"
            name="address"
            className="w-full px-3 py-2 border rounded-md outline-none"
            placeholder="Enter Address"
            value={formData.address}
            onChange={handleInputChange}
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address}</p>
          )}
        </div>

        {/* Visiting Person Select */}
        <div>
          <label className="font-semibold">Visiting Person:</label>
          <Select
            className="w-full h-10 border rounded-md"
            value={formData.meet_employee}
            onChange={(value) => handleSelectChange("meet_employee", value)}
            showSearch
            listHeight={200}
            placeholder="Select visiting person"
            options={employeeOptions}
            loading={loading} // Pass the loading state to show the loading spinner
          />
          {errors.meet_employee && (
            <p className="text-red-500 text-sm">{errors.meet_employee}</p>
          )}
        </div>

        {/* Purpose of Visit Select */}
        <div>
          <label className="font-semibold">Purpose of visit:</label>
          <Select
            className="w-full h-10 rounded-md"
            value={formData.purpose}
            onChange={(value) => handleSelectChange("purpose", value)}
            listHeight={200}
            placeholder="Select Purpose"
            options={purposeVisitOptions}
          />
          {errors.purpose && (
            <p className="text-red-500 text-sm">{errors.purpose}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-row gap-4">
          <div className="btn btn-light w-full" onClick={handleClose}>
            Cancel
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Update Visitor
          </button>
        </div>
      </form>
    </div>
  );
};

export default Editvisitor;
