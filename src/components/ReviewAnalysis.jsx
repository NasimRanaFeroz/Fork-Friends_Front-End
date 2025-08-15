import React, { useState } from "react";
// import CountUsefulFunnyCool from './review/CountUsefulFunnyCool';
import CountPerYear from "./review/CountPerYear";
import PositiveWords from "./review/PositiveWords";
import NegativeWords from "./review/NegativeWords";
import RankUsers from "./review/RankUsers";
import WordAssociation from "./review/WordAssociation";
import WordCloud from "./review/WordCloud";
import CommonWords from "./review/CommonWords";

const ReviewAnalysis = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const analysisItems = [
    { id: 1, title: "Word Association Graph", path: "word-association" },

    {
      id: 2,
      title: "Word Cloud Analysis with POS Filtering",
      path: "word-cloud",
    },
    { id: 3, title: "User Rankings by Review Count", path: "user-rankings" },
    {
      id: 4,
      title: "Top 20 Most Common Words in Reviews",
      path: "common-words",
    },
    {
      id: 5,
      title: "Top 10 Words from Positive Reviews",
      path: "positive-words",
    },
    {
      id: 6,
      title: "Top 10 Words from Negative Reviews",
      path: "negative-words",
    },
    { id: 7, title: "Number of Reviews per Year", path: "reviews-per-year" },
  ];

  const renderAnalysisComponent = () => {
    switch (selectedAnalysis) {
      case "reviews-per-year":
        return <CountPerYear onBack={() => setSelectedAnalysis(null)} />;
      case "user-rankings":
        return <RankUsers onBack={() => setSelectedAnalysis(null)} />;
      case "common-words":
        return <CommonWords onBack={() => setSelectedAnalysis(null)} />;
      case "positive-words":
        return <PositiveWords onBack={() => setSelectedAnalysis(null)} />;
      case "negative-words":
        return <NegativeWords onBack={() => setSelectedAnalysis(null)} />;
      case "word-cloud":
        return <WordCloud onBack={() => setSelectedAnalysis(null)} />;
      case "word-association":
        return <WordAssociation onBack={() => setSelectedAnalysis(null)} />;
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
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-amber-100 hover:border-amber-200 group cursor-pointer"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-amber-600 text-white rounded-full p-4 mr-4 group-hover:bg-amber-700 transition-colors">
                  {item.id}
                </div>
                <h2 className="text-lg font-semibold text-gray-700 group-hover:text-amber-700 transition-colors">
                  {item.title}
                </h2>
              </div>
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

export default ReviewAnalysis;
