import React, { useState, useRef,useEffect } from "react";
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
} from "react-icons/fi";

function FriendRecommendation() {

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
      text: "Hi there! I'm your Friend Finder AI. I can recommend potential friends based on your interests, dining preferences, and social connections. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
      type: "greeting",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userProfile] = useState({
    interests: ["Italian cuisine", "Hiking", "Jazz music", "Photography"],
    topRatedPlaces: [
      "Bella Trattoria",
      "Mountain View Trail",
      "Blue Note Jazz Club",
    ],
    recentActivity: [
      "Reviewed Bella Trattoria (5★)",
      "Checked in at Central Park",
      "Liked The Coffee House",
    ],
  });
  const messagesEndRef = useRef(null);

  const aiResponses = {
    collaborative: [
      {
        text: "Based on your dining preferences, I'd recommend connecting with Alex J. You both gave 5-star reviews to Bella Trattoria and seem to enjoy authentic Italian cuisine. Alex also frequently visits jazz clubs like you!",
        icon: <FiUsers className="text-blue-500" />,
        friendDetails: {
          name: "Alex J.",
          mutualInterests: ["Italian food", "Jazz music"],
          compatibility: "87%",
          photo: "https://randomuser.me/api/portraits/men/32.jpg",
        },
      },
      {
        text: "You and Taylor M. have very similar taste in restaurants! You've both rated many of the same places within 1 star of each other. Taylor also enjoys photography and has some great hiking photos in their profile.",
        icon: <FiUsers className="text-blue-500" />,
        friendDetails: {
          name: "Taylor M.",
          mutualInterests: ["Photography", "Hiking", "Fine dining"],
          compatibility: "92%",
          photo: "https://randomuser.me/api/portraits/women/45.jpg",
        },
      },
    ],
    interest: [
      {
        text: "I analyzed your reviews and found that Jordan P. writes about Italian cuisine with the same enthusiasm you do! Their reviews mention 'authentic flavors' and 'traditional recipes' just like yours. You two might enjoy discussing culinary experiences.",
        icon: <FiHeart className="text-red-500" />,
        friendDetails: {
          name: "Jordan P.",
          mutualInterests: ["Italian cuisine", "Cooking", "Food photography"],
          compatibility: "85%",
          photo: "https://randomuser.me/api/portraits/men/67.jpg",
        },
      },
      {
        text: "Based on the language in your reviews and bio, you and Riley S. share a passion for jazz music and photography. Riley frequently mentions composition techniques in their reviews of art venues, similar to your photography comments.",
        icon: <FiHeart className="text-red-500" />,
        friendDetails: {
          name: "Riley S.",
          mutualInterests: ["Jazz", "Photography", "Art exhibitions"],
          compatibility: "89%",
          photo: "https://randomuser.me/api/portraits/women/22.jpg",
        },
      },
    ],
    graph: [
      {
        text: "Through our social network analysis, I found that Jamie L. is connected to two of your current friends (Sarah K. and Michael T.) and shares your interest in hiking. Many people in your extended network speak highly of Jamie.",
        icon: <FiStar className="text-yellow-500" />,
        friendDetails: {
          name: "Jamie L.",
          mutualInterests: ["Hiking", "Nature photography"],
          mutualConnections: ["Sarah K.", "Michael T."],
          compatibility: "94%",
          photo: "https://randomuser.me/api/portraits/women/63.jpg",
        },
      },
      {
        text: "Our graph analysis shows that you and Casey B. are just two connections apart in your social network. You share three mutual friends and have both checked in at Blue Note Jazz Club multiple times. Casey also enjoys Italian cuisine!",
        icon: <FiStar className="text-yellow-500" />,
        friendDetails: {
          name: "Casey B.",
          mutualInterests: ["Jazz music", "Italian food"],
          mutualConnections: ["Priya R.", "Michael T."],
          compatibility: "91%",
          photo: "https://randomuser.me/api/portraits/men/41.jpg",
        },
      },
    ],
    general: [
      {
        text: "I'd be happy to recommend friends based on your interests! Would you prefer recommendations based on similar dining preferences, shared hobbies, or mutual connections?",
        icon: <FiMessageSquare className="text-gray-500" />,
      },
      {
        text: "I can find potential friends for you! Would you like me to focus on people with similar taste in restaurants, those who enjoy photography like you do, or people connected to your existing friends?",
        icon: <FiMessageSquare className="text-gray-500" />,
      },
    ],
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputMessage.trim() === "") return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputMessage("");

    // Simulate AI thinking
    setIsTyping(true);

    // Analyze user input to determine response type
    const userInput = inputMessage.toLowerCase();
    let responseType = "general"; // default

    if (
      userInput.includes("similar") ||
      userInput.includes("taste") ||
      userInput.includes("restaurant") ||
      userInput.includes("rating")
    ) {
      responseType = "collaborative";
    } else if (
      userInput.includes("interest") ||
      userInput.includes("hobby") ||
      userInput.includes("passion") ||
      userInput.includes("like")
    ) {
      responseType = "interest";
    } else if (
      userInput.includes("mutual") ||
      userInput.includes("friend") ||
      userInput.includes("connection") ||
      userInput.includes("network")
    ) {
      responseType = "graph";
    }

    // Simulate AI response after a delay
    setTimeout(() => {
      const responses = aiResponses[responseType];
      const selectedResponse =
        responses[Math.floor(Math.random() * responses.length)];

      const aiMessage = {
        id: messages.length + 2,
        text: selectedResponse.text,
        sender: "ai",
        timestamp: new Date(),
        icon: selectedResponse.icon,
        type: responseType,
        friendDetails: selectedResponse.friendDetails || null,
      };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Quick suggestion buttons
  const suggestions = [
    "Find friends with similar restaurant tastes",
    "Recommend people who share my interests",
    "Suggest friends based on my network",
    "Who might I enjoy meeting?",
  ];

  // Custom CSS to hide all scrollbars
  const noScrollbarStyles = {
    msOverflowStyle: "none", // IE and Edge
    scrollbarWidth: "none", // Firefox
    WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
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

              <div className="mb-4">
                <h3 className="font-semibold text-sm uppercase opacity-70 flex items-center">
                  <FiHeart className="mr-2 text-red-500" /> Interests
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {userProfile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-base-300 rounded-full text-xs"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-sm uppercase opacity-70 flex items-center">
                  <FiStar className="mr-2 text-yellow-500" /> Top Rated Places
                </h3>
                <ul className="mt-1">
                  {userProfile.topRatedPlaces.map((place, index) => (
                    <li key={index} className="text-sm py-1 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-[#ff5722] mr-2"></span>
                      {place}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-sm uppercase opacity-70 flex items-center">
                  <FiCoffee className="mr-2 text-green-500" /> Recent Activity
                </h3>
                <ul className="mt-1">
                  {userProfile.recentActivity.map((activity, index) => (
                    <li key={index} className="text-sm py-1 opacity-70">
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-base-200 rounded-lg shadow-lg p-4 mt-4">
              <h2 className="text-xl font-bold mb-3">
                Our Recommendation Methods
              </h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-1 rounded mr-2">
                    <FiUsers className="text-blue-500" />
                  </div>
                  <div className="text-sm">
                    <strong>Collaborative Filtering</strong>
                    <p className="opacity-70">
                      Finding friends with similar ratings and preferences
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-red-100 p-1 rounded mr-2">
                    <FiHeart className="text-red-500" />
                  </div>
                  <div className="text-sm">
                    <strong>Interest-Based Matching</strong>
                    <p className="opacity-70">
                      NLP analysis of your reviews and interests
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-1 rounded mr-2">
                    <FiStar className="text-yellow-500" />
                  </div>
                  <div className="text-sm">
                    <strong>Graph Network Analysis</strong>
                    <p className="opacity-70">
                      Finding connections through your social network
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat interface */}
          <div className="md:col-span-2">
            <div className="bg-base-200 rounded-lg shadow-lg overflow-hidden h-[650px] flex flex-col">
              {/* Header */}
              <div className="bg-[#ff5722] text-white p-4">
                <h1 className="text-2xl font-bold bebas-neue">
                  Friend Recommendation AI
                </h1>
                <p className="opacity-90">
                  Find friends based on shared interests and preferences
                </p>
              </div>

              {/* Chat area - with scrollbars hidden */}
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
                    className={`flex mb-4 ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-[#ff5722] text-white rounded-br-none"
                          : "bg-base-300 rounded-bl-none"
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        {message.sender === "ai" ? (
                          <>
                            <FiMessageSquare className="mr-2" />
                            <span className="font-bold">Friend Finder AI</span>
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

                      {message.sender === "ai" &&
                        message.icon &&
                        message.type !== "greeting" &&
                        message.type !== "general" && (
                          <div className="flex items-center mb-2 text-sm">
                            <div className="mr-2">{message.icon}</div>
                            <span className="opacity-70">
                              {message.type === "collaborative" &&
                                "Collaborative Filtering Match"}
                              {message.type === "interest" &&
                                "Interest-Based Match"}
                              {message.type === "graph" &&
                                "Social Network Match"}
                            </span>
                          </div>
                        )}

                      <p>{message.text}</p>

                      {/* Friend card for recommendations */}
                      {message.friendDetails && (
                        <div className="mt-3 bg-base-100 rounded-lg p-3 shadow-sm">
                          <div className="flex items-center">
                            <img
                              src={message.friendDetails.photo}
                              alt={message.friendDetails.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="ml-3">
                              <div className="font-bold">
                                {message.friendDetails.name}
                              </div>
                              <div className="text-xs flex items-center">
                                <span className="text-green-500 font-semibold">
                                  {message.friendDetails.compatibility}
                                </span>
                                <span className="mx-1 opacity-70">
                                  compatibility match
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-2">
                            <div className="text-xs font-semibold opacity-70 uppercase">
                              Mutual Interests
                            </div>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {message.friendDetails.mutualInterests.map(
                                (interest, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-0.5 bg-base-300 rounded-full text-xs"
                                  >
                                    {interest}
                                  </span>
                                )
                              )}
                            </div>
                          </div>

                          {message.friendDetails.mutualConnections && (
                            <div className="mt-2">
                              <div className="text-xs font-semibold opacity-70 uppercase">
                                Mutual Connections
                              </div>
                              <div className="text-sm mt-1">
                                {message.friendDetails.mutualConnections.join(
                                  ", "
                                )}
                              </div>
                            </div>
                          )}

                          <div className="mt-3 flex justify-end">
                            <button className="btn btn-sm btn-outline">
                              View Profile
                            </button>
                            <button className="btn btn-sm bg-[#ff5722] text-white ml-2 border-none hover:bg-[#e64a19]">
                              Connect
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex mb-4 justify-start">
                    <div className="bg-base-300 rounded-lg rounded-bl-none p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                        <div
                          className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick suggestions - with scrollbar hidden */}
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
              <form
                onSubmit={handleSubmit}
                className="border-t border-base-300 p-4 bg-base-100"
              >
                <div className="flex">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={handleInputChange}
                    placeholder="Ask for friend recommendations..."
                    className="flex-grow input input-bordered focus:outline-none focus:border-[#ff5722]"
                  />
                  <button
                    type="submit"
                    className="ml-2 btn bg-[#ff5722] hover:bg-[#e64a19] text-white"
                    disabled={inputMessage.trim() === ""}
                  >
                    <FiSend />
                    <span className="ml-1 hidden sm:inline">Send</span>
                  </button>
                </div>
                <p className="text-xs mt-2 opacity-70">
                  Ask for recommendations based on shared interests, dining
                  preferences, or mutual connections.
                </p>
              </form>
            </div>

            {/* Data sources info */}
            <div className="mt-4 bg-base-200 p-4 rounded-lg shadow text-sm">
              <h3 className="font-bold mb-1">
                How We Find Your Perfect Friends
              </h3>
              <p>
                We use collaborative filtering to match users with similar
                ratings, NLP analysis of reviews to find shared interests, and
                graph neural networks to analyze social connections. All
                recommendations are personalized based on your unique profile.{" "}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default FriendRecommendation;
