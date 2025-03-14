import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

function FAQ() {
  // FAQ data
  const faqData = [
    {
      id: 1,
      question: "What are your operating hours?",
      answer: "We are open Monday through Thursday from 11:00 AM to 10:00 PM, Friday and Saturday from 11:00 AM to 11:00 PM, and Sunday from 10:00 AM to 9:00 PM. Our brunch service is available on weekends from 10:00 AM to 2:00 PM."
    },
    {
      id: 2,
      question: "Do you take reservations?",
      answer: "Yes, we highly recommend making reservations, especially for dinner service and weekends. You can make a reservation through our website, by calling us directly, or through popular reservation platforms. We hold reservations for 15 minutes past the reserved time before releasing the table."
    },
    {
      id: 3,
      question: "What type of cuisine do you serve?",
      answer: "Our restaurant offers modern fusion cuisine that blends Mediterranean and Asian influences. We focus on seasonal ingredients, sustainable seafood, and locally sourced produce. Our menu changes quarterly to reflect the best seasonal offerings."
    },
    {
      id: 4,
      question: "Do you accommodate dietary restrictions and allergies?",
      answer: "Absolutely! We can accommodate most dietary restrictions including vegetarian, vegan, gluten-free, and dairy-free options. Please inform your server about any allergies or dietary concerns when ordering, and our chefs will be happy to modify dishes when possible."
    },
    {
      id: 5,
      question: "Is there a dress code?",
      answer: "We maintain a smart casual dress code. While formal attire is not required, we ask that guests refrain from wearing athletic wear, beachwear, or overly casual attire such as flip-flops and tank tops. Neat denim is acceptable."
    },
    {
      id: 6,
      question: "Do you have parking available?",
      answer: "We offer complimentary valet parking for our dinner guests. There is also a public parking garage located one block away, and street parking is available in the surrounding area (metered until 8:00 PM)."
    },
    {
      id: 7,
      question: "Can I host a private event at your restaurant?",
      answer: "Yes, we have a private dining room that can accommodate groups of 10-30 people. For larger events, we also offer full restaurant buyouts. Please contact our events coordinator at events@restaurant.com for more information, pricing, and availability."
    },
    {
      id: 8,
      question: "Do you have a children's menu?",
      answer: "We offer a children's menu for guests under 12 years old, featuring smaller portions of select dishes as well as kid-friendly options. High chairs and booster seats are available upon request."
    },
    {
      id: 9,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), cash, and digital payment methods including Apple Pay and Google Pay. We do not accept personal checks."
    },
    {
      id: 10,
      question: "Do you offer gift cards?",
      answer: "Yes, we offer gift cards in any denomination. They can be purchased in-person at the restaurant or online through our website. Gift cards are valid for one year from the date of purchase."
    },
    {
      id: 11,
      question: "What is your cancellation policy?",
      answer: "We request that cancellations be made at least 24 hours in advance. For parties of 6 or more, cancellations within 24 hours may incur a fee of $25 per person. No-shows for any reservation size may affect future reservation privileges."
    },
    {
      id: 12,
      question: "Do you offer takeout or delivery?",
      answer: "Yes, we offer takeout service for most menu items. Orders can be placed by phone or through our website. We partner with several delivery services including UberEats, DoorDash, and GrubHub for delivery options within a 5-mile radius."
    }
  ];

  // State to track which FAQ items are open
  const [openItems, setOpenItems] = useState({});

  // Toggle function for FAQ items
  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-[#1a1a1a] text-white pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold bebas-neue mb-4 text-center">Frequently Asked Questions</h1>
          <div className="w-20 h-1 bg-[#ff5722] mx-auto mb-8"></div>
          <p className="text-xl max-w-3xl mx-auto text-center roboto-light">
            Find answers to our most commonly asked questions. If you need further assistance, please don't hesitate to contact us.
          </p>
        </div>
      </div>
      
      {/* FAQ Content */}
      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="max-w-4xl mx-auto">
          {faqData.map((item) => (
            <div 
              key={item.id} 
              className="mb-6 border-b border-gray-200 pb-6 last:border-b-0"
            >
              <button 
                className="flex justify-between items-center w-full text-left font-semibold text-xl focus:outline-none"
                onClick={() => toggleItem(item.id)}
              >
                <span>{item.question}</span>
                {openItems[item.id] ? 
                  <FiChevronUp className="text-[#ff5722] flex-shrink-0 ml-2" size={24} /> : 
                  <FiChevronDown className="text-[#ff5722] flex-shrink-0 ml-2" size={24} />
                }
              </button>
              
              <div 
                className={`mt-4 text-gray-600 transition-all duration-300 overflow-hidden ${
                  openItems[item.id] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Contact Section */}
      <div className="bg-base-200 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold bebas-neue mb-4">Still Have Questions?</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            If you couldn't find the answer to your question, please feel free to contact us directly. Our team is here to help!
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <a 
              href="tel:+15551234567" 
              className="bg-[#ff5722] hover:bg-[#e64a19] text-white font-medium py-3 px-6 rounded-full shadow-lg transition-all duration-300 hover:scale-105 inline-flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Us
            </a>
            <a 
              href="mailto:info@restaurant.com" 
              className="bg-white border border-[#ff5722] text-[#ff5722] hover:bg-gray-100 font-medium py-3 px-6 rounded-full shadow-lg transition-all duration-300 hover:scale-105 inline-flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Us
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default FAQ;
