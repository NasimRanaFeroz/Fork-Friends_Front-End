import React, { useState } from 'react';

const UserAnalysis = () => {
  // State to track which analysis is selected
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const analysisItems = [
    { id: 1, title: "Users Joining Each Year", path: "users-per-year" },
    { id: 2, title: "Top Reviewers by Review Count", path: "top-reviewers" },
    { id: 3, title: "Most Popular Users by Fans", path: "popular-users" },
    { id: 4, title: "Elite to Regular Users Ratio", path: "elite-ratio" },
    { id: 5, title: "Total vs. Silent Users Proportion", path: "silent-users" },
    { id: 6, title: "Yearly User Statistics", path: "yearly-stats" },
  ];

  // Function to render the selected analysis component
  const renderAnalysisComponent = () => {
    // You'll need to implement this function to return the appropriate component
    // based on the selectedAnalysis path
    // For example:
    // switch(selectedAnalysis) {
    //   case "users-per-year":
    //     return <UsersPerYear />;
    //   case "top-reviewers":
    //     return <TopReviewers />;
    //   // Add cases for all your analysis components
    //   default:
    //     return null;
    // }
    
    // For now, just showing a placeholder
    return (
      <div className="p-6 bg-white rounded-lg">
        <button 
          onClick={() => setSelectedAnalysis(null)}
          className="mb-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Back to User Analysis
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
              className="block p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-purple-200 group cursor-pointer"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-purple-600 text-white rounded-full mr-4 group-hover:bg-purple-700 transition-colors">
                  {item.id}
                </div>
                <h2 className="text-lg font-semibold text-gray-700 group-hover:text-purple-700 transition-colors">
                  {item.title}
                </h2>
              </div>
              <div className="mt-3 flex justify-end">
                <span className="text-purple-600 group-hover:text-purple-800 transition-colors text-sm font-medium flex items-center">
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

export default UserAnalysis;
