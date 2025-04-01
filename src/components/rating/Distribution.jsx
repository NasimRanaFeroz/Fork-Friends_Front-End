import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { IoArrowBack } from "react-icons/io5";

const Distribution = ({ onBack }) => {
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleGoBack = () => {
    if (onBack) onBack();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://192.168.37.177:5001/api/rating/distribution"
        );

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const responseData = await response.json();
        setData(responseData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching rating distribution data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0 && !loading) {
      const totalCount = d3.sum(data, (d) => d.count);

      // Render Pie Chart
      renderPieChart(data, totalCount);

      // Render Bar Chart
      renderBarChart(data);
    }
  }, [data, loading]);

  const renderPieChart = (data, totalCount) => {
    if (!pieChartRef.current) return;

    // Clear any existing SVG
    d3.select(pieChartRef.current).selectAll("*").remove();

    // Set dimensions
    const containerWidth = pieChartRef.current.clientWidth || 600;
    const width = Math.min(containerWidth, 700);
    const height = width * 0.8;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    // Color scale with a custom palette
    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d._id))
      .range(["#FF6B6B", "#FFD166", "#06D6A0", "#118AB2", "#073B4C"]);

    // Create SVG
    const svg = d3
      .select(pieChartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Create a tooltip div
    const tooltip = d3
      .select(pieChartRef.current)
      .append("div")
      .attr(
        "class",
        "absolute bg-gray-800 text-white p-2 rounded shadow-lg text-sm z-10 pointer-events-none opacity-0 transition-opacity duration-300"
      )
      .style("max-width", "200px");

    // Compute the position of each group on the pie
    const pie = d3
      .pie()
      .value((d) => d.count)
      .sort(null);

    const data_ready = pie(data);

    // Arc generators
    const arcPath = d3
      .arc()
      .innerRadius(radius * 0.5) // Donut chart
      .outerRadius(radius);

    const hoverArc = d3
      .arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 1.05);

    // Build the pie chart
    const paths = svg
      .selectAll("path")
      .data(data_ready)
      .enter()
      .append("path")
      .attr("d", arcPath)
      .attr("fill", (d) => color(d.data._id))
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        // Highlight segment
        d3.select(this).transition().duration(200).attr("d", hoverArc);

        // Show tooltip
        tooltip
          .html(
            `
          <div class="font-bold">${d.data.label}</div>
          <div>${d3.format(",")(d.data.count)}</div>
          <div>${d.data.percentage}%</div>
        `
          )
          .style("opacity", 1)
          .style("left", `${event.offsetX + 10}px`)
          .style("top", `${event.offsetY + 10}px`);

        // Check if tooltip is outside container and adjust if needed
        const tooltipNode = tooltip.node();
        const containerRect = pieChartRef.current.getBoundingClientRect();
        const tooltipRect = tooltipNode.getBoundingClientRect();

        if (tooltipRect.right > containerRect.right) {
          tooltip.style("left", `${event.offsetX - tooltipRect.width - 10}px`);
        }

        if (tooltipRect.bottom > containerRect.bottom) {
          tooltip.style("top", `${event.offsetY - tooltipRect.height - 10}px`);
        }
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(200).attr("d", arcPath);

        tooltip.style("opacity", 0);
      });

    // Helper function to compute the mid angle
    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    // Create shorter connecting lines
    svg
      .selectAll("allPolylines")
      .data(data_ready)
      .enter()
      .append("line") // Using simple lines instead of polylines
      .attr("stroke", "gray")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr("x1", function (d) {
        return arcPath.centroid(d)[0] * 1.1; // Start slightly outside the pie
      })
      .attr("y1", function (d) {
        return arcPath.centroid(d)[1] * 1.1;
      })
      .attr("x2", function (d) {
        // End point is shorter - just extend a bit from the pie
        const pos = arcPath.centroid(d);
        return pos[0] * 1.4; // Shorter line
      })
      .attr("y2", function (d) {
        const pos = arcPath.centroid(d);
        return pos[1] * 1.4; // Shorter line
      });

    // Add labels closer to the pie segments
    svg
      .selectAll("allLabels")
      .data(data_ready)
      .enter()
      .append("text")
      .text((d) => `${d.data.label}: ${d.data.percentage}%`)
      .attr("transform", function (d) {
        // Position labels closer to the pie
        const pos = arcPath.centroid(d);
        // Scale the position to place labels closer to the pie
        return `translate(${pos[0] * 1.5}, ${pos[1] * 1.5})`;
      })
      .style("text-anchor", function (d) {
        // Adjust text anchor based on position
        return midAngle(d) < Math.PI ? "start" : "end";
      })
      .style("font-size", "12px")
      .style("font-weight", "500")
      .style("alignment-baseline", "middle");

    // Add center text
    const centerGroup = svg.append("g");

    centerGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-1em")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Total Ratings");

    centerGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1em")
      .style("font-size", "20px")
      .style("font-weight", "bold")
      .text(d3.format(",")(totalCount));

    // Animation
    paths
      .style("opacity", 0)
      .attr("d", (d) => {
        const startArc = { ...d, startAngle: d.endAngle, endAngle: d.endAngle };
        return arcPath(startArc);
      })
      .transition()
      .duration(1000)
      .style("opacity", 1)
      .attrTween("d", function (d) {
        const interpolate = d3.interpolate({ ...d, startAngle: d.endAngle }, d);
        return (t) => arcPath(interpolate(t));
      });

    centerGroup
      .style("opacity", 0)
      .transition()
      .delay(1000)
      .duration(500)
      .style("opacity", 1);
  };

  const renderBarChart = (data) => {
    if (!barChartRef.current) return;

    // Clear any existing SVG
    d3.select(barChartRef.current).selectAll("*").remove();

    // Set dimensions
    const containerWidth = barChartRef.current.clientWidth || 600;
    const margin = { top: 30, right: 30, bottom: 70, left: 60 };
    const width = containerWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(barChartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X scale
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, width])
      .padding(0.3);

    // Y scale
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count)])
      .range([height, 0]);

    // Color scale
    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d._id))
      .range(["#FF6B6B", "#FFD166", "#06D6A0", "#118AB2", "#073B4C"]);

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "12px")
      .style("font-weight", "500");

    // Add Y axis
    svg
      .append("g")
      .call(d3.axisLeft(y).tickFormat((d) => d3.format(".2s")(d)))
      .selectAll("text")
      .style("font-size", "12px");

    // Y axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 15)
      .attr("x", -height / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "500")
      .text("Number of Ratings");

    // Create a tooltip
    const tooltip = d3
      .select(barChartRef.current)
      .append("div")
      .attr(
        "class",
        "absolute bg-gray-800 text-white p-2 rounded shadow-lg text-sm z-10 pointer-events-none opacity-0 transition-opacity duration-300"
      )
      .style("max-width", "200px");

    // Add bars
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.label))
      .attr("y", height) // Start from bottom for animation
      .attr("width", x.bandwidth())
      .attr("height", 0) // Start with height 0 for animation
      .attr("fill", (d) => color(d._id))
      .attr("rx", 4) // Rounded corners
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration(200).attr("opacity", 0.8);

        tooltip
          .html(
            `
          <div class="font-bold">${d.label}</div>
          <div>${d3.format(",")(d.count)} ratings</div>
          <div>${d.percentage}% of total</div>
        `
          )
          .style("opacity", 1)
          .style("left", `${event.offsetX + 10}px`)
          .style("top", `${event.offsetY + 10}px`);
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(200).attr("opacity", 1);

        tooltip.style("opacity", 0);
      })
      .transition() // Animation
      .duration(1000)
      .delay((d, i) => i * 100)
      .attr("y", (d) => y(d.count))
      .attr("height", (d) => height - y(d.count));

    // Add value labels on top of bars
    svg
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.label) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.count) - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("opacity", 0)
      .text((d) => `${d.percentage}%`)
      .transition()
      .duration(1000)
      .delay((d, i) => 1000 + i * 100)
      .style("opacity", 1);
  };

  // Sort data for the table display (highest rating first)
  const sortedData = [...data].sort((a, b) => b._id - a._id);

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

      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Rating Distribution
      </h2>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading data...</p>
          </div>
        </div>
      ) : error ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <p className="mt-2">
            Please check your API connection and try again.
          </p>
        </div>
      ) : (
        <>
          {/* Pie Chart */}
          <div
            ref={pieChartRef}
            className="relative w-full max-w-3xl h-[500px] mb-12"
          ></div>

          {/* Bar Chart */}
          <div className="w-full max-w-3xl mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Rating Distribution by Count
            </h3>
            <div ref={barChartRef} className="relative w-full h-[300px]"></div>
          </div>

          {/* Star rating legend */}
          <div className="mt-4 grid grid-cols-5 gap-4 w-full max-w-3xl border-t pt-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <div key={rating} className="flex justify-center">
                {Array(rating)
                  .fill(0)
                  .map((_, i) => (
                    <svg
                      key={i}
                      className="w-6 h-6 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
              </div>
            ))}
          </div>

          {/* Summary Table */}
          <div className="w-full max-w-3xl mt-8 overflow-hidden rounded-lg shadow">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Rating
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Count
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedData.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-700">
                      <div className="flex items-center">
                        {Array(item._id)
                          .fill(0)
                          .map((_, i) => (
                            <svg
                              key={i}
                              className="w-4 h-4 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {d3.format(",")(item.count)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Distribution;
