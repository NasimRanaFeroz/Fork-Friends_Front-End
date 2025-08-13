import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { ArrowLeft } from "lucide-react";

const CityTopMerchants = ({ onBack }) => {
  const chartRef = useRef(null);
  const [merchantData, setMerchantData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("rating");
  const [usingDemoData, setUsingDemoData] = useState(false);

  const demoData = [
    {
      city: "New York",
      state: "NY",
      topMerchants: [
        {
          name: "Manhattan Bistro",
          overallRating: 4.8,
          totalReviews: 2547,
        },
      ],
    },
    {
      city: "Los Angeles",
      state: "CA",
      topMerchants: [
        {
          name: "Sunset Grill",
          overallRating: 4.6,
          totalReviews: 1893,
        },
      ],
    },
    {
      city: "Chicago",
      state: "IL",
      topMerchants: [
        {
          name: "Deep Dish Palace",
          overallRating: 4.7,
          totalReviews: 3241,
        },
      ],
    },
    {
      city: "Miami",
      state: "FL",
      topMerchants: [
        {
          name: "Ocean View Cafe",
          overallRating: 4.5,
          totalReviews: 1654,
        },
      ],
    },
    {
      city: "Seattle",
      state: "WA",
      topMerchants: [
        {
          name: "Coffee Corner",
          overallRating: 4.9,
          totalReviews: 2987,
        },
      ],
    },
    {
      city: "Austin",
      state: "TX",
      topMerchants: [
        {
          name: "BBQ Central",
          overallRating: 4.4,
          totalReviews: 1432,
        },
      ],
    },
  ];

  const handleGoBack = () => {
    if (onBack) onBack();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(
            () => reject(new Error("Request timeout after 5 seconds")),
            5000
          );
        });

        const fetchPromise = fetch(
          "http://192.168.37.177:5001/api/comprehensive/city-top-merchants"
        );

        const response = await Promise.race([fetchPromise, timeoutPromise]);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        if (!Array.isArray(result) || result.length === 0) {
          throw new Error("Invalid data format received from API");
        }

        setMerchantData(result);
        setUsingDemoData(false);
        setLoading(false);
      } catch (err) {
        console.warn(
          "Backend not available, switching to demo data:",
          err.message
        );
        setMerchantData(demoData);
        setUsingDemoData(true);
        setError(null);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (merchantData.length > 0 && chartRef.current) {
      createVisualization();
    }
  }, [merchantData, sortBy]);

  const sortData = () => {
    let sortedData = [...merchantData];

    switch (sortBy) {
      case "rating":
        sortedData.sort(
          (a, b) =>
            b.topMerchants[0].overallRating - a.topMerchants[0].overallRating
        );
        break;
      case "reviews":
        sortedData.sort(
          (a, b) =>
            b.topMerchants[0].totalReviews - a.topMerchants[0].totalReviews
        );
        break;
      case "alphabetical":
        sortedData.sort((a, b) => a.city.localeCompare(b.city));
        break;
      default:
        break;
    }

    return sortedData;
  };

  const createVisualization = () => {
    d3.select(chartRef.current).selectAll("*").remove();

    const sortedData = sortData();

    const margin = { top: 60, right: 120, bottom: 150, left: 60 };
    const width = 1000 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#f0f4ff")
      .attr("rx", 8)
      .attr("ry", 8);

    const x = d3
      .scaleBand()
      .domain(sortedData.map((d) => d.city))
      .range([0, width])
      .padding(0.3);

    const y = d3.scaleLinear().domain([0, 5.5]).range([height, 0]);

    svg
      .selectAll("grid-lines")
      .data([0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5])
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", (d) => y(d))
      .attr("y2", (d) => y(d))
      .attr("stroke", "#e2e8f0")
      .attr("stroke-width", 1);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "12px")
      .style("font-family", "Arial")
      .style("fill", "#4a5568");

    svg
      .append("g")
      .call(d3.axisLeft(y).ticks(10))
      .selectAll("text")
      .style("font-size", "12px")
      .style("font-family", "Arial")
      .style("fill", "#4a5568");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -height / 2)
      .attr("text-anchor", "middle")
      .text("Rating")
      .style("fill", "#2d3748")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("font-family", "Arial");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .text("Top Merchants by City Rating")
      .style("fill", "#1a202c")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .style("font-family", "Arial");

    const colorScale = d3
      .scaleLinear()
      .domain([1, 5])
      .range(["#cbd5e0", "#4c51bf"]);

    const tooltip = d3
      .select(chartRef.current)
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #ddd")
      .style("border-radius", "8px")
      .style("padding", "12px")
      .style("box-shadow", "0 4px 6px rgba(0, 0, 0, 0.1)")
      .style("pointer-events", "none")
      .style("font-family", "Arial")
      .style("font-size", "14px")
      .style("z-index", 10);

    svg
      .selectAll(".bar")
      .data(sortedData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.city))
      .attr("width", x.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .attr("fill", (d) => colorScale(d.topMerchants[0].overallRating))
      .attr("rx", 4)
      .attr("ry", 4)
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration(300).attr("fill", "#667eea");

        tooltip.transition().duration(200).style("opacity", 0.9);

        tooltip
          .html(
            `
          <div style="font-weight: bold; margin-bottom: 8px; font-size: 16px;">${d.city}, ${d.state}</div>
          <div style="margin-bottom: 4px;"><b>Merchant:</b> ${d.topMerchants[0].name}</div>
          <div style="margin-bottom: 4px;"><b>Rating:</b> ${d.topMerchants[0].overallRating} ⭐</div>
          <div><b>Reviews:</b> ${d.topMerchants[0].totalReviews}</div>
        `
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition()
          .duration(300)
          .attr("fill", (d) => colorScale(d.topMerchants[0].overallRating));

        tooltip.transition().duration(500).style("opacity", 0);
      })
      .transition()
      .duration(800)
      .delay((d, i) => i * 50)
      .attr("y", (d) => y(d.topMerchants[0].overallRating))
      .attr("height", (d) => height - y(d.topMerchants[0].overallRating))
      .ease(d3.easeBounce);

    svg
      .selectAll(".rating-label")
      .data(sortedData)
      .enter()
      .append("text")
      .attr("class", "rating-label")
      .attr("x", (d) => x(d.city) + x.bandwidth() / 2)
      .attr("y", height)
      .attr("text-anchor", "middle")
      .style("font-size", "0px")
      .style("font-weight", "bold")
      .style("font-family", "Arial")
      .style("fill", "#fff")
      .text((d) => d.topMerchants[0].overallRating)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 50 + 400)
      .attr("y", (d) => y(d.topMerchants[0].overallRating) + 20)
      .style("font-size", "12px");

    const legendData = [
      { label: "5.0 ⭐⭐⭐⭐⭐", value: 5 },
      { label: "4.0 ⭐⭐⭐⭐", value: 4 },
      { label: "3.0 ⭐⭐⭐", value: 3 },
      { label: "2.0 ⭐⭐", value: 2 },
      { label: "1.0 ⭐", value: 1 },
    ];

    const legend = svg
      .append("g")
      .attr("transform", `translate(${width + 20}, 20)`);

    legend
      .selectAll("rect")
      .data(legendData)
      .enter()
      .append("rect")
      .attr("y", (d, i) => i * 25)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", (d) => colorScale(d.value))
      .attr("rx", 2)
      .attr("ry", 2);

    legend
      .selectAll("text")
      .data(legendData)
      .enter()
      .append("text")
      .attr("x", 25)
      .attr("y", (d, i) => i * 25 + 12)
      .text((d) => d.label)
      .style("font-size", "12px")
      .style("font-family", "Arial")
      .style("fill", "#4a5568");

    legend
      .append("text")
      .attr("x", 0)
      .attr("y", -10)
      .text("Rating Legend")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("font-family", "Arial")
      .style("fill", "#2d3748");
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className="text-yellow-500">
          ★
        </span>
      );
    }

    if (halfStar) {
      stars.push(
        <span key="half" className="text-yellow-500">
          ★
        </span>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">
          ☆
        </span>
      );
    }

    return stars;
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

  if (error && !usingDemoData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">Error: {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-5 font-sans relative">
      <button
        onClick={handleGoBack}
        className="absolute top-5 left-5 flex items-center gap-2 py-2 px-4 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-all duration-300 z-10 opacity-100"
        aria-label="Back to Business Analysis Dashboard"
      >
        <ArrowLeft className="text-gray-700" size={18} />
        <span className="text-gray-700 font-medium">Back</span>
      </button>

      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-800 mt-16">
        Top Merchants by City
      </h1>

      <div className="mb-6 flex justify-end space-x-4">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setSortBy("rating")}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              sortBy === "rating"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Sort by Rating
          </button>
          <button
            onClick={() => setSortBy("reviews")}
            className={`px-4 py-2 text-sm font-medium ${
              sortBy === "reviews"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Sort by Reviews
          </button>
          <button
            onClick={() => setSortBy("alphabetical")}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              sortBy === "alphabetical"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Sort Alphabetically
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <div ref={chartRef} className="mt-4 overflow-x-auto"></div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
          Detailed Merchant Data
        </h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  City
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  State
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Merchant Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Rating
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Reviews
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortData().map((cityData, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {cityData.city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cityData.state}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cityData.topMerchants[0].name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <div className="flex items-center justify-center">
                      {renderStars(cityData.topMerchants[0].overallRating)}
                      <span className="ml-1">
                        ({cityData.topMerchants[0].overallRating})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {cityData.topMerchants[0].totalReviews}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CityTopMerchants;
