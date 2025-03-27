import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

function FAQ() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);

  const faqData = [
    {
      id: 1,
      question: "How does your restaurant recommendation system work?",
      answer: "Our recommendation system uses collaborative filtering and AI-powered analysis to suggest restaurants based on your preferences, past reviews, and behavior patterns. We analyze data from thousands of users to identify patterns and similarities between users with comparable tastes. When you search for restaurants, we consider factors like your rating history, cuisine preferences, and location to provide personalized recommendations tailored specifically to your tastes." 
    },
    {
      id: 2,
      question: "How accurate are the restaurant ratings on your platform?",
      answer: "Our ratings are aggregated from verified user reviews and are designed to provide an authentic representation of each restaurant's quality. We use advanced algorithms to detect and filter out potentially fraudulent reviews. Our system analyzes rating distribution across different restaurant types and locations to ensure consistency and reliability. We regularly update our rating calculations to reflect the most recent customer experiences." 
    },
    {
      id: 3,
      question: "Can I trust the friend recommendations I receive?",
      answer: "Yes, our friend recommendation system is designed to connect you with users who share similar dining preferences and interests. We use multiple recommendation strategies including collaborative filtering, interest-based recommendations, and graph-based social network analysis. The system analyzes your review patterns, restaurant preferences, and even the language you use in reviews to suggest potential connections who are likely to share your taste in restaurants." 
    },
    {
      id: 4,
      question: "How do I get personalized restaurant recommendations?",
      answer: "To receive personalized recommendations, create an account and start rating restaurants you've visited. The more reviews you provide, the better our system can understand your preferences. You can also use our chat-based search feature to ask for specific recommendations like 'Find me a highly-rated Japanese restaurant near downtown' or 'Recommend a quiet café good for working.' Our AI will process your request and provide tailored suggestions based on your profile and preferences." 
    },
    {
      id: 5,
      question: "What information do you collect about restaurants?",
      answer: "We collect comprehensive data about each restaurant including location, cuisine type, price range, hours of operation, menu items, and special features (like outdoor seating or takeout options). We also aggregate user reviews, ratings, check-ins, and photos. Our data analysis identifies the most common merchants in different regions, top-rated establishments, and trending restaurants. This allows us to provide detailed insights beyond just basic restaurant information." 
    },
    {
      id: 6,
      question: "How can I filter restaurants by specific criteria?",
      answer: "Our search functionality allows you to filter restaurants by multiple criteria including cuisine type, location, price range, rating, and special features. You can also sort results by popularity, rating, or distance. For more specific needs, use our natural language search by typing requests like 'family-friendly Italian restaurants with outdoor seating' or 'highly-rated vegan options open late.' Our system will interpret your query and provide relevant results." 
    },
    {
      id: 7,
      question: "How do I write an effective restaurant review?",
      answer: "Effective reviews are specific, balanced, and helpful to others. Describe your experience in detail, including what you ordered, the quality of service, atmosphere, and any standout features. Include both positives and areas for improvement. Photos can greatly enhance your review. Our system analyzes review content to identify helpful patterns and keywords that assist other users in making dining decisions. The most useful reviews tend to be those that provide context about your visit and specific details about your experience." 
    },
    {
      id: 8,
      question: "How can restaurant owners respond to reviews?",
      answer: "Restaurant owners can claim their business profile and gain the ability to respond to reviews. We encourage constructive dialogue between businesses and customers. Responses should address specific points raised in reviews, thank customers for feedback, and explain any improvements or changes made based on suggestions. Our data shows that businesses that actively engage with reviews tend to see improved ratings over time." 
    },
    {
      id: 9,
      question: "What data analysis features do you offer?",
      answer: "Our platform provides extensive data analysis including identification of top merchants by region, rating distribution analysis, review sentiment analysis, and trend tracking. Users can explore visualizations of the most common restaurant types, highest-rated cuisines, and popular check-in times. Premium users can access deeper insights such as word association graphs and detailed sentiment analysis of reviews." 
    },
    {
      id: 10,
      question: "How do you determine the top restaurants in each city?",
      answer: "We determine top restaurants using a comprehensive algorithm that considers average rating, review volume, check-in frequency, review recency, and user engagement metrics. Our system also analyzes the text of reviews to identify consistently mentioned positive attributes. We regularly update our rankings to reflect current customer experiences and trending establishments. This multi-factor approach ensures that our top recommendations represent truly exceptional dining experiences." 
    },
    {
      id: 11,
      question: "Can I save my favorite restaurants for future reference?",
      answer: "Yes, you can save restaurants to personalized lists such as 'Favorites,' 'Want to Try,' or custom categories you create. These lists are accessible from your profile and can be private or shared with friends. You'll also receive notifications about special events or promotions at your saved restaurants. Our system uses your saved restaurants to further refine your personalized recommendations." 
    },
    {
      id: 12,
      question: "How can I use the chat-based recommendation feature?",
      answer: "Our chat-based recommendation feature uses advanced AI to understand natural language queries. Simply type your request as you would ask a friend, such as 'Where can I find good Thai food that's not too expensive?' or 'I need a romantic restaurant for an anniversary dinner.' The system will analyze your query along with your preference history to provide tailored recommendations. You can refine your search through conversation, asking follow-up questions to narrow down options." 
    }
  ];

  const [openItems, setOpenItems] = useState({});

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Navbar />
      
      <div className="bg-[#1a1a1a] text-white pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold bebas-neue mb-4 text-center">Frequently Asked Questions</h1>
          <div className="w-20 h-1 bg-[#ff5722] mx-auto mb-8"></div>
          <p className="text-xl max-w-3xl mx-auto text-center roboto-light">
            Find answers to common questions about our restaurant recommendation platform. Discover how to get personalized suggestions, connect with like-minded food enthusiasts, and make the most of our features.
          </p>
        </div>
      </div>
      
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
                className={`mt-4 text-gray-300 transition-all duration-300 overflow-hidden ${
                  openItems[item.id] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-base-200 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold bebas-neue mb-4">Still Have Questions?</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            If you couldn't find the answer to your question, please feel free to contact us directly. Our team is here to help with any inquiries about our restaurant recommendation platform!
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <a 
              href="tel:+8613228142082" 
              className="bg-[#ff5722] hover:bg-[#e64a19] text-white font-medium py-3 px-6 rounded-full shadow-lg transition-all duration-300 hover:scale-105 inline-flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Us
            </a>
            <a 
              href="mailto:feroznasimrana@gmail.com" 
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
