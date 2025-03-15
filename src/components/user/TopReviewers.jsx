import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const TopReviewers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const svgRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/user/top-reviewers');
        const sortedData = response.data.sort((a, b) => b.review_count - a.review_count);
        setData(sortedData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch top reviewers data');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0 && !loading) {
      drawChart();
    }
  }, [data, loading]);

  const drawChart = () => {
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 40, right: 30, bottom: 60, left: 120 }; // Increased margins
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.review_count) * 1.1])
      .range([0, width]);

    const y = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, height])
      .padding(0.3);

    // Add X axis with improved visibility
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#333')
      .attr('dy', '1em'); // Move text slightly down

    // Add X axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#333')
      .text('Number of Reviews');

    // Add Y axis with improved visibility
    svg.append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#333')
      .style('font-weight', 'bold')
      .attr('dx', '-0.5em'); // Move text slightly left

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text('Top Reviewers');

    const colorScale = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      .range(d3.schemeCategory10);

    // Create and animate bars
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('y', d => y(d.name))
      .attr('height', y.bandwidth())
      .attr('x', 0)
      .attr('width', 0)
      .attr('fill', d => colorScale(d.name))
      .attr('rx', 4)
      .attr('ry', 4)
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .attr('width', d => x(d.review_count));

    // Add review count labels
    svg.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.review_count) - 40)
      .attr('y', d => y(d.name) + y.bandwidth() / 2 + 5)
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', 'white')
      .style('opacity', 0)
      .text(d => d3.format(",")(d.review_count))
      .transition()
      .duration(800)
      .delay((d, i) => i * 100 + 300)
      .style('opacity', 1);

    // Hover effects
    svg.selectAll('.bar')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 0.8)
          .attr('stroke', '#333')
          .attr('stroke-width', 2);

        const tooltip = svg.append('g')
          .attr('class', 'tooltip')
          .attr('transform', `translate(${x(d.review_count) / 2}, ${y(d.name) - 15})`);

        tooltip.append('rect')
          .attr('width', 160)
          .attr('height', 50)
          .attr('rx', 5)
          .attr('ry', 5)
          .attr('fill', 'rgba(0,0,0,0.7)');

        tooltip.append('text')
          .attr('x', 80)
          .attr('y', 20)
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .style('font-weight', 'bold')
          .text(`${d.name}`);

        tooltip.append('text')
          .attr('x', 80)
          .attr('y', 40)
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .text(`Reviews: ${d3.format(",")(d.review_count)}`);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 1)
          .attr('stroke', 'none');

        svg.select('.tooltip').remove();
      });
  };

  return (
    <div className="top-reviewers-container" style={{ 
      maxWidth: '850px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
       {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {!loading && !error && (
        <>
          <div style={{ overflowX: 'auto' }}>
            <svg ref={svgRef}></svg>
          </div>
          
          <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
            <p>This chart displays our top reviewers based on the total number of reviews submitted.</p>
          </div>
        </>
      )}
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TopReviewers;