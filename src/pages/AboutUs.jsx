import React, { useEffect } from "react";
import { FiMail, FiLinkedin, FiTwitter, FiGithub } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import teamMember1 from "../assets/aziz.jpg";
import teamMember2 from "../assets/Nezam.jpg";
import teamMember3 from "../assets/nasim.jpg";
import reality from "../assets/reality.png";

function AboutUs() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  const teamMembers = [
    {
      id: 1,
      name: "Md Azizur Rahman",
      role: "Full Stack Developer",
      image: teamMember1,
      bio: "A problem-solving enthusiast who thrives on technical challenges. Aziz combines expertise in API development and database optimization to create seamless user experiences. With a background in competitive programming, he ensures our platform is technically robust.",
      social: {
        email: "azizurrahman.zero@gmail.com",
        linkedin: "https://linkedin.com/in/azizurrahman-zero",
        twitter: "https://twitter.com/alexdev",
        github: "https://github.com/azizurrahman-zero",
      },
    },
    {
      id: 2,
      name: "Md Nezam Uddin",
      role: "Full Stack Developer",
      image: teamMember2,
      bio: "Our algorithm specialist with expertise across the entire stack. Nezam's background in data science drives our recommendation engine, while his frontend skills ensure beautiful presentation. He constantly refines our algorithms to deliver spot-on restaurant suggestions.",
      social: {
        email: "nezam0266@gmail.com",
        linkedin: "https://linkedin.com/in/md-nezam-uddin-497a54282",
        twitter: "/",
        github: "https://github.com/mdnezam-uddin",
      },
    },
    {
      id: 3,
      name: "Nasim Rana Feroz",
      role: "Full Stack Developer",
      image: teamMember3,
      bio: "A versatile developer passionate about seamless user experiences. Nasim excels in React and Node.js, with a keen eye for UI/UX design that makes our platform both beautiful and functional. When not coding, he explores restaurants to enhance our database with firsthand insights.",
      social: {
        email: "feroznasimrana@gmail.com",
        linkedin: "https://linkedin.com/in/nasim-rana-feroz",
        twitter: "/about-us",
        github: "https://github.com/NasimRanaFeroz",
      },
    },
  ];
  
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <div className="container mx-auto mt-20 px-4 py-16">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold bebas-neue mb-4">
              Our Mission
            </h2>
            <div className="w-16 h-1 bg-[#ff5722] mb-6"></div>
            <p className="mb-6">
              We're building a smarter way to connect food lovers with their
              perfect dining experiences. Our recommendation platform combines
              cutting-edge technology with a genuine love for culinary
              exploration to help users discover restaurants that truly match
              their preferences.
            </p>
            <p>
              By leveraging machine learning algorithms and user feedback, we're
              creating a community where personal tastes, dietary needs, and
              dining ambitions are understood and catered to with precision and
              care.
            </p>
          </div>
          <div className="md:w-1/2">
            <div className="aspect-video rounded-lg shadow-xl overflow-hidden">
              <img
                src={reality}
                alt="Our mission"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bebas-neue mb-4">
              Meet Our Team
            </h2>
            <div className="w-16 h-1 bg-[#ff5722] mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto">
              We're three friends who met in our software engineering program
              and bonded over our shared love of food and coding. Together,
              we're combining our technical skills and passion for great dining
              experiences to build something special.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto max-w-5xl">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-base-100 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:scale-105"
              >
                <div className="h-80 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold bebas-neue">
                    {member.name}
                  </h3>
                  <p className="text-[#ff5722] font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="mb-6">{member.bio}</p>

                  <div className="flex space-x-4">
                    <a
                      href={`mailto:${member.social.email}`}
                      className="text-gray-600 hover:text-[#ff5722] transition-colors"
                    >
                      <FiMail size={20} />
                    </a>
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#ff5722] transition-colors"
                    >
                      <FiLinkedin size={20} />
                    </a>
                    <a
                      href={member.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#ff5722] transition-colors"
                    >
                      <FiTwitter size={20} />
                    </a>
                    <a
                      href={member.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#ff5722] transition-colors"
                    >
                      <FiGithub size={20} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bebas-neue mb-4">
              Our Values
            </h2>
            <div className="w-16 h-1 bg-[#ff5722] mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-base-100 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-[#ff5722]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#ff5722]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p>
                We're constantly exploring new technologies and approaches to
                make restaurant discovery more personalized and enjoyable.
              </p>
            </div>

            <div className="text-center p-6 bg-base-100 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-[#ff5722]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#ff5722]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Community</h3>
              <p>
                We believe in building a community of food enthusiasts who share
                their experiences and help others discover great dining options.
              </p>
            </div>

            <div className="text-center p-6 bg-base-100 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-[#ff5722]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#ff5722]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Trust & Transparency</h3>
              <p>
                We're committed to providing honest recommendations and being
                transparent about how our platform works and uses data.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AboutUs;
