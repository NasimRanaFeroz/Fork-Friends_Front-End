import React from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const navLinkStyles = ({ isActive }) => {
    return isActive 
      ? "font-bold text-[#ff5722]" 
      : "";
  };

  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div 
            tabIndex={0} 
            role="button" 
            className="btn btn-ghost lg:hidden"
            aria-label="Navigation menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content text-lg bg-base-100 rounded-box z-[100] mt-3 w-52 p-2 shadow"
          >
            <li>
              <NavLink to="/data-analysis" className={navLinkStyles}>
                Data Analysis & Visualization
              </NavLink>
            </li>
            <li>
              <NavLink to="/friend-recommendation" className={navLinkStyles}>
                Friend Recommendation
              </NavLink>
            </li>
            <li>
              <NavLink to="/business-recommendation" className={navLinkStyles}>
                Business Recommendation
              </NavLink>
            </li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost bebas-neue-regular text-4xl text-[#ff5722]">Fork & Friends</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-3 roboto-regular text-lg">
          <li>
            <NavLink to="/data-analysis" className={navLinkStyles}>
              Data Analysis & Visualization
            </NavLink>
          </li>
          <li>
            <NavLink to="/friend-recommendation" className={navLinkStyles}>
              Friend Recommendation
            </NavLink>
          </li>
          <li>
            <NavLink to="/business-recommendation" className={navLinkStyles}>
              Business Recommendation
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="navbar-end roboto-regular text-lg">
        <NavLink to="/feedback" className={({ isActive }) => 
          `btn ${isActive ? "bg-[#ff5722] text-white border-[#ff5722]" : "bg-orange-600 hover:bg-[#e64a19] hover:border-[#e64a19]"}`
        }>
          Give a Feedback!
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
