import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { IoArrowBack } from "react-icons/io5";

const CheckInsPerYear = ({ onBack }) => {
  const lineChartRef = useRef(null);
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
        const response = await fetch(
          "http://192.168.37.177:5001/api/checkin/checkins-per-year"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0 && lineChartRef.current && barChartRef.current) {
      drawLineChart();
      drawBarChart();
    }
  }, [data]);

  const drawLineChart = () => {
    d3.select(lineChartRef.current).selectAll("*").remove();

    const margin = { top: 40, right: 30, bottom: 50, left: 80 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(lineChartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.year))
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count)])
      .range([height, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")))
      .style("font-size", "12px");

    svg
      .append("g")
      .call(d3.axisLeft(y).tickFormat((d) => `${d / 1000}k`))
      .style("font-size", "12px");

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .text("Year")
      .style("fill", "#666")
      .style("font-size", "14px");

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .text("Number of Check-ins")
      .style("fill", "#666")
      .style("font-size", "14px");

    const line = d3
      .line()
      .x((d) => x(d.year))
      .y((d) => y(d.count))
      .curve(d3.curveMonotoneX);

    const path = svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#4B83F2")
      .attr("stroke-width", 3)
      .attr("d", line);

    const length = path.node().getTotalLength();
    path
      .attr("stroke-dasharray", length + " " + length)
      .attr("stroke-dashoffset", length)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(d.year))
      .attr("cy", (d) => y(d.count))
      .attr("r", 0)
      .attr("fill", "#4B83F2")
      .transition()
      .delay((d, i) => i * 150)
      .duration(500)
      .attr("r", 5);

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .text("Check-ins Trend Over Years");
  };

  const drawBarChart = () => {
    d3.select(barChartRef.current).selectAll("*").remove();

    const margin = { top: 40, right: 30, bottom: 50, left: 80 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(barChartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .range([0, width])
      .padding(0.2)
      .domain(data.map((d) => d.year));

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count)])
      .range([height, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .style("font-size", "12px");

    svg
      .append("g")
      .call(d3.axisLeft(y).tickFormat((d) => `${d / 1000}k`))
      .style("font-size", "12px");

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .text("Year")
      .style("fill", "#666")
      .style("font-size", "14px");

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .text("Number of Check-ins")
      .style("fill", "#666")
      .style("font-size", "14px");

    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "bar-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#4B83F2");

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#85B0FF");

    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.year))
      .attr("width", x.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .style("fill", "url(#bar-gradient)")
      .transition()
      .duration(1000)
      .attr("y", (d) => y(d.count))
      .attr("height", (d) => height - y(d.count));

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .text("Check-ins Distribution by Year");
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
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div ref={lineChartRef}></div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div ref={barChartRef}></div>
        </div>
      </div>
    </div>
  );
};

export default CheckInsPerYear;
