import React, { useState } from "react";

import CommonMerchants from "../components/business/CommonMerchants";
import MerchantCities from "../components/business/MerchantCities";
import MerchantStates from "../components/business/MerchantStates";
// import MerchantRatings from "../components/business/MerchantRatings";
import HighestRatedCities from "../components/business/HighestRatedCities";
import CategoryCount from "../components/business/CategoryCount";
import FiveStarMerchants from "../components/business/FiveStarMerchants";
import RestaurantReviews from "../components/business/RestaurantReviews";

const BusinessAnalysis = () => {
  // State to track which analysis is selected
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const analysisItems = [
    { id: 1, title: "Top 20 Most Common Merchants in the U.S.", path: "common-merchants" },
    { id: 2, title: "Top 10 Cities with Most Merchants in the U.S.", path: "merchant-cities" },
    { id: 3, title: "Top 5 States with Most Merchants in the U.S.", path: "merchant-states" },
    { id: 4, title: "Top 10 Cities with Highest Ratings", path: "highest-rated-cities" },
    { id: 5, title: "Category Distribution Analysis", path: "category-count" },
    // { id: 6, title: "Top 10 Most Frequent Categories", path: "top-categories" },
    { id: 6, title: "Top 20 Merchants with Most Five-Star Reviews", path: "five-star-merchants" },
    { id: 7, title: "Review Count by Restaurant Type", path: "restaurant-reviews" },
  ];

  // Function to render the selected analysis component
  const renderAnalysisComponent = () => {
    // You'll need to implement this function to return the appropriate component
    // based on the selectedAnalysis path
    // For example:
    switch(selectedAnalysis) {
      case "common-merchants":
        return <CommonMerchants onBack={() => setSelectedAnalysis(null)} />;
      case "merchant-cities":
        return <MerchantCities onBack={() => setSelectedAnalysis(null)}/>;
      case "merchant-states":
        return <MerchantStates onBack={() => setSelectedAnalysis(null)}/>;
      case "highest-rated-cities":
        return <HighestRatedCities onBack={() => setSelectedAnalysis(null)}/>;
      case "category-count":
        return <CategoryCount onBack={() => setSelectedAnalysis(null)}/>;
      case "five-star-merchants":
        return <FiveStarMerchants onBack={() => setSelectedAnalysis(null)}/>;
      case "restaurant-reviews":
        return <RestaurantReviews onBack={() => setSelectedAnalysis(null)}/>;
      // Add cases for all your analysis components
      default:
        // For now, just showing a placeholder
        return (
          <div className="p-6 bg-white rounded-lg">
            <button 
              onClick={() => setSelectedAnalysis(null)}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
            <h2 className="text-2xl font-bold mb-4">
              {analysisItems.find(item => item.path === selectedAnalysis)?.title}
            </h2>
            <p>Analysis component for {selectedAnalysis} would render here</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      
      {selectedAnalysis ? (
        // Render the selected analysis component
        renderAnalysisComponent()
      ) : (
        // Render the grid of analysis cards
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analysisItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedAnalysis(item.path)}
              className="block p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 group cursor-pointer"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full mr-4 group-hover:bg-blue-700 transition-colors">
                  {item.id}
                </div>
                <h2 className="text-lg font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">
                  {item.title}
                </h2>
              </div>
              <div className="mt-3 flex justify-end">
                <span className="text-blue-600 group-hover:text-blue-800 transition-colors text-sm font-medium flex items-center">
                  View Analysis
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessAnalysis;
