import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

const SilentActive = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [chartType, setChartType] = useState('bar'); // 'bar', 'stacked', 'pie', 'line', 'area'
  
  const chartRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/user/silent-active-proportions');
        setData(response.data);
        // Set the most recent year as selected by default
        if (response.data.length > 0) {
          setSelectedYear(response.data[response.data.length - 1].year);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user activity data');
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
  }, [data, loading, selectedYear, chartType]);

  const drawChart = () => {
    if (!chartRef.current) return;
    
    // Clear previous chart
    d3.select(chartRef.current).selectAll("*").remove();
    
    const margin = { top: 40, right: 30, bottom: 60, left: 80 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Create tooltip
    const tooltip = d3.select(tooltipRef.current)
      .style('opacity', 0)
      .attr('class', 'tooltip')
      .style('background-color', 'white')
      .style('border', '1px solid #ddd')
      .style('border-radius', '8px')
      .style('padding', '10px')
      .style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('font-size', '12px')
      .style('z-index', 10);

    // Create scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.year))
      .range([0, width])
      .padding(0.3);
      
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.totalUsers) * 1.1])
      .range([height, 0]);
      
    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('font-size', '12px')
      .style('font-weight', '500')
      .style('fill', '#4B5563');
      
    // Add X axis label
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('fill', '#374151')
      .text('Year');
      
    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y)
        .tickFormat(d => d3.format(',')(d))
        .ticks(8))
      .selectAll('text')
      .style('font-size', '12px')
      .style('font-weight', '500')
      .style('fill', '#4B5563');
      
    // Add Y axis label
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 20)
      .attr('x', -height / 2)
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('fill', '#374151')
      .text('Number of Users');
      
    // Add grid lines
    svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y)
        .tickSize(-width)
        .tickFormat('')
        .ticks(8))
      .style('stroke', '#E5E7EB')
      .style('stroke-opacity', 0.7);
      
    // Create gradients
    const defs = svg.append('defs');
    
    // Gradient for active users
    const activeGradient = defs
      .append('linearGradient')
      .attr('id', 'activeGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
      
    activeGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#3B82F6')
      .attr('stop-opacity', 1);
      
    activeGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#1D4ED8')
      .attr('stop-opacity', 1);
      
    // Gradient for silent users
    const silentGradient = defs
      .append('linearGradient')
      .attr('id', 'silentGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
      
    silentGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#9CA3AF')
      .attr('stop-opacity', 1);
      
    silentGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#6B7280')
      .attr('stop-opacity', 1);

    // Add chart title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#1F2937')
      .text('Active vs. Silent Users by Year');

    // Render different chart types
    if (chartType === 'bar') {
      // Simple bar chart for active users
      svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.year))
        .attr('width', x.bandwidth())
        .attr('y', height)
        .attr('height', 0)
        .attr('fill', 'url(#activeGradient)')
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('opacity', d => d.year === selectedYear ? 1 : 0.7)
        .on('mouseover', function(event, d) {
          d3.select(this).attr('opacity', 1);
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip.html(`
            <div class="font-medium text-gray-800">Year: ${d.year}</div>
            <div class="text-blue-600">Active Users: ${d.activeUsers.toLocaleString()}</div>
            <div class="text-gray-600">Total Users: ${d.totalUsers.toLocaleString()}</div>
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
          
          setSelectedYear(d.year);
        })
        .on('mouseout', function(event, d) {
          if (d.year !== selectedYear) {
            d3.select(this).attr('opacity', 0.7);
          }
          tooltip.transition().duration(500).style('opacity', 0);
        })
        .transition()
        .duration(800)
        .delay((d, i) => i * 100)
        .attr('y', d => y(d.activeUsers))
        .attr('height', d => height - y(d.activeUsers));
        
      // Add value labels on top of bars
      svg.selectAll('.label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.year) + x.bandwidth() / 2)
        .attr('y', d => y(d.activeUsers) - 10)
        .attr('text-anchor', 'middle')
        .style('font-size', '0px')
        .style('font-weight', 'bold')
        .style('fill', '#2563EB')
        .text(d => d3.format(',')(d.activeUsers))
        .transition()
        .duration(800)
        .delay((d, i) => 800 + i * 100)
        .style('font-size', '12px');
    } 
    else if (chartType === 'stacked') {
      // Prepare stacked data
      const stackedData = data.map(d => [
        { year: d.year, type: 'active', value: d.activeUsers, y0: 0, y1: d.activeUsers },
        { year: d.year, type: 'silent', value: d.silentUsers, y0: d.activeUsers, y1: d.totalUsers }
      ]).flat();
      
      // Add stacked bars
      svg.selectAll('.bar')
        .data(stackedData)
        .enter()
        .append('rect')
        .attr('class', d => `bar bar-${d.type}`)
        .attr('x', d => x(d.year))
        .attr('width', x.bandwidth())
        .attr('y', height)
        .attr('height', 0)
        .attr('fill', d => d.type === 'active' ? 'url(#activeGradient)' : 'url(#silentGradient)')
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .attr('opacity', d => d.year === selectedYear ? 1 : 0.7)
        .on('mouseover', function(event, d) {
          d3.select(this).attr('opacity', 1);
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip.html(`
            <div class="font-medium text-gray-800">Year: ${d.year}</div>
            <div class="${d.type === 'active' ? 'text-blue-600' : 'text-gray-600'}">${d.type === 'active' ? 'Active' : 'Silent'} Users: ${d.value.toLocaleString()}</div>
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
          
          setSelectedYear(d.year);
        })
        .on('mouseout', function(event, d) {
          if (d.year !== selectedYear) {
            d3.select(this).attr('opacity', 0.7);
          }
          tooltip.transition().duration(500).style('opacity', 0);
        })
        .transition()
        .duration(800)
        .delay((d, i) => i * 100)
        .attr('y', d => y(d.y1))
        .attr('height', d => y(d.y0) - y(d.y1));
        
      // Add total value labels on top of bars
      svg.selectAll('.label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.year) + x.bandwidth() / 2)
        .attr('y', d => y(d.totalUsers) - 10)
        .attr('text-anchor', 'middle')
        .style('font-size', '0px')
        .style('font-weight', 'bold')
        .style('fill', '#2563EB')
        .text(d => d3.format(',')(d.totalUsers))
        .transition()
        .duration(800)
        .delay((d, i) => 800 + i * 100)
        .style('font-size', '12px');
    }
    else if (chartType === 'pie') {
      // Create pie chart for selected year
      const selectedData = data.find(d => d.year === selectedYear) || data[data.length - 1];
      const pieData = [
        { name: 'Active Users', value: selectedData.activeUsers },
        { name: 'Silent Users', value: selectedData.silentUsers }
      ];
      
      // Remove axes for pie chart
      svg.selectAll('.grid').remove();
      svg.selectAll('g').remove();
      
      // Update title for pie chart
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', -15)
        .attr('text-anchor', 'middle')
        .style('font-size', '18px')
        .style('font-weight', 'bold')
        .style('fill', '#1F2937')
        .text(`User Activity Distribution - ${selectedYear}`);
      
      const radius = Math.min(width, height) / 2;
      
      const pie = d3.pie()
        .value(d => d.value)
        .sort(null);
      
      const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius * 0.8);
      
      const outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);
      
      const pieG = svg.append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);
      
      // Add pie segments
      const path = pieG.selectAll('path')
        .data(pie(pieData))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => i === 0 ? 'url(#activeGradient)' : 'url(#silentGradient)')
        .attr('stroke', 'white')
        .style('stroke-width', '2px')
        .style('opacity', 0.7)
        .on('mouseover', function(event, d) {
          d3.select(this).style('opacity', 1);
          tooltip.transition().duration(200).style('opacity', 0.9);
          const percent = ((d.data.value / selectedData.totalUsers) * 100).toFixed(1);
          tooltip.html(`
            <div class="font-medium text-gray-800">${d.data.name}</div>
            <div class="text-blue-600">${d.data.value.toLocaleString()} (${percent}%)</div>
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
          d3.select(this).style('opacity', 0.7);
          tooltip.transition().duration(500).style('opacity', 0);
        })
        .transition()
        .duration(800)
        .attrTween('d', function(d) {
          const interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
          return function(t) {
            return arc(interpolate(t));
          };
        });
      
      // Add labels
      const text = pieG.selectAll('text')
        .data(pie(pieData))
        .enter()
        .append('text')
        .attr('transform', d => {
          const pos = outerArc.centroid(d);
          const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          pos[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
          return `translate(${pos})`;
        })
        .attr('dy', '.35em')
        .style('text-anchor', d => {
          const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          return midAngle < Math.PI ? 'start' : 'end';
        })
        .style('font-size', '14px')
        .style('fill', '#4B5563')
        .style('font-weight', '500')
        .text(d => {
          const percent = ((d.data.value / selectedData.totalUsers) * 100).toFixed(1);
          return `${d.data.name}: ${percent}%`;
        })
        .style('opacity', 0)
        .transition()
        .duration(800)
        .delay(800)
        .style('opacity', 1);
      
      // Add polylines
      const polyline = pieG.selectAll('polyline')
        .data(pie(pieData))
        .enter()
        .append('polyline')
        .attr('points', d => {
          const pos = outerArc.centroid(d);
          const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          pos[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
          return [arc.centroid(d), outerArc.centroid(d), pos];
        })
        .style('fill', 'none')
        .style('stroke', '#CBD5E1')
        .style('stroke-width', '1px')
        .style('opacity', 0)
        .transition()
        .duration(800)
        .delay(800)
        .style('opacity', 1);
    }
    else if (chartType === 'line') {
      // Create line chart
      const line = d3.line()
        .x(d => x(d.year) + x.bandwidth() / 2)
        .y(d => y(d.activeUsers))
        .curve(d3.curveMonotoneX);
      
      const silentLine = d3.line()
        .x(d => x(d.year) + x.bandwidth() / 2)
        .y(d => y(d.silentUsers))
        .curve(d3.curveMonotoneX);
      
      // Add active users line
      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'url(#activeGradient)')
        .attr('stroke-width', 3)
        .attr('d', line)
        .attr('stroke-dasharray', function() {
          return this.getTotalLength();
        })
        .attr('stroke-dashoffset', function() {
          return this.getTotalLength();
        })
        .transition()
        .duration(1500)
        .attr('stroke-dashoffset', 0);
      
      // Add silent users line
      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'url(#silentGradient)')
        .attr('stroke-width', 3)
        .attr('d', silentLine)
        .attr('stroke-dasharray', function() {
          return this.getTotalLength();
        })
        .attr('stroke-dashoffset', function() {
          return this.getTotalLength();
        })
        .transition()
        .duration(1500)
        .attr('stroke-dashoffset', 0);
      
      // Add dots for active users
      svg.selectAll('.dot-active')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot-active')
        .attr('cx', d => x(d.year) + x.bandwidth() / 2)
        .attr('cy', d => y(d.activeUsers))
        .attr('r', 0)
        .attr('fill', '#3B82F6')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .on('mouseover', function(event, d) {
          d3.select(this).attr('r', 8);
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip.html(`
            <div class="font-medium text-gray-800">Year: ${d.year}</div>
            <div class="text-blue-600">Active Users: ${d.activeUsers.toLocaleString()}</div>
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
          
          setSelectedYear(d.year);
        })
        .on('mouseout', function() {
          d3.select(this).attr('r', 6);
          tooltip.transition().duration(500).style('opacity', 0);
        })
        .transition()
        .duration(800)
        .delay((d, i) => 1500 + i * 100)
        .attr('r', d => d.year === selectedYear ? 8 : 6);
      
      // Add dots for silent users
      svg.selectAll('.dot-silent')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot-silent')
        .attr('cx', d => x(d.year) + x.bandwidth() / 2)
        .attr('cy', d => y(d.silentUsers))
        .attr('r', 0)
        .attr('fill', '#9CA3AF')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .on('mouseover', function(event, d) {
          d3.select(this).attr('r', 8);
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip.html(`
            <div class="font-medium text-gray-800">Year: ${d.year}</div>
            <div class="text-gray-600">Silent Users: ${d.silentUsers.toLocaleString()}</div>
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
          
          setSelectedYear(d.year);
        })
        .on('mouseout', function() {
          d3.select(this).attr('r', 6);
          tooltip.transition().duration(500).style('opacity', 0);
        })
        .transition()
        .duration(800)
        .delay((d, i) => 1500 + i * 100)
        .attr('r', d => d.year === selectedYear ? 8 : 6);
    }
    else if (chartType === 'area') {
      // Create area chart
      const area = d3.area()
        .x(d => x(d.year) + x.bandwidth() / 2)
        .y0(height)
        .y1(d => y(d.activeUsers))
        .curve(d3.curveMonotoneX);
      
      const silentArea = d3.area()
        .x(d => x(d.year) + x.bandwidth() / 2)
        .y0(d => y(d.activeUsers))
        .y1(d => y(d.activeUsers + d.silentUsers))
        .curve(d3.curveMonotoneX);
      
      // Add clip path
      svg.append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', width)
        .attr('height', height);
      
      // Add active users area
      svg.append('path')
        .datum(data)
        .attr('fill', 'url(#activeGradient)')
        .attr('fill-opacity', 0.6)
        .attr('stroke', '#3B82F6')
        .attr('stroke-width', 2)
        .attr('clip-path', 'url(#clip)')
        .attr('d', area)
        .attr('transform', `translate(0,${height})`)
        .transition()
        .duration(1500)
        .attr('transform', 'translate(0,0)');
      
      // Add silent users area
      svg.append('path')
        .datum(data)
        .attr('fill', 'url(#silentGradient)')
        .attr('fill-opacity', 0.6)
        .attr('stroke', '#9CA3AF')
        .attr('stroke-width', 2)
        .attr('clip-path', 'url(#clip)')
        .attr('d', silentArea)
        .attr('transform', `translate(0,${height})`)
        .transition()
        .duration(1500)
        .attr('transform', 'translate(0,0)');
      
      // Add dots for interaction
      svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', d => x(d.year) + x.bandwidth() / 2)
        .attr('cy', d => y(d.activeUsers))
        .attr('r', 0)
        .attr('fill', '#3B82F6')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .attr('opacity', 0.8)
        .on('mouseover', function(event, d) {
          d3.select(this).attr('r', 8).attr('opacity', 1);
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip.html(`
            <div class="font-medium text-gray-800">Year: ${d.year}</div>
            <div class="text-blue-600">Active Users: ${d.activeUsers.toLocaleString()}</div>
            <div class="text-gray-600">Silent Users: ${d.silentUsers.toLocaleString()}</div>
            <div class="text-gray-800">Total Users: ${d.totalUsers.toLocaleString()}</div>
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
          
          setSelectedYear(d.year);
        })
        .on('mouseout', function() {
          d3.select(this).attr('r', 6).attr('opacity', 0.8);
          tooltip.transition().duration(500).style('opacity', 0);
        })
        .transition()
        .duration(800)
        .delay((d, i) => 1500 + i * 100)
        .attr('r', d => d.year === selectedYear ? 8 : 6);
    }
    
    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 120}, 0)`);
      
    // Active users legend
    legend.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', 'url(#activeGradient)')
      .attr('rx', 3)
      .attr('ry', 3);
      
    legend.append('text')
      .attr('x', 25)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('font-size', '14px')
      .style('fill', '#4B5563')
      .text('Active Users');
      
    // Silent users legend
    legend.append('rect')
      .attr('x', 0)
      .attr('y', 25)
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', 'url(#silentGradient)')
      .attr('rx', 3)
      .attr('ry', 3)
      .style('opacity', 0.7);
      
    legend.append('text')
      .attr('x', 25)
      .attr('y', 34)
      .attr('dy', '.35em')
      .style('font-size', '14px')
      .style('fill', '#4B5563')
      .text('Silent Users');
  };

  // Format percentage for display
  const formatPercentage = (value) => {
    return (value * 100).toFixed(1) + '%';
  };

  // Get selected year data
  const getSelectedYearData = () => {
    return data.find(item => item.year === selectedYear) || {};
  };

  const selectedData = getSelectedYearData();

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

    return (
    <div className="max-w-7xl mx-auto p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">User Activity Analysis</h1>
        <p className="text-gray-600 mt-2">
          Tracking the proportion of active and silent users over time
        </p>
      </motion.div>

      {loading ? (
         (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )
          
      ) : (
        <div>
        {/* Stats Summary Cards */}
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
            <motion.div 
                variants={itemVariants}
                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500"
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Users</p>
                        <p className="text-2xl font-bold mt-1 text-blue-600">{selectedData.totalUsers?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100">
                        <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                        </svg>
                    </div>
                </div>
            </motion.div>

            <motion.div 
                variants={itemVariants}
                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500"
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Active Users</p>
                        <p className="text-2xl font-bold mt-1 text-green-600">{selectedData.activeUsers?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div className="p-3 rounded-full bg-green-100">
                        <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                    </div>
                </div>
            </motion.div>

            <motion.div 
                variants={itemVariants}
                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-gray-500"
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Silent Users</p>
                        <p className="text-2xl font-bold mt-1 text-gray-600">{selectedData.silentUsers?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="p-3 rounded-full bg-gray-100">
                        <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"></path>
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"></path>
                        </svg>
                    </div>
                </div>
            </motion.div>

            <motion.div 
                variants={itemVariants}
                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500"
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Active User Rate</p>
                        <p className="text-2xl font-bold mt-1 text-purple-600">{formatPercentage(selectedData.activeUserProportion || 0)}</p>
                    </div>
                    <div className="p-3 rounded-full bg-purple-100">
                        <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
                        </svg>
                    </div>
                </div>
            </motion.div>
        </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Chart Type</h3>
            <div className="flex flex-wrap gap-2">
              {['bar', 'stacked', 'pie', 'line', 'area'].map(type => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`px-4 py-2 rounded-md transition-all duration-200 ${
                    chartType === type
                      ? 'bg-blue-600 text-white font-medium shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Year Selector */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Select Year</h3>
            <div className="flex flex-wrap gap-2">
              {data.map(item => (
                <button
                  key={item.year}
                  onClick={() => setSelectedYear(item.year)}
                  className={`px-4 py-2 rounded-md transition-all duration-200 ${
                    selectedYear === item.year
                      ? 'bg-blue-600 text-white font-medium shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {item.year}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Main Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-md mb-8"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">User Activity Visualization</h3>
            
            {/* D3.js Chart Container */}
            <div className="h-[500px] relative">
              <div ref={tooltipRef} className="absolute pointer-events-none z-10"></div>
              <div ref={chartRef} className="w-full h-full"></div>
            </div>
          </motion.div>

          {/* Detailed Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white">Year {selectedYear} Breakdown</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Users:</span>
                    <span className="font-semibold text-gray-800">{selectedData.totalUsers?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Users:</span>
                    <span className="font-semibold text-green-600">{selectedData.activeUsers?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Silent Users:</span>
                    <span className="font-semibold text-gray-600">{selectedData.silentUsers?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active User Proportion:</span>
                    <span className="font-semibold text-blue-600">{formatPercentage(selectedData.activeUserProportion || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Silent User Proportion:</span>
                    <span className="font-semibold text-gray-600">{formatPercentage(selectedData.silentUserProportion || 0)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white">Activity Distribution</h3>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-blue-600">Active Users</span>
                    <span className="text-sm font-medium text-blue-600">{formatPercentage(selectedData.activeUserProportion || 0)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <motion.div 
                      className="bg-blue-600 h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(selectedData.activeUserProportion || 0) * 100}%` }}
                      transition={{ duration: 1, delay: 0.6 }}
                    ></motion.div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-600">Silent Users</span>
                    <span className="text-sm font-medium text-gray-600">{formatPercentage(selectedData.silentUserProportion || 0)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <motion.div 
                      className="bg-gray-500 h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(selectedData.silentUserProportion || 0) * 100}%` }}
                      transition={{ duration: 1, delay: 0.6 }}
                    ></motion.div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-2">Key Insights</h4>
                  <p className="text-gray-600 text-sm">
                    {selectedData.activeUserProportion === 1 
                      ? "All users are active in this time period. This indicates excellent user engagement."
                      : "The platform has a mix of active and silent users. Focus on re-engaging silent users."}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trend Analysis */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-md border border-blue-100 mb-8"
          >
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Activity Trend Analysis</h3>
            <p className="text-blue-700 mb-4">
              {data.every(item => item.activeUserProportion === 1)
                ? "The data shows 100% active users across all years. This is an excellent engagement metric, indicating that all registered users are actively participating on the platform."
                : "The data shows varying levels of user activity across different years. Understanding these patterns can help in developing targeted re-engagement strategies."}
            </p>
            <div className="mt-4 flex items-center">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
              <span className="text-sm text-blue-700">
                Total user growth from {data.length > 0 ? data[0].year : 'N/A'} to {data.length > 0 ? data[data.length-1].year : 'N/A'}: 
                {data.length > 0 
                  ? ` ${((data[data.length-1].totalUsers / data[0].totalUsers) * 100).toFixed(0)}%` 
                  : ' N/A'}
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SilentActive;
