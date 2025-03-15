import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

const YearlyJoins = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMetric, setActiveMetric] = useState('totalUsers');
  
  const chartRef = useRef();

  // Available metrics to display with their colors matching the image
  const metrics = [
    { id: 'totalUsers', label: 'Total Users', color: '#4285F4' },     // Blue
    { id: 'totalReviews', label: 'Total Reviews', color: '#34A853' }, // Green
    { id: 'eliteUsers', label: 'Elite Users', color: '#EA4335' },     // Red
    { id: 'regularUsers', label: 'Regular Users', color: '#FBBC05' }, // Yellow/Orange
    { id: 'totalFans', label: 'Total Fans', color: '#F39C12' },       // Orange
    { id: 'activeUsers', label: 'Active Users', color: '#16A085' },   // Additional metric
    { id: 'silentUsers', label: 'Silent Users', color: '#8E24AA' }    // Additional metric
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/user/yearly-joins');
        // Sort data by year to ensure proper line drawing
        const sortedData = response.data.sort((a, b) => a.year - b.year);
        setUserData(sortedData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user data');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (userData.length > 0 && !loading) {
      drawChart();
    }
  }, [userData, loading, activeMetric]);

  const drawChart = () => {
    // Clear previous chart
    d3.select(chartRef.current).selectAll("*").remove();
    
    const margin = { top: 60, right: 120, bottom: 60, left: 80 };
    const width = 900 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    // Create SVG container
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Create tooltip div with styling exactly matching the image
    const tooltip = d3.select(chartRef.current)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('padding', '20px')
      .style('background', 'white')
      .style('border-radius', '8px')
      .style('box-shadow', '0 4px 15px rgba(0, 0, 0, 0.15)')
      .style('pointer-events', 'none')
      .style('font-size', '14px')
      .style('z-index', 10)
      .style('min-width', '220px')
      .style('line-height', '1.8')
      .style('transition', 'all 0.3s ease');
    
    // X scale - years
    const x = d3.scaleLinear()
      .domain(d3.extent(userData, d => d.year))
      .range([0, width]);
    
    // Add X axis with enhanced styling
    const xAxis = svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .attr('class', 'x-axis')
      .call(d3.axisBottom(x)
        .ticks(userData.length)
        .tickFormat(d3.format('d')));
    
    // Style X axis text
    xAxis.selectAll("text")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "#555")
      .attr("dy", "1em");
    
    // Style X axis lines
    xAxis.selectAll("line")
      .style("stroke", "#ccc");
    
    xAxis.selectAll("path")
      .style("stroke", "#ccc");
    
    // Add X axis label with animation
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 5) // Adjusted position to be more below
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#555')
      .style('opacity', 0)
      .text('Year')
      .transition()
      .duration(1000)
      .style('opacity', 1);
    
    // Find the maximum value for the current metric to set Y scale
    const maxValue = d3.max(userData, d => {
      // For all metrics except the active one, return 0 (to not affect the scale)
      const values = metrics.map(metric => 
        metric.id === activeMetric ? d[metric.id] : 0
      );
      return d3.max(values);
    });
    
    // Y scale with some padding at the top
    const y = d3.scaleLinear()
      .domain([0, maxValue * 1.1]) // Add 10% padding at the top
      .range([height, 0]);
    
    // Add Y axis with enhanced styling
    const yAxis = svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y)
        .ticks(5)
        .tickFormat(d => {
          if (d >= 1000000) return `${d/1000000}M`;
          if (d >= 1000) return `${d/1000}K`;
          return d;
        }));
    
    // Style Y axis text
    yAxis.selectAll("text")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "#555");
    
    // Style Y axis lines
    yAxis.selectAll("line")
      .style("stroke", "#ccc");
    
    yAxis.selectAll("path")
      .style("stroke", "#ccc");
    
    // Add Y axis label with animation
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 20)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#555')
      .style('opacity', 0)
      .text('Count')
      .transition()
      .duration(1000)
      .style('opacity', 1);
    
    // Add title with animation
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '20px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .style('opacity', 0)
      .text('Yearly User Growth Analysis')
      .transition()
      .duration(1000)
      .style('opacity', 1);
    
    // Add grid lines with animation
    const grid = svg.append('g')
      .attr('class', 'grid')
      .style('opacity', 0)
      .call(d3.axisLeft(y)
        .ticks(5)
        .tickSize(-width)
        .tickFormat('')
      );
    
    grid.selectAll("line")
      .style("stroke", "#e5e5e5")
      .style("stroke-dasharray", "3,3");
    
    // Remove the grid's domain line
    grid.selectAll("path").style("stroke-width", 0);
    
    // Animate grid appearance
    grid.transition()
      .duration(1000)
      .style('opacity', 0.7);
    
    // Create line generator
    const line = d3.line()
      .x(d => x(d.year))
      .y(d => y(d[activeMetric]))
      .curve(d3.curveMonotoneX); // Smooth curve
    
    // Add the line path with enhanced animation
    const path = svg.append('path')
      .datum(userData)
      .attr('fill', 'none')
      .attr('stroke', metrics.find(m => m.id === activeMetric).color)
      .attr('stroke-width', 3)
      .attr('d', line);
    
    // Animate the line drawing with longer duration
    const pathLength = path.node().getTotalLength();
    path
      .attr("stroke-dasharray", pathLength)
      .attr("stroke-dashoffset", pathLength)
      .transition()
      .duration(2000)
      .ease(d3.easePolyOut)
      .attr("stroke-dashoffset", 0)
      .on("end", animateDataPoints); // Start data point animation after line is drawn
    
    // Function to animate data points sequentially
    function animateDataPoints() {
      // Add data points with enhanced hover effect
      svg.selectAll('.data-point')
        .data(userData)
        .enter()
        .append('circle')
        .attr('class', 'data-point')
        .attr('cx', d => x(d.year))
        .attr('cy', d => y(d[activeMetric]))
        .attr('r', 0) // Start with radius 0 for animation
        .attr('fill', metrics.find(m => m.id === activeMetric).color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .transition()
        .delay((d, i) => i * 100)
        .duration(500)
        .attr('r', 6)
        .on("end", (d, i, nodes) => {
          // Add hover effects after animation completes
          if (i === nodes.length - 1) {
            addHoverEffects();
          }
        });
    }
    
    // Function to add hover effects to data points
    function addHoverEffects() {
      svg.selectAll('.data-point')
        .on('mouseover', function(event, d) {
          // Expand point with animation
          d3.select(this)
            .transition()
            .duration(300)
            .attr('r', 8)
            .attr('stroke-width', 3);
          
          // Add pulse animation
          d3.select(this)
            .append("animate")
            .attr("attributeName", "r")
            .attr("values", "6;8;6")
            .attr("dur", "1.5s")
            .attr("repeatCount", "indefinite");
          
          // Show tooltip with animation
          tooltip.transition()
            .duration(300)
            .style('opacity', 1)
            .style('transform', 'scale(1)');
          
          // Create tooltip content with colored values exactly matching the image
          // Note: Using the exact color codes from the metrics array
          tooltip.html(`
            <div style="font-weight: bold; margin-bottom: 15px; font-size: 18px; color: #333;">Year: ${d.year}</div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="color: #9e9e9e; font-size: 16px;">Total Users:</span>
              <span style="font-weight: bold; color: #4285F4; font-size: 16px;">${d.totalUsers.toLocaleString()}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="color: #9e9e9e; font-size: 16px;">Total Reviews:</span>
              <span style="font-weight: bold; color: #34A853; font-size: 16px;">${d.totalReviews.toLocaleString()}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="color: #9e9e9e; font-size: 16px;">Elite Users:</span>
              <span style="font-weight: bold; color: #EA4335; font-size: 16px;">${d.eliteUsers.toLocaleString()}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="color: #9e9e9e; font-size: 16px;">Regular Users:</span>
              <span style="font-weight: bold; color: #FBBC05; font-size: 16px;">${d.regularUsers.toLocaleString()}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #9e9e9e; font-size: 16px;">Total Fans:</span>
              <span style="font-weight: bold; color: #F39C12; font-size: 16px;">${d.totalFans.toLocaleString()}</span>
            </div>
          `)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 10}px`);
          
          // Highlight the year on x-axis
          xAxis.selectAll("text")
            .filter(t => t === d.year)
            .transition()
            .duration(200)
            .style("font-size", "14px")
            .style("fill", metrics.find(m => m.id === activeMetric).color);
        })
        .on('mouseout', function(event, d) {
          d3.select(this)
            .transition()
            .duration(300)
            .attr('r', 6)
            .attr('stroke-width', 2);
          
          // Remove pulse animation
          d3.select(this).select("animate").remove();
          
          // Hide tooltip with animation
          tooltip.transition()
            .duration(300)
            .style('opacity', 0)
            .style('transform', 'scale(0.95)');
          
          // Reset x-axis text
          xAxis.selectAll("text")
            .filter(t => t === d.year)
            .transition()
            .duration(200)
            .style("font-size", "12px")
            .style("fill", "#555");
        });
    }
    
    // Create a legend for metric selection with enhanced styling and animations
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width + 20}, 0)`);
    
    // Add legend title with animation
    legend.append('text')
      .attr('x', 0)
      .attr('y', -10)
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .style('opacity', 0)
      .text('Metrics')
      .transition()
      .duration(1000)
      .style('opacity', 1);
    
    // Add legend items with sequential animation
    const legendItems = legend.selectAll('.legend-item')
      .data(metrics)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 30 + 10})`)
      .style('cursor', 'pointer')
      .style('opacity', 0)
      .on('click', function(event, d) {
        // Add click animation
        d3.select(this)
          .transition()
          .duration(300)
          .attr('transform', (d, i) => `translate(5, ${i * 30 + 10})`)
          .transition()
          .duration(300)
          .attr('transform', (d, i) => `translate(0, ${i * 30 + 10})`);
        
        // Update active metric with animation
        const oldMetric = activeMetric;
        const newMetric = d.id;
        
        // Animate the transition between metrics
        if (oldMetric !== newMetric) {
          // Fade out the current line
          path.transition()
            .duration(500)
            .style('opacity', 0)
            .on('end', () => {
              // Update the active metric
              setActiveMetric(newMetric);
            });
          
          // Fade out the current data points
          svg.selectAll('.data-point')
            .transition()
            .duration(500)
            .style('opacity', 0);
        }
      });
    
    // Animate legend items sequentially
    legendItems.transition()
      .delay((d, i) => 1000 + i * 100)
      .duration(500)
      .style('opacity', 1);
    
    // Add colored rectangles
    legendItems.append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .attr('rx', 3)
      .style('fill', d => d.color)
      .style('stroke', d => d.id === activeMetric ? '#333' : 'none')
      .style('stroke-width', d => d.id === activeMetric ? 2 : 0);
    
    // Add labels
    legendItems.append('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('font-size', '12px')
      .style('font-weight', d => d.id === activeMetric ? 'bold' : 'normal')
      .style('fill', '#333')
      .text(d => d.label);
    
    // Add hover effects to legend items
    legendItems
      .on('mouseover', function(event, d) {
        d3.select(this).select('rect')
          .transition()
          .duration(200)
          .style('stroke', '#333')
          .style('stroke-width', 2);
        
        d3.select(this).select('text')
          .transition()
          .duration(200)
          .style('font-weight', 'bold')
          .style('fill', d.color);
      })
      .on('mouseout', function(event, d) {
        if (d.id !== activeMetric) {
          d3.select(this).select('rect')
            .transition()
            .duration(200)
            .style('stroke', 'none')
            .style('stroke-width', 0);
          
          d3.select(this).select('text')
            .transition()
            .duration(200)
            .style('font-weight', 'normal')
            .style('fill', '#333');
        }
      });
    
    // Add a note about clicking legend items with animation
    svg.append('text')
      .attr('x', width)
      .attr('y', height + 40)
      .attr('text-anchor', 'end')
      .style('font-size', '12px')
      .style('font-style', 'italic')
      .style('fill', '#666')
      .style('opacity', 0)
      .text('Click on a metric in the legend to change the displayed data')
      .transition()
      .delay(2000)
      .duration(1000)
      .style('opacity', 1);
  };

  return (
    <div className="max-w-7xl mx-auto p-5 bg-gray-50 font-sans">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Yearly User Growth Analysis</h1>
      
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
        <div className="border border-gray-200 rounded-lg bg-white shadow-lg p-6">
          <div className="mb-4">
            <p className="text-gray-600">
              This visualization shows the growth of different user categories by year. Click on a metric in the legend to view its trend over time.
            </p>
          </div>
          <div ref={chartRef} className="flex justify-center overflow-hidden"></div>
          
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Summary Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {userData.length > 0 && (
                <>
                  <div className="bg-blue-50 p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
                    <p className="text-sm text-gray-600">Most Recent Year</p>
                    <p className="text-2xl font-bold text-blue-700 animate-fadeIn">
                      {userData[userData.length - 1].year}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">Total Users</p>
                    <p className="text-xl font-bold text-blue-700 animate-fadeIn">
                      {userData[userData.length - 1].totalUsers.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
                    <p className="text-sm text-gray-600">Total Reviews</p>
                    <p className="text-2xl font-bold text-green-700 animate-fadeIn">
                      {d3.sum(userData, d => d.totalReviews).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">Average Reviews per User</p>
                    <p className="text-xl font-bold text-green-700 animate-fadeIn">
                      {(d3.sum(userData, d => d.totalReviews) / d3.sum(userData, d => d.totalUsers)).toFixed(1)}
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
                    <p className="text-sm text-gray-600">Elite Users Percentage</p>
                    <p className="text-2xl font-bold text-purple-700 animate-fadeIn">
                      {(d3.sum(userData, d => d.eliteUsers) / d3.sum(userData, d => d.totalUsers) * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600 mt-2">Total Fans</p>
                    <p className="text-xl font-bold text-purple-700 animate-fadeIn">
                      {d3.sum(userData, d => d.totalFans).toLocaleString()}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        
        .tooltip {
          transform-origin: center top;
          transform: scale(0.95);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        .data-point {
          transition: all 0.3s ease;
        }
        
        .legend-item {
          transition: all 0.3s ease;
        }
        
        .hover\\:shadow-md:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
      `}</style>
    </div>
  );
};

export default YearlyJoins;
