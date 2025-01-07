import { Image } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Userdetailsmodel = ({ id }) => {
  const [user, setUser] = useState({});

  const getUSerbyid = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/get_userbyprimary/${id}`
      );
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getUSerbyid();
    }
  }, [id]);

  return (
    <div className=" ">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          {user.base64_image ? (
            <img
              src={`data:image/jpeg;base64,${user.base64_image}`}
              alt="profile"
              style={{ height: "150px", width: "170px" }}
              className="rounded-lg"
            />
          ) : (
            <div
              style={{
                height: "150px",
                width: "170px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f0f0f0",
                borderRadius: "8px",
              }}
            >
              No Image
            </div>
          )}
        </div>
        <div className="flex flex-row gap-2">
          <div className="text-gray-500">Employee Id :</div>
          <div className="rs-text-semibold">{user.unique_id || "N/A"}</div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="text-gray-500">Name :</div>
          <div className="rs-text-semibold">{user.name || "N/A"}</div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="text-gray-500">Mobile :</div>
          <div className="rs-text-semibold">{user.phone_number || "N/A"}</div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="text-gray-500">Email :</div>
          <div className="rs-text-semibold">{user.email_id || "N/A"}</div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="text-gray-500">Position :</div>
          <div className="rs-text-semibold">{user.designation || "N/A"}</div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="text-gray-500">Role :</div>
          <div className="rs-text-semibold">{user.role || "N/A"}</div>
        </div>
      </div>
    </div>
  );
};

export default Userdetailsmodel;
