import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  FiSend, FiUser, FiMessageSquare, FiBriefcase, 
  FiMapPin, FiTrendingUp, FiTarget, FiDollarSign 
} from 'react-icons/fi';

function BusinessRecommendation() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your Business Intelligence Assistant. I can recommend businesses based on your preferences, location, and past activities. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'greeting'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userProfile] = useState({
    preferences: ['Italian cuisine', 'Coffee shops', 'Coworking spaces'],
    location: 'Downtown Seattle',
    pastVisits: ['Starbucks Reserve', 'Pike Place Market', 'Capitol Hill Restaurants']
  });
  const messagesEndRef = useRef(null);

  const aiResponses = {
    profile: [
      {
        text: "Based on your preference for Italian cuisine, I recommend 'Trattoria Bella Italia'. Their pasta dishes have received excellent ratings from users with similar taste profiles.",
        icon: <FiTarget className="text-green-500" />
      },
      {
        text: "Since you enjoy coffee shops, 'Analog Coffee' might be perfect for you. Users who visited the same places as you rated it 4.8/5 stars.",
        icon: <FiTarget className="text-green-500" />
      }
    ],
    nlp: [
      {
        text: "I noticed you often mention 'quiet atmosphere' in your reviews. 'The Reading Room Café' is known for its peaceful environment and has great workspaces.",
        icon: <FiTrendingUp className="text-blue-500" />
      },
      {
        text: "Your reviews suggest you value 'authentic flavors'. 'Sichuan Home' has been praised by users for maintaining traditional cooking techniques.",
        icon: <FiTrendingUp className="text-blue-500" />
      }
    ],
    location: [
      {
        text: "There's a highly-rated business near your location: 'Urban Coworking'. It's just 0.3 miles from Downtown Seattle and offers private meeting rooms.",
        icon: <FiMapPin className="text-red-500" />
      },
      {
        text: "Within walking distance from you is 'The Market Grill', a seafood restaurant with fresh daily catches from Pike Place Market.",
        icon: <FiMapPin className="text-red-500" />
      }
    ],
    business: [
      {
        text: "Based on your business profile, I recommend focusing on weekend promotions. Your customer traffic is 35% lower on Sundays compared to weekdays.",
        icon: <FiBriefcase className="text-purple-500" />
      },
      {
        text: "Your pricing strategy could be optimized. Competitors in your area charge 12% more for similar services while maintaining customer satisfaction.",
        icon: <FiDollarSign className="text-yellow-500" />
      }
    ]
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (inputMessage.trim() === '') return;
    
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInputMessage('');
    
    setIsTyping(true);
    
    const userInput = inputMessage.toLowerCase();
    let responseType = 'profile';
    
    if (userInput.includes('near') || userInput.includes('location') || userInput.includes('close')) {
      responseType = 'location';
    } else if (userInput.includes('review') || userInput.includes('quality') || userInput.includes('experience')) {
      responseType = 'nlp';
    } else if (userInput.includes('business') || userInput.includes('profit') || userInput.includes('strategy')) {
      responseType = 'business';
    }
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const responses = aiResponses[responseType];
      const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiMessage = {
        id: messages.length + 2,
        text: selectedResponse.text,
        sender: 'ai',
        timestamp: new Date(),
        icon: selectedResponse.icon,
        type: responseType
      };
      
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Quick suggestion buttons
  const suggestions = [
    "Find Italian restaurants near me",
    "Recommend a quiet place to work",
    "Business optimization insights",
    "Places similar to my past visits"
  ];

  // Custom CSS to hide all scrollbars
  const noScrollbarStyles = {
    msOverflowStyle: 'none',  // IE and Edge
    scrollbarWidth: 'none',   // Firefox
    WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-8 max-w-5xl mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User profile sidebar */}
          <div className="hidden md:block">
            <div className="bg-base-200 rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-bold mb-3 flex items-center">
                <FiUser className="mr-2" /> Your Profile
              </h2>
              <div className="mb-4">
                <h3 className="font-semibold text-sm uppercase opacity-70">Preferences</h3>
                <ul className="mt-1">
                  {userProfile.preferences.map((pref, index) => (
                    <li key={index} className="text-sm py-1 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-[#ff5722] mr-2"></span>
                      {pref}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-sm uppercase opacity-70">Location</h3>
                <p className="text-sm py-1 flex items-center">
                  <FiMapPin className="mr-2 text-red-500" />
                  {userProfile.location}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm uppercase opacity-70">Recent Visits</h3>
                <ul className="mt-1">
                  {userProfile.pastVisits.map((visit, index) => (
                    <li key={index} className="text-sm py-1">{visit}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-base-200 rounded-lg shadow-lg p-4 mt-4">
              <h2 className="text-xl font-bold mb-3">How It Works</h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-green-100 p-1 rounded mr-2">
                    <FiTarget className="text-green-500" />
                  </div>
                  <div className="text-sm">
                    <strong>Profile-Based</strong>
                    <p className="opacity-70">Recommendations based on your preferences</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 p-1 rounded mr-2">
                    <FiTrendingUp className="text-blue-500" />
                  </div>
                  <div className="text-sm">
                    <strong>NLP Analysis</strong>
                    <p className="opacity-70">Insights from your reviews and feedback</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-red-100 p-1 rounded mr-2">
                    <FiMapPin className="text-red-500" />
                  </div>
                  <div className="text-sm">
                    <strong>Location-Based</strong>
                    <p className="opacity-70">Nearby businesses you might enjoy</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-purple-100 p-1 rounded mr-2">
                    <FiBriefcase className="text-purple-500" />
                  </div>
                  <div className="text-sm">
                    <strong>Business Insights</strong>
                    <p className="opacity-70">Optimization strategies for business owners</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chat interface */}
          <div className="md:col-span-2">
            <div className="bg-base-200 rounded-lg shadow-lg overflow-hidden h-[600px] flex flex-col">
              {/* Header */}
              <div className="bg-[#ff5722] text-white p-4">
                <h1 className="text-2xl font-bold bebas-neue">Business Recommendation AI</h1>
                <p className="opacity-90">Powered by collaborative filtering, NLP, and location data</p>
              </div>
              
              {/* Chat area - with both scrollbars hidden */}
              <div 
                className="flex-grow overflow-y-auto p-4"
                style={noScrollbarStyles}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-lg p-3 ${
                        message.sender === 'user' 
                          ? 'bg-[#ff5722] text-white rounded-br-none' 
                          : 'bg-base-300 rounded-bl-none'
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        {message.sender === 'ai' ? (
                          <>
                            <FiMessageSquare className="mr-2" />
                            <span className="font-bold">Business AI</span>
                          </>
                        ) : (
                          <>
                            <FiUser className="mr-2" />
                            <span className="font-bold">You</span>
                          </>
                        )}
                        <span className="text-xs opacity-70 ml-2">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      
                      {message.sender === 'ai' && message.icon && (
                        <div className="flex items-center mb-2 text-sm">
                          <div className="mr-2">
                            {message.icon}
                          </div>
                          <span className="opacity-70">
                            {message.type === 'profile' && 'Profile-Based Recommendation'}
                            {message.type === 'nlp' && 'NLP-Based Analysis'}
                            {message.type === 'location' && 'Location-Based Suggestion'}
                            {message.type === 'business' && 'Business Intelligence'}
                          </span>
                        </div>
                      )}
                      
                      <p>{message.text}</p>
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex mb-4 justify-start">
                    <div className="bg-base-300 rounded-lg rounded-bl-none p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* Quick suggestions with hidden horizontal scrollbar */}
              <div 
                className="px-4 py-2 bg-base-300/50 flex overflow-x-auto gap-2" 
                style={noScrollbarStyles}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="px-3 py-1 bg-base-100 rounded-full text-sm whitespace-nowrap hover:bg-base-300 transition-colors"
                    onClick={() => {
                      setInputMessage(suggestion);
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              
              {/* Input area */}
              <form onSubmit={handleSubmit} className="border-t border-base-300 p-4 bg-base-100">
                <div className="flex">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={handleInputChange}
                    placeholder="Ask for business recommendations..."
                    className="flex-grow input input-bordered focus:outline-none focus:border-[#ff5722]"
                  />
                  <button 
                    type="submit" 
                    className="ml-2 btn bg-[#ff5722] hover:bg-[#e64a19] text-white"
                    disabled={inputMessage.trim() === ''}
                  >
                    <FiSend />
                    <span className="ml-1 hidden sm:inline">Send</span>
                  </button>
                </div>
                <p className="text-xs mt-2 opacity-70">
                  Try asking for recommendations based on location, preferences, or business insights.
                </p>
              </form>
            </div>
            
            {/* Data sources info */}
            <div className="mt-4 bg-base-200 p-4 rounded-lg shadow text-sm">
              <h3 className="font-bold mb-1">Data Sources & Methods</h3>
              <p>Recommendations are generated using collaborative filtering, matrix factorization (SVD/ALS), and natural language processing of reviews. Location data uses Haversine formula for proximity calculations. [[8]](#__8)</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default BusinessRecommendation;
