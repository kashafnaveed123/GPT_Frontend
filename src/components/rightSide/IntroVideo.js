import React, { useState } from "react";
import { Play, Pause } from "lucide-react";

export default function IntroVideo() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
      {/* Video Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 sm:px-5 py-3 sm:py-4">
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-white">
          Introduction Video
        </h3>
        <p className="text-xs sm:text-sm text-blue-100 mt-1">
          Learn more about my work
        </p>
      </div>

      {/* Video Container */}
      <div className="relative bg-gray-900 aspect-video">
        {/* Placeholder for video - replace with actual video component */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 to-slate-900">
          {!isPlaying ? (
            <button
              onClick={() => setIsPlaying(true)}
              className="group relative"
            >
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <Play 
                  size={32} 
                  className="text-blue-600 ml-1" 
                />
              </div>
            </button>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {/* Replace this with actual video player */}
              <video
                className="w-full h-full object-cover"
                controls
                autoPlay
              >
                <source src="your-video-url.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}