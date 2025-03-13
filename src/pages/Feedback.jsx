import React from "react";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import emailjs from "@emailjs/browser";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Feedback = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email || !message) {
      setError("Please fill in all fields");
      return;
    }

    const templateParams = {
      from_name: name,
      from_email: email,
      message,
    };

    setIsLoading(true);
    emailjs
      .send(
        import.meta.env.VITE_PUBLIC_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_PUBLIC_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_PUBLIC_EMAILJS_PUBLIC_KEY
      )
      .then(
        function () {
          setIsLoading(false);
          setSuccess("Your e-mail has been sent successfully.");
          setName("");
          setEmail("");
          setMessage("");
        },
        function (error) {
          setIsLoading(false);
          setError("Sending failed. Please send me a direct e-mail.");
          console.error(error);
        }
      );
  };
  

  return (
    <div>
      <Navbar />
      <div className="h-auto sm:h-[40rem] bg-base-200 bg-cover bg-center flex justify-center items-center">
        <div className="grid grid-cols-1 xl:w-1/2 mt-6 mb-4 md:px-8 gap-4 rounded-lg bg-base-100 shadow-xl transition-shadow duration-300 hover:shadow-2xl">
          <div>
            <p className="text-2xl text-[#ff5722] p-3 mt-2 text-center roboto-bold">
              Give us a feedback!
            </p>
          </div>
          <div className="flex justify-center items-center ">
            <form
              onSubmit={handleSubmit}
              className=" rounded-lg pt-1 w-full px-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-2 px-2 sm:px-4 gap-y-4 roboto-regular">
                <div>
                  <label
                    htmlFor="name"
                    className="text-sm lg:text-base font-medium text-gray-300"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="p-2 w-full border text-black bg-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none"
                    placeholder="Your Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm lg:text-base font-medium text-gray-300"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="mt-1 p-2 w-full border text-black bg-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="py-4 px-2  sm:px-4">
                <label
                  htmlFor="message"
                  className="block lg:text-base text-sm font-medium text-gray-300 h-5"
                >
                  Message
                </label>
                <textarea
                  rows="3"
                  id="message"
                  name="message"
                  className="mt-1 p-2 text-black w-full border bg-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none"
                  placeholder="Your Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`${
                    isLoading
                      ? "bg-orange-600 cursor-not-allowed"
                      : "bg-orange-600 hover:bg-[#e64a19]"
                  } text-white text-base px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600`}
                >
                  {isLoading ? "Sending..." : "Send Email"}
                </button>
              </div>
              <div className="text-center mt-2">
                {success && <p className="text-green-950">{success}</p>}
                {error && <p className="text-red-900">{error}</p>}
              </div>
            </form>
          </div>
          <div className="roboto-regular">
            <p className="text-center text-sm sm:text-base text-white">
              or send us an e-mail at
            </p>
            <p className="text-center text-white text-base sm:text-lg">
              femboytahmid@gmail.com
            </p>
          </div>
          <div className="border-t-2 border-text-white roboto-regular">
            <p className="text-center text-sm sm:text-base text-white mt-2">
              Connect with us on other platforms
            </p>
            <div className="text-lg p-2 text-white flex justify-center gap-3 sm:gap-4">
              <div className="flex gap-2 sm:gap-3 pt-1">
                <a
                  className="p-2 border-orange-400 rounded-lg shadow-sm hover:shadow-md hover:shadow-orange-500 transition duration-300"
                  href="https://github.com/NasimRanaFeroz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub />
                </a>
                <a
                  className="p-2 border-orange-400 rounded-lg shadow-sm hover:shadow-md hover:shadow-orange-500 transition duration-300"
                  href="https://www.linkedin.com/in/nasim-rana-feroz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin />
                </a>
                <a
                  className="p-2 border-orange-400 rounded-lg shadow-sm hover:shadow-md hover:shadow-orange-500 transition duration-300"
                  href="https://www.instagram.com/nasim_rana_feroz/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <AiFillInstagram />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Feedback
