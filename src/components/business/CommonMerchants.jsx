import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

const CommonMerchants = () => {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const pieChartRef = useRef();
  const lineChartRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/business/top-merchants');
        setMerchants(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch merchant data');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (merchants.length > 0 && !loading) {
      drawPieChart();
      drawLineChart();
    }
  }, [merchants, loading]);

  const drawPieChart = () => {
    // Clear previous chart
    d3.select(pieChartRef.current).selectAll("*").remove();

    // Use only top 10 merchants for better visualization
    const topMerchants = merchants.slice(0, 10);
    
    const width = 600;
    const height = 600;
    const radius = Math.min(width, height) / 2;
    
    const svg = d3.select(pieChartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
    
    const color = d3.scaleOrdinal()
      .domain(topMerchants.map(d => d.name))
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), topMerchants.length));
    
    const pie = d3.pie()
      .value(d => d.count)
      .sort(null);
    
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius * 0.7); // Reduced to leave more space for labels
    
    const outerArc = d3.arc()
      .innerRadius(radius * 0.8)
      .outerRadius(radius * 0.8);
    
    const arcs = svg.selectAll('.arc')
      .data(pie(topMerchants))
      .enter()
      .append('g')
      .attr('class', 'arc');
    
    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.name))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.7);
    
    // Add polylines for labels
    arcs.append('polyline')
      .attr('points', d => {
        const pos = outerArc.centroid(d);
        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        return [arc.centroid(d), outerArc.centroid(d), pos];
      })
      .style('fill', 'none')
      .style('stroke', '#555')
      .style('stroke-width', 1);
    
    // Add merchant name labels
    arcs.append('text')
      .attr('transform', d => {
        const pos = outerArc.centroid(d);
        pos[0] = radius * 0.99 * (midAngle(d) < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .attr('text-anchor', d => midAngle(d) < Math.PI ? 'start' : 'end')
      .text(d => `${d.data.name}`)
      .style('font-size', '14px')
      .style('font-weight', 'bold');
    
    // Add count labels below merchant names
    arcs.append('text')
      .attr('transform', d => {
        const pos = outerArc.centroid(d);
        pos[0] = radius * 0.99 * (midAngle(d) < Math.PI ? 1 : -1);
        pos[1] += 16; // Position below the name
        return `translate(${pos})`;
      })
      .attr('text-anchor', d => midAngle(d) < Math.PI ? 'start' : 'end')
      .text(d => `Count: ${d.data.count}`)
      .style('font-size', '12px');
    
    // Add title
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -height/2 + 20)
      .text('Top 10 Merchants by Count')
      .style('font-size', '16px')
      .style('font-weight', 'bold');
    
    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }
  };

  const drawLineChart = () => {
    // Clear previous chart
    d3.select(lineChartRef.current).selectAll("*").remove();
    
    // Sort merchants by count for better visualization
    const sortedMerchants = [...merchants].sort((a, b) => a.count - b.count);
    
    const margin = { top: 50, right: 150, bottom: 80, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    const svg = d3.select(lineChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // X scale
    const x = d3.scalePoint()
      .domain(sortedMerchants.map(d => d.name))
      .range([0, width]);
    
    // Y scales for count and rating
    const yCount = d3.scaleLinear()
      .domain([0, d3.max(sortedMerchants, d => d.count) * 1.1])
      .range([height, 0]);
    
    const yRating = d3.scaleLinear()
      .domain([0, 5])
      .range([height, 0]);
    
    // X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "10px");
    
    // Y axis for count
    svg.append('g')
      .call(d3.axisLeft(yCount));
    
    // Y axis for rating
    svg.append('g')
      .attr('transform', `translate(${width}, 0)`)
      .call(d3.axisRight(yRating));
    
    // Line for count
    const countLine = d3.line()
      .x(d => x(d.name))
      .y(d => yCount(d.count));
    
    svg.append('path')
      .datum(sortedMerchants)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', countLine);
    
    // Line for rating
    const ratingLine = d3.line()
      .x(d => x(d.name))
      .y(d => yRating(d.averageRating));
    
    svg.append('path')
      .datum(sortedMerchants)
      .attr('fill', 'none')
      .attr('stroke', 'orangered')
      .attr('stroke-width', 2)
      .attr('d', ratingLine);
    
    // Add dots for count
    svg.selectAll('.dot-count')
      .data(sortedMerchants)
      .enter()
      .append('circle')
      .attr('class', 'dot-count')
      .attr('cx', d => x(d.name))
      .attr('cy', d => yCount(d.count))
      .attr('r', 5)
      .attr('fill', 'steelblue');
    
    // Add dots for rating
    svg.selectAll('.dot-rating')
      .data(sortedMerchants)
      .enter()
      .append('circle')
      .attr('class', 'dot-rating')
      .attr('cx', d => x(d.name))
      .attr('cy', d => yRating(d.averageRating))
      .attr('r', 5)
      .attr('fill', 'orangered');
    
    // Add title
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', -20)
      .text('Merchant Count vs. Average Rating')
      .style('font-size', '16px')
      .style('font-weight', 'bold');
    
    // Add axis labels
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .text('Merchant Name')
      .style('font-size', '14px');
    
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 15)
      .attr('x', -height / 2)
      .text('Count')
      .style('font-size', '14px')
      .style('fill', 'steelblue');
    
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('y', width + margin.right - 15)
      .attr('x', -height / 2)
      .text('Average Rating')
      .style('font-size', '14px')
      .style('fill', 'orangered');
    
    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 0)`);
    
    legend.append('circle').attr('cx', 0).attr('cy', 20).attr('r', 6).style('fill', 'steelblue');
    legend.append('text').attr('x', 10).attr('y', 20).text('Count').style('font-size', '12px').attr('alignment-baseline', 'middle');
    
    legend.append('circle').attr('cx', 0).attr('cy', 40).attr('r', 6).style('fill', 'orangered');
    legend.append('text').attr('x', 10).attr('y', 40).text('Rating').style('font-size', '12px').attr('alignment-baseline', 'middle');
  };

  return (
    <div className="max-w-7xl mx-auto p-5 font-sans">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Common Merchants Analysis</h1>
      
      {loading && <p className="text-center text-gray-600">Loading data...</p>}
      {error && <p className="text-center text-red-600 font-bold">{error}</p>}
      
      {!loading && !error && (
        <>
          <div className="mb-10 p-6 border border-gray-200 rounded-lg bg-white shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Merchant Distribution</h2>
            <div ref={pieChartRef} className="flex justify-center"></div>
          </div>
          
          <div className="mb-10 p-6 border border-gray-200 rounded-lg bg-white shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Merchant Count vs Rating</h2>
            <div ref={lineChartRef} className="flex justify-center overflow-x-auto"></div>
          </div>
        </>
      )}
    </div>
  );
};

export default CommonMerchants;
