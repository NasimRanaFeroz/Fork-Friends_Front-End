import React from "react";
import { FiMail, FiLinkedin, FiTwitter, FiInstagram } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import teamMember1 from "../assets/beauty.png";
import teamMember2 from "../assets/food.png";
import teamMember3 from "../assets/restaurant.png";

function AboutUs() {
  const teamMembers = [
    {
      id: 1,
      name: "Isabella Martinez",
      role: "Executive Chef",
      image: teamMember1,
      bio: "With over 15 years of culinary experience across Europe and Asia, Isabella brings a unique global perspective to our kitchen. Her passion for sustainable ingredients and innovative techniques has earned our restaurant numerous accolades and a loyal following.",
      social: {
        email: "isabella@restaurant.com",
        linkedin: "https://linkedin.com/in/isabellamartinez",
        twitter: "https://twitter.com/chefisabella",
        instagram: "https://instagram.com/chef.isabella",
      },
    },
    {
      id: 2,
      name: "Marcus Chen",
      role: "Pastry Chef",
      image: teamMember2,
      bio: "Marcus discovered his love for pastry while studying architecture, bringing a structural precision to his dessert creations. His signature style combines classic techniques with unexpected flavor combinations, creating memorable final courses that complement our menu perfectly.",
      social: {
        email: "marcus@restaurant.com",
        linkedin: "https://linkedin.com/in/marcuschen",
        twitter: "https://twitter.com/pastrymarcus",
        instagram: "https://instagram.com/marcus.pastry",
      },
    },
    {
      id: 3,
      name: "Olivia Johnson",
      role: "Restaurant Manager",
      image: teamMember3,
      bio: "With a background in hospitality management and a genuine love for creating exceptional dining experiences, Olivia ensures that every aspect of your visit exceeds expectations. Her attention to detail and warm personality set the tone for our service philosophy.",
      social: {
        email: "olivia@restaurant.com",
        linkedin: "https://linkedin.com/in/oliviajohnson",
        twitter: "https://twitter.com/oliviahospitality",
        instagram: "https://instagram.com/olivia.dining",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-[#1a1a1a] text-white mt-16">
        {/* Fixed: Using imported image directly with inline style instead of bg-[url()] */}
        <div className="absolute inset-0 opacity-20">
          <img 
            src={teamMember1} 
            alt="Restaurant background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold bebas-neue mb-4">Our Story</h1>
          <div className="w-20 h-1 bg-[#ff5722] mb-8"></div>
          <p className="text-xl md:text-2xl max-w-3xl roboto-light">
            Founded in 2015, our restaurant was born from a passion for bringing people together through exceptional food. We believe that dining is more than just eating—it's about creating moments and memories around the table.
          </p>
        </div>
      </div>
      
      {/* Mission Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold bebas-neue mb-4">Our Mission</h2>
            <div className="w-16 h-1 bg-[#ff5722] mb-6"></div>
            <p className="mb-6">
              We are committed to crafting culinary experiences that delight the senses while respecting our environment and community. Every dish tells a story of tradition, innovation, and the careful journey from farm to table.
            </p>
            <p>
              Our team sources ingredients from local farmers and producers who share our values of sustainability and ethical practices. We believe that the best flavors come from food that is grown with care and prepared with passion.
            </p>
          </div>
          <div className="md:w-1/2">
            {/* Fixed: Using imported image directly instead of bg-[url()] */}
            <div className="aspect-video rounded-lg shadow-xl overflow-hidden">
              <img 
                src={teamMember1} 
                alt="Our mission" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Team Section */}
      <div className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bebas-neue mb-4">Meet Our Team</h2>
            <div className="w-16 h-1 bg-[#ff5722] mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto">
              The heart and soul of our restaurant is our dedicated team. Their expertise, creativity, and passion are what make every visit to our restaurant special.
            </p>
          </div>
          
          {/* Team Members Grid - Responsive with different layouts for mobile, tablet, and desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-base-100 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
                {/* Team Member Image */}
                <div className="h-80 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Team Member Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold bebas-neue">{member.name}</h3>
                  <p className="text-[#ff5722] font-medium mb-4">{member.role}</p>
                  <p className="mb-6">{member.bio}</p>
                  
                  {/* Social Links */}
                  <div className="flex space-x-4">
                    <a href={`mailto:${member.social.email}`} className="text-gray-600 hover:text-[#ff5722] transition-colors">
                      <FiMail size={20} />
                    </a>
                    <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#ff5722] transition-colors">
                      <FiLinkedin size={20} />
                    </a>
                    <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#ff5722] transition-colors">
                      <FiTwitter size={20} />
                    </a>
                    <a href={member.social.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#ff5722] transition-colors">
                      <FiInstagram size={20} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Values Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bebas-neue mb-4">Our Values</h2>
          <div className="w-16 h-1 bg-[#ff5722] mx-auto mb-6"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-base-200 rounded-lg">
            <div className="w-16 h-16 bg-[#ff5722]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#ff5722]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Quality & Excellence</h3>
            <p>We never compromise on quality. From ingredients to service, we strive for excellence in everything we do.</p>
          </div>
          
          <div className="text-center p-6 bg-base-200 rounded-lg">
            <div className="w-16 h-16 bg-[#ff5722]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#ff5722]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Sustainability</h3>
            <p>We're committed to environmentally responsible practices, from sourcing local ingredients to minimizing waste.</p>
          </div>
          
          <div className="text-center p-6 bg-base-200 rounded-lg">
            <div className="w-16 h-16 bg-[#ff5722]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#ff5722]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Community</h3>
            <p>We believe in creating a welcoming space for all and supporting the community that supports us.</p>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-base-200 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold bebas-neue mb-4">Come Join Us</h2>
          <p className="max-w-2xl mx-auto mb-8">
            We'd love to welcome you to our restaurant and share our passion for exceptional food and hospitality.
          </p>
          <button className="bg-white text-[#ff5722] font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors">
            Make a Reservation
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default AboutUs;
