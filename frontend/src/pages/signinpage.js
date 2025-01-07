import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slice";
import vmssign from "../../src/images/5blog-1.png";
import { message } from "antd";

const Signin = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie] = useCookies(["token"]);
  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();


  // Function to validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to validate password requirements
  const validatePassword = (password) => {
    // Example: Minimum 4 characters
    return password.length >= 4;
  };

  // Dynamic email validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Validate the email dynamically
    if (value && !validateEmail(value)) {
      setEmailError("Invalid email format.");
    } else {
      setEmailError("");
    }

    // Clear any general errors when the user types
    setGeneralError("");
  };

  // Dynamic password validation
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    // Validate the password dynamically
    if (value && !validatePassword(value)) {
      setPasswordError("Password must be at least 4 characters long.");
    } else {
      setPasswordError("");
    }

    // Clear any general errors when the user types
    setGeneralError("");
  };

  const[submitted, setSumitted]=useState(false)

  const handleSubmit = async (e) => {
    setSumitted(true)
    e.preventDefault();
    setLoading(true);
    setGeneralError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 4 characters long.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/sign_in", {
        email_id: email,
        password: password,
      });

      const responseData = response.data;

      if(response.status===205){
        // setGeneralError("Invalid email or password")
        messageApi.open({
          type: "error",
          content: "Invalid email or password",
        });
      }

      console.log("role", responseData);


      if (responseData.success) {
        console.log("Login Successful", responseData);
        dispatch(setUser(responseData.user));

        // Store the token in local storage
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('role', responseData.role);

        

        if (responseData.user.role === "super Admin") {
          navigate("/superadmindashboard");
        } else if (responseData.user.role === "Admin") {
          navigate("/admindashboard");
        } else {
          navigate("/");
        }
      } 
    } catch (error) {
      setGeneralError("An error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
};


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4  bg-[url('https://img.freepik.com/free-vector/blurred-background-with-light-colors_1034-245.jpg')] bg-cover bg-center h-64 w-fulls ">
        {contextHolder}
      <div className="flex flex-col md:flex-row items-center justify-center max-w-6xl w-full">
        {/* Image Section */}
        <div className="flex-shrink-0 mb-6 md:mb-0 md:w-1/2 w-full h-full flex items-center justify-center">
          <img
            src={vmssign}
            alt="Sign In"
            className="w-full lg:h-96 sm:h-64 md:h-96 object-cover"
          />
        </div>

        {/* Form Section */}
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md md:w-1/2 h-full flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>

          {/* General error message */}
          {/* {generalError && (
            <div className="bg-red-100 text-red-800 p-2 mb-4 rounded-md">
              {generalError}
            </div>
          )} */}

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Email Input */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                className={`w-full p-2 mt-2 border ${
                  emailError ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
              />
              {/* Email error */}
              <div className="h-5">
                { submitted && emailError && (
                  <p className="text-red-600 text-sm mt-1">{emailError}</p>
                )}
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`w-full p-2 mt-2 border ${
                  passwordError ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
              />
              {/* Password error */}
              <div className="h-5">
                { submitted && passwordError && (
                  <p className="text-red-600 text-sm mt-1">{passwordError}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 ${
                (loading ) &&
                "opacity-50 cursor-not-allowed"
              }`}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
