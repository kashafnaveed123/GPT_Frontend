import React from "react";
import Profile from "./Profile";
import IntroVideo from "./IntroVideo";

export default function RightMain({ isHorizontal = false }) {
  return (
    <div 
      className={`
        flex w-full
        ${isHorizontal 
          ? 'flex-col sm:flex-row gap-4 sm:gap-6' 
          : 'flex-col gap-4 sm:gap-6' 
        }
      `}
    >
      {/* Profile Section */}
      <div className={isHorizontal ? 'flex-1' : 'w-full'}>
        <Profile />
      </div>
      
      {/* Intro Video Section */}
      <div className={isHorizontal ? 'flex-1' : 'w-full'}>
        <IntroVideo />
      </div>
    </div>
  );
}