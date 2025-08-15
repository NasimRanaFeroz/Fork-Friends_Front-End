import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { IoArrowBack } from "react-icons/io5";

const CommonWords = ({ onBack }) => {
  const [commonWords, setCommonWords] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  const demoData = {
    results: [
      { _id: "good", count: 1284567 },
      { _id: "great", count: 1156890 },
      { _id: "food", count: 987432 },
      { _id: "place", count: 876543 },
      { _id: "service", count: 765432 },
      { _id: "time", count: 698745 },
      { _id: "really", count: 623456 },
      { _id: "love", count: 578923 },
      { _id: "nice", count: 534567 },
      { _id: "staff", count: 489234 },
      { _id: "experience", count: 445678 },
      { _id: "amazing", count: 398765 },
      { _id: "delicious", count: 356789 },
      { _id: "location", count: 323456 },
      { _id: "atmosphere", count: 289345 },
      { _id: "recommend", count: 267834 },
      { _id: "quality", count: 245678 },
      { _id: "customer", count: 223456 },
      { _id: "friendly", count: 198765 },
      { _id: "excellent", count: 176543 },
    ],
    metadata: {
      sampleSize: 2500000,
      processedAt: new Date().toISOString(),
      executionTimeMs: 1847,
    },
  };

  const handleGoBack = () => {
    if (onBack) onBack();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // const response = await fetch(
        //   "http://192.168.37.177:5001/api/review/top-20-common-words"
        // );
        //
        // if (!response.ok) {
        //   throw new Error("Failed to fetch data");
        // }
        //
        // const data = await response.json();

        setTimeout(() => {
          setCommonWords(demoData.results);
          setMetadata(demoData.metadata);
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
    if (commonWords.length > 0 && chartRef.current) {
      createBarChart();
    }
  }, [commonWords]);

  const createBarChart = () => {
    d3.select(chartRef.current).selectAll("*").remove();

    const margin = { top: 40, right: 30, bottom: 120, left: 100 };
    const width = 800 - margin.left - margin.right;
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
      .range([0, width])
      .domain(commonWords.map((d) => d._id))
      .padding(0.2);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "14px")
      .style("fill", "#4B5563")
      .style("font-weight", "bold");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 30)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("fill", "#1F2937")
      .style("font-weight", "bold")
      .text("Words");

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(commonWords, (d) => d.count) * 1.1])
      .range([height, 0]);

    svg
      .append("g")
      .call(d3.axisLeft(y).tickFormat((d) => d3.format(",")(d)))
      .selectAll("text")
      .style("font-size", "14px")
      .style("fill", "#4B5563");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -(height / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("fill", "#1F2937")
      .style("font-weight", "bold")
      .text("Frequency");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .style("fill", "#1F2937")
      .text("Top 20 Most Common Words in Reviews");

    svg
      .append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y).tickSize(-width).tickFormat(""))
      .style("stroke", "#E5E7EB")
      .style("stroke-opacity", "0.7")
      .style("shape-rendering", "crispEdges");

    const colorScale = d3
      .scaleSequential()
      .domain([0, commonWords.length - 1])
      .interpolator(d3.interpolateInferno);

    svg
      .selectAll("bar")
      .data(commonWords)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d._id))
      .attr("width", x.bandwidth())
      .attr("fill", (d, i) => colorScale(i))
      .attr("y", height)
      .attr("height", 0)
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .attr("y", (d) => y(d.count))
      .attr("height", (d) => height - y(d.count));

    setTimeout(() => {
      svg
        .selectAll("rect")
        .on("mouseover", function (event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("opacity", 0.8)
            .attr("stroke", "#000")
            .attr("stroke-width", 2);

          const tooltip = svg
            .append("g")
            .attr("class", "tooltip")
            .attr("id", "tooltip");

          tooltip
            .append("rect")
            .attr("x", x(d._id) + x.bandwidth() / 2 - 70)
            .attr("y", y(d.count) - 40)
            .attr("width", 140)
            .attr("height", 30)
            .attr("fill", "rgba(0,0,0,0.7)")
            .attr("rx", 5);

          tooltip
            .append("text")
            .attr("x", x(d._id) + x.bandwidth() / 2)
            .attr("y", y(d.count) - 20)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("fill", "white")
            .text(`${d.count.toLocaleString()}`);
        })
        .on("mouseout", function () {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("opacity", 1)
            .attr("stroke", "none");

          d3.select("#tooltip").remove();
        });

      svg
        .selectAll(".count-label")
        .data(commonWords)
        .enter()
        .append("text")
        .attr("class", "count-label")
        .attr("x", (d) => x(d._id) + x.bandwidth() / 2)
        .attr("y", (d) => y(d.count) - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "0px")
        .style("fill", "#fff")
        .style("font-weight", "bold")
        .text((d) => d3.format(",")(d.count))
        .transition()
        .delay((d, i) => 1000 + i * 50)
        .duration(500)
        .style("font-size", "10px");
    }, commonWords.length * 100 + 800);
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
      <div
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md motion-safe:animate-fadeIn"
        role="alert"
      >
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-gray-50 to-indigo-50 relative">
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

      <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800 motion-safe:animate-bounce">
        Top 20 Most Common Words in Reviews
      </h1>

      {metadata && (
        <div className="bg-white p-6 mb-8 rounded-lg shadow-lg transform transition duration-500 motion-safe:hover:scale-[1.01]">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
            Analysis Metadata
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-lg shadow-md text-white transform transition duration-300 hover:scale-105">
              <p className="text-indigo-100 text-sm uppercase tracking-wider">
                Sample Size
              </p>
              <p className="text-2xl font-bold">
                {metadata.sampleSize.toLocaleString()}
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-lg shadow-md text-white transform transition duration-300 hover:scale-105">
              <p className="text-pink-100 text-sm uppercase tracking-wider">
                Processed At
              </p>
              <p className="text-lg font-medium">
                {new Date(metadata.processedAt).toLocaleString()}
              </p>
            </div>
            <div className="bg-gradient-to-r from-pink-500 to-indigo-500 p-4 rounded-lg shadow-md text-white transform transition duration-300 hover:scale-105">
              <p className="text-indigo-100 text-sm uppercase tracking-wider">
                Execution Time
              </p>
              <p className="text-2xl font-bold">
                {(metadata.executionTimeMs / 1000).toFixed(2)} seconds
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition duration-500 motion-safe:hover:shadow-2xl">
          <div className="bg-indigo-600 text-white p-4">
            <h2 className="text-xl font-bold">Word Frequency Table</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Rank
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Word
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Count
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {commonWords.map((word, index) => (
                  <tr
                    key={word._id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-indigo-50 transition-colors duration-150`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-700 font-semibold">
                      {word._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                      {word.count.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {metadata &&
                        ((word.count / metadata.sampleSize) * 100).toFixed(2)}
                      %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-6 transform transition duration-500 motion-safe:hover:shadow-2xl">
          <div ref={chartRef} className="w-full overflow-x-auto"></div>
        </div>
      </div>

      <div className="hidden">
        <div className="animate-pulse animate-bounce animate-spin"></div>
      </div>
    </div>
  );
};

export default CommonWords;
