// PieChart.jsx
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const PieChart = ({ data, width = 400, height = 400, colors = d3.schemeCategory10 }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Setup dimensions
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const radius = Math.min(innerWidth, innerHeight) / 2;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Create pie generator
    const pie = d3.pie()
      .value(d => d.value)
      .sort(null);

    // Create arc generator
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    // Create color scale
    const colorScale = d3.scaleOrdinal(colors);

    // Draw pie segments
    const arcs = svg.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => colorScale(i))
      .attr('class', 'hover:opacity-80 transition-opacity duration-300')
      .append('title')
      .text(d => `${d.data.label}: ${d.data.value}`);

    // Add labels
    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-xs font-medium fill-white')
      .text(d => d.data.value > 5 ? d.data.label : '');

  }, [data, width, height, colors]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Pie Chart</h3>
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
};

export default PieChart;
