import React, { useState } from 'react';

const ReviewAnalysis = () => {
  // State to track which analysis is selected
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const analysisItems = [
    { id: 1, title: "Number of Reviews per Year", path: "reviews-per-year" },
    { id: 2, title: "Useful, Funny, and Cool Reviews Count", path: "review-attributes" },
    { id: 3, title: "User Rankings by Review Count", path: "user-rankings" },
    { id: 4, title: "Top 20 Most Common Words in Reviews", path: "common-words" },
    { id: 5, title: "Top 10 Words from Positive Reviews", path: "positive-words" },
    { id: 6, title: "Top 10 Words from Negative Reviews", path: "negative-words" },
    { id: 7, title: "Word Cloud Analysis with POS Filtering", path: "word-cloud" },
    { id: 8, title: "Word Association Graph", path: "word-association" },
  ];

  // Function to render the selected analysis component
  const renderAnalysisComponent = () => {
    // You'll need to implement this function to return the appropriate component
    // based on the selectedAnalysis path
    // For example:
    // switch(selectedAnalysis) {
    //   case "reviews-per-year":
    //     return <ReviewsPerYear />;
    //   case "review-attributes":
    //     return <ReviewAttributes />;
    //   // Add cases for all your analysis components
    //   default:
    //     return null;
    // }
    
    // For now, just showing a placeholder
    return (
      <div className="p-6 bg-white rounded-lg">
        <button 
          onClick={() => setSelectedAnalysis(null)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Review Analysis
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
              className="block p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-green-200 group cursor-pointer"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-green-600 text-white rounded-full mr-4 group-hover:bg-green-700 transition-colors">
                  {item.id}
                </div>
                <h2 className="text-lg font-semibold text-gray-700 group-hover:text-green-700 transition-colors">
                  {item.title}
                </h2>
              </div>
              <div className="mt-3 flex justify-end">
                <span className="text-green-600 group-hover:text-green-800 transition-colors text-sm font-medium flex items-center">
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

export default ReviewAnalysis;
