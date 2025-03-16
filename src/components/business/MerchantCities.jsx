import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import { IoArrowBack } from "react-icons/io5";

const MerchantCities = ({ onBack }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const barChartRef = useRef();
  const lineChartRef = useRef();

  // Added handleGoBack function
  const handleGoBack = () => {
    if (onBack) onBack();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://192.168.37.177:5001/api/business/top-cities');
        setCities(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch city data');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (cities.length > 0 && !loading) {
      drawBarChart();
      drawLineChart();
    }
  }, [cities, loading]);

  const drawBarChart = () => {
    // Clear previous chart
    d3.select(barChartRef.current).selectAll("*").remove();

    // Sort cities by count in descending order
    const sortedCities = [...cities].sort((a, b) => b.count - a.count);

    const margin = { top: 50, right: 30, bottom: 120, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select(barChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X scale
    const x = d3.scaleBand()
      .domain(sortedCities.map(d => `${d.city}, ${d.state}`))
      .range([0, width])
      .padding(0.3);

    // Y scale
    const y = d3.scaleLinear()
      .domain([0, d3.max(sortedCities, d => d.count) * 1.1])
      .range([height, 0]);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "12px")
      .style("fill", "#000000")
      .style("font-weight", "500");

    // Add Y axis with improved visibility
    svg.append('g')
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#000000")
      .style("font-weight", "500");

    // Add Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 20)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .text('Number of Merchants')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#000000');

    // Add X axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .text('Cities')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#000000');

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .attr('text-anchor', 'middle')
      .text('Top Cities by Merchant Count')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#000000');

    // Create a color scale
    const colorScale = d3.scaleLinear()
      .domain([d3.min(sortedCities, d => d.count), d3.max(sortedCities, d => d.count)])
      .range(['#60a5fa', '#2563eb']);

    // Add bars
    svg.selectAll('.bar')
      .data(sortedCities)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(`${d.city}, ${d.state}`))
      .attr('width', x.bandwidth())
      .attr('y', d => y(d.count))
      .attr('height', d => height - y(d.count))
      .attr('fill', d => colorScale(d.count))
      .attr('rx', 4) // Rounded corners
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 0.8);

        svg.append('text')
          .attr('class', 'tooltip')
          .attr('x', x(`${d.city}, ${d.state}`) + x.bandwidth() / 2)
          .attr('y', y(d.count) - 10)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('font-weight', 'bold')
          .style('fill', '#000000')
          .text(`${d.count}`);
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 1);
        svg.selectAll('.tooltip').remove();
      });

    // Add count labels on top of bars
    svg.selectAll('.label')
      .data(sortedCities)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => x(`${d.city}, ${d.state}`) + x.bandwidth() / 2)
      .attr('y', d => y(d.count) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#000000')
      .text(d => d.count);
  };

  const drawLineChart = () => {
    // Clear previous chart
    d3.select(lineChartRef.current).selectAll("*").remove();

    // Sort cities by count
    const sortedCities = [...cities].sort((a, b) => b.count - a.count);

    const margin = { top: 50, right: 150, bottom: 120, left: 80 };
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
      .domain(sortedCities.map(d => `${d.city}, ${d.state}`))
      .range([0, width]);

    // Y scales for count and rating
    const yCount = d3.scaleLinear()
      .domain([0, d3.max(sortedCities, d => d.count) * 1.1])
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
      .style("font-size", "12px")
      .style("fill", "#000000")
      .style("font-weight", "500");

    // Y axis for count with improved visibility
    svg.append('g')
      .call(d3.axisLeft(yCount))
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#000000")
      .style("font-weight", "500");

    // Y axis for rating with improved visibility
    svg.append('g')
      .attr('transform', `translate(${width}, 0)`)
      .call(d3.axisRight(yRating))
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#000000")
      .style("font-weight", "500");

    // Add Y axis label for count
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 20)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .text('Number of Merchants')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#2563eb');

    // Add Y axis label for rating
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', width + margin.right - 20)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .text('Average Rating')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#dc2626');

    // Add X axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .text('Cities')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#000000');

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .attr('text-anchor', 'middle')
      .text('Merchant Count vs. Average Rating by City')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#000000');

    // Line for count
    const countLine = d3.line()
      .x(d => x(`${d.city}, ${d.state}`))
      .y(d => yCount(d.count))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(sortedCities)
      .attr('fill', 'none')
      .attr('stroke', '#2563eb')
      .attr('stroke-width', 3)
      .attr('d', countLine);

    // Line for rating
    const ratingLine = d3.line()
      .x(d => x(`${d.city}, ${d.state}`))
      .y(d => yRating(d.averageRating))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(sortedCities)
      .attr('fill', 'none')
      .attr('stroke', '#dc2626')
      .attr('stroke-width', 3)
      .attr('d', ratingLine);

    // Add dots for count
    svg.selectAll('.dot-count')
      .data(sortedCities)
      .enter()
      .append('circle')
      .attr('class', 'dot-count')
      .attr('cx', d => x(`${d.city}, ${d.state}`))
      .attr('cy', d => yCount(d.count))
      .attr('r', 6)
      .attr('fill', '#2563eb')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('r', 8);

        svg.append('text')
          .attr('class', 'tooltip')
          .attr('x', x(`${d.city}, ${d.state}`))
          .attr('y', yCount(d.count) - 15)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('font-weight', 'bold')
          .style('fill', '#000000')
          .text(`Count: ${d.count}`);
      })
      .on('mouseout', function () {
        d3.select(this).attr('r', 6);
        svg.selectAll('.tooltip').remove();
      });

    // Add dots for rating
    svg.selectAll('.dot-rating')
      .data(sortedCities)
      .enter()
      .append('circle')
      .attr('class', 'dot-rating')
      .attr('cx', d => x(`${d.city}, ${d.state}`))
      .attr('cy', d => yRating(d.averageRating))
      .attr('r', 6)
      .attr('fill', '#dc2626')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('r', 8);

        svg.append('text')
          .attr('class', 'tooltip')
          .attr('x', x(`${d.city}, ${d.state}`))
          .attr('y', yRating(d.averageRating) - 15)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('font-weight', 'bold')
          .style('fill', '#000000')
          .text(`Rating: ${d.averageRating}`);
      })
      .on('mouseout', function () {
        d3.select(this).attr('r', 6);
        svg.selectAll('.tooltip').remove();
      });

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 5}, -60)`);

    legend.append('circle').attr('cx', 0).attr('cy', 20).attr('r', 6).style('fill', '#2563eb');
    legend.append('text')
      .attr('x', 10)
      .attr('y', 20)
      .text('Merchant Count')
      .style('font-size', '12px')
      .style('fill', '#000000')
      .style('font-weight', '500')
      .attr('alignment-baseline', 'middle');

    legend.append('circle').attr('cx', 0).attr('cy', 40).attr('r', 6).style('fill', '#dc2626');
    legend.append('text')
      .attr('x', 10)
      .attr('y', 40)
      .text('Average Rating')
      .style('font-size', '12px')
      .style('fill', '#000000')
      .style('font-weight', '500')
      .attr('alignment-baseline', 'middle');
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto p-5 font-sans relative">
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
        <span className="text-gray-700 font-medium">Back</span>
      </button>



      {error && <p className="text-center text-red-600 font-bold">{error}</p>}

      {!error && (
        <>
          <div className="mb-10 p-6 border border-gray-200 rounded-lg bg-white shadow-md">
            <h2 className="text-xl text-center font-semibold text-gray-700 mb-4">Merchant Count by City</h2>
            <div ref={barChartRef} className="flex justify-center overflow-x-auto"></div>
          </div>

          <div className="mb-10 p-6 border border-gray-200 rounded-lg bg-white shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Merchant Count vs Rating by City</h2>
            <div ref={lineChartRef} className="flex justify-center overflow-x-auto"></div>
          </div>
        </>
      )}
    </div>
  );
};

export default MerchantCities;
