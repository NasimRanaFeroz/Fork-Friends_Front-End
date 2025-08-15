import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as d3 from "d3";
import { IoArrowBack } from "react-icons/io5";

const YearlyJoins = ({ onBack }) => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMetric, setActiveMetric] = useState("totalUsers");
  const chartRef = useRef();

  const demoData = [
    {
      year: 2010,
      totalUsers: 1250000,
      totalReviews: 2800000,
      eliteUsers: 45000,
      regularUsers: 1205000,
      totalFans: 890000,
      activeUsers: 950000,
      silentUsers: 300000,
    },
    {
      year: 2011,
      totalUsers: 1580000,
      totalReviews: 3650000,
      eliteUsers: 58000,
      regularUsers: 1522000,
      totalFans: 1150000,
      activeUsers: 1220000,
      silentUsers: 360000,
    },
    {
      year: 2012,
      totalUsers: 2100000,
      totalReviews: 4900000,
      eliteUsers: 78000,
      regularUsers: 2022000,
      totalFans: 1580000,
      activeUsers: 1650000,
      silentUsers: 450000,
    },
    {
      year: 2013,
      totalUsers: 2850000,
      totalReviews: 6800000,
      eliteUsers: 105000,
      regularUsers: 2745000,
      totalFans: 2150000,
      activeUsers: 2280000,
      silentUsers: 570000,
    },
    {
      year: 2014,
      totalUsers: 3950000,
      totalReviews: 9200000,
      eliteUsers: 145000,
      regularUsers: 3805000,
      totalFans: 3100000,
      activeUsers: 3200000,
      silentUsers: 750000,
    },
    {
      year: 2015,
      totalUsers: 5200000,
      totalReviews: 12500000,
      eliteUsers: 195000,
      regularUsers: 5005000,
      totalFans: 4200000,
      activeUsers: 4300000,
      silentUsers: 900000,
    },
    {
      year: 2016,
      totalUsers: 6800000,
      totalReviews: 16800000,
      eliteUsers: 260000,
      regularUsers: 6540000,
      totalFans: 5600000,
      activeUsers: 5700000,
      silentUsers: 1100000,
    },
    {
      year: 2017,
      totalUsers: 8500000,
      totalReviews: 21500000,
      eliteUsers: 330000,
      regularUsers: 8170000,
      totalFans: 7200000,
      activeUsers: 7300000,
      silentUsers: 1200000,
    },
    {
      year: 2018,
      totalUsers: 10800000,
      totalReviews: 27200000,
      eliteUsers: 420000,
      regularUsers: 10380000,
      totalFans: 9100000,
      activeUsers: 9400000,
      silentUsers: 1400000,
    },
    {
      year: 2019,
      totalUsers: 13200000,
      totalReviews: 33800000,
      eliteUsers: 520000,
      regularUsers: 12680000,
      totalFans: 11500000,
      activeUsers: 11800000,
      silentUsers: 1400000,
    },
    {
      year: 2020,
      totalUsers: 15800000,
      totalReviews: 41200000,
      eliteUsers: 630000,
      regularUsers: 15170000,
      totalFans: 14200000,
      activeUsers: 14600000,
      silentUsers: 1200000,
    },
    {
      year: 2021,
      totalUsers: 18500000,
      totalReviews: 48900000,
      eliteUsers: 740000,
      regularUsers: 17760000,
      totalFans: 16800000,
      activeUsers: 17300000,
      silentUsers: 1200000,
    },
    {
      year: 2022,
      totalUsers: 21200000,
      totalReviews: 56800000,
      eliteUsers: 850000,
      regularUsers: 20350000,
      totalFans: 19500000,
      activeUsers: 20000000,
      silentUsers: 1200000,
    },
    {
      year: 2023,
      totalUsers: 24100000,
      totalReviews: 65200000,
      eliteUsers: 970000,
      regularUsers: 23130000,
      totalFans: 22300000,
      activeUsers: 22900000,
      silentUsers: 1200000,
    },
  ];

  const handleGoBack = () => {
    if (onBack) onBack();
  };

  const metrics = [
    { id: "totalUsers", label: "Total Users", color: "#4285F4" }, // Blue
    { id: "totalReviews", label: "Total Reviews", color: "#34A853" }, // Green
    { id: "eliteUsers", label: "Elite Users", color: "#EA4335" }, // Red
    { id: "regularUsers", label: "Regular Users", color: "#FBBC05" }, // Yellow/Orange
    { id: "totalFans", label: "Total Fans", color: "#F39C12" }, // Orange
    { id: "activeUsers", label: "Active Users", color: "#16A085" }, // Additional metric
    { id: "silentUsers", label: "Silent Users", color: "#8E24AA" }, // Additional metric
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // const response = await axios.get('http://192.168.37.177:5001/api/user/yearly-joins');
        // const sortedData = response.data.sort((a, b) => a.year - b.year);

        setTimeout(() => {
          const sortedData = demoData.sort((a, b) => a.year - b.year);
          setUserData(sortedData);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to fetch user data");
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (userData.length > 0 && !loading) {
      drawChart();
    }
  }, [userData, loading, activeMetric]);

  const drawChart = () => {
    d3.select(chartRef.current).selectAll("*").remove();

    const margin = { top: 60, right: 120, bottom: 60, left: 80 };
    const width = 900 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3
      .select(chartRef.current)
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("padding", "20px")
      .style("background", "white")
      .style("border-radius", "8px")
      .style("box-shadow", "0 4px 15px rgba(0, 0, 0, 0.15)")
      .style("pointer-events", "none")
      .style("font-size", "14px")
      .style("z-index", 10)
      .style("min-width", "220px")
      .style("line-height", "1.8")
      .style("transition", "all 0.3s ease");

    const x = d3
      .scaleLinear()
      .domain(d3.extent(userData, (d) => d.year))
      .range([0, width]);

    const xAxis = svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .attr("class", "x-axis")
      .call(d3.axisBottom(x).ticks(userData.length).tickFormat(d3.format("d")));

    xAxis
      .selectAll("text")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "#555")
      .attr("dy", "1em");

    xAxis.selectAll("line").style("stroke", "#ccc");

    xAxis.selectAll("path").style("stroke", "#ccc");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "#555")
      .style("opacity", 0)
      .text("Year")
      .transition()
      .duration(1000)
      .style("opacity", 1);

    const maxValue = d3.max(userData, (d) => {
      const values = metrics.map((metric) =>
        metric.id === activeMetric ? d[metric.id] : 0
      );
      return d3.max(values);
    });

    const y = d3
      .scaleLinear()
      .domain([0, maxValue * 1.1])
      .range([height, 0]);

    const yAxis = svg
      .append("g")
      .attr("class", "y-axis")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => {
            if (d >= 1000000) return `${d / 1000000}M`;
            if (d >= 1000) return `${d / 1000}K`;
            return d;
          })
      );

    yAxis
      .selectAll("text")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "#555");

    yAxis.selectAll("line").style("stroke", "#ccc");

    yAxis.selectAll("path").style("stroke", "#ccc");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "#555")
      .style("opacity", 0)
      .text("Count")
      .transition()
      .duration(1000)
      .style("opacity", 1);

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .style("opacity", 0)
      .text("Yearly User Growth Analysis")
      .transition()
      .duration(1000)
      .style("opacity", 1);

    const grid = svg
      .append("g")
      .attr("class", "grid")
      .style("opacity", 0)
      .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(""));

    grid
      .selectAll("line")
      .style("stroke", "#e5e5e5")
      .style("stroke-dasharray", "3,3");

    grid.selectAll("path").style("stroke-width", 0);

    grid.transition().duration(1000).style("opacity", 0.7);

    const line = d3
      .line()
      .x((d) => x(d.year))
      .y((d) => y(d[activeMetric]))
      .curve(d3.curveMonotoneX);

    const path = svg
      .append("path")
      .datum(userData)
      .attr("fill", "none")
      .attr("stroke", metrics.find((m) => m.id === activeMetric).color)
      .attr("stroke-width", 3)
      .attr("d", line);

    const pathLength = path.node().getTotalLength();
    path
      .attr("stroke-dasharray", pathLength)
      .attr("stroke-dashoffset", pathLength)
      .transition()
      .duration(2000)
      .ease(d3.easePolyOut)
      .attr("stroke-dashoffset", 0)
      .on("end", animateDataPoints);

    function animateDataPoints() {
      svg
        .selectAll(".data-point")
        .data(userData)
        .enter()
        .append("circle")
        .attr("class", "data-point")
        .attr("cx", (d) => x(d.year))
        .attr("cy", (d) => y(d[activeMetric]))
        .attr("r", 0)
        .attr("fill", metrics.find((m) => m.id === activeMetric).color)
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .transition()
        .delay((d, i) => i * 100)
        .duration(500)
        .attr("r", 6)
        .on("end", (d, i, nodes) => {
          if (i === nodes.length - 1) {
            addHoverEffects();
          }
        });
    }

    function addHoverEffects() {
      svg
        .selectAll(".data-point")
        .on("mouseover", function (event, d) {
          d3.select(this)
            .transition()
            .duration(300)
            .attr("r", 8)
            .attr("stroke-width", 3);

          d3.select(this)
            .append("animate")
            .attr("attributeName", "r")
            .attr("values", "6;8;6")
            .attr("dur", "1.5s")
            .attr("repeatCount", "indefinite");

          tooltip
            .transition()
            .duration(300)
            .style("opacity", 1)
            .style("transform", "scale(1)");

          tooltip
            .html(
              `
            <div style="font-weight: bold; margin-bottom: 15px; font-size: 18px; color: #333;">Year: ${
              d.year
            }</div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="color: #9e9e9e; font-size: 16px;">Total Users:</span>
              <span style="font-weight: bold; color: #4285F4; font-size: 16px;">${d.totalUsers.toLocaleString()}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="color: #9e9e9e; font-size: 16px;">Total Reviews:</span>
              <span style="font-weight: bold; color: #34A853; font-size: 16px;">${d.totalReviews.toLocaleString()}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="color: #9e9e9e; font-size: 16px;">Elite Users:</span>
              <span style="font-weight: bold; color: #EA4335; font-size: 16px;">${d.eliteUsers.toLocaleString()}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="color: #9e9e9e; font-size: 16px;">Regular Users:</span>
              <span style="font-weight: bold; color: #FBBC05; font-size: 16px;">${d.regularUsers.toLocaleString()}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #9e9e9e; font-size: 16px;">Total Fans:</span>
              <span style="font-weight: bold; color: #F39C12; font-size: 16px;">${d.totalFans.toLocaleString()}</span>
            </div>
          `
            )
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 10}px`);

          xAxis
            .selectAll("text")
            .filter((t) => t === d.year)
            .transition()
            .duration(200)
            .style("font-size", "14px")
            .style("fill", metrics.find((m) => m.id === activeMetric).color);
        })
        .on("mouseout", function (event, d) {
          d3.select(this)
            .transition()
            .duration(300)
            .attr("r", 6)
            .attr("stroke-width", 2);

          d3.select(this).select("animate").remove();

          tooltip
            .transition()
            .duration(300)
            .style("opacity", 0)
            .style("transform", "scale(0.95)");

          xAxis
            .selectAll("text")
            .filter((t) => t === d.year)
            .transition()
            .duration(200)
            .style("font-size", "12px")
            .style("fill", "#555");
        });
    }

    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width + 20}, 0)`);

    legend
      .append("text")
      .attr("x", 0)
      .attr("y", -10)
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .style("opacity", 0)
      .text("Metrics")
      .transition()
      .duration(1000)
      .style("opacity", 1);

    const legendItems = legend
      .selectAll(".legend-item")
      .data(metrics)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 30 + 10})`)
      .style("cursor", "pointer")
      .style("opacity", 0)
      .on("click", function (event, d) {
        d3.select(this)
          .transition()
          .duration(300)
          .attr("transform", (d, i) => `translate(5, ${i * 30 + 10})`)
          .transition()
          .duration(300)
          .attr("transform", (d, i) => `translate(0, ${i * 30 + 10})`);

        const oldMetric = activeMetric;
        const newMetric = d.id;

        if (oldMetric !== newMetric) {
          path
            .transition()
            .duration(500)
            .style("opacity", 0)
            .on("end", () => {
              setActiveMetric(newMetric);
            });

          svg
            .selectAll(".data-point")
            .transition()
            .duration(500)
            .style("opacity", 0);
        }
      });

    legendItems
      .transition()
      .delay((d, i) => 1000 + i * 100)
      .duration(500)
      .style("opacity", 1);

    legendItems
      .append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .attr("rx", 3)
      .style("fill", (d) => d.color)
      .style("stroke", (d) => (d.id === activeMetric ? "#333" : "none"))
      .style("stroke-width", (d) => (d.id === activeMetric ? 2 : 0));

    legendItems
      .append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("font-size", "12px")
      .style("font-weight", (d) => (d.id === activeMetric ? "bold" : "normal"))
      .style("fill", "#333")
      .text((d) => d.label);

    legendItems
      .on("mouseover", function (event, d) {
        d3.select(this)
          .select("rect")
          .transition()
          .duration(200)
          .style("stroke", "#333")
          .style("stroke-width", 2);

        d3.select(this)
          .select("text")
          .transition()
          .duration(200)
          .style("font-weight", "bold")
          .style("fill", d.color);
      })
      .on("mouseout", function (event, d) {
        if (d.id !== activeMetric) {
          d3.select(this)
            .select("rect")
            .transition()
            .duration(200)
            .style("stroke", "none")
            .style("stroke-width", 0);

          d3.select(this)
            .select("text")
            .transition()
            .duration(200)
            .style("font-weight", "normal")
            .style("fill", "#333");
        }
      });

    svg
      .append("text")
      .attr("x", width)
      .attr("y", height + 40)
      .attr("text-anchor", "end")
      .style("font-size", "12px")
      .style("font-style", "italic")
      .style("fill", "#666")
      .style("opacity", 0)
      .text("Click on a metric in the legend to change the displayed data")
      .transition()
      .delay(2000)
      .duration(1000)
      .style("opacity", 1);
  };

  return (
    <div className="max-w-7xl mx-auto p-5 bg-gray-50 font-sans relative">
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

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Yearly User Growth Analysis
      </h1>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="border border-gray-200 rounded-lg bg-white shadow-lg p-6">
          <div className="mb-4">
            <p className="text-gray-600">
              This visualization shows the growth of different user categories
              by year. Click on a metric in the legend to view its trend over
              time.
            </p>
          </div>
          <div
            ref={chartRef}
            className="flex justify-center overflow-hidden"
          ></div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Summary Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {userData.length > 0 && (
                <>
                  <div className="bg-blue-50 p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
                    <p className="text-sm text-gray-600">Most Recent Year</p>
                    <p className="text-2xl font-bold text-blue-700 animate-fadeIn">
                      {userData[userData.length - 1].year}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">Total Users</p>
                    <p className="text-xl font-bold text-blue-700 animate-fadeIn">
                      {userData[
                        userData.length - 1
                      ].totalUsers.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
                    <p className="text-sm text-gray-600">Total Reviews</p>
                    <p className="text-2xl font-bold text-green-700 animate-fadeIn">
                      {d3.sum(userData, (d) => d.totalReviews).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Average Reviews per User
                    </p>
                    <p className="text-xl font-bold text-green-700 animate-fadeIn">
                      {(
                        d3.sum(userData, (d) => d.totalReviews) /
                        d3.sum(userData, (d) => d.totalUsers)
                      ).toFixed(1)}
                    </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
                    <p className="text-sm text-gray-600">
                      Elite Users Percentage
                    </p>
                    <p className="text-2xl font-bold text-purple-700 animate-fadeIn">
                      {(
                        (d3.sum(userData, (d) => d.eliteUsers) /
                          d3.sum(userData, (d) => d.totalUsers)) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                    <p className="text-sm text-gray-600 mt-2">Total Fans</p>
                    <p className="text-xl font-bold text-purple-700 animate-fadeIn">
                      {d3.sum(userData, (d) => d.totalFans).toLocaleString()}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        .animate-pulse {
          animation: pulse 2s infinite;
        }

        .tooltip {
          transform-origin: center top;
          transform: scale(0.95);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .data-point {
          transition: all 0.3s ease;
        }

        .legend-item {
          transition: all 0.3s ease;
        }

        .hover\\:shadow-md:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
      `}</style>
    </div>
  );
};

export default YearlyJoins;
