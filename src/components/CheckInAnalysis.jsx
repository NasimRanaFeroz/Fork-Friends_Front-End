import React, { useState } from 'react';
import CheckInsPerYear from './checkin/CheckInsPerYear';

const CheckInAnalysis = () => {
  // State to track which analysis is selected
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const analysisItems = [
    { id: 1, title: "Check-ins Per Year", path: "checkins-per-year" },
    { id: 2, title: "Check-ins Per Hour", path: "checkins-per-hour" },
    { id: 3, title: "Most Popular Cities for Check-ins", path: "popular-checkin-cities" },
    { id: 4, title: "Businesses Ranked by Check-ins", path: "business-checkin-ranking" },
  ];

  // Function to render the selected analysis component
  const renderAnalysisComponent = () => {
  
    switch(selectedAnalysis) {
      case "checkins-per-year":
        return <CheckInsPerYear />;
      case "checkins-per-hour":
        return <CheckinsPerHour />;
      // Add cases for all your analysis components
      default:
        return null;
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
              className="block p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-green-200 group cursor-pointer"
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

export default CheckInAnalysis;
