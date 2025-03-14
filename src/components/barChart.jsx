// BarChart.jsx
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const BarChart = ({ 
  data, 
  width = 600, 
  height = 400,
  xAccessor = d => d.label,
  yAccessor = d => d.value,
  color = 'steelblue'
}) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Setup dimensions
    const margin = { top: 20, right: 20, bottom: 60, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create scales
    const xScale = d3.scaleBand()
      .domain(data.map(xAccessor))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, yAccessor) * 1.1]) // Add 10% padding
      .range([innerHeight, 0]);

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
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('class', 'text-xs');

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(yScale));

    // Add bars
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(xAccessor(d)))
      .attr('y', d => yScale(yAccessor(d)))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(yAccessor(d)))
      .attr('fill', color)
      .attr('class', 'hover:opacity-80 transition-opacity duration-300')
      .append('title')
      .text(d => `${xAccessor(d)}: ${yAccessor(d)}`);

  }, [data, width, height, xAccessor, yAccessor, color]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Bar Chart</h3>
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
};

export default BarChart;
