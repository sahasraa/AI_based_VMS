import axios from "axios";
import React, { useState, useEffect } from "react";
import { Alert, message, Spin } from "antd";
import RemindOutlineIcon from "@rsuite/icons/RemindOutline";
import { LoadingOutlined } from "@ant-design/icons";

const Editemployee = ({ handleClose, Getemployee, query, updated }) => {
  const [filename, setFilename] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email_id: "",
    phone_number: "",
    unique_id: "",
    base64_image: "",
    designation: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(true);
  const [initialdata, setInitialdata] = useState(null);
  const [saveloader, setSaveloader] = useState(false);

  // Fetch employee data by ID
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/get_employee/${query}`
        );
        // Extracting employee data from the response
        const employeeData = response.data?.employee?.[0];

        if (employeeData) {
          const FormData = {
            name: employeeData.name || "",
            email_id: employeeData.email_id || "",
            phone_number: employeeData.phone_number || "",
            unique_id: employeeData.unique_id || "",
            designation: employeeData.designation || "",
            base64_image: employeeData.base64_image || "",
          };

          setFormData(FormData);
          setInitialdata(FormData);
        } else {
          console.error("No employee data found.");
        }

        console.log("data", employeeData);
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };

    fetchEmployee();
  }, [query]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (submitted) {
      validateField(name, value);
    }
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilename(file);

        const base64Data = reader.result.replace(/^data:image\/[a-z]+;base64,/, '');



        setFormData((prev) => ({
          ...prev,
          base64_image: base64Data,
        }));

        if (submitted) {
          validateField("base64_image", reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Field validation
  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "name":
        error = value ? "" : "Name is required";
        break;
      case "email_id":
        error = value
          ? /\S+@\S+\.\S+/.test(value)
            ? ""
            : "Email is not valid"
          : "Email is required";
        break;
      case "phone_number":
        error = value
          ? /^\d{10}$/.test(value)
            ? ""
            : "Mobile number should be 10 digits"
          : "Mobile number is required";
        break;
      case "unique_id":
        error = value ? "" : "Employee ID is required";
        break;
      case "designation":
        error = value ? "" : "designation is required";
        break;
      case "base64_image":
        error = value ? "" : "Profile picture is required";
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  // Form validation
  const validateForm = () => {
    const fields = ["name", "email_id", "phone_number", "unique_id", "designation", "profile"];
    const newErrors = {};
    let isValid = true;

    fields.forEach((field) => {
      const value = formData[field];
      validateField(field, value);
      if (!value || errors[field]) {
        isValid = false;
        newErrors[field] = errors[field];
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const [messageApi, contextHolder] = message.useMessage();
  console.log("query", query)

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // setSubmitted(true);

    // if (!validateForm) {
    //   return;
    // }

    // if (validateForm()) {
      setSaveloader(true);

      // console.log("formdata", formData)

      try {
        const response = await axios.put(
          `http://127.0.0.1:5000/edit_employee/${query}`,
          formData
        );

        // console.log("response", response.data)

        const responseData = response.data;

        // if(responseData.success){
        //   messageApi.open({
        //         type: "success",
        //         content: "employee updated successfully",
        //       });
        //       updated();
        //     // alert("employee updated successfully");
        //     Getemployee();
        //     handleClose();
        // }

        if (JSON.stringify(formData) === JSON.stringify(initialdata)) {
          messageApi.open({
            type: "warning",
            content: "no changes made",
          });

          setSaveloader(false);
          // alert("no changes made");
        }  

        if(responseData.message==="Email ID already exists."){
          messageApi.open({
            type: "warning",
            content: "Email ID already exists.",
          });
          setSaveloader(false)
        }

        if(responseData.message==="Unique ID already exists."){
          messageApi.open({
            type: "warning",
            content: "Unique ID already exists.",
          });   
          setSaveloader(false)

        }

          if (responseData.success) {
            messageApi.open({
              type: "success",
              content: "employee updated successfully",
            });
            updated();
            // alert("employee updated successfully");
            Getemployee();
            handleClose();
            await axios.put(
              `http://127.0.0.1:5000/edit_user/${query}`,
              formData
            );

            // if (userresponse.data.success) {
            //   // alert("user also updated");
            // }
          
        }
      } catch (error) {
        console.error("Error creating employee:", error);
      }
    // }
  };

  return (
    <div>
      {contextHolder}
      <form onSubmit={handleSubmit}>
        {["unique_id", "name", "email_id", "phone_number", "designation"].map((field) => (
          <div key={field}>
            <label className="font-semibold">
              {field.charAt(0).toUpperCase() + field.slice(1)}:
            </label>
            <input
              type={field === "email_id" ? "email_id" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleInputChange}
              // readOnly={field === "unique_id"} // Make "empid" read-only
              className={`${
                !errors[field] ? "mb-10" : "mb-0 border-danger"
              } w-full px-3 py-2 border rounded-md outline-none  // Optional: add a visual cue for read-only fields
              }`}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            />
            {submitted && errors[field] && (
              <div className="text-red-500 mb-3 flex gap-2 items-center">
                <RemindOutlineIcon className="w-3" />
                {errors[field]}
              </div>
            )}
          </div>
        ))}

        <div className=" flex  items-center">
          <div>
            <label className=" font-semibold">Profile:</label>
            <input
              type="file"
              name="base64_image"
              id="file-input"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="file-input"
              className={`block cursor-pointer  text-center rounded-lg border transition w-full ${
                errors.base64_image
                  ? "bg-red-100 border-red-500"
                  : "bg-gray-100 border-blue-400"
              }`}
            >
              {/* {filename ? `File Selected: ${filename.name}` : "Change Profile"} */}
              <img
                alt="d"
                src={`data:image/jpeg;base64,${formData.base64_image}`}
                className=" w-40 h-40 rounded-t-lg"
              ></img>
              <div>Change profile</div>
            </label>
          </div>
          {submitted && errors.base64_image && (
            <div className="text-red-500 mb-3 flex gap-2 items-center">
              <RemindOutlineIcon className="w-3" />
              {errors.base64_image}
            </div>
          )}
        </div>

        <div className="flex flex-row gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="mt-4 px-4 py-2 bg-gray-300 text-black rounded w-full"
          >
            Cancel
          </button>
          {saveloader ? (
            <button
              type="submit"
              disabled={true}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded w-full"
            >
              Save
              <Spin
                indicator={
                  <LoadingOutlined spin className=" text-white ms-2" />
                }
              />
            </button>
          ) : (
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded w-full"
            >
              Save
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Editemployee;
