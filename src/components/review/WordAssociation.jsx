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

  const handleGoBack = () => {
    if (onBack) onBack();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://192.168.37.177:5001/api/review/word-association-graph"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
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
        radius: 15, // Larger radius for better visibility
        count: d3.sum(item.associations.map((a) => a.count)),
      });

      // Add associations as nodes and create links
      item.associations.forEach((assoc) => {
        // Skip very common words with low counts to reduce clutter
        if (
          ["the", "and", "for", "with", "was", "that"].includes(assoc.word) &&
          assoc.count < 50
        )
          return;

        // Check if this association node already exists
        const existingNode = nodes.find((n) => n.id === assoc.word);
        if (!existingNode) {
          nodes.push({
            id: assoc.word,
            group: 2,
            radius: 8 + Math.sqrt(assoc.count) / 3, // Adjusted for better visibility
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

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("class", "bg-gray-50 rounded-lg");

    // Create a tooltip
    const tooltip = d3
      .select(containerRef.current)
      .append("div")
      .attr(
        "class",
        "tooltip absolute hidden bg-black text-white p-2 rounded text-sm pointer-events-none z-10"
      )
      .style("opacity", 0);

    // Create a force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(150)
      ) // Increased distance
      .force("charge", d3.forceManyBody().strength(-300)) // Stronger repulsion
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide().radius((d) => d.radius * 2.5)
      ); // Prevent overlap

    // Create links
    const link = svg
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d) => Math.sqrt(d.value) / 1.5);

    // Create node groups
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
        // Toggle selection
        setSelectedWord(selectedWord === d.id ? null : d.id);
      });

    // Add circles to node groups
    nodeGroup
      .append("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) => (d.group === 1 ? "#ff6b6b" : "#4ecdc4"))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);

    // Add text labels directly to node groups
    // This ensures text and circles move together
    nodeGroup
      .append("text")
      .text((d) => d.id)
      .attr("font-size", (d) => (d.group === 1 ? "14px" : "10px"))
      .attr("fill", "#333")
      .attr("text-anchor", "middle") // Center text
      .attr("dy", (d) => (d.group === 1 ? d.radius + 15 : d.radius + 12)) // Position below circle
      .attr("pointer-events", "none")
      .attr("font-weight", (d) => (d.group === 1 ? "bold" : "normal"));

    // Update positions on each tick of the simulation
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      // Keep nodes within bounds
      nodeGroup.attr("transform", (d) => {
        d.x = Math.max(d.radius, Math.min(width - d.radius, d.x));
        d.y = Math.max(d.radius, Math.min(height - d.radius, d.y));
        return `translate(${d.x},${d.y})`;
      });
    });

    // Drag functionality
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

  // Word selector dropdown
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
            className="block w-full pl-3 pr-10 py-2 text-base border border-amber-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none"
          >
            <option value="">All Words</option>
            {data.results
              .sort((a, b) => a.word.localeCompare(b.word)) // Alphabetical order
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

  // Bar chart for top associations
  const renderBarChart = () => {
    if (!selectedWord || !data) return null;

    const wordData = data.results.find((item) => item.word === selectedWord);
    if (!wordData) return null;

    // Take top 10 associations
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
                  {/* Show count inside bar if enough space */}
                  {assoc.count / maxCount > 0.3 && (
                    <span className="text-xs font-medium text-white">
                      {assoc.count}
                    </span>
                  )}
                </div>
              </div>
              {/* Show count outside bar if not enough space */}
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

  // Detailed association table
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
        Word Association Graph
      </h1>

      {loading && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading data...</p>
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
            <h2 className="text-lg font-semibold text-black">Metadata</h2>
            <p className="text-sm text-gray-700">
              Sample Size:{" "}
              <span className="font-medium">
                {data.metadata.sampleSize.toLocaleString()}
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

          {/* Word selector dropdown */}
          {renderWordSelector()}

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              {selectedWord
                ? `Showing associations for "${selectedWord}". Click on it again to show all words.`
                : "Click on any word to focus on its associations."}
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

          {/* Bar chart for selected word */}
          {selectedWord && renderBarChart()}

          {/* Association table for selected word */}
          {selectedWord && renderAssociationTable()}
        </div>
      )}
    </div>
  );
};

export default WordAssociationGraph;
