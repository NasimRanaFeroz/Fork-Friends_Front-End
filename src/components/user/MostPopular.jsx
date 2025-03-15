import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const MultiChartVisualization = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const barChartRef = useRef();
  const pieChartRef = useRef();
  const lineChartRef = useRef();

  // Generate trend data for line chart
  const generateTrendData = (baseValue) => {
    return Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      value: baseValue * (0.85 + Math.random() * 0.3)
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/user/most-popular');
        const sortedData = response.data
          .sort((a, b) => b.fans - a.fans)
          .slice(0, 6) // Take top 6 for better visualization
          .map(item => ({
            ...item,
            trendData: generateTrendData(item.fans)
          }));
          console.log(sortedData)
        setData(sortedData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch popular users data');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0 && !loading) {
      drawBarChart();
      drawPieChart();
      drawLineChart();
    }
  }, [data, loading]);

  const drawBarChart = () => {
    d3.select(barChartRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 60, left: 70 };
    const width = 300 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(barChartRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, width])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.fans) * 1.1])
      .range([height, 0]);

    // Add X axis with rotated labels for better readability
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "12px")
      .style("font-weight", "500")
      .style("fill", "#4a5568");

    // Add Y axis with better number formatting and ensure visibility
    svg.append('g')
      .call(d3.axisLeft(y)
        .tickFormat(d => d3.format(",.0f")(d))
        .ticks(6))
      .style("font-size", "12px")
      .style("font-weight", "500")
      .call(g => g.select(".domain").attr("stroke", "#64748b"))
      .call(g => g.selectAll(".tick line").attr("stroke", "#64748b"))
      .call(g => g.selectAll(".tick text").attr("fill", "#1e293b"));

    // Create color scale
    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      .range(['#FF6B6B', '#4834D4', '#6AB04C', '#F9CA24', '#A3CB38', '#9B59B6']);

    // Add gradient definitions
    const defs = svg.append('defs');
    data.forEach((d, i) => {
      const gradient = defs.append('linearGradient')
        .attr('id', `barGradient${i}`)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', d3.rgb(color(i)).brighter(0.2));

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d3.rgb(color(i)).darker(0.2));
    });

    // Add bars with animated growth
    svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.name))
      .attr("width", x.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .attr("fill", (d, i) => `url(#barGradient${i})`)
      .attr("rx", 4)
      .attr("ry", 4)
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .attr("y", d => y(d.fans))
      .attr("height", d => height - y(d.fans));

    // Add value labels on top of bars with counting animation
    const valueLabels = svg.selectAll(".value-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "value-label")
      .attr("x", d => x(d.name) + x.bandwidth() / 2)
      .attr("y", d => y(d.fans) - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "#2d3436")
      .style("opacity", 0);

    // Animate the number counting up
    valueLabels.transition()
      .duration(1000)
      .delay((d, i) => 800 + i * 100)
      .style("opacity", 1)
      .tween("text", function(d) {
        const i = d3.interpolate(0, d.fans);
        return function(t) {
          d3.select(this).text(d3.format(",.0f")(i(t)));
        };
      });
  };

  const drawPieChart = () => {
    d3.select(pieChartRef.current).selectAll("*").remove();

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(pieChartRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width/2},${height/2})`);

    // Create color scale with more distinct colors
    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      .range(['#FF6B6B', '#4834D4', '#6AB04C', '#F9CA24', '#A3CB38', '#9B59B6']);

    // Compute pie data
    const pie = d3.pie()
      .value(d => d.fans)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(radius * 0.4)
      .outerRadius(radius * 0.8);

    // Create outer arc for labels - improved positioning
    const outerArc = d3.arc()
      .innerRadius(radius * 0.85)
      .outerRadius(radius * 0.85);

    // Add gradient definitions with improved colors
    const defs = svg.append('defs');
    data.forEach((d, i) => {
      const gradient = defs.append('linearGradient')
        .attr('id', `pieGradient${i}`)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '100%');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', d3.rgb(color(i)).brighter(0.5));

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d3.rgb(color(i)).darker(0.5));
    });

    // Create a group for each pie slice with its label
    const sliceGroups = svg.selectAll('.slice-group')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'slice-group');

    // Create pie sections with sequential animation and enhanced effects
    const paths = sliceGroups.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => `url(#pieGradient${i})`)
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0)
      .attr('transform', 'scale(0.8)')
      // Add unique "pop" animation
      .transition()
      .duration(800)
      .delay((d, i) => i * 120)
      .attr('transform', 'scale(1)')
      .style('opacity', 1)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate(
          {startAngle: d.startAngle, endAngle: d.startAngle},
          {startAngle: d.startAngle, endAngle: d.endAngle}
        );
        return function(t) {
          return arc(interpolate(t));
        };
      });

    // Add hover effects to pie slices
    sliceGroups.selectAll('path')
      .on('mouseover', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', function(d) {
            const centroid = arc.centroid(d);
            return `translate(${centroid[0] * 0.05}, ${centroid[1] * 0.05}) scale(1.05)`;
          });
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', 'scale(1)');
      });

    // Improved label positioning logic
    const labelGroups = svg.selectAll('.label-group')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'label-group');

    // Calculate optimal label positions with better spacing
    const labelData = pie(data).map(d => {
      const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
      const pos = outerArc.centroid(d);
      
      // Adjust label positions based on angle for better readability
      // Increase the multiplier to push labels further out
      const x = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
      // Add slight vertical adjustment based on position to prevent overlap
      const y = pos[1] + (midAngle > Math.PI / 2 && midAngle < Math.PI * 1.5 ? -5 : 5);
      
      return {
        x: x,
        y: y,
        name: d.data.name,
        fans: d.data.fans,
        percentage: d.data.fans / d3.sum(data, d => d.fans),
        midAngle: midAngle,
        anchor: midAngle < Math.PI ? 'start' : 'end'
      };
    });

    // Add name labels with improved positioning and staggered animation
    const nameLabels = labelGroups.append('text')
      .attr('class', 'pie-label')
      .attr('transform', (d, i) => `translate(${labelData[i].x}, ${labelData[i].y - 8})`)
      .attr('dy', '.35em')
      .style('text-anchor', d => {
        const i = labelData.findIndex(item => item.name === d.data.name);
        return labelData[i].anchor;
      })
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', '#2d3436')
      .style('opacity', 0)
      .text(d => d.data.name)
      .transition()
      .duration(600)
      .delay((d, i) => 800 + i * 120)
      .style('opacity', 1);

    // Add percentage labels with improved positioning
    const percentLabels = labelGroups.append('text')
      .attr('class', 'percent-label')
      .attr('transform', (d, i) => `translate(${labelData[i].x}, ${labelData[i].y + 8})`)
      .attr('dy', '.35em')
      .style('text-anchor', d => {
        const i = labelData.findIndex(item => item.name === d.data.name);
        return labelData[i].anchor;
      })
      .style('font-size', '10px')
      .style('fill', '#636e72')
      .style('opacity', 0)
      .text(d => `(${d3.format('.1%')(d.data.fans/d3.sum(data, d => d.fans))})`)
      .transition()
      .duration(600)
      .delay((d, i) => 1000 + i * 120)
      .style('opacity', 1);

    // Add connecting lines with improved positioning and animated drawing
    labelGroups.append('polyline')
      .attr('points', (d, i) => {
        const midAngle = labelData[i].midAngle;
        const pos = outerArc.centroid(d);
        const arcPoint = arc.centroid(d);
        const endPoint = [labelData[i].x * 0.85, labelData[i].y];
        return [arcPoint, pos, endPoint];
      })
      .style('fill', 'none')
      .style('stroke', '#2d3436')
      .style('stroke-width', '1px')
      .style('opacity', 0)
      .style('stroke-dasharray', function() {
        return this.getTotalLength();
      })
      .style('stroke-dashoffset', function() {
        return this.getTotalLength();
      })
      .transition()
      .duration(800)
      .delay((d, i) => 600 + i * 120)
      .style('opacity', 0.6)
      .style('stroke-dashoffset', 0);

    // Add center text with total fans count
    const totalFans = d3.sum(data, d => d.fans);
    
    // Add background circle for center text
    svg.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', radius * 0.38)
      .attr('fill', '#f8f9fa')
      .attr('stroke', '#e9ecef')
      .attr('stroke-width', 2)
      .style('opacity', 0)
      .transition()
      .duration(800)
      .style('opacity', 1);
    
    // Add total label
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .style('font-size', '12px')
      .style('fill', '#64748b')
      .style('opacity', 0)
      .text('TOTAL FANS')
      .transition()
      .duration(800)
      .delay(200)
      .style('opacity', 1);
    
    // Add total value with counting animation
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('fill', '#1e293b')
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .delay(400)
      .style('opacity', 1)
      .tween('text', function() {
        const i = d3.interpolate(0, totalFans);
        return function(t) {
          d3.select(this).text(d3.format(",.0f")(i(t)));
        };
      });
  };

  const drawLineChart = () => {
    d3.select(lineChartRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 120, bottom: 40, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(lineChartRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales with padding
    const x = d3.scaleLinear()
      .domain([1, 12])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d3.max(d.trendData, t => t.value)) * 1.1])
      .range([height, 0]);

    // Create line generator with smoother curve
    const line = d3.line()
      .x(d => x(d.month))
      .y(d => y(d.value))
      .curve(d3.curveCardinal.tension(0.4));

    // Add X axis with better styling
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x)
        .ticks(12)
        .tickFormat(d => `M${d}`))
      .style('font-size', '12px')
      .call(g => g.select(".domain").attr("stroke", "#cbd5e0"))
      .call(g => g.selectAll(".tick line").attr("stroke", "#cbd5e0"))
      .call(g => g.selectAll(".tick text").attr("fill", "#4a5568").attr("font-weight", "500"));

    // Add X axis label
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 5)
      .style("font-size", "12px")
      .style("fill", "#2d3436")
      .text("Month")
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .style("opacity", 1);

    // Add Y axis with better styling
    svg.append('g')
      .call(d3.axisLeft(y)
        .tickFormat(d => d3.format(",.0f")(d)))
      .style('font-size', '12px')
      .call(g => g.select(".domain").attr("stroke", "#cbd5e0"))
      .call(g => g.selectAll(".tick line").attr("stroke", "#cbd5e0"))
      .call(g => g.selectAll(".tick text").attr("fill", "#4a5568").attr("font-weight", "500"));

    // Add Y axis label
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 15)
      .attr("x", -height / 2)
      .style("font-size", "12px")
      .style("fill", "#2d3436")
      .text("Fans")
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .style("opacity", 1);

    // Add grid lines with better styling
    svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y)
        .tickSize(-width)
        .tickFormat('')
      )
      .style('stroke', '#e0e0e0')
      .style('stroke-opacity', 0.5)
      .style('stroke-dasharray', '3,3');

    // Add lines for each user with sequential animation
    data.forEach((user, i) => {
      const color = d3.schemeCategory10[i];

      // Add line path with animated drawing
      const path = svg.append('path')
        .datum(user.trendData)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 3)
        .attr('d', line);

      // Animate line drawing
      const totalLength = path.node().getTotalLength();
      path
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(2000)
        .delay(i * 200)
        .ease(d3.easePolyOut)
        .attr('stroke-dashoffset', 0);

      // Add data points with pop-in animation
      svg.selectAll(`.point-${i}`)
        .data(user.trendData)
        .enter()
        .append('circle')
        .attr('class', `point-${i}`)
        .attr('cx', d => x(d.month))
        .attr('cy', d => y(d.value))
        .attr('r', 0)
        .attr('fill', color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .transition()
        .duration(400)
        .delay((d, j) => 2000 + i * 200 + j * 50)
        .attr('r', 5);

      // Add tooltips for data points
      svg.selectAll(`.point-${i}`)
        .data(user.trendData)
        .enter()
        .append('title')
        .text(d => `${user.name}: ${d3.format(",.0f")(d.value)} fans`);

      // Add legend with staggered animation
      const legendG = svg.append('g')
        .attr('transform', `translate(${width + 20}, ${i * 25})`)
        .style('opacity', 0)
        .transition()
        .duration(500)
        .delay(i * 100)
        .style('opacity', 1);

      svg.append('circle')
        .attr('cx', width + 10)
        .attr('cy', i * 25)
        .attr('r', 6)
        .style('fill', color);

      svg.append('text')
        .attr('x', width + 25)
        .attr('y', i * 25)
        .attr('dy', '.35em')
        .style('font-size', '12px')
        .style('font-weight', '500')
        .style('fill', '#2d3436')
        .text(user.name);
    });
  };

  // Return statement with Tailwind CSS classes
  return (
    <div className="max-w-7xl mx-auto p-5 bg-white rounded-xl shadow-lg border border-gray-100">
      {loading && (
        <div className="flex justify-center items-center h-96">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin shadow-md"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 my-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {!loading && !error && (
        <div>
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-8">
            User Popularity Analysis Dashboard
          </h2>
          
          {/* Bar Chart Section */}
          <div className="p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 mb-8">
            <h3 className="text-center text-lg font-semibold text-gray-700 mb-4">Fan Distribution</h3>
            <div className="flex justify-center">
              <svg ref={barChartRef} className="w-full max-w-md"></svg>
            </div>
          </div>
          
          {/* Pie Chart Section */}
          <div className="p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 mb-8">
            <h3 className="text-center text-lg font-semibold text-gray-700 mb-4">Market Share</h3>
            <div className="flex justify-center">
              <svg ref={pieChartRef} className="w-full max-w-md"></svg>
            </div>
          </div>
          
          {/* Line Chart Section */}
          <div className="p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-center text-lg font-semibold text-gray-700 mb-4">Growth Trends</h3>
            <div className="flex justify-center">
              <svg ref={lineChartRef} className="w-full"></svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiChartVisualization;
