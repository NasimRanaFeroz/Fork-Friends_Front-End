import React, { useState } from 'react';
import CityTopMerchants from './comprehensive/CityTopMarchants';

const ComprehensiveAnalysis = () => {
  // State to track which analysis is selected
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const analysisItems = [
    { 
      id: 1, 
      title: "Top 5 Merchants by City", 
      description: "Based on rating frequency, average rating, and check-in frequency",
      path: "top-merchants-by-city" 
    },
    // You can add more comprehensive analysis items here as needed
  ];

  // Function to render the selected analysis component
  const renderAnalysisComponent = () => {
    
    // For example:
    switch(selectedAnalysis) {
      case "top-merchants-by-city":
        return <CityTopMerchants onBack={() => setSelectedAnalysis(null)} />;
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
              className="block p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-indigo-200 group cursor-pointer"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-full mr-4 group-hover:bg-indigo-700 transition-colors">
                  {item.id}
                </div>
                <h2 className="text-lg font-semibold text-gray-700 group-hover:text-indigo-700 transition-colors">
                  {item.title}
                </h2>
              </div>
              {item.description && (
                <p className="mt-2 text-sm text-gray-600 pl-14">
                  {item.description}
                </p>
              )}
              <div className="mt-3 flex justify-end">
                <span className="text-indigo-600 group-hover:text-indigo-800 transition-colors text-sm font-medium flex items-center">
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

export default ComprehensiveAnalysis;
