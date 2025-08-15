import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { IoArrowBack } from "react-icons/io5";

const PositiveWords = ({ onBack }) => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeWord, setActiveWord] = useState(null);
  const chartRef = useRef(null);

  const demoData = [
    { _id: "great", count: 156789 },
    { _id: "excellent", count: 143265 },
    { _id: "amazing", count: 132456 },
    { _id: "tasty", count: 118743 },
    { _id: "wonderful", count: 105632 },
    { _id: "perfect", count: 94587 },
    { _id: "outstanding", count: 83421 },
    { _id: "awesome", count: 76543 },
    { _id: "superb", count: 68765 },
    { _id: "delicious", count: 61234 },
  ];

  const handleGoBack = () => {
    if (onBack) onBack();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch(
        //   "http://192.168.37.177:5001/api/review/top-10-positive-words"
        // );
        // if (!response.ok) {
        //   throw new Error("Network response was not ok");
        // }
        // const data = await response.json();

        setTimeout(() => {
          setWords(demoData);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (words.length > 0 && chartRef.current) {
      createHorizontalBarChart();
    }
  }, [words, activeWord]);

  const createHorizontalBarChart = () => {
    d3.select(chartRef.current).selectAll("*").remove();

    const margin = { top: 50, right: 150, bottom: 50, left: 150 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`
      )
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("width", "100%")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "bar-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#4F46E5");

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#8B5CF6");

    const y = d3
      .scaleBand()
      .range([0, height])
      .domain(words.map((d) => d._id))
      .padding(0.3);

    const yAxis = svg.append("g").call(d3.axisLeft(y));

    yAxis
      .selectAll("text")
      .style("font-size", "16px")
      .style("font-weight", "600")
      .style("fill", "#1F2937")
      .attr("dy", "0.32em");

    yAxis
      .selectAll("line")
      .style("stroke", "#9CA3AF")
      .style("stroke-width", "1.5px");

    yAxis
      .selectAll("path")
      .style("stroke", "#9CA3AF")
      .style("stroke-width", "1.5px");

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(words, (d) => d.count) * 1.1])
      .range([0, width]);

    const xAxis = svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickFormat((d) => d3.format(",")(d))
      );

    xAxis
      .selectAll("text")
      .style("font-size", "14px")
      .style("font-weight", "600")
      .style("fill", "#1F2937")
      .attr("dy", "1em");

    xAxis
      .selectAll("line")
      .style("stroke", "#9CA3AF")
      .style("stroke-width", "1.5px");

    xAxis
      .selectAll("path")
      .style("stroke", "#9CA3AF")
      .style("stroke-width", "1.5px");

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .text("Word Count")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", "#4B5563");

    const bars = svg
      .selectAll("myRect")
      .data(words)
      .enter()
      .append("rect")
      .attr("y", (d) => y(d._id))
      .attr("height", y.bandwidth())
      .attr("x", 0)
      .attr("width", 0)
      .attr("fill", "url(#bar-gradient)")
      .attr("rx", 6)
      .attr("ry", 6)
      .style("filter", (d) =>
        activeWord === d._id
          ? "drop-shadow(0 0 10px rgba(79, 70, 229, 0.7))"
          : "none"
      )
      .style("opacity", (d) =>
        activeWord === d._id || activeWord === null ? 1 : 0.5
      )
      .on("mouseover", function (event, d) {
        setActiveWord(d._id);
        d3.select(this)
          .transition()
          .duration(300)
          .attr("height", y.bandwidth() * 1.1)
          .attr("y", (d) => y(d._id) - y.bandwidth() * 0.05);
      })
      .on("mouseout", function () {
        setActiveWord(null);
        d3.select(this)
          .transition()
          .duration(300)
          .attr("height", y.bandwidth())
          .attr("y", (d) => y(d._id));
      });

    bars
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .attr("width", (d) => x(d.count))
      .ease(d3.easeBounceOut);

    svg
      .selectAll(".count-label")
      .data(words)
      .enter()
      .append("text")
      .attr("class", "count-label")
      .attr("x", (d) => x(d.count) + 10)
      .attr("y", (d) => y(d._id) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("opacity", 0)
      .text((d) => d3.format(",")(d.count))
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", "#1F2937")
      .transition()
      .duration(1000)
      .delay((d, i) => 1000 + i * 100)
      .attr("opacity", 1);

    const totalCount = words.reduce((sum, w) => sum + w.count, 0);
    svg
      .selectAll(".percentage-label")
      .data(words)
      .enter()
      .append("text")
      .attr("class", "percentage-label")
      .attr("x", (d) => x(d.count) + 10)
      .attr("y", (d) => y(d._id) + y.bandwidth() / 2)
      .attr("dy", "1.5em")
      .attr("opacity", 0)
      .text((d) => `(${((d.count / totalCount) * 100).toFixed(1)}%)`)
      .style("font-size", "14px")
      .style("fill", "#6B7280")
      .transition()
      .duration(1000)
      .delay((d, i) => 1200 + i * 100)
      .attr("opacity", 1);

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .style("fill", "#4F46E5")
      .attr("opacity", 0)
      .text("Top 10 Positive Words in Reviews")
      .transition()
      .duration(1000)
      .attr("opacity", 1);

    svg
      .append("path")
      .attr("d", `M0,${height + 2} L${width},${height + 2}`)
      .attr("stroke", "#E5E7EB")
      .attr("stroke-width", 3)
      .attr("stroke-dasharray", "5,5");

    svg
      .selectAll("grid-line")
      .data(x.ticks(5))
      .enter()
      .append("line")
      .attr("x1", (d) => x(d))
      .attr("x2", (d) => x(d))
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke", "#E5E7EB")
      .attr("stroke-width", 0.5)
      .style("opacity", 0)
      .transition()
      .duration(500)
      .delay((d, i) => 1500 + i * 100)
      .style("opacity", 0.5);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full border-l-4 border-red-500 animate-fadeIn">
          <div className="flex items-center">
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-gray-800">
                Error Loading Data
              </h3>
              <p className="text-gray-600 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative">
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
        <span className="text-gray-700 font-medium">Back to Dashboard</span>
      </button>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-6 px-8">
            <h1 className="text-3xl font-bold text-white text-center">
              <span className="inline-block animate-bounce mr-2">📊</span>
              Word Frequency Analysis
            </h1>
            <p className="text-indigo-100 text-center mt-2">
              Visualizing the most common positive words in our reviews
            </p>
          </div>

          <div className="p-6 mb-8">
            <div ref={chartRef} className="w-full overflow-x-auto"></div>
          </div>

          <div className="px-6 pb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Word Statistics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 shadow transform transition-all duration-300 hover:scale-105">
                <h3 className="text-indigo-700 font-medium text-sm">
                  Total Words
                </h3>
                <p className="text-3xl font-bold text-indigo-900">
                  {words.reduce((sum, w) => sum + w.count, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 shadow transform transition-all duration-300 hover:scale-105">
                <h3 className="text-purple-700 font-medium text-sm">
                  Most Common Word
                </h3>
                <p className="text-3xl font-bold text-purple-900">
                  {words.length > 0 ? words[0]._id : ""}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow transform transition-all duration-300 hover:scale-105">
                <h3 className="text-blue-700 font-medium text-sm">
                  Highest Count
                </h3>
                <p className="text-3xl font-bold text-blue-900">
                  {words.length > 0 ? words[0].count.toLocaleString() : ""}
                </p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 shadow transform transition-all duration-300 hover:scale-105">
                <h3 className="text-pink-700 font-medium text-sm">
                  Average Count
                </h3>
                <p className="text-3xl font-bold text-pink-900">
                  {words.length > 0
                    ? Math.round(
                        words.reduce((sum, w) => sum + w.count, 0) /
                          words.length
                      ).toLocaleString()
                    : ""}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 pb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Detailed Word Data
            </h2>
            <div className="overflow-x-auto bg-white rounded-xl shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-600 to-purple-600">
                    <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Word
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Count
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Visualization
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {words.map((word, index) => {
                    const totalCount = words.reduce(
                      (sum, w) => sum + w.count,
                      0
                    );
                    const percentage = (
                      (word.count / totalCount) *
                      100
                    ).toFixed(2);
                    const maxCount = Math.max(...words.map((w) => w.count));
                    const widthPercentage = (word.count / maxCount) * 100;

                    return (
                      <tr
                        key={word._id}
                        className={`hover:bg-indigo-50 transition-colors duration-150 ${
                          activeWord === word._id ? "bg-indigo-50" : ""
                        }`}
                        onMouseEnter={() => setActiveWord(word._id)}
                        onMouseLeave={() => setActiveWord(null)}
                      >
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                              index < 3
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 text-gray-800"
                            } font-bold text-sm`}
                          >
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-lg font-medium text-gray-900">
                          {word._id}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-lg text-gray-700">
                          {word.count.toLocaleString()}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-lg text-gray-700">
                          {percentage}%
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${widthPercentage}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Data refreshed on {new Date().toLocaleDateString()} |
              <span className="text-indigo-600 ml-1">
                Word Frequency Analysis Tool
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositiveWords;
