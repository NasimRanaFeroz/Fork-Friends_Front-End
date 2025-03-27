import React, { useState } from "react";
import CityTopMerchants from "./comprehensive/CityTopMarchants";

const ComprehensiveAnalysis = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const analysisItems = [
    {
      id: 1,
      title: "Top 5 Merchants by City",
      description:
        "Based on rating frequency, average rating, and check-in frequency",
      path: "top-merchants-by-city",
    },
  ];

  const renderAnalysisComponent = () => {
    switch (selectedAnalysis) {
      case "top-merchants-by-city":
        return <CityTopMerchants onBack={() => setSelectedAnalysis(null)} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg rounded-lg">
      {selectedAnalysis ? (
        renderAnalysisComponent()
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analysisItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedAnalysis(item.path)}
              className="block py-6 px-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-amber-100 hover:border-amber-200 group cursor-pointer"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-amber-600 text-white rounded-full mr-4 group-hover:bg-amber-700 transition-colors">
                  {item.id}
                </div>
                <h2 className="text-lg font-semibold text-gray-700 group-hover:text-amber-700 transition-colors">
                  {item.title}
                </h2>
              </div>
              {item.description && (
                <p className="mt-2 text-sm text-amber-600 pl-14">
                  {item.description}
                </p>
              )}
              <div className="mt-3 flex justify-end">
                <span className="text-amber-600 group-hover:text-amber-800 transition-colors text-sm font-medium flex items-center">
                  View Analysis
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
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
