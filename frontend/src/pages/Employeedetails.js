import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Image, Skeleton } from "antd";

function Employeedetails() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query"); // Get the 'query' parameter from the URL

  const [empname, setEmpname] = useState("");
  const [visitors, setVisitors] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // To handle modal state
  const [loadingImage, setLoadingImage] = useState(true);
  const [selectedImage, setSelectedImage] = useState(""); // To store the image URL

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

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleImageLoad = () => {
    setLoadingImage(false); // Set loading to false when the image has loaded
  };
  return (
    <div>
      <Header />
      <div className="pt-28">
        <div className="lg:px-20">
          <div className="p-3 rounded-md">
            <Link to={"/employees"}>
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
    </div>
  );
}

export default Employeedetails;
