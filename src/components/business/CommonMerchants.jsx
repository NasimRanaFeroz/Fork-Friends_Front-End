import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import { IoArrowBack } from "react-icons/io5";
// import { useNavigate } from 'react-router-dom';

const CommonMerchants = ({ onBack }) => {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const radialChartRef = useRef();
  const lineChartRef = useRef();
  // const navigate = useNavigate();

  const handleGoBack = () => {
    if (onBack) onBack();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://192.168.37.177:5001/api/business/top-merchants');
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
      drawRadialBarChart();
      drawLineChart();
    }
  }, [merchants, loading]);

  const drawRadialBarChart = () => {
    // Clear previous chart
    d3.select(radialChartRef.current).selectAll("*").remove();

    // Use only top 10 merchants for better visualization
    const topMerchants = merchants.slice(0, 10).sort((a, b) => b.count - a.count);

    const width = 700;
    const height = 700;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const innerRadius = 100;
    const outerRadius = Math.min(width, height) / 2 - margin.top;

    // Create SVG
    const svg = d3.select(radialChartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Add title
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -height / 2 + 20)
      .text('Top 10 Merchants by Count')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .style('opacity', 0)
      .transition()
      .duration(800)
      .style('opacity', 1);

    // X scale
    const x = d3.scaleBand()
      .domain(topMerchants.map(d => d.name))
      .range([0, 2 * Math.PI])
      .padding(0.1);

    // Y scale
    const y = d3.scaleRadial()
      .domain([0, d3.max(topMerchants, d => d.count) * 1.1])
      .range([innerRadius, outerRadius]);

    // Color scale
    const color = d3.scaleOrdinal()
      .domain(topMerchants.map(d => d.name))
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), topMerchants.length));

    // Add radial axis lines
    const yTicks = y.ticks(5).slice(1);
    svg.selectAll('.y-axis-line')
      .data(yTicks)
      .enter()
      .append('circle')
      .attr('class', 'y-axis-line')
      .attr('r', d => y(d))
      .style('fill', 'none')
      .style('stroke', '#ddd')
      .style('stroke-dasharray', '4,4')
      .style('opacity', 0)
      .transition()
      .duration(800)
      .style('opacity', 0.5);

    // Add y-axis labels
    svg.selectAll('.y-axis-label')
      .data(yTicks)
      .enter()
      .append('text')
      .attr('class', 'y-axis-label')
      .attr('y', d => -y(d))
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text(d => d)
      .style('font-size', '10px')
      .style('fill', '#555')
      .style('opacity', 0)
      .transition()
      .delay(800)
      .duration(500)
      .style('opacity', 1);

    // Add bars
    svg.selectAll('.bar')
      .data(topMerchants)
      .enter()
      .append('path')
      .attr('class', 'bar')
      .attr('fill', d => color(d.name))
      .attr('d', d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(innerRadius) // Start with zero height
        .startAngle(d => x(d.name))
        .endAngle(d => x(d.name) + x.bandwidth())
        .padAngle(0.01)
        .padRadius(innerRadius)
      )
      .style('opacity', 0.8)
      .style('stroke', 'white')
      .style('stroke-width', 1)
      // Add animation
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .attrTween('d', function (d) {
        const i = d3.interpolate(innerRadius, y(d.count));
        return function (t) {
          return d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(i(t))
            .startAngle(x(d.name))
            .endAngle(x(d.name) + x.bandwidth())
            .padAngle(0.01)
            .padRadius(innerRadius)();
        };
      });

    // Add merchant labels
    const labelRadius = outerRadius + 20;
    svg.selectAll('.merchant-label')
      .data(topMerchants)
      .enter()
      .append('text')
      .attr('class', 'merchant-label')
      .attr('transform', d => {
        const angle = x(d.name) + x.bandwidth() / 2;
        const labelX = Math.sin(angle) * labelRadius;
        const labelY = -Math.cos(angle) * labelRadius;
        return `translate(${labelX},${labelY}) rotate(${angle * 180 / Math.PI - 90})`;
      })
      .attr('text-anchor', d => {
        const angle = x(d.name) + x.bandwidth() / 2;
        return (angle > Math.PI / 2 && angle < Math.PI * 3 / 2) ? 'end' : 'start';
      })
      .attr('alignment-baseline', 'middle')
      .text(d => d.name)
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .style('opacity', 0)
      .transition()
      .delay((d, i) => 1000 + i * 50)
      .duration(500)
      .style('opacity', 1);

    // Add count labels inside the bars
    svg.selectAll('.count-label')
      .data(topMerchants)
      .enter()
      .append('text')
      .attr('class', 'count-label')
      .attr('transform', d => {
        const angle = x(d.name) + x.bandwidth() / 2;
        const radius = (y(d.count) + innerRadius) / 2;
        const labelX = Math.sin(angle) * radius;
        const labelY = -Math.cos(angle) * radius;
        return `translate(${labelX},${labelY})`;
      })
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text(d => d.count)
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .style('fill', 'white')
      .style('opacity', 0)
      .transition()
      .delay((d, i) => 1200 + i * 50)
      .duration(500)
      .style('opacity', 1);

    // Add center circle with total count
    const totalCount = topMerchants.reduce((sum, d) => sum + d.count, 0);

    svg.append('circle')
      .attr('r', innerRadius - 10)
      .attr('fill', '#f8f9fa')
      .attr('stroke', '#ddd')
      .style('opacity', 0)
      .transition()
      .duration(800)
      .style('opacity', 1);

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-1em')
      .text('Total Count')
      .style('font-size', '14px')
      .style('fill', '#555')
      .style('opacity', 0)
      .transition()
      .delay(1500)
      .duration(500)
      .style('opacity', 1);

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.5em')
      .text(totalCount)
      .style('font-size', '24px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .style('opacity', 0)
      .transition()
      .delay(1800)
      .duration(500)
      .style('opacity', 1);

    // Add legend
    const legendRadius = 12;
    const legendSpacing = 25;
    const legendX = -width / 2 + 50;
    const legendY = height / 2 - 100;

    const legend = svg.append('g')
      .attr('transform', `translate(${legendX}, ${legendY})`);

    legend.append('text')
      .attr('x', 0)
      .attr('y', -30)
      .text('Merchants')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .style('opacity', 0)
      .transition()
      .delay(2000)
      .duration(500)
      .style('opacity', 1);

    topMerchants.slice(0, 5).forEach((d, i) => {
      const lg = legend.append('g')
        .attr('transform', `translate(0, ${i * legendSpacing})`);

      lg.append('circle')
        .attr('r', 0)
        .attr('fill', color(d.name))
        .transition()
        .delay(2000 + i * 100)
        .duration(300)
        .attr('r', 6);

      lg.append('text')
        .attr('x', legendRadius + 5)
        .attr('y', 0)
        .attr('alignment-baseline', 'middle')
        .text(d.name)
        .style('font-size', '12px')
        .style('fill', '#333')
        .style('opacity', 0)
        .transition()
        .delay(2000 + i * 100)
        .duration(300)
        .style('opacity', 1);
    });
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
      .style("font-size", "10px")
      .style("fill", "#333");  // Ensure text color is visible

    // Y axis for count
    svg.append('g')
      .call(d3.axisLeft(yCount))
      .selectAll("text")
      .style("fill", "#333");  // Ensure text color is visible

    // Y axis for rating
    svg.append('g')
      .attr('transform', `translate(${width}, 0)`)
      .call(d3.axisRight(yRating))
      .selectAll("text")
      .style("fill", "#333");  // Ensure text color is visible

    // Line for count with animation
    const countLine = d3.line()
      .x(d => x(d.name))
      .y(d => yCount(d.count));

    const countPath = svg.append('path')
      .datum(sortedMerchants)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', countLine);

    // Animate the count line
    const countPathLength = countPath.node().getTotalLength();
    countPath
      .attr("stroke-dasharray", countPathLength)
      .attr("stroke-dashoffset", countPathLength)
      .transition()
      .duration(2000)
      .attr("stroke-dashoffset", 0);

    // Line for rating with animation
    const ratingLine = d3.line()
      .x(d => x(d.name))
      .y(d => yRating(d.averageRating));

    const ratingPath = svg.append('path')
      .datum(sortedMerchants)
      .attr('fill', 'none')
      .attr('stroke', 'orangered')
      .attr('stroke-width', 2)
      .attr('d', ratingLine);

    // Animate the rating line
    const ratingPathLength = ratingPath.node().getTotalLength();
    ratingPath
      .attr("stroke-dasharray", ratingPathLength)
      .attr("stroke-dashoffset", ratingPathLength)
      .transition()
      .delay(500)
      .duration(2000)
      .attr("stroke-dashoffset", 0);

    // Add dots for count with animation
    svg.selectAll('.dot-count')
      .data(sortedMerchants)
      .enter()
      .append('circle')
      .attr('class', 'dot-count')
      .attr('cx', d => x(d.name))
      .attr('cy', d => yCount(d.count))
      .attr('r', 0)  // Start with radius 0
      .attr('fill', 'steelblue')
      .transition()
      .delay((d, i) => 2000 + i * 100)
      .duration(500)
      .attr('r', 5);  // Animate to radius 5

    // Add dots for rating with animation
    svg.selectAll('.dot-rating')
      .data(sortedMerchants)
      .enter()
      .append('circle')
      .attr('class', 'dot-rating')
      .attr('cx', d => x(d.name))
      .attr('cy', d => yRating(d.averageRating))
      .attr('r', 0)  // Start with radius 0
      .attr('fill', 'orangered')
      .transition()
      .delay((d, i) => 2500 + i * 100)
      .duration(500)
      .attr('r', 5);  // Animate to radius 5

    // Add title with animation
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', -20)
      .text('Merchant Count vs. Average Rating')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('fill', '#333')  // Ensure text color is visible
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .style('opacity', 1);

    // Add axis labels with animation
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .text('Merchant Name')
      .style('font-size', '14px')
      .style('fill', '#333')  // Ensure text color is visible
      .style('opacity', 0)
      .transition()
      .delay(500)
      .duration(1000)
      .style('opacity', 1);

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 15)
      .attr('x', -height / 2)
      .text('Count')
      .style('font-size', '14px')
      .style('fill', 'steelblue')
      .style('opacity', 0)
      .transition()
      .delay(1000)
      .duration(1000)
      .style('opacity', 1);

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('y', width + margin.right - 15)
      .attr('x', -height / 2)
      .text('Average Rating')
      .style('font-size', '14px')
      .style('fill', 'orangered')
      .style('opacity', 0)
      .transition()
      .delay(1500)
      .duration(1000)
      .style('opacity', 1);

    // Add legend with animation
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 0)`);

    legend.append('circle')
      .attr('cx', 0)
      .attr('cy', 20)
      .attr('r', 0)
      .style('fill', 'steelblue')
      .transition()
      .delay(2000)
      .duration(500)
      .attr('r', 6);

    legend.append('text')
      .attr('x', 10)
      .attr('y', 20)
      .text('Count')
      .style('font-size', '12px')
      .style('fill', '#333')  // Ensure text color is visible
      .attr('alignment-baseline', 'middle')
      .style('opacity', 0)
      .transition()
      .delay(2000)
      .duration(500)
      .style('opacity', 1);

    legend.append('circle')
      .attr('cx', 0)
      .attr('cy', 40)
      .attr('r', 0)
      .style('fill', 'orangered')
      .transition()
      .delay(2200)
      .duration(500)
      .attr('r', 6);

    legend.append('text')
      .attr('x', 10)
      .attr('y', 40)
      .text('Rating')
      .style('font-size', '12px')
      .style('fill', '#333')  // Ensure text color is visible
      .attr('alignment-baseline', 'middle')
      .style('opacity', 0)
      .transition()
      .delay(2200)
      .duration(500)
      .style('opacity', 1);
  };

  return (
    <div className="max-w-7xl mx-auto p-5 font-sans ">
      {/* Back button with animation */}
      <div className='relative'>
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
          aria-label="Go back to previous page"
        >
          <IoArrowBack className="text-gray-700 text-lg" />
          <span className="text-gray-700 font-medium">Back</span>
        </button>
      </div>

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 opacity-0"
        ref={el => {
          if (el) {
            setTimeout(() => {
              el.style.transition = "opacity 0.5s, transform 0.5s";
              el.style.opacity = 1;
              el.style.transform = "translateY(0)";
            }, 100);
            el.style.transform = "translateY(-20px)";
          }
        }}>
        Common Merchants Analysis
      </h1>

      {loading && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>

          </div>
        </div>
      )}


      {error && (
        <p className="text-center text-red-600 font-bold opacity-0"
          ref={el => {
            if (el) {
              setTimeout(() => {
                el.style.transition = "opacity 0.5s";
                el.style.opacity = 1;
              }, 100);
            }
          }}>
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <div className="mb-10 p-6 border border-gray-200 rounded-lg bg-white shadow-md opacity-0 transform translate-y-4"
            ref={el => {
              if (el) {
                setTimeout(() => {
                  el.style.transition = "opacity 0.7s, transform 0.7s";
                  el.style.opacity = 1;
                  el.style.transform = "translateY(0)";
                }, 100);
              }
            }}>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Merchant Distribution</h2>
            <div ref={radialChartRef} className="flex justify-center"></div>
          </div>

          <div className="mb-10 p-6 border border-gray-200 rounded-lg bg-white shadow-md opacity-0 transform translate-y-4"
            ref={el => {
              if (el) {
                setTimeout(() => {
                  el.style.transition = "opacity 0.7s, transform 0.7s";
                  el.style.opacity = 1;
                  el.style.transform = "translateY(0)";
                }, 300);
              }
            }}>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Merchant Count vs Rating</h2>
            <div ref={lineChartRef} className="flex justify-center overflow-x-auto"></div>
          </div>
        </>
      )}
    </div>
  );
};

export default CommonMerchants;
