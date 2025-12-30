// import React, {useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// const TopBar = ({ onMenuClick }) => {
//   const dropdownRef = useRef(null);
//   const navigate =useNavigate()
//   const auth=useAuth()
//   console.log('auth',auth.user.name)
//   return (
//     <div
//       className="relative w-full flex items-center justify-between px-6 py-4 shadow-lg backdrop-blur-lg border-b"
//       style={{
//         background: "white",
//         borderColor: "rgba(236, 72, 153, 0.15)",
//       }}
//     >

//       <div className="text-center  mx-auto w-fit">
//         <h1 className="text-2xl font-bold text-pink-700 drop-shadow-sm">
//           Kashaf GPT
//         </h1>
//         <p className="text-pink-500 text-sm -mt-1">
//           Professional MERN + AI Developer
//         </p>
//       </div>

//       {/* Profile Button */}
//       <div className="relative" ref={dropdownRef}>
//         <button
//           // onClick={() => setOpen(!open)}
//           className="flex items-center gap-2 px-3 py-2 rounded-sm transition-all"
//         >
//           <p className="w-42 h-9 m-auto rounded-xl text-white hover:shadow-lg"
//             style={{
//               background: "linear-gradient(135deg, #EC4899, #C026D3)",
//               padding: "6px 18px" // top right bottom left
//             }}
//             onClick={()=>navigate('/login')}
//           >
//             Login
//           </p>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TopBar;

import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TopBar = ({ onMenuClick }) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth(); // from context

  const isLoggedIn = Boolean(user);

  return (
    <div
      className="relative w-full flex items-center justify-between px-6 py-4 shadow-lg backdrop-blur-lg border-b"
      style={{
        background: "white",
        borderColor: "rgba(236, 72, 153, 0.15)",
      }}
    >
      {/* Title */}
      <div className="text-center mx-auto w-fit">
        <h1 className="text-2xl font-bold text-pink-700 drop-shadow-sm">
          Kashaf GPT
        </h1>
        <p className="text-pink-500 text-sm -mt-1">
          Professional MERN + AI Developer
        </p>
      </div>

      {/* Profile / Login Section */}
      <div className="relative" ref={dropdownRef}>
        <button className="flex items-center gap-2 px-3 py-2 rounded-sm transition-all">
          {/* If logged in → show username */}
          {isLoggedIn ? (
            <p
              className="w-42 h-9 m-auto rounded-xl text-white hover:shadow-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #EC4899, #C026D3)",
                padding: "6px 18px",
              }}
            >
              {user.name || "User"}
            </p>
          ) : (
            <>
              {/* Show guest + login button if not logged in */}
              <p className="text-pink-600 font-medium mr-2">Guest</p>

              <p
                className="w-42 h-9 m-auto rounded-xl text-white hover:shadow-lg cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #EC4899, #C026D3)",
                  padding: "6px 18px",
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </p>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TopBar;
