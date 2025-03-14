import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Accessibility - trap focus in mobile menu when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const navLinkStyles = ({ isActive }) => {
    return isActive 
      ? "font-bold text-[#ff5722] relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[3px] after:bg-[#ff5722] after:rounded-full" 
      : "hover:text-[#ff5722] transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[3px] after:bg-[#ff5722] after:rounded-full after:transition-all after:duration-300 hover:after:w-full";
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-base-300/95 backdrop-blur-sm shadow-md py-2" : "bg-base-300 py-4"
      }`}
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Left Section: Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="bebas-neue-regular text-4xl text-[#ff5722] hover:scale-105 transition-transform duration-300"
              aria-label="Fork & Friends - Home"
            >
              Fork & Friends
            </Link>
          </div>

          {/* Mobile Menu Button - Only visible on small screens */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
            {isOpen ? (
              <FiX className="h-6 w-6" aria-hidden="true" />
            ) : (
              <FiMenu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>

          {/* Desktop Navigation - Hidden on small screens */}
          <div className="hidden lg:flex items-center justify-between flex-grow ml-10">
            {/* Middle Section: Main Navigation Links */}
            <ul className="flex space-x-8 roboto-regular text-lg mx-auto">
              <li>
                <NavLink 
                  to="/data-analysis" 
                  className={navLinkStyles}
                  aria-current={location.pathname === "/data-analysis" ? "page" : undefined}
                >
                  Data Analysis & Visualization
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/friend-recommendation" 
                  className={navLinkStyles}
                  aria-current={location.pathname === "/friend-recommendation" ? "page" : undefined}
                >
                  Friend Recommendation
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/business-recommendation" 
                  className={navLinkStyles}
                  aria-current={location.pathname === "/business-recommendation" ? "page" : undefined}
                >
                  Business Recommendation
                </NavLink>
              </li>
            </ul>
            
            <div className="flex-shrink-0">
              <NavLink 
                to="/about-us" 
                className={({ isActive }) => 
                  `px-5 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isActive 
                      ? "bg-[#ff5722] text-white shadow-lg shadow-orange-500/30" 
                      : "bg-orange-600 text-white hover:bg-[#e64a19] hover:shadow-lg hover:shadow-orange-500/20"
                  }`
                }
                aria-current={location.pathname === "/about-us" ? "page" : undefined}
              >
                About Us
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden"
          >
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
              className="px-4 pt-2 pb-4 bg-base-100 shadow-lg"
            >
              <ul className="space-y-4 roboto-regular text-lg">
                <motion.li
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <NavLink
                    to="/data-analysis"
                    className={({ isActive }) => 
                      `block py-2 px-3 rounded-md ${isActive ? "bg-base-200 text-[#ff5722] font-bold" : "hover:bg-base-200"}`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    Data Analysis & Visualization
                  </NavLink>
                </motion.li>
                <motion.li
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <NavLink
                    to="/friend-recommendation"
                    className={({ isActive }) => 
                      `block py-2 px-3 rounded-md ${isActive ? "bg-base-200 text-[#ff5722] font-bold" : "hover:bg-base-200"}`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    Friend Recommendation
                  </NavLink>
                </motion.li>
                <motion.li
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <NavLink
                    to="/business-recommendation"
                    className={({ isActive }) => 
                      `block py-2 px-3 rounded-md ${isActive ? "bg-base-200 text-[#ff5722] font-bold" : "hover:bg-base-200"}`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    Business Recommendation
                  </NavLink>
                </motion.li>
                <motion.li
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="pt-2"
                >
                  <NavLink
                    to="/about-us"
                    className={({ isActive }) => 
                      `block py-3 text-center rounded-lg ${
                        isActive 
                          ? "bg-[#ff5722] text-white font-medium" 
                          : "bg-orange-600 text-white hover:bg-[#e64a19]"
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    About Us
                  </NavLink>
                </motion.li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
