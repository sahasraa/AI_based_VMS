import React, { useEffect, useState } from "react";
import { Button, ButtonToolbar } from "rsuite";
import Apper from "./Dropdown";
import axios from "axios";

function Visitorprofile({ visitorssearchlist }) {
  const [visitors, setVisitors] = useState(null);
  const [data, setData] = useState(null);

  // const Getvisitors = async () => {
  //   await axios
  //     .get("http://127.0.0.1:8090/api/getvisitors")
  //     .then((response) => {
  //       if (visitorssearchlist === null) {
  //         setVisitors(response.data);
  //       }
  //     });
  // };

  // useEffect(() => {
  //   if (visitorssearchlist) {
  //     setVisitors(visitorssearchlist); // If search data is provided, use it directly
  //   } else {
  //     Getvisitors(); // Fetch visitors from the API if no search is active
  //   }
  // }, [visitorssearchlist]);

  // useEffect(() => {
  //   Getvisitors();
  // }, []);

  console.log("visitors", visitors);

  // const visitorcheckin = visitors?.filter((visitor) =>
  //   setData(visitor.checkin)
  // );

  return (
    <>
      <div className="mt-3 px-2 ">
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {visitors?.length > 0 ? (
            visitors.map((employee) => (
              <div
                key={employee._id}
                className="bg-white rounded-lg border overflow-hidden transform transition-all duration-300
                  
                  hover:shadow-xl"
              >
                <div className="relative h-44  border-b-2 p-4">
                  <img
                    alt="profile"
                    src={employee.photo}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="px-2 pt-1 text-start">
                  <h3 className="text-xl font-semibold text-gray-800 truncate">
                    {employee.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">{employee.email}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {employee.mobile}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{employee.empid}</p>
                  {employee.checkin === false && <div>Checked in false</div>}
                </div>
              </div>
            ))
          ) : (
            <div className="w-full text-center text-lg text-gray-500 p-4">
              No employees found.
            </div>
          )}
        </div>

        {/* <div className="card w-72 h-80 px-4 py-6 hover:bg-amber-100">
          <div className=" header flex justify-between bg-slate-100">
            <div>
              <h4>Name</h4>
              <p>subName</p>
            </div>
            <div>
              <ButtonToolbar>
                <Button
                  color="orange"
                  appearance="ghost"
                  className="mt-2 ml-2 me-1.5"
                >
                  pending....
                </Button>
              </ButtonToolbar>
            </div>
          </div>
          <div className="body">
            <div>
              <p className="text-slate-400">visiting</p>
              <h6>Asseigned:</h6>
            </div>
            <div className="">
              <p className="text-slate-400">purpose of Visit</p>
              <h6>Purpose:</h6>
            </div>
            <div className="created-time">
              <p className="text-slate-400">created Time</p>
              <h6>Date & Time</h6>
            </div>
          </div>
          <div className="footer flex justify-around items-center">
            <ButtonToolbar>
              <Button color="green" appearance="primary" className="w-28 flex ">
                CheckIn
              </Button>
            </ButtonToolbar>
            <Apper />
          </div>
        </div> */}
      </div>
    </>
  );
}

export default Visitorprofile;
