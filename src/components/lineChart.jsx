// LineChart.jsx
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const LineChart = ({ 
  data, 
  width = 600, 
  height = 400, 
  xAccessor = d => d.x,
  yAccessor = d => d.y,
  color = 'steelblue' 
}) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Setup dimensions
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, xAccessor))
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, yAccessor) * 1.1]) // Add 10% padding
      .range([innerHeight, 0]);

    // Create line generator
    const line = d3.line()
      .x(d => xScale(xAccessor(d)))
      .y(d => yScale(yAccessor(d)))
      .curve(d3.curveMonotoneX);

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .attr('class', 'text-gray-600');

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(yScale))
      .attr('class', 'text-gray-600');

    // Add line
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2)
      .attr('d', line)
      .attr('class', 'transition-all duration-500 ease-in-out');

    // Add dots
    svg.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(xAccessor(d)))
      .attr('cy', d => yScale(yAccessor(d)))
      .attr('r', 4)
      .attr('fill', color)
      .attr('class', 'hover:r-6 transition-all duration-300')
      .append('title')
      .text(d => `(${xAccessor(d)}, ${yAccessor(d)})`);

  }, [data, width, height, xAccessor, yAccessor, color]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Line Chart</h3>
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
};

export default LineChart;
