import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  FiSend, FiUser, FiMessageSquare, FiBriefcase,
  FiMapPin, FiTrendingUp, FiTarget, FiDollarSign,
  FiChevronDown, FiCheck, FiHeart, FiCoffee
} from 'react-icons/fi';

function BusinessRecommendation() {

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);

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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const [preferenceOptions] = useState([
    "Italian cuisine",
    "Japanese cuisine",
    "Chinese cuisine",
    "Mexican cuisine",
    "Indian cuisine",
    "Coffee shops",
    "Coworking spaces",
    "Fine dining",
    "Fast food",
    "Bakeries",
    "Bars & Pubs",
    "Cafés",
    "Food trucks",
    "Vegan restaurants",
    "Seafood restaurants",
    "Steakhouses",
    "Breakfast spots",
    "Dessert shops",
    "Bookstores",
    "Retail shops"
  ]);

  const [locationOptions] = useState([
    "Downtown Seattle",
    "Capitol Hill",
    "Ballard",
    "Fremont",
    "University District",
    "South Lake Union",
    "West Seattle",
    "Queen Anne",
    "Belltown",
    "Pioneer Square",
    "International District",
    "Wallingford",
    "Greenwood",
    "Northgate",
    "Columbia City"
  ]);

  const [selectedPreferences, setSelectedPreferences] = useState([
    "Italian cuisine", "Coffee shops", "Coworking spaces"
  ]);
  const [selectedLocation, setSelectedLocation] = useState("Downtown Seattle");

  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);

  const preferencesRef = useRef(null);
  const locationRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (preferencesRef.current && !preferencesRef.current.contains(event.target)) {
        setPreferencesOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setLocationOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Preference checkbox handlers
  const handlePreferenceToggle = (preference) => {
    if (selectedPreferences.includes(preference)) {
      setSelectedPreferences(selectedPreferences.filter(item => item !== preference));
    } else {
      setSelectedPreferences([...selectedPreferences, preference]);
    }
  };

  // Select all preferences
  const handleSelectAllPreferences = () => {
    setSelectedPreferences([...preferenceOptions]);
  };

  // Clear all preferences
  const handleClearPreferences = () => {
    setSelectedPreferences([]);
  };

  // Location selection handler
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setLocationOpen(false);
  };

  // const aiResponses = {
  //   profile: [
  //     {
  //       text: `Based on your preference for ${selectedPreferences[0] || "Italian cuisine"}, I recommend 'Trattoria Bella Italia'. Their dishes have received excellent ratings from users with similar taste profiles.`,
  //       icon: <FiTarget className="text-green-500" />
  //     },
  //     {
  //       text: `Since you enjoy ${selectedPreferences[1] || "coffee shops"}, 'Analog Coffee' might be perfect for you. Users who visited the same places as you rated it 4.8/5 stars.`,
  //       icon: <FiTarget className="text-green-500" />
  //     }
  //   ],
  //   nlp: [
  //     {
  //       text: "I noticed you often mention 'quiet atmosphere' in your reviews. 'The Reading Room Café' is known for its peaceful environment and has great workspaces.",
  //       icon: <FiTrendingUp className="text-blue-500" />
  //     },
  //     {
  //       text: `Your reviews suggest you value 'authentic flavors'. ${selectedPreferences.includes("Japanese cuisine") ? "'Sushi Kashiba'" : "'Sichuan Home'"} has been praised by users for maintaining traditional cooking techniques.`,
  //       icon: <FiTrendingUp className="text-blue-500" />
  //     }
  //   ],
  //   location: [
  //     {
  //       text: `There's a highly-rated business near your location: 'Urban Coworking'. It's just 0.3 miles from ${selectedLocation} and offers private meeting rooms.`,
  //       icon: <FiMapPin className="text-red-500" />
  //     },
  //     {
  //       text: `Within walking distance from ${selectedLocation} is 'The Market Grill', a seafood restaurant with fresh daily catches from Pike Place Market.`,
  //       icon: <FiMapPin className="text-red-500" />
  //     }
  //   ],
  //   business: [
  //     {
  //       text: "Based on your business profile, I recommend focusing on weekend promotions. Your customer traffic is 35% lower on Sundays compared to weekdays.",
  //       icon: <FiBriefcase className="text-purple-500" />
  //     },
  //     {
  //       text: "Your pricing strategy could be optimized. Competitors in your area charge 12% more for similar services while maintaining customer satisfaction.",
  //       icon: <FiDollarSign className="text-yellow-500" />
  //     }
  //   ]
  // };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const fetchRestaurantData = async (query) => {
    console.log("Fetching restaurant data for query:", query);
    try {
      const url = `http://192.168.37.49:5000/api/simple-query?q=${encodeURIComponent(query)}`;
      console.log(url);
      const response = await fetch(url);




      console.log(response);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      return {
        status: "error",
        response: "Sorry, I couldn't fetch restaurant information at the moment."
      };
    }
  };

  const handleSubmit = async (e) => {
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

    try {
      // Call the restaurant API
      const apiResponse = await fetchRestaurantData(inputMessage);
      console.log(apiResponse);

      if (apiResponse.status === "success") {
        const aiResponse = {
          id: messages.length + 2,
          text: apiResponse.response,
          sender: "ai",
          timestamp: new Date(),
          icon: <FiCoffee className="text-orange-500" />,
        };

        setMessages(prevMessages => [...prevMessages, aiResponse]);
      } else {
        // Handle error response
        const aiResponse = {
          id: messages.length + 2,
          text: "Sorry, I couldn't find information about that restaurant query right now.",
          sender: "ai",
          timestamp: new Date(),
          icon: <FiMessageSquare className="text-purple-500" />,
        };

        setMessages(prevMessages => [...prevMessages, aiResponse]);
      }
    } catch (error) {
      console.error("Error handling API response:", error);

      // Fallback response in case of error
      const aiResponse = {
        id: messages.length + 2,
        text: "I'm having trouble connecting to the restaurant database. Please try again later.",
        sender: "ai",
        timestamp: new Date(),
        icon: <FiMessageSquare className="text-purple-500" />,
      };

      setMessages(prevMessages => [...prevMessages, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };






  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Quick suggestion buttons
  const suggestions = [
    "Find me the best Italian restaurants in Phoenix",
    "Suggest me some chinese restaurant",
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
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-[#ff5722] flex items-center justify-center text-white text-2xl font-bold">
                  <FiUser />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold">Your Profile</h2>
                  <p className="text-sm opacity-70">
                    Business recommendation data
                  </p>
                </div>
              </div>

              {/* Business Preferences dropdown */}
              <div className="mb-4" ref={preferencesRef}>
                <h3 className="font-semibold text-sm uppercase opacity-70 flex items-center">
                  <FiHeart className="mr-2 text-red-500" /> Business Preferences
                </h3>
                <div className="relative mt-2">
                  <button
                    className="w-full px-3 py-2 bg-base-300 rounded flex justify-between items-center"
                    onClick={() => setPreferencesOpen(!preferencesOpen)}
                  >
                    <span className="text-sm">Select preferences</span>
                    <FiChevronDown className={`transition-transform ${preferencesOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {preferencesOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-base-100 border border-base-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      <div className="sticky top-0 bg-base-100 border-b border-base-300 px-3 py-2 flex justify-between">
                        <button
                          className="text-xs text-blue-500 hover:text-blue-700"
                          onClick={handleSelectAllPreferences}
                        >
                          Select All
                        </button>
                        <button
                          className="text-xs text-red-500 hover:text-red-700"
                          onClick={handleClearPreferences}
                        >
                          Clear All
                        </button>
                      </div>
                      {preferenceOptions.map((preference) => (
                        <label key={preference} className="flex items-center px-3 py-2 hover:bg-base-200 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedPreferences.includes(preference)}
                            onChange={() => handlePreferenceToggle(preference)}
                            className="mr-2"
                          />
                          <span className="text-sm">{preference}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Display selected preferences */}
                {selectedPreferences.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedPreferences.map((preference) => (
                      <span
                        key={preference}
                        className="px-2 py-1 bg-base-300 rounded-full text-xs flex items-center"
                      >
                        {preference}
                        <button
                          className="ml-1 text-xs hover:text-red-500"
                          onClick={() => handlePreferenceToggle(preference)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Location dropdown */}
              <div className="mb-4" ref={locationRef}>
                <h3 className="font-semibold text-sm uppercase opacity-70 flex items-center">
                  <FiMapPin className="mr-2 text-blue-500" /> Location
                </h3>
                <div className="relative mt-2">
                  <button
                    className="w-full px-3 py-2 bg-base-300 rounded flex justify-between items-center"
                    onClick={() => setLocationOpen(!locationOpen)}
                  >
                    <span className="text-sm">{selectedLocation}</span>
                    <FiChevronDown className={`transition-transform ${locationOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {locationOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-base-100 border border-base-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {locationOptions.map((location) => (
                        <div
                          key={location}
                          className="px-3 py-2 hover:bg-base-200 cursor-pointer flex items-center"
                          onClick={() => handleLocationSelect(location)}
                        >
                          <span className={`mr-2 ${selectedLocation === location ? 'visible' : 'invisible'}`}>
                            <FiCheck className="text-green-500" />
                          </span>
                          <span className="text-sm">{location}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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

          <div className="md:col-span-2">
            <div className="bg-base-200 rounded-lg shadow-lg overflow-hidden h-[600px] flex flex-col">
              <div className="bg-[#ff5722] text-white p-4">
                <h1 className="text-2xl font-bold bebas-neue">Business Recommendation AI</h1>
                <p className="opacity-90">Powered by collaborative filtering, NLP, and location data</p>
              </div>

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
                      className={`max-w-[85%] rounded-lg p-3 ${message.sender === 'user'
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

                      <p>{message.text.split(/(?=### )/g)}</p>
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
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default BusinessRecommendation;
