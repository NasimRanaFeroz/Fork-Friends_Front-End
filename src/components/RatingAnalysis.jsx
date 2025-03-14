import React, { useState } from 'react';

const RatingAnalysis = () => {
  // State to track which analysis is selected
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const analysisItems = [
    { id: 1, title: "Distribution of Ratings (1-5 Stars)", path: "rating-distribution" },
    { id: 2, title: "Weekly Rating Frequency", path: "weekly-ratings" },
    { id: 3, title: "Top Businesses with Five-Star Ratings", path: "five-star-businesses" },
  ];

  // Function to render the selected analysis component
  const renderAnalysisComponent = () => {
    // You'll need to implement this function to return the appropriate component
    // based on the selectedAnalysis path
    // For example:
    // switch(selectedAnalysis) {
    //   case "rating-distribution":
    //     return <RatingDistribution />;
    //   case "weekly-ratings":
    //     return <WeeklyRatings />;
    //   case "five-star-businesses":
    //     return <FiveStarBusinesses />;
    //   default:
    //     return null;
    // }
    
    // For now, just showing a placeholder
    return (
      <div className="p-6 bg-white rounded-lg">
        <button 
          onClick={() => setSelectedAnalysis(null)}
          className="mb-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
        >
          Back to Rating Analysis
        </button>
        <h2 className="text-2xl font-bold mb-4">
          {analysisItems.find(item => item.path === selectedAnalysis)?.title}
        </h2>
        <p>Analysis component for {selectedAnalysis} would render here</p>
      </div>
    );
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
              className="block p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-amber-200 group cursor-pointer"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-amber-600 text-white rounded-full mr-4 group-hover:bg-amber-700 transition-colors">
                  {item.id}
                </div>
                <h2 className="text-lg font-semibold text-gray-700 group-hover:text-amber-700 transition-colors">
                  {item.title}
                </h2>
              </div>
              <div className="mt-3 flex justify-end">
                <span className="text-amber-600 group-hover:text-amber-800 transition-colors text-sm font-medium flex items-center">
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

export default RatingAnalysis;
