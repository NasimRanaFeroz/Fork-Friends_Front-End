import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { IoArrowBack } from "react-icons/io5";

const CountPerYear = ({ onBack }) => {
  const [yearlyData, setYearlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState("area");

  const chartRef = useRef(null);
  const statsRef = useRef(null);

  const handleGoBack = () => {
    if (onBack) onBack();
  };

  useEffect(() => {
    const fetchYearlyReviews = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "http://192.168.37.177:5001/api/review/count-by-year"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setYearlyData(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchYearlyReviews();
  }, []);

  // Render chart when data is available
  useEffect(() => {
    if (yearlyData.length > 0 && !isLoading) {
      if (activeChart === "area") {
        renderAreaChart();
      } else {
        renderBarChart();
      }
      renderStats();
    }
  }, [yearlyData, isLoading, activeChart]);

  const renderAreaChart = () => {
    if (!chartRef.current) return;

    // Clear any existing SVG
    d3.select(chartRef.current).selectAll("*").remove();

    const margin = { top: 40, right: 30, bottom: 60, left: 80 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add background grid
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(
            d3
              .scaleTime()
              .domain(d3.extent(yearlyData, (d) => new Date(d._id, 0)))
              .range([0, width])
          )
          .tickSize(-height)
          .tickFormat("")
      )
      .selectAll("line")
      .attr("stroke", "#e5e7eb")
      .attr("stroke-opacity", 0.5);

    svg
      .append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(
            d3
              .scaleLinear()
              .domain([0, d3.max(yearlyData, (d) => d.count) * 1.1])
              .range([height, 0])
          )
          .tickSize(-width)
          .tickFormat("")
      )
      .selectAll("line")
      .attr("stroke", "#e5e7eb")
      .attr("stroke-opacity", 0.5);

    // X scale
    const x = d3
      .scaleTime()
      .domain(d3.extent(yearlyData, (d) => new Date(d._id, 0)))
      .range([0, width]);

    // Y scale
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(yearlyData, (d) => d.count) * 1.1])
      .range([height, 0]);

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")))
      .selectAll("text")
      .style("font-size", "12px")
      .style("font-weight", "500");

    // Add Y axis
    svg
      .append("g")
      .call(d3.axisLeft(y).tickFormat((d) => d3.format(",.0f")(d)))
      .selectAll("text")
      .style("font-size", "12px");

    // Y axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "500")
      .text("Number of Reviews");

    // Create a tooltip
    const tooltip = d3
      .select(chartRef.current)
      .append("div")
      .attr(
        "class",
        "absolute bg-indigo-900 text-white p-2 rounded shadow-lg text-sm z-10 pointer-events-none opacity-0 transition-opacity duration-300"
      )
      .style("max-width", "200px");

    // Add the area
    svg
      .append("path")
      .datum(yearlyData)
      .attr("fill", "url(#area-gradient)")
      .attr("stroke", "#4f46e5")
      .attr("stroke-width", 2)
      .attr(
        "d",
        d3
          .area()
          .x((d) => x(new Date(d._id, 0)))
          .y0(height)
          .y1(() => y(0))
      )
      .transition()
      .duration(2000)
      .attr(
        "d",
        d3
          .area()
          .x((d) => x(new Date(d._id, 0)))
          .y0(height)
          .y1((d) => y(d.count))
      );

    // Create gradient
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "area-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#4f46e5")
      .attr("stop-opacity", 0.8);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#4f46e5")
      .attr("stop-opacity", 0.1);

    // Add the line
    const line = d3
      .line()
      .x((d) => x(new Date(d._id, 0)))
      .y((d) => y(d.count))
      .curve(d3.curveMonotoneX);

    const path = svg
      .append("path")
      .datum(yearlyData)
      .attr("fill", "none")
      .attr("stroke", "#4f46e5")
      .attr("stroke-width", 3)
      .attr("d", line);

    // Animate the line
    const pathLength = path.node().getTotalLength();

    path
      .attr("stroke-dasharray", pathLength)
      .attr("stroke-dashoffset", pathLength)
      .transition()
      .duration(2000)
      .attr("stroke-dashoffset", 0);

    // Add the points
    svg
      .selectAll(".dot")
      .data(yearlyData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(new Date(d._id, 0)))
      .attr("cy", (d) => y(d.count))
      .attr("r", 0)
      .attr("fill", "#4f46e5")
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration(200).attr("r", 8);

        tooltip
          .html(
            `
          <div class="font-bold">${d._id}</div>
          <div>${d3.format(",")(d.count)} reviews</div>
          ${
            yearlyData.indexOf(d) > 0
              ? `
            <div class="text-xs mt-1">
              ${
                calculateGrowth(
                  yearlyData[yearlyData.indexOf(d) - 1].count,
                  d.count
                ) > 0
                  ? "+"
                  : ""
              }
              ${calculateGrowth(
                yearlyData[yearlyData.indexOf(d) - 1].count,
                d.count
              ).toFixed(1)}% from previous year
            </div>
          `
              : ""
          }
        `
          )
          .style("opacity", 1)
          .style(
            "left",
            `${
              event.pageX - chartRef.current.getBoundingClientRect().left + 10
            }px`
          )
          .style(
            "top",
            `${
              event.pageY - chartRef.current.getBoundingClientRect().top - 40
            }px`
          );
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(200).attr("r", 5);

        tooltip.style("opacity", 0);
      })
      .transition()
      .duration(500)
      .delay((d, i) => 2000 + i * 100)
      .attr("r", 5);

    // Add title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Review Volume Growth (2005-2022)");

    // Add annotations for key events or milestones
    // Find the year with highest growth
    let maxGrowthYear = null;
    let maxGrowthRate = 0;

    for (let i = 1; i < yearlyData.length; i++) {
      const growthRate = calculateGrowth(
        yearlyData[i - 1].count,
        yearlyData[i].count
      );
      if (growthRate > maxGrowthRate) {
        maxGrowthRate = growthRate;
        maxGrowthYear = yearlyData[i];
      }
    }

    if (maxGrowthYear) {
      // Add annotation for highest growth year
      svg
        .append("line")
        .attr("x1", x(new Date(maxGrowthYear._id, 0)))
        .attr("y1", y(maxGrowthYear.count))
        .attr("x2", x(new Date(maxGrowthYear._id, 0)))
        .attr("y2", y(maxGrowthYear.count) - 50)
        .attr("stroke", "#ef4444")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4")
        .style("opacity", 0)
        .transition()
        .duration(500)
        .delay(2500)
        .style("opacity", 1);

      svg
        .append("circle")
        .attr("cx", x(new Date(maxGrowthYear._id, 0)))
        .attr("cy", y(maxGrowthYear.count) - 50)
        .attr("r", 5)
        .attr("fill", "#ef4444")
        .style("opacity", 0)
        .transition()
        .duration(500)
        .delay(2500)
        .style("opacity", 1);

      svg
        .append("text")
        .attr("x", x(new Date(maxGrowthYear._id, 0)))
        .attr("y", y(maxGrowthYear.count) - 60)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("fill", "#ef4444")
        .text(`Highest growth: +${maxGrowthRate.toFixed(1)}%`)
        .style("opacity", 0)
        .transition()
        .duration(500)
        .delay(2700)
        .style("opacity", 1);
    }

    // Find the peak year
    const peakYear = yearlyData.reduce(
      (max, year) => (year.count > max.count ? year : max),
      yearlyData[0]
    );

    // Add annotation for peak year
    svg
      .append("line")
      .attr("x1", x(new Date(peakYear._id, 0)))
      .attr("y1", y(peakYear.count))
      .attr("x2", x(new Date(peakYear._id, 0)))
      .attr("y2", y(peakYear.count) - 30)
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "4")
      .style("opacity", 0)
      .transition()
      .duration(500)
      .delay(3000)
      .style("opacity", 1);

    svg
      .append("circle")
      .attr("cx", x(new Date(peakYear._id, 0)))
      .attr("cy", y(peakYear.count) - 30)
      .attr("r", 5)
      .attr("fill", "#3b82f6")
      .style("opacity", 0)
      .transition()
      .duration(500)
      .delay(3000)
      .style("opacity", 1);

    svg
      .append("text")
      .attr("x", x(new Date(peakYear._id, 0)))
      .attr("y", y(peakYear.count) - 40)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "#3b82f6")
      .text(`Peak: ${d3.format(",")(peakYear.count)} reviews`)
      .style("opacity", 0)
      .transition()
      .duration(500)
      .delay(3200)
      .style("opacity", 1);
  };

  const renderBarChart = () => {
    if (!chartRef.current) return;

    // Clear any existing SVG
    d3.select(chartRef.current).selectAll("*").remove();

    const margin = { top: 40, right: 30, bottom: 60, left: 80 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add background grid
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(
            d3
              .scaleBand()
              .domain(yearlyData.map((d) => d._id))
              .range([0, width])
          )
          .tickSize(-height)
          .tickFormat("")
      )
      .selectAll("line")
      .attr("stroke", "#e5e7eb")
      .attr("stroke-opacity", 0.5);

    svg
      .append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(
            d3
              .scaleLinear()
              .domain([0, d3.max(yearlyData, (d) => d.count) * 1.1])
              .range([height, 0])
          )
          .tickSize(-width)
          .tickFormat("")
      )
      .selectAll("line")
      .attr("stroke", "#e5e7eb")
      .attr("stroke-opacity", 0.5);

    // X scale
    const x = d3
      .scaleBand()
      .domain(yearlyData.map((d) => d._id))
      .range([0, width])
      .padding(0.2);

    // Y scale
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(yearlyData, (d) => d.count) * 1.1])
      .range([height, 0]);

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "12px")
      .style("font-weight", "500");

    // Add Y axis
    svg
      .append("g")
      .call(d3.axisLeft(y).tickFormat((d) => d3.format(",.0f")(d)))
      .selectAll("text")
      .style("font-size", "12px");

    // Y axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "500")
      .text("Number of Reviews");

    // Create a tooltip
    const tooltip = d3
      .select(chartRef.current)
      .append("div")
      .attr(
        "class",
        "absolute bg-indigo-900 text-white p-2 rounded shadow-lg text-sm z-10 pointer-events-none opacity-0 transition-opacity duration-300"
      )
      .style("max-width", "200px");

    // Color scale based on growth rate
    const colorScale = d3
      .scaleLinear()
      .domain([
        d3.min(yearlyData, (d) => d.count),
        d3.max(yearlyData, (d) => d.count),
      ])
      .range(["#818cf8", "#4f46e5"]);

    // Add bars with animation
    svg
      .selectAll(".bar")
      .data(yearlyData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d._id))
      .attr("width", x.bandwidth())
      .attr("y", height) // Start from bottom
      .attr("height", 0) // Start with height 0
      .attr("fill", (d) => colorScale(d.count))
      .attr("rx", 4) // Rounded corners
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration(200).attr("fill", "#3730a3");

        tooltip
          .html(
            `
          <div class="font-bold">${d._id}</div>
          <div>${d3.format(",")(d.count)} reviews</div>
          ${
            yearlyData.indexOf(d) > 0
              ? `
            <div class="text-xs mt-1">
              ${
                calculateGrowth(
                  yearlyData[yearlyData.indexOf(d) - 1].count,
                  d.count
                ) > 0
                  ? "+"
                  : ""
              }
              ${calculateGrowth(
                yearlyData[yearlyData.indexOf(d) - 1].count,
                d.count
              ).toFixed(1)}% from previous year
            </div>
          `
              : ""
          }
        `
          )
          .style("opacity", 1)
          .style(
            "left",
            `${
              event.pageX - chartRef.current.getBoundingClientRect().left + 10
            }px`
          )
          .style(
            "top",
            `${
              event.pageY - chartRef.current.getBoundingClientRect().top - 40
            }px`
          );
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("fill", (d) => colorScale(d.count));

        tooltip.style("opacity", 0);
      })
      .transition() // Add animation
      .duration(800)
      .delay((d, i) => i * 100)
      .attr("y", (d) => y(d.count))
      .attr("height", (d) => height - y(d.count));

    // Add title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Review Volume by Year (2005-2022)");
  };

  const renderStats = () => {
    if (!statsRef.current) return;

    // Calculate statistics
    const totalReviews = d3.sum(yearlyData, (d) => d.count);
    const peakYear = yearlyData.reduce(
      (max, year) => (year.count > max.count ? year : max),
      yearlyData[0]
    );

    // Calculate average annual growth rate
    let totalGrowthRate = 0;
    let growthYears = 0;

    for (let i = 1; i < yearlyData.length; i++) {
      const growthRate = calculateGrowth(
        yearlyData[i - 1].count,
        yearlyData[i].count
      );
      if (!isNaN(growthRate) && isFinite(growthRate)) {
        totalGrowthRate += growthRate;
        growthYears++;
      }
    }

    const avgAnnualGrowth = totalGrowthRate / growthYears;

    // Find year with highest growth
    let maxGrowthYear = null;
    let maxGrowthRate = 0;

    for (let i = 1; i < yearlyData.length; i++) {
      const growthRate = calculateGrowth(
        yearlyData[i - 1].count,
        yearlyData[i].count
      );
      if (growthRate > maxGrowthRate) {
        maxGrowthRate = growthRate;
        maxGrowthYear = yearlyData[i];
      }
    }

    // Animated counter function
    const animateCounter = (
      element,
      target,
      duration = 2000,
      prefix = "",
      suffix = ""
    ) => {
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easeProgress = d3.easeCubicOut(progress);
        const currentValue = Math.floor(easeProgress * target);

        element.textContent = `${prefix}${d3.format(",")(
          currentValue
        )}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = `${prefix}${d3.format(",")(target)}${suffix}`;
        }
      };

      requestAnimationFrame(updateCounter);
    };

    // Start animations for each stat after a delay
    setTimeout(() => {
      const totalReviewsElement = document.getElementById("total-reviews");
      const peakYearElement = document.getElementById("peak-year");
      const peakCountElement = document.getElementById("peak-count");
      const avgGrowthElement = document.getElementById("avg-growth");
      const maxGrowthYearElement = document.getElementById("max-growth-year");
      const maxGrowthRateElement = document.getElementById("max-growth-rate");

      if (totalReviewsElement)
        animateCounter(totalReviewsElement, totalReviews);
      if (peakYearElement) peakYearElement.textContent = peakYear._id;
      if (peakCountElement) animateCounter(peakCountElement, peakYear.count);
      if (avgGrowthElement)
        animateCounter(avgGrowthElement, avgAnnualGrowth, 1500, "", "%");
      if (maxGrowthYearElement && maxGrowthYear)
        maxGrowthYearElement.textContent = maxGrowthYear._id;
      if (maxGrowthRateElement && maxGrowthYear)
        animateCounter(maxGrowthRateElement, maxGrowthRate, 1500, "", "%");
    }, 500);
  };

  // Helper function to calculate growth percentage
  const calculateGrowth = (previous, current) => {
    if (previous === 0) return 100; // Avoid division by zero
    return ((current - previous) / previous) * 100;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }
  <div className="relative">
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

    <h1 className="text-3xl font-bold text-indigo-900 mb-6 text-center">
      Review Volume Analysis (2005-2022)
    </h1>
  </div>;

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg ">
      {/* Stats Cards */}
      <div
        ref={statsRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
      >
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md p-4 text-white">
          <h3 className="text-xl font-semibold mb-2">Total Reviews</h3>
          <p id="total-reviews" className="text-3xl font-bold">
            0
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md p-4 text-white">
          <h3 className="text-xl font-semibold mb-2">Peak Year</h3>
          <p className="text-3xl font-bold">
            <span id="peak-year">-</span>
          </p>
          <p className="text-lg">
            <span id="peak-count">0</span> reviews
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-md p-4 text-white">
          <h3 className="text-xl font-semibold mb-2">Average Annual Growth</h3>
          <p id="avg-growth" className="text-3xl font-bold">
            0%
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-lg shadow-md p-4 text-white">
          <h3 className="text-xl font-semibold mb-2">Highest Growth Year</h3>
          <p className="text-3xl font-bold">
            <span id="max-growth-year">-</span>
          </p>
          <p className="text-lg">
            <span id="max-growth-rate">0</span>% growth
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg shadow-md p-4 text-white md:col-span-2">
          <h3 className="text-xl font-semibold mb-2">Growth Pattern</h3>
          <p className="text-lg">
            {yearlyData.length > 0 && (
              <>
                Reviews grew consistently from 2005 to 2019, with a peak of{" "}
                <span className="font-bold">
                  {d3.format(",")(
                    yearlyData.reduce(
                      (max, year) => (year.count > max.count ? year : max),
                      yearlyData[0]
                    ).count
                  )}
                </span>{" "}
                reviews in{" "}
                {
                  yearlyData.reduce(
                    (max, year) => (year.count > max.count ? year : max),
                    yearlyData[0]
                  )._id
                }
                . There was a significant decline in 2020, likely due to the
                pandemic.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Chart Navigation */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              activeChart === "area"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            } border border-gray-200 focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:text-indigo-700 transition-all duration-200`}
            onClick={() => setActiveChart("area")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1 inline"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 000 2h6a1 1 0 100-2H3zm0 4a1 1 0 100 2h8a1 1 0 100-2H3z"
                clipRule="evenodd"
              />
              <path d="M18 10a1 1 0 00-1-1h-4a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4z" />
            </svg>
            Area Chart
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              activeChart === "bar"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            } border border-gray-200 focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:text-indigo-700 transition-all duration-200`}
            onClick={() => setActiveChart("bar")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1 inline"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            Bar Chart
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div ref={chartRef} className="relative h-[500px] w-full"></div>

      {/* Insights Section */}
      <div className="mt-8 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-indigo-900 mb-4">Key Insights</h2>

        {yearlyData.length > 0 && (
          <div className="space-y-3">
            <p className="text-gray-700">
              <span className="font-semibold">Overall Trend:</span> The data
              shows a general upward trend in review volume from 2005 to{" "}
              {
                yearlyData.reduce(
                  (max, year) => (year.count > max.count ? year : max),
                  yearlyData[0]
                )._id
              }
              , followed by a decline in more recent years.
            </p>

            <p className="text-gray-700">
              <span className="font-semibold">Growth Phases:</span> The most
              significant growth occurred between{" "}
              {
                yearlyData.reduce(
                  (result, year, index) => {
                    if (index === 0) return result;
                    const growthRate = calculateGrowth(
                      yearlyData[index - 1].count,
                      year.count
                    );
                    return growthRate > result.rate
                      ? { year: year._id, rate: growthRate }
                      : result;
                  },
                  { year: "", rate: 0 }
                ).year
              }{" "}
              and{" "}
              {
                yearlyData.reduce(
                  (max, year) => (year.count > max.count ? year : max),
                  yearlyData[0]
                )._id
              }
              , with an average annual growth rate of{" "}
              {(
                yearlyData.slice(1).reduce((sum, year, index) => {
                  return (
                    sum + calculateGrowth(yearlyData[index].count, year.count)
                  );
                }, 0) /
                (yearlyData.length - 1)
              ).toFixed(1)}
              %.
            </p>

            <p className="text-gray-700">
              <span className="font-semibold">Recent Trends:</span> Since{" "}
              {
                yearlyData.reduce(
                  (max, year) => (year.count > max.count ? year : max),
                  yearlyData[0]
                )._id
              }
              , there has been a{" "}
              {yearlyData[yearlyData.length - 1].count <
              yearlyData.reduce(
                (max, year) => (year.count > max.count ? year : max),
                yearlyData[0]
              ).count
                ? "decline"
                : "continued growth"}{" "}
              in review volume, potentially indicating{" "}
              {yearlyData[yearlyData.length - 1].count <
              yearlyData.reduce(
                (max, year) => (year.count > max.count ? year : max),
                yearlyData[0]
              ).count
                ? "market saturation or changing consumer behavior"
                : "sustained market interest and engagement"}
              .
            </p>
          </div>
        )}
      </div>

      {/* Download Options */}
      <div className="mt-6 flex justify-end">
        <button
          className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-4 py-2 rounded-md text-sm font-medium flex items-center mr-2"
          onClick={() => {
            const svgElement = chartRef.current.querySelector("svg");
            if (!svgElement) return;

            const svgData = new XMLSerializer().serializeToString(svgElement);
            const svgBlob = new Blob([svgData], {
              type: "image/svg+xml;charset=utf-8",
            });
            const svgUrl = URL.createObjectURL(svgBlob);

            const downloadLink = document.createElement("a");
            downloadLink.href = svgUrl;
            downloadLink.download = `review-volume-${activeChart}-chart.svg`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Download SVG
        </button>

        <button
          className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium flex items-center"
          onClick={() => {
            // Create CSV content
            let csvContent = "Year,Review Count,Growth Rate\n";
            yearlyData.forEach((d, i) => {
              const growthRate =
                i > 0
                  ? calculateGrowth(yearlyData[i - 1].count, d.count).toFixed(2)
                  : "N/A";
              csvContent += `${d._id},${d.count},${growthRate}%\n`;
            });

            // Create download link
            const blob = new Blob([csvContent], {
              type: "text/csv;charset=utf-8;",
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", "review-volume-data.csv");
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Export Data
        </button>
      </div>
    </div>
  );
};

export default CountPerYear;
