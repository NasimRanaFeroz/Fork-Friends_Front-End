import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const NegativeWords = () => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeWord, setActiveWord] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/review/top-10-negative-words');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setWords(data.results); // Extract the results array from the response
        setLoading(false);
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
    // Clear any existing chart
    d3.select(chartRef.current).selectAll("*").remove();

    const margin = { top: 50, right: 150, bottom: 50, left: 150 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create SVG with responsive container
    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("width", "100%")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add gradient definition
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "bar-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#EF4444");

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#F87171");

    // Y axis (words)
    const y = d3.scaleBand()
      .range([0, height])
      .domain(words.map(d => d._id))
      .padding(0.3);
    
    // Add Y axis with enhanced text visibility
    const yAxis = svg.append("g")
      .call(d3.axisLeft(y));
    
    yAxis.selectAll("text")
      .style("font-size", "16px")
      .style("font-weight", "600")
      .style("fill", "#1F2937")
      .attr("dy", "0.32em");
    
    yAxis.selectAll("line")
      .style("stroke", "#9CA3AF")
      .style("stroke-width", "1.5px");
    
    yAxis.selectAll("path")
      .style("stroke", "#9CA3AF")
      .style("stroke-width", "1.5px");

    // X axis (counts)
    const x = d3.scaleLinear()
      .domain([0, d3.max(words, d => d.count) * 1.1])
      .range([0, width]);
    
    // Add X axis with enhanced text visibility
    const xAxis = svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => d3.format(",")(d)));
    
    xAxis.selectAll("text")
      .style("font-size", "14px")
      .style("font-weight", "600")
      .style("fill", "#1F2937")
      .attr("dy", "1em");
    
    xAxis.selectAll("line")
      .style("stroke", "#9CA3AF")
      .style("stroke-width", "1.5px");
    
    xAxis.selectAll("path")
      .style("stroke", "#9CA3AF")
      .style("stroke-width", "1.5px");

    // X axis label
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .text("Word Count")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", "#4B5563");

    // Add bars with animation
    const bars = svg.selectAll("myRect")
      .data(words)
      .enter()
      .append("rect")
      .attr("y", d => y(d._id))
      .attr("height", y.bandwidth())
      .attr("x", 0)
      .attr("width", 0) // Start with width 0 for animation
      .attr("fill", "url(#bar-gradient)")
      .attr("rx", 6)
      .attr("ry", 6)
      .style("filter", d => activeWord === d._id ? "drop-shadow(0 0 10px rgba(239, 68, 68, 0.7))" : "none")
      .style("opacity", d => activeWord === d._id || activeWord === null ? 1 : 0.5)
      .on("mouseover", function(event, d) {
        setActiveWord(d._id);
        d3.select(this)
          .transition()
          .duration(300)
          .attr("height", y.bandwidth() * 1.1)
          .attr("y", d => y(d._id) - (y.bandwidth() * 0.05));
      })
      .on("mouseout", function() {
        setActiveWord(null);
        d3.select(this)
          .transition()
          .duration(300)
          .attr("height", y.bandwidth())
          .attr("y", d => y(d._id));
      });

    // Animate bars on load
    bars.transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .attr("width", d => x(d.count))
      .ease(d3.easeBounceOut);

    // Add count labels
    svg.selectAll(".count-label")
      .data(words)
      .enter()
      .append("text")
      .attr("class", "count-label")
      .attr("x", d => x(d.count) + 10)
      .attr("y", d => y(d._id) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("opacity", 0)
      .text(d => d3.format(",")(d.count))
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", "#1F2937")
      .transition()
      .duration(1000)
      .delay((d, i) => 1000 + i * 100)
      .attr("opacity", 1);

    // Add percentage labels
    const totalCount = words.reduce((sum, w) => sum + w.count, 0);
    svg.selectAll(".percentage-label")
      .data(words)
      .enter()
      .append("text")
      .attr("class", "percentage-label")
      .attr("x", d => x(d.count) + 10)
      .attr("y", d => y(d._id) + y.bandwidth() / 2)
      .attr("dy", "1.5em")
      .attr("opacity", 0)
      .text(d => `(${((d.count / totalCount) * 100).toFixed(1)}%)`)
      .style("font-size", "14px")
      .style("fill", "#6B7280")
      .transition()
      .duration(1000)
      .delay((d, i) => 1200 + i * 100)
      .attr("opacity", 1);

    // Add title with animation
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .style("fill", "#EF4444")
      .attr("opacity", 0)
      .text("Top 10 Words in Negative Reviews")
      .transition()
      .duration(1000)
      .attr("opacity", 1);

    // Add decorative elements
    svg.append("path")
      .attr("d", `M0,${height + 2} L${width},${height + 2}`)
      .attr("stroke", "#E5E7EB")
      .attr("stroke-width", 3)
      .attr("stroke-dasharray", "5,5");

    // Add grid lines
    svg.selectAll("grid-line")
      .data(x.ticks(5))
      .enter()
      .append("line")
      .attr("x1", d => x(d))
      .attr("x2", d => x(d))
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
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-8 border-red-200 rounded-full animate-ping"></div>
          <div className="absolute top-0 left-0 w-full h-full border-8 border-t-red-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-red-700 font-medium animate-pulse">Loading word data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full border-l-4 border-red-500 animate-fadeIn">
          <div className="flex items-center">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-gray-800">Error Loading Data</h3>
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-orange-500 py-6 px-8">
            <h1 className="text-3xl font-bold text-white text-center">
              <span className="inline-block animate-bounce mr-2">📉</span>
              Negative Review Word Analysis
            </h1>
            <p className="text-red-100 text-center mt-2">Visualizing the most common words in negative reviews (rating ≤ 3)</p>
          </div>

          {/* Chart */}
          <div className="p-6 mb-8">
            <div ref={chartRef} className="w-full overflow-x-auto"></div>
          </div>

          {/* Stats Cards */}
          <div className="px-6 pb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Word Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 shadow transform transition-all duration-300 hover:scale-105">
                <h3 className="text-red-700 font-medium text-sm">Total Words</h3>
                <p className="text-3xl font-bold text-red-900">
                  {words.reduce((sum, w) => sum + w.count, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 shadow transform transition-all duration-300 hover:scale-105">
                <h3 className="text-orange-700 font-medium text-sm">Most Common Word</h3>
                <p className="text-3xl font-bold text-orange-900">
                  {words.length > 0 ? words[0]._id : ""}
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 shadow transform transition-all duration-300 hover:scale-105">
                <h3 className="text-amber-700 font-medium text-sm">Highest Count</h3>
                <p className="text-3xl font-bold text-amber-900">
                  {words.length > 0 ? words[0].count.toLocaleString() : ""}
                </p>
              </div>
              <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl p-4 shadow transform transition-all duration-300 hover:scale-105">
                <h3 className="text-rose-700 font-medium text-sm">Average Count</h3>
                <p className="text-3xl font-bold text-rose-900">
                  {words.length > 0 ? Math.round(words.reduce((sum, w) => sum + w.count, 0) / words.length).toLocaleString() : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="px-6 pb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Detailed Word Data</h2>
            <div className="overflow-x-auto bg-white rounded-xl shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-red-600 to-orange-500">
                    <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Rank</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Word</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Count</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Percentage</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Visualization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {words.map((word, index) => {
                    const totalCount = words.reduce((sum, w) => sum + w.count, 0);
                    const percentage = ((word.count / totalCount) * 100).toFixed(2);
                    const maxCount = Math.max(...words.map(w => w.count));
                    const widthPercentage = (word.count / maxCount) * 100;
                    
                    return (
                      <tr 
                        key={word._id} 
                        className={`hover:bg-red-50 transition-colors duration-150 ${
                          activeWord === word._id ? 'bg-red-50' : ''
                        }`}
                        onMouseEnter={() => setActiveWord(word._id)}
                        onMouseLeave={() => setActiveWord(null)}
                      >
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                            index < 3 ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-800'
                          } font-bold text-sm`}>
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
                              className="bg-gradient-to-r from-red-600 to-orange-500 h-2.5 rounded-full transition-all duration-500 ease-out"
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

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Data refreshed on {new Date().toLocaleDateString()} | 
              <span className="text-red-600 ml-1">Negative Review Analysis Tool</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NegativeWords;
