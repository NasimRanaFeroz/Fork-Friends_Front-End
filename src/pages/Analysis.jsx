import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { FiMenu, FiBarChart2, FiUsers, FiMessageSquare, FiStar, FiCheckSquare, FiPieChart } from "react-icons/fi";

function Analysis() {
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState("Business Analysis");

  useEffect(() => {
    const path = location.pathname;
    if (path === "/data-analysis") setPageTitle("Business Analysis");
    else if (path === "/data-analysis/user-analysis") setPageTitle("User Analysis");
    else if (path === "/data-analysis/review-analysis") setPageTitle("Review Analysis");
    else if (path === "/data-analysis/rating-analysis") setPageTitle("Rating Analysis");
    else if (path === "/data-analysis/check-in-analysis") setPageTitle("Check-in Analysis");
    else if (path === "/data-analysis/comprehensive-analysis") setPageTitle("Comprehensive Analysis");
    
    setIsDrawerOpen(false);
  }, [location.pathname]);

  const navLinkStyles = ({ isActive }) => {
    return `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive 
        ? "bg-[#ff5722] text-white font-bold shadow-md" 
        : "hover:bg-base-300"
    }`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-grow pt-20">
        <div className="drawer lg:drawer-open">
          <input 
            id="analysis-drawer" 
            type="checkbox" 
            className="drawer-toggle" 
            checked={isDrawerOpen}
            onChange={() => setIsDrawerOpen(!isDrawerOpen)}
          />
          
          <div className="drawer-content flex flex-col">
            <div className="lg:hidden flex items-center justify-between p-4 border-b">
              <h1 className="text-2xl font-bold">{pageTitle}</h1>
              <label
                htmlFor="analysis-drawer"
                className="btn btn-square btn-ghost"
                aria-label="Open navigation"
              >
                <FiMenu size={24} />
              </label>
            </div>
            
            <div className="hidden lg:flex items-center p-6 border-b">
              <h1 className="text-3xl font-bold bebas-neue text-[#ff5722]">{pageTitle}</h1>
            </div>
            <div className="p-4 md:p-6 lg:p-8">
              <Outlet />
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="drawer-side z-40">
            <label
              htmlFor="analysis-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            
            <div className="bg-base-200 w-80 min-h-full flex flex-col p-0">
              {/* Sidebar header */}
              <div className="p-4 border-b border-base-300">
                <h2 className="text-xl font-bold bebas-neue">Data Analysis</h2>
                <p className="text-sm opacity-75">Explore different analysis views</p>
              </div>
              
              {/* Navigation links */}
              <ul className="menu p-4 gap-2 flex-grow">
                <li>
                  <NavLink to="/data-analysis" end className={navLinkStyles}>
                    <FiBarChart2 size={20} />
                    Business Analysis
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/data-analysis/user-analysis" className={navLinkStyles}>
                    <FiUsers size={20} />
                    User Analysis
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/data-analysis/review-analysis" className={navLinkStyles}>
                    <FiMessageSquare size={20} />
                    Review Analysis
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/data-analysis/rating-analysis" className={navLinkStyles}>
                    <FiStar size={20} />
                    Rating Analysis
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/data-analysis/check-in-analysis" className={navLinkStyles}>
                    <FiCheckSquare size={20} />
                    Check-in Analysis
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/data-analysis/comprehensive-analysis" className={navLinkStyles}>
                    <FiPieChart size={20} />
                    Comprehensive Analysis
                  </NavLink>
                </li>
              </ul>
              
              {/* Help section at bottom of sidebar */}
              <div className="p-4 border-t border-base-300 bg-base-300/50">
                <div className="text-sm">
                  <p className="font-bold">Need help with analytics?</p>
                  <p className="mt-1 opacity-75">Check our <a href="/documentation" className="text-[#ff5722] hover:underline">documentation</a> or <a href="/contact" className="text-[#ff5722] hover:underline">contact support</a>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Analysis;
