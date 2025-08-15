import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { IoArrowBack } from "react-icons/io5";

const WordAssociationGraph = ({ onBack }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  const demoData = {
    metadata: {
      sampleSize: 25000,
      processedAt: "2024-08-15T10:30:00Z",
      executionTimeMs: 1850,
    },
    results: [
      {
        word: "food",
        associations: [
          { word: "delicious", count: 456 },
          { word: "fresh", count: 398 },
          { word: "amazing", count: 367 },
          { word: "great", count: 334 },
          { word: "excellent", count: 298 },
          { word: "good", count: 276 },
          { word: "tasty", count: 245 },
          { word: "quality", count: 198 },
          { word: "authentic", count: 176 },
          { word: "flavorful", count: 154 },
          { word: "hot", count: 132 },
          { word: "spicy", count: 118 },
          { word: "cold", count: 95 },
          { word: "bland", count: 87 },
          { word: "portion", count: 76 },
        ],
      },
      {
        word: "service",
        associations: [
          { word: "friendly", count: 523 },
          { word: "excellent", count: 445 },
          { word: "fast", count: 398 },
          { word: "attentive", count: 356 },
          { word: "professional", count: 298 },
          { word: "slow", count: 287 },
          { word: "poor", count: 234 },
          { word: "rude", count: 198 },
          { word: "helpful", count: 176 },
          { word: "quick", count: 154 },
          { word: "polite", count: 142 },
          { word: "staff", count: 128 },
          { word: "waitress", count: 115 },
          { word: "server", count: 98 },
          { word: "manager", count: 87 },
        ],
      },
      {
        word: "restaurant",
        associations: [
          { word: "atmosphere", count: 412 },
          { word: "clean", count: 378 },
          { word: "cozy", count: 334 },
          { word: "busy", count: 298 },
          { word: "noisy", count: 267 },
          { word: "crowded", count: 234 },
          { word: "comfortable", count: 198 },
          { word: "ambiance", count: 187 },
          { word: "decor", count: 165 },
          { word: "location", count: 154 },
          { word: "parking", count: 142 },
          { word: "seating", count: 128 },
          { word: "music", count: 115 },
          { word: "lighting", count: 98 },
          { word: "temperature", count: 87 },
        ],
      },
      {
        word: "pizza",
        associations: [
          { word: "crust", count: 445 },
          { word: "cheese", count: 398 },
          { word: "sauce", count: 356 },
          { word: "toppings", count: 298 },
          { word: "pepperoni", count: 267 },
          { word: "thin", count: 234 },
          { word: "thick", count: 198 },
          { word: "crispy", count: 176 },
          { word: "soggy", count: 154 },
          { word: "greasy", count: 142 },
          { word: "mushrooms", count: 128 },
          { word: "sausage", count: 115 },
          { word: "vegetarian", count: 98 },
          { word: "slice", count: 87 },
          { word: "oven", count: 76 },
        ],
      },
      {
        word: "price",
        associations: [
          { word: "expensive", count: 567 },
          { word: "reasonable", count: 445 },
          { word: "cheap", count: 398 },
          { word: "overpriced", count: 356 },
          { word: "affordable", count: 298 },
          { word: "value", count: 267 },
          { word: "worth", count: 234 },
          { word: "money", count: 198 },
          { word: "cost", count: 176 },
          { word: "budget", count: 154 },
          { word: "deal", count: 142 },
          { word: "special", count: 128 },
          { word: "discount", count: 115 },
          { word: "promotion", count: 98 },
          { word: "tip", count: 87 },
        ],
      },
      {
        word: "sushi",
        associations: [
          { word: "fresh", count: 489 },
          { word: "roll", count: 445 },
          { word: "salmon", count: 398 },
          { word: "tuna", count: 356 },
          { word: "rice", count: 298 },
          { word: "wasabi", count: 267 },
          { word: "ginger", count: 234 },
          { word: "soy", count: 198 },
          { word: "sauce", count: 176 },
          { word: "chef", count: 154 },
          { word: "quality", count: 142 },
          { word: "avocado", count: 128 },
          { word: "cucumber", count: 115 },
          { word: "spicy", count: 98 },
          { word: "california", count: 87 },
        ],
      },
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
          "http://192.168.37.177:5001/api/review/word-association-graph"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        */

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setData(demoData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    loadDemoData();
  }, []);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    d3.select(svgRef.current).selectAll("*").remove();
    d3.select(containerRef.current).selectAll(".tooltip").remove();

    createForceGraph();
  }, [data, selectedWord]);

  const createForceGraph = () => {
    if (!data) return;

    const width = containerRef.current.clientWidth;
    const height = 600;

    const nodes = [];
    const links = [];

    data.results.forEach((item) => {
      if (selectedWord && selectedWord !== item.word) {
        return;
      }

      nodes.push({
        id: item.word,
        group: 1,
        radius: 15,
        count: d3.sum(item.associations.map((a) => a.count)),
      });

      item.associations.forEach((assoc) => {
        if (
          ["the", "and", "for", "with", "was", "that"].includes(assoc.word) &&
          assoc.count < 50
        )
          return;

        const existingNode = nodes.find((n) => n.id === assoc.word);
        if (!existingNode) {
          nodes.push({
            id: assoc.word,
            group: 2,
            radius: 8 + Math.sqrt(assoc.count) / 3,
            count: assoc.count,
          });
        }

        links.push({
          source: item.word,
          target: assoc.word,
          value: assoc.count,
        });
      });
    });

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("class", "bg-gray-50 rounded-lg");

    const tooltip = d3
      .select(containerRef.current)
      .append("div")
      .attr(
        "class",
        "tooltip absolute hidden bg-black text-white p-2 rounded text-sm pointer-events-none z-10"
      )
      .style("opacity", 0);

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(150)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide().radius((d) => d.radius * 2.5)
      );

    const link = svg
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d) => Math.sqrt(d.value) / 1.5);

    const nodeGroup = svg
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(drag(simulation))
      .on("mouseover", (event, d) => {
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0.9)
          .style("display", "block");

        tooltip
          .html(
            `
          <div>
            <strong>${d.id}</strong><br/>
            Count: ${d.count}
          </div>
        `
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        tooltip
          .transition()
          .duration(500)
          .style("opacity", 0)
          .style("display", "none");
      })
      .on("click", (event, d) => {
        setSelectedWord(selectedWord === d.id ? null : d.id);
      });

    nodeGroup
      .append("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) => (d.group === 1 ? "#ff6b6b" : "#4ecdc4"))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);

    nodeGroup
      .append("text")
      .text((d) => d.id)
      .attr("font-size", (d) => (d.group === 1 ? "14px" : "10px"))
      .attr("fill", "#333")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => (d.group === 1 ? d.radius + 15 : d.radius + 12))
      .attr("pointer-events", "none")
      .attr("font-weight", (d) => (d.group === 1 ? "bold" : "normal"));

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      nodeGroup.attr("transform", (d) => {
        d.x = Math.max(d.radius, Math.min(width - d.radius, d.x));
        d.y = Math.max(d.radius, Math.min(height - d.radius, d.y));
        return `translate(${d.x},${d.y})`;
      });
    });

    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
  };

  const renderWordSelector = () => {
    if (!data) return null;

    return (
      <div className="mb-4">
        <label
          htmlFor="word-select"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Select a word to focus:
        </label>
        <div className="relative">
          <select
            id="word-select"
            value={selectedWord || ""}
            onChange={(e) => setSelectedWord(e.target.value || null)}
            className="block w-full pl-3 pr-10 py-2 text-blue-900 border border-amber-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none"
          >
            <option value="">All Words</option>
            {data.results
              .sort((a, b) => a.word.localeCompare(b.word))
              .map((item) => (
                <option key={item.word} value={item.word}>
                  {item.word}
                </option>
              ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    );
  };

  const renderBarChart = () => {
    if (!selectedWord || !data) return null;

    const wordData = data.results.find((item) => item.word === selectedWord);
    if (!wordData) return null;

    const topAssociations = [...wordData.associations]
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const maxCount = topAssociations[0].count;

    return (
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">
          Top 10 Associations for "{selectedWord}"
        </h2>
        <div className="space-y-3">
          {topAssociations.map((assoc, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-24 text-sm font-medium truncate pr-2"
                title={assoc.word}
              >
                {assoc.word}
              </div>
              <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full flex items-center justify-end pr-2"
                  style={{
                    width: `${Math.max(5, (assoc.count / maxCount) * 100)}%`,
                  }}
                >
                  {assoc.count / maxCount > 0.3 && (
                    <span className="text-xs font-medium text-white">
                      {assoc.count}
                    </span>
                  )}
                </div>
              </div>
              {assoc.count / maxCount <= 0.3 && (
                <div className="w-12 text-right text-sm ml-2 text-gray-600">
                  {assoc.count}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAssociationTable = () => {
    if (!selectedWord || !data) return null;

    const wordData = data.results.find((item) => item.word === selectedWord);
    if (!wordData) return null;

    return (
      <div className="mt-4 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">
          All Associations for "{selectedWord}"
        </h2>
        <div className="max-h-64 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {wordData.associations
                .sort((a, b) => b.count - a.count)
                .map((assoc, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      {assoc.word}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                      {assoc.count}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 relative" ref={containerRef}>
      <button
        onClick={handleGoBack}
        className="absolute top-5 left-5 flex items-center gap-2 py-2 px-4 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-all duration-300 z-10"
        aria-label="Back to Business Analysis Dashboard"
      >
        <IoArrowBack className="text-gray-700 text-lg" />
        <span className="text-gray-700 font-medium">Back</span>
      </button>

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Restaurant Reviews - Word Association Graph
      </h1>

      {loading && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Loading restaurant review data...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      )}

      {data && (
        <div>
          <div className="mb-4 bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-black">
              Dataset Information
            </h2>
            <p className="text-sm text-gray-700">
              Sample Size:{" "}
              <span className="font-medium">
                {data.metadata.sampleSize.toLocaleString()} restaurant reviews
              </span>
            </p>
            <p className="text-sm text-gray-700">
              Processed At:{" "}
              <span className="font-medium">
                {new Date(data.metadata.processedAt).toLocaleString()}
              </span>
            </p>
            <p className="text-sm text-gray-700">
              Execution Time:{" "}
              <span className="font-medium">
                {data.metadata.executionTimeMs.toLocaleString()}ms
              </span>
            </p>
          </div>

          {renderWordSelector()}

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              {selectedWord
                ? `Showing associations for "${selectedWord}" from restaurant reviews. Click on the word again to show all words.`
                : "Click on any word to focus on its associations from restaurant reviews."}
            </p>
            {selectedWord && (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                onClick={() => setSelectedWord(null)}
              >
                Reset View
              </button>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <svg ref={svgRef}></svg>
          </div>

          {selectedWord && renderBarChart()}

          {selectedWord && renderAssociationTable()}
        </div>
      )}
    </div>
  );
};

export default WordAssociationGraph;
