import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet, NavLink } from "react-router-dom";

function Analysis() {
  // Style function for NavLink - applies active styles when route is active
  const navLinkStyles = ({ isActive }) => {
    return isActive 
      ? "font-bold bg-[#ff5722] text-primary-content roboto-bold" 
      : "";
  };

  return (
    <div>
      <Navbar />
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          {/* Page content here */}
          <Outlet />
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden roboto-bold"
          >
            Open drawer
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-md min-h-full w-80 p-4 roboto-regular">
            <li>
              <NavLink to="/data-analysis" end className={navLinkStyles}>
                Business Analysis
              </NavLink>
            </li>
            <li>
              <NavLink to="/data-analysis/user-analysis" className={navLinkStyles}>
                User Analysis
              </NavLink>
            </li>
            <li>
              <NavLink to="/data-analysis/review-analysis" className={navLinkStyles}>
                Review Analysis
              </NavLink>
            </li>
            <li>
              <NavLink to="/data-analysis/rating-analysis" className={navLinkStyles}>
                Rating Analysis
              </NavLink>
            </li>
            <li>
              <NavLink to="/data-analysis/check-in-analysis" className={navLinkStyles}>
                Check-in Analysis
              </NavLink>
            </li>
            <li>
              <NavLink to="/data-analysis/comprehensive-analysis" className={navLinkStyles}>
                Comprehensive Analysis
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Analysis;
