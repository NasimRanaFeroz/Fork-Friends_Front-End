import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-base-300 pt-8 pb-6">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between mb-8">
          {/* Brand Section */}
          <div className="mb-6 md:mb-0">
            <Link to="/" className="bebas-neue-regular text-3xl text-[#ff5722]">
              Fork & Friends
            </Link>
            <p className="mt-2 max-w-xs text-sm opacity-75">
              Connecting food lovers and helping you discover your next favorite dining experience.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4">Explore</h3>
              <ul className="space-y-2">
                <li><Link to="/data-analysis" className="hover:text-[#ff5722] transition-colors">Data Analysis</Link></li>
                <li><Link to="/friend-recommendation" className="hover:text-[#ff5722] transition-colors">Friend Recommendation</Link></li>
                <li><Link to="/business-recommendation" className="hover:text-[#ff5722] transition-colors">Business Recommendation</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/faq" className="hover:text-[#ff5722] transition-colors">FAQs</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-[#ff5722] transition-colors">Privacy Policy</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-[#ff5722] transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li><Link to="/feedback" className="hover:text-[#ff5722] transition-colors">Give Feedback</Link></li>
                <li><a href="mailto:contact@forkandfriends.com" className="hover:text-[#ff5722] transition-colors">feroznasimrana@gmail.com</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-base-content/10 my-4"></div>
        
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm opacity-75">
            © {currentYear} Fork & Friends Ltd. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a 
              href="https://github.com/forkandfriends" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#ff5722] transition-colors"
              aria-label="GitHub"
            >
              <FaGithub size={20} />
            </a>
            <a 
              href="https://linkedin.com/company/forkandfriends" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#ff5722] transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={20} />
            </a>
            <a 
              href="https://twitter.com/forkandfriends" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#ff5722] transition-colors"
              aria-label="Twitter"
            >
              <FaTwitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
