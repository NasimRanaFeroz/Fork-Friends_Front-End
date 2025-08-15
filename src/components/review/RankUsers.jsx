import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { IoArrowBack } from "react-icons/io5";

const ReviewsPerYear = ({ onBack }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const [activeYear, setActiveYear] = useState(null);

  const demoData = [
    { year: 2018, reviewCount: 1250 },
    { year: 2019, reviewCount: 1680 },
    { year: 2020, reviewCount: 2100 },
    { year: 2021, reviewCount: 1890 },
    { year: 2022, reviewCount: 2450 },
    { year: 2023, reviewCount: 2780 },
    { year: 2024, reviewCount: 3120 },
  ];

  const handleGoBack = () => {
    if (onBack) onBack();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch(
        //   "http://192.168.37.177:5001/api/review/rank-users-by-reviews"
        // );
        // if (!response.ok) {
        //   throw new Error("Network response was not ok");
        // }
        // const result = await response.json();

        // const formattedData = result.map((item) => ({
        //   year: item.year,
        //   reviewCount: item.topUsers[0].totalReviews,
        // }));

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setData(demoData);
        setLoading(false);
      } catch (error) {
        setError("Error fetching data: " + error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0 && chartRef.current) {
      createChart();
    }
  }, [data, activeYear]);

  const createChart = () => {
    d3.select(chartRef.current).selectAll("*").remove();

    const margin = { top: 50, right: 50, bottom: 100, left: 120 };
    const width = 1000 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const titleGradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "title-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    titleGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#4338ca");

    titleGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#6366f1");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .style("fill", "url(#title-gradient)")
      .text("Number of Reviews Per Year");

    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(
            d3
              .scaleBand()
              .range([0, width])
              .domain(data.map((d) => d.year))
          )
          .tickSize(-height)
          .tickFormat("")
      )
      .style("stroke-opacity", 0.1);

    svg
      .append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(
            d3
              .scaleLinear()
              .domain([0, d3.max(data, (d) => d.reviewCount) * 1.1])
              .range([height, 0])
          )
          .tickSize(-width)
          .tickFormat("")
      )
      .style("stroke-opacity", 0.1);

    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((d) => d.year))
      .padding(0.3);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(0,10)")
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold");

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 20)
      .text("Year")
      .style("font-size", "16px")
      .style("font-weight", "bold");

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.reviewCount) * 1.1])
      .range([height, 0]);

    svg
      .append("g")
      .call(
        d3
          .axisLeft(y)
          .tickFormat((d) => d3.format(",")(d))
          .ticks(10)
      )
      .selectAll("text")
      .style("font-size", "12px");

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 50)
      .attr("x", -height / 2)
      .text("Number of Reviews")
      .style("font-size", "16px")
      .style("font-weight", "bold");

    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "bar-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#4338ca");

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#6366f1");

    const hoverGradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "bar-hover-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    hoverGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#3730a3");

    hoverGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#4f46e5");

    svg
      .selectAll("bars")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.year))
      .attr("y", height)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", (d) =>
        activeYear === d.year
          ? "url(#bar-hover-gradient)"
          : "url(#bar-gradient)"
      )
      .attr("rx", 6)
      .attr("ry", 6)
      .attr("stroke", "#2a2a7c")
      .attr("stroke-width", (d) => (activeYear === d.year ? 2 : 0))
      .attr("stroke-opacity", 0.7)
      .on("mouseover", function (event, d) {
        setActiveYear(d.year);
        d3.select(this)
          .attr("fill", "url(#bar-hover-gradient)")
          .attr("stroke-width", 2)
          .transition()
          .duration(300)
          .attr("width", x.bandwidth() * 1.05)
          .attr("x", x(d.year) - x.bandwidth() * 0.025);
      })
      .on("mouseout", function (event, d) {
        setActiveYear(null);
        d3.select(this)
          .attr("fill", "url(#bar-gradient)")
          .attr("stroke-width", 0)
          .transition()
          .duration(300)
          .attr("width", x.bandwidth())
          .attr("x", x(d.year));
      })
      .transition()
      .duration(1000)
      .delay((d, i) => i * 200)
      .attr("y", (d) => y(d.reviewCount))
      .attr("height", (d) => height - y(d.reviewCount))
      .ease(d3.easeBounceOut);

    svg
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.year) + x.bandwidth() / 2)
      .attr("y", height)
      .attr("text-anchor", "middle")
      .text((d) => d3.format(",")(d.reviewCount))
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 200 + 500)
      .attr("y", (d) => y(d.reviewCount) - 15)
      .style("opacity", 1);

    data.forEach((d, i) => {
      if (i > 0) {
        const prevYear = data[i - 1];
        const change = d.reviewCount - prevYear.reviewCount;
        const percentChange = ((change / prevYear.reviewCount) * 100).toFixed(
          1
        );
        const isPositive = change > 0;

        svg
          .append("path")
          .attr(
            "d",
            d3
              .symbol()
              .type(isPositive ? d3.symbolTriangle : d3.symbolTriangle)
              .size(100)
          )
          .attr(
            "transform",
            `translate(${x(d.year) + x.bandwidth() / 2}, ${
              y(d.reviewCount) - 35
            }) ${isPositive ? "" : "rotate(180)"}`
          )
          .attr("fill", isPositive ? "#10b981" : "#ef4444")
          .style("opacity", 0)
          .transition()
          .duration(800)
          .delay(i * 200 + 1000)
          .style("opacity", 1);

        svg
          .append("text")
          .attr("x", x(d.year) + x.bandwidth() / 2)
          .attr("y", y(d.reviewCount) - 50)
          .attr("text-anchor", "middle")
          .text(`${isPositive ? "+" : ""}${percentChange}%`)
          .style("font-size", "12px")
          .style("font-weight", "bold")
          .style("fill", isPositive ? "#10b981" : "#ef4444")
          .style("opacity", 0)
          .transition()
          .duration(800)
          .delay(i * 200 + 1000)
          .style("opacity", 1);
      }
    });

    if (activeYear) {
      const activeData = data.find((d) => d.year === activeYear);
      if (activeData) {
        const tooltip = svg.append("g").attr("class", "tooltip");

        tooltip
          .append("rect")
          .attr("x", x(activeYear) + x.bandwidth() / 2 - 80)
          .attr("y", y(activeData.reviewCount) - 90)
          .attr("width", 160)
          .attr("height", 60)
          .attr("fill", "rgba(0,0,0,0.8)")
          .attr("rx", 8)
          .attr("ry", 8);

        tooltip
          .append("text")
          .attr("x", x(activeYear) + x.bandwidth() / 2)
          .attr("y", y(activeData.reviewCount) - 65)
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .style("font-weight", "bold")
          .style("font-size", "14px")
          .text(`Year: ${activeYear}`);

        tooltip
          .append("text")
          .attr("x", x(activeYear) + x.bandwidth() / 2)
          .attr("y", y(activeData.reviewCount) - 45)
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .style("font-size", "14px")
          .text(`Reviews: ${d3.format(",")(activeData.reviewCount)}`);
      }
    }
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
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4"
        role="alert"
      >
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  const totalReviews = data.reduce((sum, item) => sum + item.reviewCount, 0);
  const avgReviews = Math.round(totalReviews / data.length);
  const highestYear = data.reduce(
    (max, item) =>
      item.reviewCount > max.count
        ? { year: item.year, count: item.reviewCount }
        : max,
    { year: 0, count: 0 }
  );
  const lowestYear = data.reduce(
    (min, item) =>
      min.count === 0 || item.reviewCount < min.count
        ? { year: item.year, count: item.reviewCount }
        : min,
    { year: 0, count: 0 }
  );

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 relative">
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

      <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800 bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-500">
        Reviews Per Year Analysis
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
            Total Reviews
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {d3.format(",")(totalReviews)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
            Average Per Year
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {d3.format(",")(avgReviews)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
            Peak Year
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {highestYear.year}
          </p>
          <p className="text-sm text-gray-600">
            {d3.format(",")(highestYear.count)} reviews
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
            Lowest Year
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {lowestYear.year}
          </p>
          <p className="text-sm text-gray-600">
            {d3.format(",")(lowestYear.count)} reviews
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8 overflow-x-auto transform transition-all duration-500 hover:shadow-xl">
        <div ref={chartRef} className="w-full min-h-96"></div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-xl">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600">
          <h2 className="text-xl font-semibold text-white">
            Yearly Review Counts
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Number of Reviews
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % of Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  YoY Growth
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => {
                const percentOfTotal = (
                  (item.reviewCount / totalReviews) *
                  100
                ).toFixed(2);
                const prevYearReviews =
                  index > 0 ? data[index - 1].reviewCount : null;
                const yoyGrowth = prevYearReviews
                  ? (
                      ((item.reviewCount - prevYearReviews) / prevYearReviews) *
                      100
                    ).toFixed(2)
                  : "N/A";

                return (
                  <tr
                    key={item.year}
                    className={`hover:bg-indigo-50 transition-colors duration-150 ${
                      activeYear === item.year ? "bg-indigo-50" : ""
                    }`}
                    onMouseEnter={() => setActiveYear(item.year)}
                    onMouseLeave={() => setActiveYear(null)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {d3.format(",")(item.reviewCount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {percentOfTotal}%
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        yoyGrowth === "N/A"
                          ? "text-gray-500"
                          : parseFloat(yoyGrowth) >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {yoyGrowth === "N/A" ? (
                        yoyGrowth
                      ) : (
                        <div className="flex items-center">
                          <span>{parseFloat(yoyGrowth) >= 0 ? "↑" : "↓"}</span>
                          <span className="ml-1">
                            {Math.abs(parseFloat(yoyGrowth))}%
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-lg p-6 transform transition-all duration-500 hover:shadow-xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Review Count Trend Analysis
        </h2>
        <p className="text-gray-600 mb-4">
          The data shows that review counts{" "}
          {data[data.length - 1].reviewCount > data[0].reviewCount
            ? "have generally increased over time"
            : "have fluctuated over time"}
          . The peak year was {highestYear.year} with{" "}
          {d3.format(",")(highestYear.count)} reviews.
          {data[data.length - 1].reviewCount <
            data[data.length - 2].reviewCount &&
            ` There was a decline in the most recent year (${
              data[data.length - 1].year
            }) compared to the previous year.`}
        </p>

        <div className="mt-6">
          <h3 className="text-md font-medium text-gray-700 mb-3">
            Year-over-Year Growth Rate
          </h3>
          <div className="flex items-end h-24 space-x-2">
            {data.slice(1).map((item, index) => {
              const prevYearReviews = data[index].reviewCount;
              const growth =
                ((item.reviewCount - prevYearReviews) / prevYearReviews) * 100;
              const barHeight = Math.min(Math.abs(growth) / 2, 100); // Scale the height

              return (
                <div
                  key={item.year}
                  className="flex flex-col items-center group"
                >
                  <div className="text-xs font-semibold mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span
                      className={
                        growth >= 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {growth.toFixed(1)}%
                    </span>
                  </div>
                  <div
                    className={`w-12 rounded-t-md ${
                      growth >= 0
                        ? "bg-gradient-to-t from-green-400 to-green-600"
                        : "bg-gradient-to-t from-red-400 to-red-600"
                    } transition-all duration-500 ease-out transform hover:scale-110`}
                    style={{
                      height: `${barHeight}%`,
                      transition: "height 1s ease-out",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  ></div>
                  <span className="text-xs mt-2 font-medium">{item.year}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPerYear;
