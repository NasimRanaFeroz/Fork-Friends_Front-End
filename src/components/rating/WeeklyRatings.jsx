import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import { IoArrowBack } from "react-icons/io5";


const WeeklyRatingsAnalysis = ({ onBack }) => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('bar');

  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const donutChartRef = useRef(null);
  const statsRef = useRef(null);

  const handleGoBack = () => {
    if (onBack) onBack();
  };


  // Order days of week correctly
  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    const fetchWeeklyRatings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://192.168.37.177:5001/api/rating/weekly');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Sort data by day of week
        const sortedData = [...data].sort((a, b) =>
          dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
        );

        setWeeklyData(sortedData);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchWeeklyRatings();
  }, []);

  useEffect(() => {
    if (weeklyData.length > 0 && !isLoading) {
      // Render the active visualization
      if (activeTab === 'bar') {
        renderBarChart();
      } else if (activeTab === 'line') {
        renderLineChart();
      } else if (activeTab === 'donut') {
        renderDonutChart();
      }

      // Always render the animated stats
      renderAnimatedStats();
    }
  }, [weeklyData, isLoading, activeTab]);

  const renderBarChart = () => {
    if (!barChartRef.current) return;

    // Clear any existing SVG
    d3.select(barChartRef.current).selectAll("*").remove();

    const margin = { top: 30, right: 30, bottom: 70, left: 80 };
    const width = barChartRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(barChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add background grid
    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(d3.scaleBand().range([0, width]).domain(weeklyData.map(d => d.day)))
        .tickSize(-height)
        .tickFormat('')
      )
      .selectAll('line')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-opacity', 0.5);

    svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(d3.scaleLinear().range([height, 0]).domain([0, d3.max(weeklyData, d => d.count) * 1.1]))
        .tickSize(-width)
        .tickFormat('')
      )
      .selectAll('line')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-opacity', 0.5);

    // X scale
    const x = d3.scaleBand()
      .domain(weeklyData.map(d => d.day))
      .range([0, width])
      .padding(0.4);

    // Y scale
    const y = d3.scaleLinear()
      .domain([0, d3.max(weeklyData, d => d.count) * 1.1])
      .range([height, 0]);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '12px')
      .style('font-weight', '500');

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y).tickFormat(d => d3.format(",.0f")(d)))
      .selectAll('text')
      .style('font-size', '12px');

    // Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 20)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '500')
      .text('Number of Ratings');

    // Create a tooltip
    const tooltip = d3.select(barChartRef.current)
      .append("div")
      .attr("class", "absolute bg-indigo-900 text-white p-2 rounded shadow-lg text-sm z-10 pointer-events-none opacity-0 transition-opacity duration-300")
      .style("max-width", "200px");

    // Color scale based on count values
    const colorScale = d3.scaleLinear()
      .domain([d3.min(weeklyData, d => d.count), d3.max(weeklyData, d => d.count)])
      .range(['#818cf8', '#4f46e5']);

    // Add bars with animation
    svg.selectAll('.bar')
      .data(weeklyData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.day))
      .attr('width', x.bandwidth())
      .attr('y', height) // Start from bottom
      .attr('height', 0) // Start with height 0
      .attr('fill', d => colorScale(d.count))
      .attr('rx', 4) // Rounded corners
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('fill', '#3730a3');

        tooltip.html(`
          <div class="font-bold">${d.day}</div>
          <div>${d3.format(",")(d.count)} ratings</div>
        `)
          .style("opacity", 1)
          .style("left", `${event.pageX - barChartRef.current.getBoundingClientRect().left + 10}px`)
          .style("top", `${event.pageY - barChartRef.current.getBoundingClientRect().top - 40}px`);
      })
      .on('mouseout', function (d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('fill', d => colorScale(d.count));

        tooltip.style("opacity", 0);
      })
      .transition() // Add animation
      .duration(800)
      .delay((d, i) => i * 100)
      .attr('y', d => y(d.count))
      .attr('height', d => height - y(d.count));

    // Add value labels on top of bars
    svg.selectAll('.label')
      .data(weeklyData)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.day) + x.bandwidth() / 2)
      .attr('y', d => y(d.count) - 10)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .style('opacity', 0)
      .text(d => d3.format(",.0f")(d.count))
      .transition()
      .duration(800)
      .delay((d, i) => 800 + i * 100)
      .style('opacity', 1);

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Weekly Ratings Distribution');
  };

  const renderLineChart = () => {
    if (!lineChartRef.current) return;

    // Clear any existing SVG
    d3.select(lineChartRef.current).selectAll("*").remove();

    const margin = { top: 30, right: 30, bottom: 70, left: 80 };
    const width = lineChartRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(lineChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add background grid
    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(d3.scaleBand().range([0, width]).domain(weeklyData.map(d => d.day)))
        .tickSize(-height)
        .tickFormat('')
      )
      .selectAll('line')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-opacity', 0.5);

    svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(d3.scaleLinear().range([height, 0]).domain([0, d3.max(weeklyData, d => d.count) * 1.1]))
        .tickSize(-width)
        .tickFormat('')
      )
      .selectAll('line')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-opacity', 0.5);

    // X scale
    const x = d3.scaleBand()
      .domain(weeklyData.map(d => d.day))
      .range([0, width])
      .padding(0.4);

    // Y scale
    const y = d3.scaleLinear()
      .domain([0, d3.max(weeklyData, d => d.count) * 1.1])
      .range([height, 0]);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '12px')
      .style('font-weight', '500');

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y).tickFormat(d => d3.format(",.0f")(d)))
      .selectAll('text')
      .style('font-size', '12px');

    // Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 20)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '500')
      .text('Number of Ratings');

    // Create a tooltip
    const tooltip = d3.select(lineChartRef.current)
      .append("div")
      .attr("class", "absolute bg-indigo-900 text-white p-2 rounded shadow-lg text-sm z-10 pointer-events-none opacity-0 transition-opacity duration-300")
      .style("max-width", "200px");

    // Add the line
    const line = d3.line()
      .x(d => x(d.day) + x.bandwidth() / 2)
      .y(d => y(d.count))
      .curve(d3.curveMonotoneX); // Smoother curve

    // Add path with animation
    const path = svg.append('path')
      .datum(weeklyData)
      .attr('fill', 'none')
      .attr('stroke', '#4f46e5')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Animate the line drawing
    const pathLength = path.node().getTotalLength();

    path
      .attr('stroke-dasharray', pathLength)
      .attr('stroke-dashoffset', pathLength)
      .transition()
      .duration(2000)
      .attr('stroke-dashoffset', 0);

    // Add the points with animation
    svg.selectAll('.dot')
      .data(weeklyData)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d.day) + x.bandwidth() / 2)
      .attr('cy', d => y(d.count))
      .attr('r', 0) // Start with radius 0
      .attr('fill', '#4f46e5')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 8)
          .attr('fill', '#3730a3');

        tooltip.html(`
          <div class="font-bold">${d.day}</div>
          <div>${d3.format(",")(d.count)} ratings</div>
        `)
          .style("opacity", 1)
          .style("left", `${event.pageX - lineChartRef.current.getBoundingClientRect().left + 10}px`)
          .style("top", `${event.pageY - lineChartRef.current.getBoundingClientRect().top - 40}px`);
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 6)
          .attr('fill', '#4f46e5');

        tooltip.style("opacity", 0);
      })
      .transition() // Add animation
      .duration(500)
      .delay((d, i) => 2000 + i * 100)
      .attr('r', 6);

    // Add value labels above points
    svg.selectAll('.label')
      .data(weeklyData)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.day) + x.bandwidth() / 2)
      .attr('y', d => y(d.count) - 15)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .style('opacity', 0)
      .text(d => d3.format(",.0f")(d.count))
      .transition()
      .duration(500)
      .delay((d, i) => 2500 + i * 100)
      .style('opacity', 1);

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Weekly Ratings Trend');

    // Add average line
    const avgCount = d3.mean(weeklyData, d => d.count);

    svg.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(avgCount))
      .attr('y2', y(avgCount))
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .delay(3000)
      .style('opacity', 1);

    // Add average label
    svg.append('text')
      .attr('x', width - 10)
      .attr('y', y(avgCount) - 10)
      .attr('text-anchor', 'end')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#ef4444')
      .text(`Average: ${d3.format(",.0f")(avgCount)}`)
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .delay(3200)
      .style('opacity', 1);
  };

  const renderDonutChart = () => {
    if (!donutChartRef.current) return;

    // Clear any existing SVG
    d3.select(donutChartRef.current).selectAll("*").remove();

    const width = donutChartRef.current.clientWidth;
    const height = 400;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    // Create SVG
    const svg = d3.select(donutChartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Color scale
    const color = d3.scaleOrdinal()
      .domain(weeklyData.map(d => d.day))
      .range(d3.quantize(t => d3.interpolateInferno(t * 0.8 + 0.1), weeklyData.length));

    // Create a tooltip
    const tooltip = d3.select(donutChartRef.current)
      .append("div")
      .attr("class", "absolute bg-indigo-900 text-white p-2 rounded shadow-lg text-sm z-10 pointer-events-none opacity-0 transition-opacity duration-300")
      .style("max-width", "200px");

    // Compute the position of each group on the pie
    const pie = d3.pie()
      .value(d => d.count)
      .sort(null); // Don't sort, maintain the order

    const data_ready = pie(weeklyData);

    // Arc generators
    const arcPath = d3.arc()
      .innerRadius(radius * 0.6) // Donut chart
      .outerRadius(radius);

    const hoverArc = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 1.05);

    // Build the pie chart
    const paths = svg.selectAll('path')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arcPath)
      .attr('fill', d => color(d.data.day))
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        // Highlight segment
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', hoverArc);

        // Show tooltip
        const percentage = (d.data.count / d3.sum(weeklyData, d => d.count) * 100).toFixed(1);

        // Get container dimensions and position
        const containerRect = donutChartRef.current.getBoundingClientRect();

        // Calculate tooltip position with constraints to keep it within the container
        let tooltipX = event.pageX - containerRect.left + 10;
        let tooltipY = event.pageY - containerRect.top - 40;

        // Estimate tooltip width and height (adjust these values based on your content)
        const estimatedTooltipWidth = 150;
        const estimatedTooltipHeight = 80;

        // Ensure tooltip stays within container bounds
        if (tooltipX + estimatedTooltipWidth > containerRect.width) {
          tooltipX = tooltipX - estimatedTooltipWidth - 20; // Move to left of cursor
        }

        if (tooltipY < 0) {
          tooltipY = 10; // Ensure minimum top spacing
        } else if (tooltipY + estimatedTooltipHeight > containerRect.height) {
          tooltipY = containerRect.height - estimatedTooltipHeight - 10; // Keep within bottom
        }

        tooltip.html(`
          <div class="font-bold">${d.data.day}</div>
          <div>${d3.format(",")(d.data.count)} ratings</div>
          <div>${percentage}% of total</div>
        `)
          .style("opacity", 1)
          .style("left", `${tooltipX}px`)
          .style("top", `${tooltipY}px`);
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arcPath);

        tooltip.style("opacity", 0);
      });

    // Animation
    paths
      .style('opacity', 0)
      .attr('d', d => {
        const startArc = { ...d, startAngle: d.endAngle, endAngle: d.endAngle };
        return arcPath(startArc);
      })
      .transition()
      .duration(1000)
      .style('opacity', 1)
      .attrTween('d', function (d) {
        const interpolate = d3.interpolate(
          { ...d, startAngle: d.endAngle },
          d
        );
        return t => arcPath(interpolate(t));
      });

    // Add labels
    const arcLabel = d3.arc()
      .innerRadius(radius * 0.8)
      .outerRadius(radius * 0.8);

    svg.selectAll('text.segment-label')
      .data(data_ready)
      .enter()
      .append('text')
      .attr('class', 'segment-label')
      .attr('transform', d => `translate(${arcLabel.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', 'white')
      .style('opacity', 0)
      .text(d => {
        const percentage = (d.data.count / d3.sum(weeklyData, d => d.count) * 100).toFixed(1);
        return `${percentage}%`;
      })
      .transition()
      .duration(500)
      .delay((d, i) => 1000 + i * 100)
      .style('opacity', 1);

    // Add center text
    const centerGroup = svg.append('g');

    centerGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Total Ratings');

    centerGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .style('font-size', '20px')
      .style('font-weight', 'bold')
      .text(d3.format(",")(d3.sum(weeklyData, d => d.count)));

    centerGroup
      .style('opacity', 0)
      .transition()
      .delay(1500)
      .duration(500)
      .style('opacity', 1);

    // Create a legend group
    const legendGroup = svg.append('g')
      .attr('transform', `translate(${radius + 20}, ${-radius})`);

    // Add legend items individually
    data_ready.forEach((d, i) => {
      const legendItem = legendGroup.append('g')
        .attr('class', 'legend-item')
        .attr('transform', `translate(0, ${i * 20})`)
        .style('opacity', 0);

      legendItem.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', color(d.data.day));

      legendItem.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .text(d.data.day)
        .style('font-size', '12px');

      legendItem.transition()
        .duration(500)
        .delay(1500 + i * 100)
        .style('opacity', 1);
    });
  };

  const renderAnimatedStats = () => {
    if (!statsRef.current) return;

    // Calculate statistics
    const totalRatings = d3.sum(weeklyData, d => d.count);
    const avgDailyRatings = totalRatings / 7;
    const maxDay = weeklyData.reduce((max, day) => day.count > max.count ? day : max, weeklyData[0]);
    const minDay = weeklyData.reduce((min, day) => day.count < min.count ? day : min, weeklyData[0]);
    const weekendTotal = weeklyData.filter(d => d.day === 'Saturday' || d.day === 'Sunday').reduce((sum, d) => sum + d.count, 0);
    const weekdayTotal = totalRatings - weekendTotal;

    // Animated counter function
    const animateCounter = (element, target, duration = 2000, prefix = '', suffix = '') => {
      let start = 0;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easeProgress = d3.easeCubicOut(progress);
        const currentValue = Math.floor(easeProgress * target);

        element.textContent = `${prefix}${d3.format(',')(currentValue)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = `${prefix}${d3.format(',')(target)}${suffix}`;
        }
      };

      requestAnimationFrame(updateCounter);
    };

    // Start animations for each stat after a delay
    setTimeout(() => {
      const totalRatingsElement = document.getElementById('total-ratings');
      const avgDailyElement = document.getElementById('avg-daily');
      const maxDayCountElement = document.getElementById('max-day-count');
      const minDayCountElement = document.getElementById('min-day-count');
      const weekendPercentageElement = document.getElementById('weekend-percentage');
      const weekdayPercentageElement = document.getElementById('weekday-percentage');

      if (totalRatingsElement) animateCounter(totalRatingsElement, totalRatings);
      if (avgDailyElement) animateCounter(avgDailyElement, Math.round(avgDailyRatings));
      if (maxDayCountElement) animateCounter(maxDayCountElement, maxDay.count);
      if (minDayCountElement) animateCounter(minDayCountElement, minDay.count);
      if (weekendPercentageElement) animateCounter(weekendPercentageElement, Math.round(weekendTotal / totalRatings * 100), 1500, '', '%');
      if (weekdayPercentageElement) animateCounter(weekdayPercentageElement, Math.round(weekdayTotal / totalRatings * 100), 1500, '', '%');
    }, 500);
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg relative">
      <button
        onClick={handleGoBack}
        className="absolute top-5 left-5 flex items-center gap-2 py-2 px-4 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-all duration-300 z-10 opacity-0 transform -translate-x-4"
        ref={el => {
          if (el) {
            setTimeout(() => {
              el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
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

      <h1 className="text-3xl font-bold text-indigo-900 mb-6 text-center">Weekly Ratings Analysis</h1>

      {/* Stats Cards */}
      <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md p-4 text-white">
          <h3 className="text-xl font-semibold mb-2">Total Ratings</h3>
          <p id="total-ratings" className="text-3xl font-bold">0</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md p-4 text-white">
          <h3 className="text-xl font-semibold mb-2">Average Daily Ratings</h3>
          <p id="avg-daily" className="text-3xl font-bold">0</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-md p-4 text-white">
          <h3 className="text-xl font-semibold mb-2">Busiest Day</h3>
          <p className="text-3xl font-bold">
            <span>{weeklyData.length > 0 ? weeklyData.reduce((max, day) => day.count > max.count ? day : max, weeklyData[0]).day : ''}</span>
          </p>
          <p className="text-lg">
            <span id="max-day-count">0</span> ratings
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-lg shadow-md p-4 text-white">
          <h3 className="text-xl font-semibold mb-2">Slowest Day</h3>
          <p className="text-3xl font-bold">
            <span>{weeklyData.length > 0 ? weeklyData.reduce((min, day) => day.count < min.count ? day : min, weeklyData[0]).day : ''}</span>
          </p>
          <p className="text-lg">
            <span id="min-day-count">0</span> ratings
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg shadow-md p-4 text-white">
          <h3 className="text-xl font-semibold mb-2">Weekend Ratings</h3>
          <p className="text-3xl font-bold">
            <span id="weekend-percentage">0</span>%
          </p>
          <p className="text-sm">of total ratings</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-lg shadow-md p-4 text-white">
          <h3 className="text-xl font-semibold mb-2">Weekday Ratings</h3>
          <p className="text-3xl font-bold">
            <span id="weekday-percentage">0</span>%
          </p>
          <p className="text-sm">of total ratings</p>
        </div>
      </div>

      {/* Chart Navigation */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${activeTab === 'bar'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
              } border border-gray-200 focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:text-indigo-700 transition-all duration-200`}
            onClick={() => setActiveTab('bar')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            Bar Chart
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'line'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
              } border-t border-b border-gray-200 focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:text-indigo-700 transition-all duration-200`}
            onClick={() => setActiveTab('line')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 000 2h6a1 1 0 100-2H3zm0 4a1 1 0 100 2h8a1 1 0 100-2H3zm10-4a1 1 0 100 2h1a1 1 0 100-2h-1z" clipRule="evenodd" />
              <path d="M18 10a1 1 0 00-1-1h-4a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4z" />
            </svg>
            Line Chart
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${activeTab === 'donut'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
              } border border-gray-200 focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:text-indigo-700 transition-all duration-200`}
            onClick={() => setActiveTab('donut')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
            Donut Chart
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-8">
        <div className={`${activeTab === 'bar' ? 'block' : 'hidden'}`}>
          <div ref={barChartRef} className="w-full h-[400px] relative"></div>
        </div>

        <div className={`${activeTab === 'line' ? 'block' : 'hidden'}`}>
          <div ref={lineChartRef} className="w-full h-[400px] relative"></div>
        </div>

        <div className={`${activeTab === 'donut' ? 'block' : 'hidden'}`}>
          <div ref={donutChartRef} className="w-full h-[400px] relative"></div>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Day</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ratings Count</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Percentage</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Comparison</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {weeklyData.map((day, index) => {
              const totalRatings = d3.sum(weeklyData, d => d.count);
              const percentage = (day.count / totalRatings * 100).toFixed(1);
              const avgDailyRatings = totalRatings / 7;
              const diffFromAvg = ((day.count - avgDailyRatings) / avgDailyRatings * 100).toFixed(1);

              return (
                <tr key={day.day} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{day.day}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{d3.format(",")(day.count)}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{percentage}%</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${diffFromAvg > 0
                        ? 'bg-green-100 text-green-800'
                        : diffFromAvg < 0
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                      {diffFromAvg > 0 ? '+' : ''}{diffFromAvg}% from average
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Insights Section */}
      <div className="mt-8 bg-indigo-50 rounded-lg p-6 shadow-inner">
        <h2 className="text-2xl font-bold text-indigo-900 mb-4">Key Insights</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="text-lg font-semibold text-indigo-800 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Busiest Days
            </h3>
            <p className="text-gray-700">
              {weeklyData.length > 0 && (
                <>
                  <span className="font-medium">{weeklyData.reduce((max, day) => day.count > max.count ? day : max, weeklyData[0]).day}</span> has the highest rating activity with{' '}
                  <span className="font-medium">{d3.format(",")(weeklyData.reduce((max, day) => day.count > max.count ? day : max, weeklyData[0]).count)}</span> ratings.
                </>
              )}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="text-lg font-semibold text-indigo-800 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z" clipRule="evenodd" />
              </svg>
              Weekend vs. Weekday
            </h3>
            <p className="text-gray-700">
              {weeklyData.length > 0 && (
                <>
                  Weekend days account for{' '}
                  <span className="font-medium">
                    {Math.round(
                      (weeklyData.filter(d => d.day === 'Saturday' || d.day === 'Sunday').reduce((sum, d) => sum + d.count, 0) /
                        d3.sum(weeklyData, d => d.count)) * 100
                    )}%
                  </span>{' '}
                  of all ratings, showing {
                    (weeklyData.filter(d => d.day === 'Saturday' || d.day === 'Sunday').reduce((sum, d) => sum + d.count, 0) / 2) >
                      (weeklyData.filter(d => d.day !== 'Saturday' && d.day !== 'Sunday').reduce((sum, d) => sum + d.count, 0) / 5)
                      ? 'higher' : 'lower'
                  } average activity than weekdays.
                </>
              )}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="text-lg font-semibold text-indigo-800 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
              Distribution Pattern
            </h3>
            <p className="text-gray-700">
              {weeklyData.length > 0 && (
                <>
                  The distribution shows a{' '}
                  {Math.max(...weeklyData.map(d => d.count)) - Math.min(...weeklyData.map(d => d.count)) >
                    d3.mean(weeklyData, d => d.count) * 0.2 ? 'significant' : 'relatively even'} variation across the week,
                  with a difference of{' '}
                  <span className="font-medium">
                    {d3.format(",")(Math.max(...weeklyData.map(d => d.count)) - Math.min(...weeklyData.map(d => d.count)))}
                  </span>{' '}
                  ratings between the busiest and slowest days.
                </>
              )}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="text-lg font-semibold text-indigo-800 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              Activity Trend
            </h3>
            <p className="text-gray-700">
              {weeklyData.length > 0 && (
                <>
                  Rating activity tends to{' '}
                  {
                    weeklyData[0].count < weeklyData[1].count &&
                      weeklyData[1].count < weeklyData[2].count ?
                      'increase gradually from Monday to Wednesday' :
                      weeklyData[0].count > weeklyData[1].count &&
                        weeklyData[1].count > weeklyData[2].count ?
                        'decrease gradually from Monday to Wednesday' :
                        'fluctuate throughout the week'
                  }
                  , with a notable{' '}
                  {
                    weeklyData.find(d => d.day === 'Friday').count <
                      weeklyData.find(d => d.day === 'Saturday').count ?
                      'increase' : 'decrease'
                  }{' '}
                  on the weekend.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeeklyRatingsAnalysis;
