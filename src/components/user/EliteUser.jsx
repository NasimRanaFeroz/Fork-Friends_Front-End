import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as d3 from "d3";
import { motion } from "framer-motion";
import { IoArrowBack } from "react-icons/io5";

const EliteUser = ({ onBack }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("chart");
  const chartRef = useRef(null);

  const demoData = [
    {
      year: 2005,
      regularUsers: 1250,
      eliteUsers: 0,
      ratio: 0,
    },
    {
      year: 2006,
      regularUsers: 3420,
      eliteUsers: 0,
      ratio: 0,
    },
    {
      year: 2007,
      regularUsers: 7850,
      eliteUsers: 0,
      ratio: 0,
    },
    {
      year: 2008,
      regularUsers: 15680,
      eliteUsers: 0,
      ratio: 0,
    },
    {
      year: 2009,
      regularUsers: 18920,
      eliteUsers: 0,
      ratio: 0,
    },
    {
      year: 2010,
      regularUsers: 22340,
      eliteUsers: 0,
      ratio: 0,
    },
    {
      year: 2011,
      regularUsers: 25760,
      eliteUsers: 0,
      ratio: 0,
    },
    {
      year: 2012,
      regularUsers: 28450,
      eliteUsers: 0,
      ratio: 0,
    },
    {
      year: 2013,
      regularUsers: 30120,
      eliteUsers: 0,
      ratio: 0,
    },
    {
      year: 2014,
      regularUsers: 31097,
      eliteUsers: 0,
      ratio: 0,
    },
  ];

  const handleGoBack = () => {
    if (onBack) onBack();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // const response = await axios.get(
        //   "http://192.168.37.177:5001/api/user/elite-to-regular-ratio"
        // );
        // setData(response.data);

        setTimeout(() => {
          setData(demoData);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to fetch user ratio data");
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0 && !loading && activeTab === "chart") {
      drawChart();
    }
  }, [data, loading, activeTab]);

  const drawChart = () => {
    d3.select(chartRef.current).selectAll("*").remove();

    const margin = { top: 40, right: 80, bottom: 60, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.year))
      .range([0, width])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.regularUsers) * 1.1])
      .range([height, 0]);

    const defs = svg.append("defs");

    const regularGradient = defs
      .append("linearGradient")
      .attr("id", "regularGradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    regularGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#3B82F6")
      .attr("stop-opacity", 1);

    regularGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#1D4ED8")
      .attr("stop-opacity", 1);

    const eliteGradient = defs
      .append("linearGradient")
      .attr("id", "eliteGradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    eliteGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#F59E0B")
      .attr("stop-opacity", 1);

    eliteGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#D97706")
      .attr("stop-opacity", 1);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "14px")
      .style("font-weight", "500")
      .style("fill", "#4B5563");

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .style("font-size", "14px")
      .style("font-weight", "600")
      .style("fill", "#374151")
      .text("Year");

    svg
      .append("g")
      .call(
        d3
          .axisLeft(y)
          .tickFormat((d) => d3.format(",")(d))
          .ticks(8)
      )
      .selectAll("text")
      .style("font-size", "14px")
      .style("font-weight", "500")
      .style("fill", "#4B5563");

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .style("font-size", "14px")
      .style("font-weight", "600")
      .style("fill", "#374151")
      .text("Number of Users");

    svg
      .append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y).tickSize(-width).tickFormat("").ticks(8))
      .style("stroke", "#E5E7EB")
      .style("stroke-opacity", 0.7);

    svg
      .selectAll(".bar-regular")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar-regular")
      .attr("x", (d) => x(d.year))
      .attr("width", x.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .attr("fill", "url(#regularGradient)")
      .attr("rx", 4)
      .attr("ry", 4)
      .transition()
      .duration(800)
      .delay((d, i) => i * 150)
      .attr("y", (d) => y(d.regularUsers))
      .attr("height", (d) => height - y(d.regularUsers));

    svg
      .selectAll(".label-regular")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label-regular")
      .attr("x", (d) => x(d.year) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.regularUsers) - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "0px")
      .style("font-weight", "bold")
      .style("fill", "#2563EB")
      .text((d) => d3.format(",")(d.regularUsers))
      .transition()
      .duration(800)
      .delay((d, i) => 800 + i * 150)
      .style("font-size", "12px");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .style("fill", "#1F2937")
      .text("User Growth by Year");

    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 120}, 0)`);

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", "url(#regularGradient)")
      .attr("rx", 3)
      .attr("ry", 3);

    legend
      .append("text")
      .attr("x", 25)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("font-size", "14px")
      .style("fill", "#4B5563")
      .text("Regular Users");
  };

  const StatCard = ({ title, value, icon, color }) => {
    return (
      <motion.div
        className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${color}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div
            className={`p-3 rounded-full ${color
              .replace("border-", "bg-")
              .replace("-500", "-100")}`}
          >
            {icon}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-5 font-sans relative">
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

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl text-center font-bold text-gray-800">
          Elite User Analysis
        </h1>
        <p className="text-gray-600 mt-2 text-center">
          Tracking the growth of regular users and preparing for elite user
          integration
        </p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading data...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 my-4">
          <strong>Error:</strong> {error}
        </div>
      ) : (
        <div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            <StatCard
              title="Total Regular Users"
              value={<span className="text-blue-600">31,097</span>}
              icon={
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                </svg>
              }
              color="border-black-500"
            />
            <StatCard
              title="Elite Users"
              value={<span className="text-amber-600">Coming Soon</span>}
              icon={
                <svg
                  className="w-6 h-6 text-amber-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              }
              color="border-amber-500"
            />
            <StatCard
              title="Year-over-Year Growth"
              value={<span className="text-emerald-600">103.4%</span>}
              icon={
                <svg
                  className="w-6 h-6 text-emerald-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              }
              color="border-emerald-500"
            />
            <StatCard
              title="Latest Data Year"
              value={<span className="text-purple-600">2022</span>}
              icon={
                <svg
                  className="w-6 h-6 text-purple-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              }
              color="border-purple-500"
            />
          </motion.div>
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                activeTab === "chart"
                  ? "text-blue-600 border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("chart")}
            >
              Chart View
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                activeTab === "table"
                  ? "text-blue-600 border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("table")}
            >
              Table View
            </button>
          </div>

          {activeTab === "chart" && (
            <motion.div
              className="bg-white p-6 rounded-xl shadow-md mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <svg ref={chartRef} className="w-full h-auto"></svg>
            </motion.div>
          )}

          {activeTab === "table" && (
            <motion.div
              className="bg-white rounded-xl shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Regular Users
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Elite Users
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Elite/Regular Ratio
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item, index) => (
                    <motion.tr
                      key={item.year}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {d3.format(",")(item.regularUsers)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Coming Soon
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        0%
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <motion.div
              className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-md border border-blue-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                About Regular Users
              </h3>
              <p className="text-blue-700">
                Regular users form the foundation of our platform. The data
                shows consistent growth year over year, with a significant
                increase from 2006 to 2008.
              </p>
              <div className="mt-4 flex items-center">
                <svg
                  className="w-5 h-5 text-blue-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="text-sm text-blue-700">
                  Total growth of{" "}
                  {data.length > 0
                    ? (
                        (data[data.length - 1].regularUsers /
                          data[0].regularUsers) *
                        100
                      ).toFixed(0)
                    : 0}
                  x since {data.length > 0 ? data[0].year : "N/A"}
                </span>
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl shadow-md border border-amber-100"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-lg font-semibold text-amber-800 mb-3">
                Elite User Program
              </h3>
              <p className="text-amber-700">
                Our Elite User Program is coming soon! Elite users will enjoy
                premium features, dedicated support, and exclusive content. Stay
                tuned for the official launch.
              </p>
              <div className="mt-4 flex items-center">
                <svg
                  className="w-5 h-5 text-amber-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="text-sm text-amber-700">
                  Launch expected in the next quarter
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EliteUser;
