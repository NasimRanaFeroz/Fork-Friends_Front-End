import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { IoArrowBack } from "react-icons/io5";

const WordCloud = ({ onBack }) => {
  const [wordData, setWordData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const barChartRef = useRef(null);
  const wordCloudRef = useRef(null);

  const demoWordData = {
    metadata: {
      sampleSize: 25000,
      processedAt: "2024-08-15T10:30:00Z",
      executionTimeMs: 1650,
      totalUniqueWords: 156,
    },
    results: [
      { text: "food", size: 12500 },
      { text: "service", size: 11200 },
      { text: "great", size: 10800 },
      { text: "good", size: 9600 },
      { text: "delicious", size: 8900 },
      { text: "restaurant", size: 8400 },
      { text: "amazing", size: 7800 },
      { text: "excellent", size: 7200 },
      { text: "staff", size: 6900 },
      { text: "place", size: 6500 },
      { text: "fresh", size: 6200 },
      { text: "friendly", size: 5800 },
      { text: "tasty", size: 5600 },
      { text: "atmosphere", size: 5300 },
      { text: "quality", size: 5000 },
      { text: "pizza", size: 4800 },
      { text: "price", size: 4600 },
      { text: "experience", size: 4400 },
      { text: "clean", size: 4200 },
      { text: "recommend", size: 4000 },
      { text: "fast", size: 3800 },
      { text: "menu", size: 3600 },
      { text: "location", size: 3500 },
      { text: "customer", size: 3300 },
      { text: "order", size: 3200 },
      { text: "value", size: 3100 },
      { text: "chicken", size: 3000 },
      { text: "portion", size: 2900 },
      { text: "wait", size: 2800 },
      { text: "flavor", size: 2700 },
      { text: "busy", size: 2600 },
      { text: "comfortable", size: 2500 },
      { text: "burger", size: 2400 },
      { text: "coffee", size: 2300 },
      { text: "sauce", size: 2200 },
      { text: "salad", size: 2100 },
      { text: "cozy", size: 2000 },
      { text: "spicy", size: 1950 },
      { text: "hot", size: 1900 },
      { text: "lunch", size: 1850 },
      { text: "dinner", size: 1800 },
      { text: "pasta", size: 1750 },
      { text: "dessert", size: 1700 },
      { text: "drink", size: 1650 },
      { text: "expensive", size: 1600 },
      { text: "cheap", size: 1550 },
      { text: "reasonable", size: 1500 },
      { text: "parking", size: 1450 },
      { text: "seating", size: 1400 },
      { text: "music", size: 1350 },
      { text: "noisy", size: 1300 },
      { text: "quiet", size: 1250 },
      { text: "romantic", size: 1200 },
      { text: "family", size: 1150 },
      { text: "kids", size: 1100 },
      { text: "outdoor", size: 1050 },
      { text: "patio", size: 1000 },
      { text: "view", size: 950 },
      { text: "decor", size: 900 },
      { text: "lighting", size: 850 },
      { text: "temperature", size: 800 },
      { text: "bathroom", size: 750 },
      { text: "handicap", size: 700 },
      { text: "accessible", size: 650 },
      { text: "reservation", size: 600 },
      { text: "takeout", size: 550 },
      { text: "delivery", size: 500 },
      { text: "credit", size: 450 },
      { text: "cash", size: 400 },
      { text: "tip", size: 350 },
      { text: "manager", size: 300 },
      { text: "owner", size: 250 },
      { text: "chef", size: 200 },
    ],
  };

  const handleGoBack = () => {
    if (onBack) onBack();
  };

  useEffect(() => {
    const loadDemoData = async () => {
      try {
        setLoading(true);

        /*
      const response = await fetch(
        "http://192.168.37.177:5001/api/review/word-cloud-analysis"
      );
      const data = await response.json();
      
      if (data && data.results) {
        console.log("Data received:", data.results);
        setWordData(data.results);
      } else {
        throw new Error("Invalid data structure received from API");
      }
      */

        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (demoWordData && demoWordData.results) {
          console.log("Demo data loaded:", demoWordData.results);
          setWordData(demoWordData.results);
        } else {
          throw new Error("Invalid demo data structure");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading demo data:", err);
        setError(`Failed to load data: ${err.message}`);
        setLoading(false);
      }
    };

    loadDemoData();
  }, []);

  const getWordColor = (index) => {
    const colors = [
      "#2563EB", // Blue
      "#7C3AED", // Purple
      "#059669", // Green
      "#DC2626", // Red
      "#D97706", // Orange
    ];
    return colors[index % colors.length];
  };

  const createBarChart = () => {
    if (!barChartRef.current || wordData.length === 0) return;

    d3.select(barChartRef.current).selectAll("*").remove();

    const data = wordData.slice(0, 20);
    const margin = { top: 30, right: 30, bottom: 120, left: 80 };
    const width = Math.max(
      barChartRef.current.clientWidth - margin.left - margin.right,
      500
    );
    const height = 500 - margin.top - margin.bottom;

    const svg = d3
      .select(barChartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().range([0, width]).padding(0.2);

    const y = d3.scaleLinear().range([height, 0]);

    x.domain(data.map((d) => d.text));
    y.domain([0, d3.max(data, (d) => d.size) * 1.1]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .attr("class", "x-axis")
      .selectAll("text")
      .attr("transform", "translate(-10,10)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "#000000");

    svg
      .append("g")
      .call(d3.axisLeft(y).ticks(10).tickFormat(d3.format(",.0f")))
      .attr("class", "y-axis")
      .selectAll("text")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "#000000");

    svg
      .selectAll(".domain")
      .style("stroke", "#000000")
      .style("stroke-width", "2px");

    svg
      .selectAll(".tick line")
      .style("stroke", "#000000")
      .style("stroke-width", "1px");

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 20)
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", "#000000")
      .text("Words");

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", "#000000")
      .text("Frequency");

    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "bar-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#3B82F6");

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#1D4ED8");

    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.text))
      .attr("width", x.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .style("fill", "url(#bar-gradient)")
      .transition()
      .duration(800)
      .delay((d, i) => i * 50)
      .attr("y", (d) => y(d.size))
      .attr("height", (d) => height - y(d.size));

    svg
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.text) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.size) - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "#000000")
      .style("opacity", 0)
      .text((d) => d.size)
      .transition()
      .duration(800)
      .delay((d, i) => i * 50)
      .style("opacity", 1);

    svg
      .selectAll(".bar")
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style("filter", "brightness(1.2)")
          .attr("stroke", "#000000")
          .attr("stroke-width", 2);

        svg
          .selectAll(".label")
          .filter((label) => label.text === d.text)
          .transition()
          .duration(200)
          .style("font-size", "14px")
          .style("fill", "#000000");
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style("filter", "none")
          .attr("stroke-width", 0);

        svg
          .selectAll(".label")
          .filter((label) => label.text === d.text)
          .transition()
          .duration(200)
          .style("font-size", "12px");
      });
  };

  useEffect(() => {
    if (wordData.length > 0) {
      createBarChart();
    }
  }, [wordData]);

  useEffect(() => {
    const handleResize = () => {
      if (wordData.length > 0) {
        createBarChart();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [wordData]);

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

  if (error)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );

  if (wordData.length === 0)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">No Data Available</p>
          <p>
            No word frequency data was found. Please check the API connection.
          </p>
        </div>
      </div>
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

      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Word Cloud Analysis
      </h1>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div
          ref={wordCloudRef}
          className="flex flex-wrap gap-3 justify-center p-6 bg-gray-50 rounded-lg min-h-[200px]"
        >
          {wordData.map((word, index) => (
            <div
              key={word.text}
              className="inline-block"
              style={{
                animation: `fadeIn 0.4s ease-in-out ${index * 0.02}s forwards`,
                opacity: 0,
              }}
            >
              <span
                className="cursor-pointer transition-all duration-300 hover:scale-110"
                style={{
                  fontSize: `${Math.max(14, Math.min(word.size / 250, 56))}px`,
                  color: getWordColor(index),
                  fontWeight: word.size > 8000 ? "bold" : "normal",
                  textShadow:
                    word.size > 8000 ? "1px 1px 2px rgba(0,0,0,0.1)" : "none",
                  display: "inline-block",
                }}
              >
                {word.text}
              </span>
            </div>
          ))}
        </div>
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Top 20 Most Frequent Words
        </h2>
        <div
          ref={barChartRef}
          className="w-full overflow-x-auto min-h-[550px]"
        ></div>
      </div>
    </div>
  );
};

export default WordCloud;
