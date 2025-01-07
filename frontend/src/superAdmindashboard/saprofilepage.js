import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Form, Button, Input } from "rsuite";
import { Divider, Image, message, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/slice";

import { useFormik } from "formik";
import * as Yup from "yup";
import Adminheader from "../Admindashboard/Adminheader";
import { LoadingOutlined } from "@ant-design/icons";
import Sheader from "./Sheader";

// Custom Field Component for Formik
const Field = ({ error, touched, ...rest }) => {
  return (
    <Form.Group>
      <Input {...rest} />
      {/* Only show error if the field has been touched */}
      {touched && error && (
        <Form.ErrorMessage show={true} placement="bottomStart">
          {error}
        </Form.ErrorMessage>
      )}
    </Form.Group>
  );
};

// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Required"),
  password: Yup.string()
    .required("Required")
    .matches(/^(?=.{8,})/, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[A-Z])/,
      "Password must contain at least one uppercase letter"
    )
    .matches(
      /^(?=.*[@$!%*?&])/,
      "Password must contain at least one special character"
    ),
  confirmpassword: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

function Sprofile() {
  const user = useSelector((state) => state.user);
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [messageApi, contextHolder] = message.useMessage();
  const [saveloader, setSaveloader] = useState(false);

 

  const GetUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("No token found, redirecting to sign-in");
        navigate("/signin");
        return;
      }
  
      const response = await axios.post("http://127.0.0.1:5000/decode_token", {
        token: token
      });
  
      const getuserData = response.data;
  
      if (getuserData.message === "Invalid JSON data") {
        alert("Invalid token");
        navigate("/signin");
        return;
      }
  
      // if (getuserData.decoded_token.role !== "Admin") {
      //   navigate("/");
      //   return;
      // }
  
      const userPayload = {
        user_id: getuserData.decoded_token.user_id,
        name: getuserData.decoded_token.name,
        email_id: getuserData.decoded_token.email_id,
        role: getuserData.decoded_token.role,
        base64_image: getuserData.decoded_token.base64_image,
      };
  
      dispatch(setUser(userPayload));
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Failed to fetch user data. Please try again.");
      // navigate("/signin");
    }
  };

    useEffect(() => {
      // If no token, redirect to signin
      // if (!cookies.token) {
      //   navigate("/signin");
      //   return; // Early return if token doesn't exist
      // }
  
      // Fetch user data using token
      
      
      
  
      GetUser();
    }, [ navigate, dispatch]);
  

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      password: "",
      confirmpassword: "",
    },
    validationSchema,
    onSubmit: async (values) =>{
          setSaveloader(true);
          const { oldPassword, password, confirmpassword } = values;
    
          const response = await axios.put(
            `http://127.0.0.1:5000/resetpassword/${user.user_id}`,
            {
              oldPassword: oldPassword,
              password: password,
            }
          );
    
          const responseData = response.data;
    
          if (oldPassword === password) {
            messageApi.open({
              type: "warning",
              content:
                "The new password cannot be the same as the old password. Please choose a different password",
            });
            setSaveloader(false);
    
            // alert(
            //   "The new password cannot be the same as the old password. Please choose a different password"
            // );
          } else
    
          if (!responseData.success) {
            messageApi.open({
              type: "error",
              content: "Old password is incorrect",
            });
            setSaveloader(false);
            // alert("Old password is incorrect");
          } 
          
         
          if (responseData.success) 
          {
            messageApi.open({
              type: "success",
              content: "Password updated",
            });
            setSaveloader(false);
            GetUser();
            formik.resetForm();
            // alert("Password updated");
            // navigate("/signin");
          }
        },
  });

  const [role, setRole] = useState(true);

  useEffect(() => {
    if (user.role === "GENERAL" || user.role === "super Admin") {
      setRole(true);
    } else {
      setRole(false);
    }
  }, [user]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  console.log("user", user)

  return (
    <>
      {contextHolder}
      {/* <Adminheader /> */}
      <Sheader />
      <div className="mt-28 pb-10">
        <div
          className="main_container flex justify-center items-center"
          style={{ width: "100%" }}
        >
          <div className="card shadow-md border-white shadow-lime-600 order-none w-96">
            <div className="card-body pt-2 px-4">
              <div className="mb-3 font-bold">My Profile</div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-2">
                  <Image
                  src={`data:image/jpeg;base64,${user.base64_image}`}
                  alt="profile"
                    style={{ height: "150px", width: "170px" }}
                  />
                </div>
                <div className="flex flex-row gap-2">
                  <div className="text-gray-500">Name :</div>
                  <div className="rs-text-semibold">{user.name}</div>
                </div>

                <div className="flex flex-row gap-2">
                  <div className="text-gray-500">Email :</div>
                  <div className="rs-text-semibold">{user.email_id}</div>
                </div>
                <div className="flex flex-row gap-2">
                  <div className="text-gray-500">Role :</div>
                  <div className="rs-text-semibold">{user.role}</div>
                </div>
              </div>
              <Divider style={{ borderColor: "#7cb305" }} />

              <div className="">
                <div>
                  <p className="font-bold">Change Password</p>

                  <Form
                    onSubmit={formik.handleSubmit}
                    className=" flex flex-col gap-5"
                  >
                    <div className="form-field">
                      <Field
                        name="oldPassword"
                        placeholder="Old Password"
                        value={formik.values.oldPassword}
                        error={formik.errors.oldPassword}
                        touched={formik.touched.oldPassword}
                        onChange={(value) =>
                          formik.setFieldValue("oldPassword", value)
                        }
                      />
                    </div>

                    <div className="form-field">
                      <Field
                        name="password"
                        placeholder="Password"
                        value={formik.values.password}
                        error={formik.errors.password}
                        touched={formik.touched.password}
                        onChange={(value) =>
                          formik.setFieldValue("password", value)
                        }
                      />
                    </div>

                    <div className="form-field">
                      <Field
                        name="confirmpassword"
                        placeholder="Confirm Password"
                        value={formik.values.confirmpassword}
                        error={formik.errors.confirmpassword}
                        touched={formik.touched.confirmpassword}
                        onChange={(value) =>
                          formik.setFieldValue("confirmpassword", value)
                        }
                      />
                    </div>

                    {saveloader ? (
                      <button
                        className=" bg-lime-600 text-white p-2 rounded-md "
                        type="button"
                        disabled={true}
                      >
                        Change Password
                        <Spin
                          indicator={
                            <LoadingOutlined
                              spin
                              className=" ms-2  text-white"
                            />
                          }
                        />
                      </button>
                    ) : (
                      <button
                        className=" bg-lime-600 text-white p-2 rounded-md"
                        type="submit"
                      >
                        Change Password
                      </button>
                    )}
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sprofile;
