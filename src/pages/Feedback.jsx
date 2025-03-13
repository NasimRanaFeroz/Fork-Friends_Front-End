import React, { useState, useRef, useEffect } from "react";
import { FaGithub, FaLinkedin, FaSpinner, FaCheck } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { MdEmail, MdFeedback, MdArrowForward } from "react-icons/md";
import emailjs from "@emailjs/browser";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Feedback = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Feedback", // Default subject
    message: ""
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formStatus, setFormStatus] = useState({
    success: "",
    error: ""
  });
  const [validationErrors, setValidationErrors] = useState({});
  const formRef = useRef(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation errors when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form fields
  const validateField = (name, value) => {
    switch (name) {
      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? "" : "Please enter a valid email address";
      }
      case "message":
        return value.trim().length > 10 ? "" : "Message must be at least 10 characters";
      default:
        return "";
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Validate all fields
    const errors = {};
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) errors[key] = error;
    });
    
    // Check if required fields are filled
    if (!formData.email) errors.email = "Email is required";
    if (!formData.message) errors.message = "Message is required";
    
    // If there are errors, show them and stop submission
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const templateParams = {
      from_name: formData.name || "Anonymous",
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    setIsLoading(true);
    setFormStatus({ success: "", error: "" });
    
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
          setFormStatus({
            success: "Your message has been sent successfully! We'll get back to you soon.",
            error: ""
          });
          setFormData({
            name: "",
            email: "",
            subject: "General Feedback",
            message: ""
          });
          setCurrentStep(1);
        },
        function (error) {
          setIsLoading(false);
          setFormStatus({
            success: "",
            error: "Something went wrong. Please try again or contact us directly via email."
          });
          console.error(error);
        }
      );
  };

  // Handle step navigation
  const nextStep = () => {
    if (currentStep === 1) {
      // Validate first step fields
      const nameError = !formData.name ? "Name is required" : "";
      const emailError = validateField("email", formData.email);
      
      if (nameError || emailError || !formData.email) {
        setValidationErrors({
          ...validationErrors,
          name: nameError,
          email: emailError || (!formData.email ? "Email is required" : "")
        });
        return;
      }
    }
    
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  useEffect(() => {
    if (formStatus.success || formStatus.error) {
      const timer = setTimeout(() => {
        setFormStatus({ success: "", error: "" });
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [formStatus]);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-base-300 to-base-200 pb-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="max-w-2xl w-full bg-base-100 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 transform hover:scale-[1.01]">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-6">
            <h2 className="text-3xl font-extrabold text-white text-center roboto-bold">
              We Value Your Feedback
            </h2>
            <p className="mt-2 text-white text-center roboto-regular">
              Help us improve our service by sharing your thoughts
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 h-2">
            <div 
              className="bg-orange-500 h-2 transition-all duration-500 ease-in-out"
              style={{ width: `${currentStep * 50}%` }}
            ></div>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            {formStatus.success ? (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                  <FaCheck className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-200">Thank you!</h3>
                <p className="mt-2 text-gray-300">{formStatus.success}</p>
                <button
                  onClick={() => setFormStatus({ success: "", error: "" })}
                  className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-6 transition-opacity duration-500">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                        Your Name
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          id="name"
                          name="name"
                          type="text"
                          className={`p-3 w-full border ${
                            validationErrors.name ? 'border-red-500' : 'border-gray-600'
                          } bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none`}
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                        />
                        {validationErrors.name && (
                          <p className="mt-1 text-sm text-red-500">{validationErrors.name}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MdEmail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          className={`pl-10 p-3 w-full border ${
                            validationErrors.email ? 'border-red-500' : 'border-gray-600'
                          } bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none`}
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        {validationErrors.email && (
                          <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-300">
                        What's this about?
                      </label>
                      <div className="mt-1">
                        <select
                          id="subject"
                          name="subject"
                          className="p-3 w-full border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                          value={formData.subject}
                          onChange={handleChange}
                        >
                          <option value="General Feedback">General Feedback</option>
                          <option value="Bug Report">Bug Report</option>
                          <option value="Feature Request">Feature Request</option>
                          <option value="Business Inquiry">Business Inquiry</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                      >
                        Next
                        <MdArrowForward className="ml-2 -mr-1 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
                
                {currentStep === 2 && (
                  <div className="space-y-6 transition-opacity duration-500">
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                        Your Message <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="message"
                          name="message"
                          rows="5"
                          className={`p-3 w-full border ${
                            validationErrors.message ? 'border-red-500' : 'border-gray-600'
                          } bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none`}
                          placeholder="Tell us what's on your mind..."
                          value={formData.message}
                          onChange={handleChange}
                          required
                        />
                        {validationErrors.message && (
                          <p className="mt-1 text-sm text-red-500">{validationErrors.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="privacy"
                        name="privacy"
                        type="checkbox"
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        required
                      />
                      <label htmlFor="privacy" className="ml-2 block text-sm text-gray-300">
                        I agree to the <a href="#" className="text-orange-500 hover:text-orange-400">privacy policy</a> and consent to being contacted.
                      </label>
                    </div>
                    
                    {formStatus.error && (
                      <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg">
                        <p className="text-sm text-red-400">{formStatus.error}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-transparent hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        Back
                      </button>
                      
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`inline-flex items-center px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                          isLoading ? "bg-orange-700 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700"
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
                      >
                        {isLoading ? (
                          <>
                            <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                            Sending...
                          </>
                        ) : (
                          "Send Message"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
            
            {/* Contact Alternative */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-300">Prefer direct contact?</h3>
                  <p className="mt-1 text-sm text-gray-400">
                    Email us at <a href="mailto:femboytahmid@gmail.com" className="text-orange-500 hover:text-orange-400">femboytahmid@gmail.com</a>
                  </p>
                </div>
                
                <div className="mt-4 sm:mt-0">
                  <div className="flex space-x-4">
                    <a
                      href="https://github.com/NasimRanaFeroz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                      aria-label="GitHub"
                    >
                      <FaGithub className="h-6 w-6" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/nasim-rana-feroz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                      aria-label="LinkedIn"
                    >
                      <FaLinkedin className="h-6 w-6" />
                    </a>
                    <a
                      href="https://www.instagram.com/nasim_rana_feroz/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                      aria-label="Instagram"
                    >
                      <AiFillInstagram className="h-6 w-6" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Feedback;
