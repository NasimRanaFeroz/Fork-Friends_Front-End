import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

const RestaurantReviews = () => {
  const [restaurantData, setRestaurantData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const barChartRef = useRef();
  const donutChartRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/business/restaurant-analysis');
        setRestaurantData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch restaurant data');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (restaurantData.length > 0 && !loading) {
      drawBarChart();
      drawDonutChart();
    }
  }, [restaurantData, loading]);

  const drawBarChart = () => {
    // Clear previous chart
    d3.select(barChartRef.current).selectAll("*").remove();
    
    const margin = { top: 60, right: 30, bottom: 100, left: 80 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    const svg = d3.select(barChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Sort data by total reviews (descending)
    const sortedData = [...restaurantData].sort((a, b) => b.totalReviews - a.totalReviews);
    
    // X scale
    const x = d3.scaleBand()
      .domain(sortedData.map(d => d.type))
      .range([0, width])
      .padding(0.4);
    
    // Y scale with proper formatting
    const maxReviews = d3.max(sortedData, d => d.totalReviews);
    const yMax = Math.ceil(maxReviews / 100000) * 100000; // Round up to nearest 100k
    
    const y = d3.scaleLinear()
      .domain([0, yMax])
      .range([height, 0]);
    
    // Custom color palette - distinct colors for each restaurant type
    const colorPalette = [
      "#4285F4", // Google Blue
      "#EA4335", // Google Red
      "#FBBC05", // Google Yellow
      "#34A853", // Google Green
      "#8E24AA", // Purple
      "#16A085", // Turquoise
      "#F39C12", // Orange
      "#2C3E50"  // Dark Blue
    ];
    
    // Create a color scale
    const color = d3.scaleOrdinal()
      .domain(sortedData.map(d => d.type))
      .range(colorPalette);
    
    // Add X axis with better formatting
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .attr('class', 'x-axis')
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,10)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "12px")
      .style("font-weight", "bold");
    
    // Style X axis
    svg.selectAll(".x-axis path, .x-axis line")
      .style("stroke", "#ccc");
    
    // Add Y axis with formatted numbers
    const yAxis = d3.axisLeft(y)
      .ticks(5)
      .tickFormat(d => {
        if (d >= 1000000) return `${d/1000000}M`;
        if (d >= 1000) return `${d/1000}K`;
        return d;
      });
    
    svg.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .selectAll("text")
      .style("font-size", "12px")
      .style("font-weight", "bold");
    
    // Style Y axis
    svg.selectAll(".y-axis path, .y-axis line")
      .style("stroke", "#ccc");
    
    // Add Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 20)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .text('Total Reviews')
      .style('font-size', '14px')
      .style('font-weight', 'bold');
    
    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .attr('text-anchor', 'middle')
      .text('Total Reviews by Restaurant Type')
      .style('font-size', '18px')
      .style('font-weight', 'bold');
    
    // Add grid lines
    svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y)
        .ticks(5)
        .tickSize(-width)
        .tickFormat('')
      )
      .selectAll("line")
      .style("stroke", "#e5e5e5")
      .style("stroke-dasharray", "3,3");
    
    // Remove the grid's domain line
    svg.selectAll(".grid path").style("stroke-width", 0);
    
    // Add bars with animation
    svg.selectAll('.bar')
      .data(sortedData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.type))
      .attr('width', x.bandwidth())
      .attr('y', height) // Start from bottom for animation
      .attr('height', 0) // Start with height 0 for animation
      .attr('fill', d => color(d.type))
      .attr('rx', 4) // Rounded corners
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .attr('y', d => y(d.totalReviews))
      .attr('height', d => height - y(d.totalReviews));
    
    // Add hover effects (after transition)
    setTimeout(() => {
      svg.selectAll('.bar')
        .on('mouseover', function(event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('opacity', 0.8)
            .attr('stroke', '#333')
            .attr('stroke-width', 2);
          
          // Create tooltip
          const tooltip = svg.append('g')
            .attr('class', 'tooltip');
          
          // Add background rectangle
          tooltip.append('rect')
            .attr('x', x(d.type) - 10)
            .attr('y', y(d.totalReviews) - 70)
            .attr('width', 140)
            .attr('height', 60)
            .attr('fill', 'white')
            .attr('stroke', '#333')
            .attr('rx', 4)
            .attr('opacity', 0.9);
          
          // Add restaurant type
          tooltip.append('text')
            .attr('x', x(d.type) + x.bandwidth() / 2)
            .attr('y', y(d.totalReviews) - 50)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text(d.type);
          
          // Add review count
          tooltip.append('text')
            .attr('x', x(d.type) + x.bandwidth() / 2)
            .attr('y', y(d.totalReviews) - 30)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .text(`Reviews: ${d.totalReviews.toLocaleString()}`);
          
          // Add average rating
          tooltip.append('text')
            .attr('x', x(d.type) + x.bandwidth() / 2)
            .attr('y', y(d.totalReviews) - 10)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .text(`Rating: ${d.averageRating.toFixed(1)} ★`);
        })
        .on('mouseout', function() {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('opacity', 1)
            .attr('stroke', 'none');
          svg.selectAll('.tooltip').remove();
        });
    }, 1000);
    
    // Add review count labels on top of bars
    svg.selectAll('.count-label')
      .data(sortedData)
      .enter()
      .append('text')
      .attr('class', 'count-label')
      .attr('x', d => x(d.type) + x.bandwidth() / 2)
      .attr('y', d => y(d.totalReviews) - 10)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('opacity', 0)
      .text(d => d.totalReviews.toLocaleString())
      .transition()
      .duration(800)
      .delay((d, i) => i * 100 + 500)
      .style('opacity', 1);
    
    // Add rating badges at the bottom of each bar
    svg.selectAll('.rating-badge')
      .data(sortedData)
      .enter()
      .append('g')
      .attr('class', 'rating-badge')
      .attr('transform', d => `translate(${x(d.type) + x.bandwidth() / 2}, ${height + 50})`)
      .style('opacity', 0)
      .transition()
      .duration(500)
      .delay((d, i) => i * 100 + 1000)
      .style('opacity', 1)
      .each(function(d) {
        const g = d3.select(this);
        
        // Add rating circle
        g.append('circle')
          .attr('r', 18)
          .attr('fill', color(d.type))
          .attr('stroke', 'white')
          .attr('stroke-width', 2);
        
        // Add rating text
        g.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '0.35em')
          .style('font-size', '12px')
          .style('font-weight', 'bold')
          .style('fill', 'white')
          .text(d.averageRating.toFixed(1));
      });
  };

  const drawDonutChart = () => {
    // Clear previous chart
    d3.select(donutChartRef.current).selectAll("*").remove();
    
    const width = 500;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 40;
    
    const svg = d3.select(donutChartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
    
    // Prepare data for the donut chart
    const data = restaurantData.map(d => ({
      type: d.type,
      value: d.totalReviews,
      rating: d.averageRating
    }));
    
    // Custom color palette - distinct colors for each restaurant type
    const colorPalette = [
      "#4285F4", // Google Blue
      "#EA4335", // Google Red
      "#FBBC05", // Google Yellow
      "#34A853", // Google Green
      "#8E24AA", // Purple
      "#16A085", // Turquoise
      "#F39C12", // Orange
      "#2C3E50"  // Dark Blue
    ];
    
    // Create a color scale
    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.type))
      .range(colorPalette);
    
    // Compute the position of each group on the pie
    const pie = d3.pie()
      .value(d => d.value)
      .sort(null);
    
    const data_ready = pie(data);
    
    // Build the donut chart
    const arcGenerator = d3.arc()
      .innerRadius(radius * 0.6) // This creates the donut hole
      .outerRadius(radius);
    
    // For labels and hover effects
    const outerArc = d3.arc()
      .innerRadius(radius * 1.1)
      .outerRadius(radius * 1.1);
    
    // Add the arcs with animation
    svg.selectAll('slices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', d => {
        // Start with a tiny arc at the center
        const startArc = d3.arc()
          .innerRadius(0)
          .outerRadius(0);
        return startArc(d);
      })
      .attr('fill', d => color(d.data.type))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .transition()
      .duration(1000)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate(
          {startAngle: d.startAngle, endAngle: d.startAngle},
          {startAngle: d.startAngle, endAngle: d.endAngle}
        );
        return function(t) {
          return arcGenerator(interpolate(t));
        };
      });
    
    // Add hover effects (after transition)
    setTimeout(() => {
      svg.selectAll('path')
        .on('mouseover', function(event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('opacity', 0.8)
            .attr('stroke', '#333')
            .style('stroke-width', '3px');
          
          // Calculate percentage
          const total = d3.sum(data, d => d.value);
          const percent = (d.data.value / total * 100).toFixed(1);
          
          // Create tooltip
          const tooltip = svg.append('g')
            .attr('class', 'tooltip');
          
          // Add background rectangle
          tooltip.append('rect')
            .attr('x', -80)
            .attr('y', -50)
            .attr('width', 160)
            .attr('height', 70)
            .attr('fill', 'white')
            .attr('stroke', '#333')
            .attr('rx', 4)
            .attr('opacity', 0.9);
          
          // Add restaurant type
          tooltip.append('text')
            .attr('x', 0)
            .attr('y', -30)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .text(d.data.type);
          
          // Add review count
          tooltip.append('text')
            .attr('x', 0)
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .text(`Reviews: ${d.data.value.toLocaleString()}`);
          
          // Add percentage
          tooltip.append('text')
            .attr('x', 0)
            .attr('y', 10)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .text(`${percent}% of total`);
        })
        .on('mouseout', function() {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('opacity', 1)
            .attr('stroke', 'white')
            .style('stroke-width', '2px');
          svg.selectAll('.tooltip').remove();
        });
    }, 1200);
    
    // Add a center circle with total reviews
    const totalReviews = d3.sum(data, d => d.value);
    
    // Add center circle background
    svg.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', radius * 0.58)
      .attr('fill', 'white')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 2);
    
    // Add total reviews label
    svg.append('text')
      .attr('x', 0)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Total Reviews');
    
    // Add total reviews count with animation
    svg.append('text')
      .attr('x', 0)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '0px') // Start with size 0
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text(totalReviews.toLocaleString())
      .transition()
      .duration(1000)
      .delay(1000)
      .style('font-size', '24px'); // Grow to full size
    
    // Add title
    svg.append('text')
      .attr('x', 0)
      .attr('y', -height / 2 + 20)
      .attr('text-anchor', 'middle')
      .text('Review Distribution by Restaurant Type')
      .style('font-size', '18px')
      .style('font-weight', 'bold');
    
    // Create a legend with better positioning and spacing
    const legendRectSize = 15;
    const legendSpacing = 25;
    const legendX = -width / 2 + 50;
    const legendY = height / 2 - 120;
    
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${legendX}, ${legendY})`);
    
    legend.append('text')
      .attr('x', 0)
      .attr('y', -15)
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('Restaurant Types');
    
    legend.selectAll('.legend-item')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * legendSpacing})`)
      .style('opacity', 0)
      .transition()
      .duration(500)
      .delay((d, i) => 1200 + i * 100)
      .style('opacity', 1);
    
    // Add legend color squares
    setTimeout(() => {
      legend.selectAll('.legend-item')
        .append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .attr('rx', 2)
        .style('fill', d => color(d.type))
        .style('stroke', '#fff');
      
      // Add legend text
      legend.selectAll('.legend-item')
        .append('text')
        .attr('x', legendRectSize + 8)
        .attr('y', legendRectSize - 2)
        .text(d => {
          // Truncate long restaurant type names
          return d.type.length > 15 ? d.type.substring(0, 15) + '...' : d.type;
        })
        .style('font-size', '12px');
    }, 1200);
    
    // Add connecting lines from segments to labels in a cleaner way
    // We'll use a different approach than in the screenshot to avoid overlapping
    setTimeout(() => {
      data_ready.forEach((d, i) => {
        // Only add lines if we have more than 3 segments to avoid clutter
        if (data_ready.length > 3) {
          const pos = outerArc.centroid(d);
          const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          
          // Adjust position based on angle
          pos[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
          
          // Calculate positions for the polyline
          const posA = arcGenerator.centroid(d);
          const posB = outerArc.centroid(d);
          const posC = outerArc.centroid(d);
          posC[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
          
          // Draw the polyline only for larger segments
          if ((d.endAngle - d.startAngle) > 0.2) {
            svg.append('polyline')
              .attr('points', [posA, posB, posC])
              .style('fill', 'none')
              .style('stroke', '#555')
              .style('stroke-width', 1)
              .style('opacity', 0)
              .transition()
              .duration(500)
              .delay(1500 + i * 100)
              .style('opacity', 0.7);
            
            // Add percentage label at the end of the line
            const percent = (d.data.value / totalReviews * 100).toFixed(1);
            svg.append('text')
              .attr('x', posC[0] + (midAngle < Math.PI ? 5 : -5))
              .attr('y', posC[1])
              .attr('text-anchor', midAngle < Math.PI ? 'start' : 'end')
              .style('font-size', '10px')
              .style('font-weight', 'bold')
              .text(`${percent}%`)
              .style('opacity', 0)
              .transition()
              .duration(500)
              .delay(1700 + i * 100)
              .style('opacity', 1);
          }
        }
      });
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto p-5 bg-gray-50 font-sans">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Restaurant Reviews Analysis</h1>
      
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Total Reviews by Restaurant Type</h2>
            <div ref={barChartRef} className="flex justify-center overflow-hidden"></div>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Review Distribution</h2>
            <div ref={donutChartRef} className="flex justify-center overflow-hidden"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantReviews;
