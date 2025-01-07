import React from "react";

const UserCard = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="relative w-[300px] h-[500px] bg-gradient-to-b from-blue-600 to-indigo-800 rounded-lg shadow-lg overflow-hidden group hover:scale-105 transform transition-all duration-300">
        {/* User Card Section */}
        <div className="p-5 flex flex-col justify-between h-full text-white">
          {/* User Card */}
          <div className="relative mb-4">
            <div className="text-lg font-bold text-center">Level 13</div>
            <div className="text-md text-center mt-2">5,312 Points</div>

            {/* Avatar */}
            <svg
              width="110"
              height="110"
              viewBox="0 0 250 250"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              {/* Your SVG content goes here */}
            </svg>
          </div>

          {/* More Info */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Jane Doe</h1>
            <p className="mt-2 text-sm">Welcome to my profile! Feel free to explore my achievements.</p>

            <div className="mt-5 space-y-2 text-sm">
              <div>
                <strong>Matches:</strong> 120
              </div>
              <div>
                <strong>Awards:</strong> 12
              </div>
              <div>
                <strong>Coffee:</strong> 10
              </div>
            </div>
          </div>
        </div>

        {/* General Info */}
        <div className="bg-indigo-700 p-5 rounded-t-lg">
          <div className="text-center text-sm text-gray-300">
            Mouse over the card for more info.
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
