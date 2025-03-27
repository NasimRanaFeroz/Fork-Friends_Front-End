import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";

const CategoryCount = ({ onBack }) => {
  const [categoryStats, setCategoryStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleGoBack = () => {
    if (onBack) onBack();
  };

  useEffect(() => {
    const fetchCategoryStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://192.168.37.177:5001/api/business/category-stats"
        );
        setCategoryStats(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch category statistics");
        setLoading(false);
        console.error("Error fetching category stats:", err);
      }
    };

    fetchCategoryStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-3">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 relative">
      <button
        onClick={handleGoBack}
        className="absolute top-5 left-5 flex items-center gap-2 py-2 px-4 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-all duration-300 z-10 opacity-0 transform -translate-x-4"
        ref={(el) => {
          if (el) {
            setTimeout(() => {
              el.style.transition =
                "opacity 0.6s ease-out, transform 0.6s ease-out";
              el.style.opacity = 1;
              el.style.transform = "translateX(0)";
            }, 300);
          }
        }}
        aria-label="Back to Business Analysis Dashboard"
      >
        <IoArrowBack className="text-gray-700 text-lg" />
        <span className="text-gray-700 font-medium">Back</span>
      </button>

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 mt-10">
        Total Unique Business Categories
      </h1>

      <div
        className="bg-white rounded-lg shadow-md p-6 opacity-0 transform translate-y-4"
        ref={(el) => {
          if (el) {
            setTimeout(() => {
              el.style.transition = "opacity 0.7s, transform 0.7s";
              el.style.opacity = 1;
              el.style.transform = "translateY(0)";
            }, 400);
          }
        }}
      >
        <div className="flex flex-col items-center">
          <div className="text-5xl font-bold text-blue-600 mb-2">
            {categoryStats?.totalUniqueCategories.toLocaleString()}
          </div>

          <div className="mt-8 w-full max-w-md">
            <div className="relative pt-1">
              <div className="overflow-hidden h-6 mb-4 text-xs flex rounded-full bg-blue-200">
                <div
                  style={{ width: "0%" }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  ref={(el) => {
                    if (el) {
                      setTimeout(() => {
                        el.style.transition = "width 1.5s ease-out";
                        el.style.width = "100%";
                      }, 600);
                    }
                  }}
                >
                  {categoryStats?.totalUniqueCategories.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div
            className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-700 max-w-md opacity-0"
            ref={(el) => {
              if (el) {
                setTimeout(() => {
                  el.style.transition = "opacity 0.7s";
                  el.style.opacity = 1;
                }, 1000);
              }
            }}
          >
            <p className="mb-2">
              <span className="font-semibold">Did you know?</span> Our database
              contains {categoryStats?.totalUniqueCategories.toLocaleString()}{" "}
              unique business categories, representing the diverse range of
              businesses in our dataset.
            </p>
            <p>
              Each category represents a specific type of business, from
              restaurants and retail stores to professional services and
              entertainment venues.
            </p>
          </div>
        </div>
      </div>

      <div
        className="mt-6 bg-white rounded-lg shadow-md p-6 opacity-0 transform translate-y-4"
        ref={(el) => {
          if (el) {
            setTimeout(() => {
              el.style.transition = "opacity 0.7s, transform 0.7s";
              el.style.opacity = 1;
              el.style.transform = "translateY(0)";
            }, 600);
          }
        }}
      >
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Category Diversity
            </h2>
            <p className="text-gray-600">
              With {categoryStats?.totalUniqueCategories.toLocaleString()}{" "}
              unique categories, our platform offers comprehensive business
              coverage across multiple industries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCount;
