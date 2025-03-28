import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import image1 from "../assets/beauty.png";
import image2 from "../assets/food.png";
import image3 from "../assets/restaurant.png";

function ImageSlider() {
  const slides = [
    {
      image: image2,
      title: "Fork & Friends",
      subtitle: "Eat Together, Share Together",
      description:
        "Our platform celebrates the social essence of dining by connecting people through food. 'Eat Together, Share Together' represents our core mission - creating meaningful connections and memorable experiences around the table. This website serves as your gateway to discovering restaurants that specialize in communal dining experiences, perfect for strengthening bonds with friends and family.",
    },
    {
      image: image3,
      title: "Smart Recommendations",
      subtitle: "Data-Driven Dining Choices",
      description:
        "Discover restaurants tailored to your preferences through our advanced recommendation system. We analyze your dining history, ratings, and location to suggest businesses you'll love. Our personalized recommendations use collaborative filtering and natural language processing to understand your unique tastes, ensuring each suggestion matches your dining style and preferences.",
    },
    {
      image: image1,
      title: "Connect Through Cuisine",
      subtitle: "Find Friends Who Share Your Taste",
      description:
        "Our friend recommendation feature connects you with like-minded food enthusiasts. By analyzing review patterns, dining preferences, and social interactions, we identify potential friends with similar culinary interests. Whether you're looking for a dinner companion or expanding your social circle, our platform helps you build connections based on shared food experiences.",
    },
  ];  

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFeedbackButton, setShowFeedbackButton] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 8000);

    const buttonTimer = setTimeout(() => {
      setShowFeedbackButton(true);
    }, 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(buttonTimer);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-base-300">
      <div className="overflow-hidden relative h-full flex items-start">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentIndex
                ? "opacity-100 translate-x-0"
                : index < currentIndex
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>

            <div className="flex flex-col gap-6 items-start justify-center h-full w-1/3 md:ml-20 ml-5 relative z-10">
              <div className="flex flex-col gap-2">
                <p className="text-white text-4xl font-bold bebas-neue">
                  {slide.title}
                </p>
                <p className="text-white text-2xl font-bold bebas-neue">
                  {slide.subtitle}
                </p>
              </div>

              <div className="text-white text-xl font-bold roboto-light">
                {slide.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link 
        to="/feedback"
        className={`fixed bottom-15 right-4 z-50 bg-[#ff5722] hover:bg-[#e64a19] text-white font-medium py-3 px-6 rounded-full shadow-lg transition-all duration-700 ease-in-out transform ${
          showFeedbackButton 
            ? "opacity-100 translate-x-0" 
            : "opacity-0 translate-x-full"
        } hover:scale-105`}
      >
        Give a Feedback!
      </Link>
    </div>
  );
}

export default ImageSlider;
