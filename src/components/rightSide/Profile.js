import React from "react";
import {
  FaMedium,
  FaGithub,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaIdBadge
} from "react-icons/fa";
import profile from '../../assests/profile.png'
export default function Profile() {
  const socialLinks = [
    { Icon: FaLinkedinIn, href: "#", label: "LinkedIn", color: "#0077B5" },
    { Icon: FaGithub, href: "#", label: "GitHub", color: "#333" },
    { Icon: FaMedium, href: "#", label: "Medium", color: "#000" },
    { Icon: FaIdBadge, href: "#", label: "Portfolio", color: "#EC4899" }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-pink-100">
      {/* Profile Image */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <div className="relative">
          <img
            src={profile}
            alt="Kashaf Naveed"
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-pink-200 shadow-lg"
          />
          <div 
            className="absolute bottom-1 right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 sm:border-3 border-white"
            style={{ background: "linear-gradient(135deg, #10B981, #34D399)" }}
          />
        </div>
      </div>

      {/* Name */}
      <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">
        Kashaf Naveed
      </h2>

      {/* Title */}
      <p className="text-center text-xs sm:text-sm md:text-base text-pink-600 font-medium mb-4 sm:mb-6 px-2 leading-relaxed">
        MERN AI Developer | AI Engineer | ML & LLM Engineer
      </p>

      {/* Social Icons */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
        {socialLinks.map(({ Icon, href, label, color }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-pink-50 hover:bg-pink-100 transition-all duration-300 shadow-sm hover:shadow-md"
            title={label}
          >
            <Icon 
              className="text-pink-600 group-hover:scale-110 transition-transform duration-300" 
              size={18}
            />
            {/* Tooltip - hidden on mobile, visible on hover on larger screens */}
            <span className="hidden sm:block absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {label}
            </span>
          </a>
        ))}
      </div>

      {/* Additional Stats or Info  */}
      <div className="mt-6 pt-6 border-t border-pink-100 grid grid-cols-3 gap-2 sm:gap-4">
        <div className="text-center">
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-pink-600">5+</div>
          <div className="text-xs sm:text-sm text-gray-600">Projects</div>
        </div>
        <div className="text-center">
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-pink-600">1+</div>
          <div className="text-xs sm:text-sm text-gray-600">Year</div>
        </div>
        <div className="text-center">
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-pink-600">10+</div>
          <div className="text-xs sm:text-sm text-gray-600">Skills</div>
        </div>
      </div>
    </div>
  );
}