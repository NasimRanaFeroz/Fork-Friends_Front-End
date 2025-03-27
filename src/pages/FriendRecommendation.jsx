import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FiSend,
  FiUser,
  FiMessageSquare,
  FiUsers,
  FiHeart,
  FiStar,
  FiCoffee,
  FiChevronDown,
  FiCheck,
  FiMapPin,
} from "react-icons/fi";

function FriendRecommendation() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm your Friend Finder AI. I can recommend potential friends based on your food interests, restaurant preferences, and social connections. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
      type: "greeting",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [interestOptions] = useState([
    "Italian",
    "Japanese",
    "Chinese",
    "Mexican",
    "Indian",
    "Thai",
    "Mediterranean",
    "French",
    "American",
    "Korean",
    "Vietnamese",
    "Middle Eastern",
    "Vegetarian",
    "Vegan",
    "Seafood",
    "Steakhouse",
    "Breakfast",
    "Brunch",
    "Dinner",
  ]);

  const [placeOptions] = useState([
    "Bella Trattoria",
    "Sakura Sushi",
    "Spice Garden",
    "El Mariachi",
    "Golden Dragon",
    "Le Petit Bistro",
    "The Steakhouse",
    "Ocean Breeze Seafood",
    "Bob's Kitchen",
    "Olive & Vine",
    "Seoul BBQ",
    "Pho Delicious",
    "Acropolis Grill",
    "Burger Joint",
    "Morning Dew Café",
    "Pasta Paradise",
    "Sushi Heaven",
    "Taco Fiesta",
    "Curry House",
  ]);

  const [cityOptions] = useState([
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
    "Miami, FL",
  ]);

  const [selectedInterests, setSelectedInterests] = useState([
  ]);

  const [selectedPlaces, setSelectedPlaces] = useState([
  ]);
  
  const [selectedCity, setSelectedCity] = useState(
  );

  const [interestsOpen, setInterestsOpen] = useState(false);
  const [placesOpen, setPlacesOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const interestsRef = useRef(null);
  const placesRef = useRef(null);
  const cityRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        interestsRef.current &&
        !interestsRef.current.contains(event.target)
      ) {
        setInterestsOpen(false);
      }
      if (placesRef.current && !placesRef.current.contains(event.target)) {
        setPlacesOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setCityOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInterestToggle = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(
        selectedInterests.filter((item) => item !== interest)
      );
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handlePlaceToggle = (place) => {
    if (selectedPlaces.includes(place)) {
      setSelectedPlaces(selectedPlaces.filter((item) => item !== place));
    } else {
      setSelectedPlaces([...selectedPlaces, place]);
    }
  };

  // useEffect(() => {
  //   if (messagesEndRef.current) {
  //     messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [messages]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCityOpen(false);
  };

  const handleSelectAllInterests = () => {
    setSelectedInterests([...interestOptions]);
  };

  const handleClearInterests = () => {
    setSelectedInterests([]);
  };

  const handleSelectAllPlaces = () => {
    setSelectedPlaces([...placeOptions]);
  };

  const handleClearPlaces = () => {
    setSelectedPlaces([]);
  };

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
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    if (inputMessage) {
      const apiResponse = await fetchRestaurantData(inputMessage);

      if (apiResponse.status === "success") {
        const aiResponse = {
          id: messages.length + 2,
          text: apiResponse.response,
          sender: "ai",
          timestamp: new Date(),
          icon: <FiCoffee className="text-orange-500" />,
        };

        setMessages((prev) => [...prev, aiResponse]);
      } else {
        const aiResponse = {
          id: messages.length + 2,
          text: "Sorry, I couldn't find information about that restaurant query right now.",
          sender: "ai",
          timestamp: new Date(),
          icon: <FiMessageSquare className="text-purple-500" />,
        };

        setMessages((prev) => [...prev, aiResponse]);
      }

      setIsTyping(false);
    } else {
      setTimeout(() => {
        const responseCategory = [
          "collaborative",
          "interest",
          "graph",
          "general",
        ][Math.floor(Math.random() * 4)];

        const aiResponsesData = {
          collaborative: [
            {
              text: `Based on your dining preferences for ${selectedInterests
                .slice(0, 2)
                .join(
                  " and "
                )} cuisine, I'd recommend connecting with Alex J. You both enjoy ${selectedPlaces[0]
                } and seem to have similar taste in food!`,
              icon: <FiUsers className="text-blue-500" />,
              friendDetails: {
                name: "Alex J.",
                mutualInterests: selectedInterests.slice(0, 2),
                compatibility: "87%",
                photo: "https://randomuser.me/api/portraits/men/32.jpg",
              },
            },
            {
              text: `You and Taylor M. have very similar taste in restaurants! You've both rated ${selectedPlaces
                .slice(0, 2)
                .join(" and ")} highly. Taylor also enjoys ${selectedInterests[0]
                } cuisine like you.`,
              icon: <FiUsers className="text-blue-500" />,
              friendDetails: {
                name: "Taylor M.",
                mutualInterests: [selectedInterests[0], "Fine dining"],
                compatibility: "92%",
                photo: "https://randomuser.me/api/portraits/women/45.jpg",
              },
            },
          ],
          interest: [
            {
              text: `I analyzed your reviews and found that Jordan P. writes about ${selectedInterests[0]} cuisine with the same enthusiasm you do! They also frequent ${selectedPlaces[0]} just like you.`,
              icon: <FiHeart className="text-red-500" />,
              friendDetails: {
                name: "Jordan P.",
                mutualInterests: [
                  selectedInterests[0],
                  "Cooking",
                  "Food photography",
                ],
                compatibility: "85%",
                photo: "https://randomuser.me/api/portraits/men/67.jpg",
              },
            },
            {
              text: `Based on your restaurant preferences, you and Riley S. both love ${selectedPlaces
                .slice(0, 2)
                .join(" and ")}. Riley also enjoys ${selectedInterests
                  .slice(0, 2)
                  .join(" and ")} food just like you!`,
              icon: <FiHeart className="text-red-500" />,
              friendDetails: {
                name: "Riley S.",
                mutualInterests: selectedInterests.slice(0, 2),
                compatibility: "89%",
                photo: "https://randomuser.me/api/portraits/women/22.jpg",
              },
            },
          ],
          graph: [
            {
              text: `Through our social network analysis, I found that Jamie L. is connected to two of your current friends and shares your interest in ${selectedInterests[0]} cuisine. They also love ${selectedPlaces[0]}!`,
              icon: <FiUsers className="text-green-500" />,
              friendDetails: {
                name: "Jamie L.",
                mutualInterests: [selectedInterests[0], "Food blogging"],
                compatibility: "81%",
                photo: "https://randomuser.me/api/portraits/women/56.jpg",
              },
            },
            {
              text: `Morgan B. is a second-degree connection in your network who frequently visits ${selectedPlaces[1]
                } like you do. They're also a big fan of ${selectedInterests
                  .slice(0, 2)
                  .join(" and ")} cuisine.`,
              icon: <FiUsers className="text-green-500" />,
              friendDetails: {
                name: "Morgan B.",
                mutualInterests: selectedInterests.slice(0, 2),
                compatibility: "79%",
                photo: "https://randomuser.me/api/portraits/men/22.jpg",
              },
            },
          ],
          general: [
            {
              text: `Based on your preferences, I think you'd enjoy meeting people who frequent ${selectedPlaces[0]} and enjoy ${selectedInterests[0]} cuisine. Would you like me to find specific recommendations?`,
              icon: <FiMessageSquare className="text-purple-500" />,
            },
            {
              text: `I notice you enjoy ${selectedInterests
                .slice(0, 3)
                .join(
                  ", "
                )} cuisine. There's a foodie meetup group in ${selectedCity} that focuses on these cuisines. Would you be interested in connecting with members?`,
              icon: <FiMessageSquare className="text-purple-500" />,
            },
          ],
        };

        const responsePool = aiResponsesData[responseCategory];
        const aiResponse = {
          id: messages.length + 2,
          ...responsePool[Math.floor(Math.random() * responsePool.length)],
          sender: "ai",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiResponse]);
        setIsTyping(false);


      }, 1500);
    }
  };


  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const suggestions = [
    "Suggest a friend who likes Chinese foods",
    "Recommend friends",
    "Find a buddy",
  ];

  const noScrollbarStyles = {
    msOverflowStyle: "none",
    scrollbarWidth: "none",
    WebkitOverflowScrolling: "touch",
  };

  return (
    <div className="flex flex-col min-h-screen bg-base-100">
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
                    Friend compatibility data
                  </p>
                </div>
              </div>

              <div className="mb-4" ref={interestsRef}>
                <h3 className="font-semibold text-sm uppercase opacity-70 flex items-center">
                  <FiHeart className="mr-2 text-red-500" /> Food Interests
                </h3>
                <div className="relative mt-2">
                  <button
                    className="w-full px-3 py-2 bg-base-300 rounded flex justify-between items-center"
                    onClick={() => setInterestsOpen(!interestsOpen)}
                  >
                    <span className="text-sm">Select food types</span>
                    <FiChevronDown
                      className={`transition-transform ${interestsOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {interestsOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-base-100 border border-base-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      <div className="sticky top-0 bg-base-100 border-b border-base-300 px-3 py-2 flex justify-between">
                        <button
                          className="text-xs text-blue-500 hover:text-blue-700"
                          onClick={handleSelectAllInterests}
                        >
                          Select All
                        </button>
                        <button
                          className="text-xs text-red-500 hover:text-red-700"
                          onClick={handleClearInterests}
                        >
                          Clear All
                        </button>
                      </div>
                      {interestOptions.map((interest) => (
                        <label
                          key={interest}
                          className="flex items-center px-3 py-2 hover:bg-base-200 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedInterests.includes(interest)}
                            onChange={() => handleInterestToggle(interest)}
                            className="mr-2"
                          />
                          <span className="text-sm">{interest}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {selectedInterests.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedInterests.map((interest) => (
                      <span
                        key={interest}
                        className="px-2 py-1 bg-base-300 rounded-full text-xs flex items-center"
                      >
                        {interest}
                        <button
                          className="ml-1 text-xs hover:text-red-500"
                          onClick={() => handleInterestToggle(interest)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-4" ref={placesRef}>
                <h3 className="font-semibold text-sm uppercase opacity-70 flex items-center">
                  <FiStar className="mr-2 text-yellow-500" /> Favorite
                  Restaurants
                </h3>
                <div className="relative mt-2">
                  <button
                    className="w-full px-3 py-2 bg-base-300 rounded flex justify-between items-center"
                    onClick={() => setPlacesOpen(!placesOpen)}
                  >
                    <span className="text-sm">Select restaurants</span>
                    <FiChevronDown
                      className={`transition-transform ${placesOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {placesOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-base-100 border border-base-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      <div className="sticky top-0 bg-base-100 border-b border-base-300 px-3 py-2 flex justify-between">
                        <button
                          className="text-xs text-blue-500 hover:text-blue-700"
                          onClick={handleSelectAllPlaces}
                        >
                          Select All
                        </button>
                        <button
                          className="text-xs text-red-500 hover:text-red-700"
                          onClick={handleClearPlaces}
                        >
                          Clear All
                        </button>
                      </div>
                      {placeOptions.map((place) => (
                        <label
                          key={place}
                          className="flex items-center px-3 py-2 hover:bg-base-200 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPlaces.includes(place)}
                            onChange={() => handlePlaceToggle(place)}
                            className="mr-2"
                          />
                          <span className="text-sm">{place}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {selectedPlaces.length > 0 && (
                  <div className="mt-2">
                    {selectedPlaces.map((place) => (
                      <div
                        key={place}
                        className="text-sm py-1 flex items-center"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#ff5722] mr-2"></span>
                        {place}
                        <button
                          className="ml-1 text-xs hover:text-red-500"
                          onClick={() => handlePlaceToggle(place)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-4" ref={cityRef}>
                <h3 className="font-semibold text-sm uppercase opacity-70 flex items-center">
                  <FiMapPin className="mr-2 text-blue-500" /> Location
                </h3>
                <div className="relative mt-2">
                  <button
                    className="w-full px-3 py-2 bg-base-300 rounded flex justify-between items-center"
                    onClick={() => setCityOpen(!cityOpen)}
                  >
                    <span className="text-sm">{selectedCity}</span>
                    <FiChevronDown
                      className={`transition-transform ${cityOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {cityOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-base-100 border border-base-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {cityOptions.map((city) => (
                        <div
                          key={city}
                          className="px-3 py-2 hover:bg-base-200 cursor-pointer flex items-center"
                          onClick={() => handleCitySelect(city)}
                        >
                          <span
                            className={`mr-2 ${selectedCity === city ? "visible" : "invisible"
                              }`}
                          >
                            <FiCheck className="text-green-500" />
                          </span>
                          <span className="text-sm">{city}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-base-200 rounded-lg shadow-lg flex flex-col h-[70vh]">
              <div className="px-4 py-3 border-b border-base-300 flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#ff5722] flex items-center justify-center text-white text-xl font-bold">
                  <FiMessageSquare />
                </div>
                <div className="ml-3">
                  <h2 className="font-bold">Friend Recommendation AI</h2>
                  <p className="text-xs opacity-70">
                    Connecting food lovers since 2025
                  </p>
                </div>
              </div>
              <div
                className="flex-grow p-4 overflow-y-auto"
                style={noScrollbarStyles}
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 flex ${message.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                      }`}
                  >
                    {message.sender === "ai" && (
                      <div className="w-8 h-8 rounded-full bg-[#ff5722] flex items-center justify-center text-white text-sm font-bold mr-2 flex-shrink-0">
                        {message.icon || <FiMessageSquare />}
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${message.sender === "user"
                        ? "bg-[#ff5722] text-white"
                        : "bg-base-300"
                        }`}
                    >
                      <div className="text-sm">{message.text.split(/(?=### )/g)}</div>
                      {message.friendDetails && (
                        <div className="mt-2 p-2 bg-base-100 rounded-md">
                          <div className="flex items-center">
                            <img
                              src={message.friendDetails.photo}
                              alt={message.friendDetails.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="ml-2">
                              <div className="font-bold text-sm">
                                {message.friendDetails.name}
                              </div>
                              <div className="text-xs opacity-70">
                                {message.friendDetails.compatibility} match
                              </div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <div className="text-xs font-semibold">
                              Mutual Interests:
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {message.friendDetails.mutualInterests.map(
                                (interest) => (
                                  <span
                                    key={interest}
                                    className="px-2 py-0.5 bg-base-300 rounded-full text-xs"
                                  >
                                    {interest}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="text-right text-xs mt-1 opacity-70">
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#ff5722] flex items-center justify-center text-white text-sm font-bold mr-2">
                      <FiMessageSquare />
                    </div>
                    <div className="bg-base-300 px-4 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-base-content animate-bounce"></div>
                        <div
                          className="w-2 h-2 rounded-full bg-base-content animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-base-content animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div
                className="px-4 py-2 border-t border-base-300 flex items-center overflow-x-auto"
                style={noScrollbarStyles}
              >
                <span className="text-xs font-semibold mr-2 whitespace-nowrap">
                  Try asking:
                </span>
                <div className="flex space-x-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="px-3 py-1 bg-base-300 hover:bg-base-100 rounded-full text-xs whitespace-nowrap"
                      onClick={() => {
                        setInputMessage(suggestion);
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-4 py-3 border-t border-base-300">
                <form onSubmit={handleSubmit} className="flex items-center">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={handleInputChange}
                    placeholder="Ask about friend recommendations..."
                    className="flex-grow px-4 py-2 bg-base-300 rounded-l-lg focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#ff5722] text-white rounded-r-lg"
                  >
                    <FiSend />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default FriendRecommendation;
