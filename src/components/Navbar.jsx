import React from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const navLinkStyles = ({ isActive }) => {
    return isActive 
      ? "font-bold text-primary" 
      : "";
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
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
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[100] mt-3 w-52 p-2 shadow"
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
        <Link to="/" className="btn btn-ghost text-xl">Fork & Friends</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
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
      <div className="navbar-end">
        <NavLink to="/feedback" className={({ isActive }) => 
          `btn ${isActive ? "btn-primary" : ""}`
        }>
          Give a Feedback!
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
