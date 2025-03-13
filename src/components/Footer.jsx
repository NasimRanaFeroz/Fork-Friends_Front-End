import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="footer sm:footer-horizontal footer-center bg-base-300  roboto-regular text-base-content p-4">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved by Fork & Friends Ltd
          </p>
        </aside>
      </footer>
    </div>
  );
};

export default Footer;
