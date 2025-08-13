import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { ArrowLeft } from "lucide-react";

// Demo data to use as fallback
const demoData = [
  {
    businessId: "demo-1",
    businessName: "Sakura Sushi Restaurant",
    fiveStarCount: 1247,
    totalReviews: 1580,
    totalStars: 4.8,
  },
  {
    businessId: "demo-2",
    businessName: "Tokyo Ramen House",
    fiveStarCount: 1156,
    totalReviews: 1420,
    totalStars: 4.7,
  },
  {
    businessId: "demo-3",
    businessName: "Blue Mountain Coffee",
    fiveStarCount: 987,
    totalReviews: 1234,
    totalStars: 4.6,
  },
  {
    businessId: "demo-4",
    businessName: "Italian Garden Bistro",
    fiveStarCount: 892,
    totalReviews: 1145,
    totalStars: 4.5,
  },
  {
    businessId: "demo-5",
    businessName: "Dragon Palace Chinese",
    fiveStarCount: 756,
    totalReviews: 985,
    totalStars: 4.4,
  },
  {
    businessId: "demo-6",
    businessName: "Golden Curry House",
    fiveStarCount: 654,
    totalReviews: 823,
    totalStars: 4.3,
  },
  {
    businessId: "demo-7",
    businessName: "Fresh Salad Bar",
    fiveStarCount: 543,
    totalReviews: 712,
    totalStars: 4.2,
  },
  {
    businessId: "demo-8",
    businessName: "Sunset Grill & Bar",
    fiveStarCount: 432,
    totalReviews: 598,
    totalStars: 4.1,
  },
];

const FiveStarBusinesses = ({ onBack }) => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const chartRef = useRef(null);

  const handleGoBack = () => {
    if (onBack) onBack();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Request timeout")), 5000);
        });

        const apiPromise = fetch(
          "http://192.168.37.177:5001/api/rating/top-five-star"
        ).then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        });

        const data = await Promise.race([apiPromise, timeoutPromise]);

        setBusinesses(data);
        setLoading(false);
      } catch (err) {
        console.log(err.message);
        setBusinesses(demoData);
        setLoading(false);
        setError(null);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (businesses.length > 0 && chartRef.current) {
      createBarChart();
    }
  }, [businesses]);

  const createBarChart = () => {
    d3.select(chartRef.current).selectAll("*").remove();

    const margin = { top: 40, right: 30, bottom: 90, left: 80 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(businesses.map((d) => d.businessName))
      .range([0, width])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(businesses, (d) => d.fiveStarCount) * 1.1])
      .range([height, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "12px");

    svg
      .append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "12px");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("x", -height / 2)
      .attr("text-anchor", "middle")
      .text("Number of Five-Star Reviews")
      .style("font-size", "14px")
      .style("font-weight", "bold");

    const colorScale = d3
      .scaleLinear()
      .domain([
        d3.min(businesses, (d) => d.fiveStarCount),
        d3.max(businesses, (d) => d.fiveStarCount),
      ])
      .range(["#60a5fa", "#3730a3"]);

    svg
      .selectAll(".bar")
      .data(businesses)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.businessName))
      .attr("width", x.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .attr("fill", (d) => colorScale(d.fiveStarCount))
      .attr("rx", 4)
      .attr("ry", 4)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.8);
        setSelectedBusiness(d);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);
        setSelectedBusiness(null);
      })
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .attr("y", (d) => y(d.fiveStarCount))
      .attr("height", (d) => height - y(d.fiveStarCount));

    svg
      .selectAll(".label")
      .data(businesses)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.businessName) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.fiveStarCount) - 10)
      .attr("text-anchor", "middle")
      .text((d) => d.fiveStarCount)
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "#4b5563")
      .style("opacity", 0)
      .transition()
      .duration(800)
      .delay((d, i) => i * 100 + 300)
      .style("opacity", 1);
  };

  const calculatePercentage = (business) => {
    return ((business.fiveStarCount / business.totalReviews) * 100).toFixed(1);
  };

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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 relative">
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
        <ArrowLeft className="text-gray-700 text-lg" />
        <span className="text-gray-700 font-medium">Back to Dashboard</span>
      </button>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-indigo-800 mb-2">
            Top Businesses with Most Five-Star Ratings
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the restaurants and businesses that have received the
            highest number of five-star reviews
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-6 mb-10">
          <div ref={chartRef} className="w-full overflow-x-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business, index) => (
            <div
              key={business.businessId}
              className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                selectedBusiness?.businessId === business.businessId
                  ? "ring-2 ring-blue-500"
                  : ""
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                    {business.businessName}
                  </h3>
                  <div className="flex items-center bg-indigo-100 px-3 py-1 rounded-full">
                    <svg
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 font-bold text-indigo-800">
                      {business.totalStars}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Five-Star Reviews:</span>
                    <span className="font-bold text-indigo-700">
                      {business.fiveStarCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Reviews:</span>
                    <span className="font-medium">
                      {business.totalReviews.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Five-Star Percentage:</span>
                    <span className="font-medium text-green-600">
                      {calculatePercentage(business)}%
                    </span>
                  </div>

                  <div className="pt-2">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                            Five-Star Ratio
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                        <div
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-1000 ease-out"
                          style={{
                            width: `${calculatePercentage(business)}%`,
                            transitionDelay: `${0.5 + index * 0.1}s`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FiveStarBusinesses;
