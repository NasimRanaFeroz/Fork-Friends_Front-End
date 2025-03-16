import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import { IoArrowBack } from "react-icons/io5";

const CityTopMerchants = ({ onBack }) => {
  const chartRef = useRef(null);
  const [merchantData, setMerchantData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('rating'); // Options: 'rating', 'reviews', 'alphabetical'


  const handleGoBack = () => {
    if (onBack) onBack();
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://192.168.37.177:5001/api/comprehensive/city-top-merchants');
        setMerchantData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch merchant data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (merchantData.length > 0 && chartRef.current) {
      createVisualization();
    }
  }, [merchantData, sortBy]);

  const sortData = () => {
    let sortedData = [...merchantData];

    switch (sortBy) {
      case 'rating':
        sortedData.sort((a, b) => b.topMerchants[0].overallRating - a.topMerchants[0].overallRating);
        break;
      case 'reviews':
        sortedData.sort((a, b) => b.topMerchants[0].totalReviews - a.topMerchants[0].totalReviews);
        break;
      case 'alphabetical':
        sortedData.sort((a, b) => a.city.localeCompare(b.city));
        break;
      default:
        break;
    }

    return sortedData;
  };

  const createVisualization = () => {
    // Clear any existing visualization
    d3.select(chartRef.current).selectAll('*').remove();

    const sortedData = sortData();

    // Set dimensions
    const margin = { top: 60, right: 120, bottom: 150, left: 60 };
    const width = 1000 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#f0f4ff')
      .attr('rx', 8)
      .attr('ry', 8);

    // X scale - use scaleBand for categorical data
    const x = d3.scaleBand()
      .domain(sortedData.map(d => d.city))
      .range([0, width])
      .padding(0.3);

    // Y scale
    const y = d3.scaleLinear()
      .domain([0, 5.5]) // Rating scale 0-5 with some padding
      .range([height, 0]);

    // Add gridlines
    svg.selectAll('grid-lines')
      .data([0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5])
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', d => y(d))
      .attr('y2', d => y(d))
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 1);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '12px')
      .style('font-family', 'Arial')
      .style('fill', '#4a5568');

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y).ticks(10))
      .selectAll('text')
      .style('font-size', '12px')
      .style('font-family', 'Arial')
      .style('fill', '#4a5568');

    // Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .text('Rating')
      .style('fill', '#2d3748')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('font-family', 'Arial');

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .text('Top Merchants by City Rating')
      .style('fill', '#1a202c')
      .style('font-size', '24px')
      .style('font-weight', 'bold')
      .style('font-family', 'Arial');

    // Create color scale based on ratings
    const colorScale = d3.scaleLinear()
      .domain([1, 5])
      .range(['#cbd5e0', '#4c51bf']);

    // Create tooltip
    const tooltip = d3.select(chartRef.current)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('border', '1px solid #ddd')
      .style('border-radius', '8px')
      .style('padding', '12px')
      .style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)')
      .style('pointer-events', 'none')
      .style('font-family', 'Arial')
      .style('font-size', '14px')
      .style('z-index', 10);

    // Add bars with animation
    svg.selectAll('.bar')
      .data(sortedData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.city))
      .attr('width', x.bandwidth())
      .attr('y', height) // Start from bottom
      .attr('height', 0) // Start with height 0
      .attr('fill', d => colorScale(d.topMerchants[0].overallRating))
      .attr('rx', 4) // Rounded corners
      .attr('ry', 4)
      .on('mouseover', function (event, d) {
        d3.select(this)
          .transition()
          .duration(300)
          .attr('fill', '#667eea');

        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9);

        tooltip.html(`
          <div style="font-weight: bold; margin-bottom: 8px; font-size: 16px;">${d.city}, ${d.state}</div>
          <div style="margin-bottom: 4px;"><b>Merchant:</b> ${d.topMerchants[0].name}</div>
          <div style="margin-bottom: 4px;"><b>Rating:</b> ${d.topMerchants[0].overallRating} ⭐</div>
          <div><b>Reviews:</b> ${d.topMerchants[0].totalReviews}</div>
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(300)
          .attr('fill', d => colorScale(d.topMerchants[0].overallRating));

        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      })
      .transition() // Add animation
      .duration(800)
      .delay((d, i) => i * 50)
      .attr('y', d => y(d.topMerchants[0].overallRating))
      .attr('height', d => height - y(d.topMerchants[0].overallRating))
      .ease(d3.easeBounce);

    // Add rating labels with animation
    svg.selectAll('.rating-label')
      .data(sortedData)
      .enter()
      .append('text')
      .attr('class', 'rating-label')
      .attr('x', d => x(d.city) + x.bandwidth() / 2)
      .attr('y', height) // Start from bottom
      .attr('text-anchor', 'middle')
      .style('font-size', '0px') // Start with size 0
      .style('font-weight', 'bold')
      .style('font-family', 'Arial')
      .style('fill', '#fff')
      .text(d => d.topMerchants[0].overallRating)
      .transition() // Add animation
      .duration(1000)
      .delay((d, i) => i * 50 + 400)
      .attr('y', d => y(d.topMerchants[0].overallRating) + 20)
      .style('font-size', '12px');

    // Add legend
    const legendData = [
      { label: '5.0 ⭐⭐⭐⭐⭐', value: 5 },
      { label: '4.0 ⭐⭐⭐⭐', value: 4 },
      { label: '3.0 ⭐⭐⭐', value: 3 },
      { label: '2.0 ⭐⭐', value: 2 },
      { label: '1.0 ⭐', value: 1 }
    ];

    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 20)`);

    legend.selectAll('rect')
      .data(legendData)
      .enter()
      .append('rect')
      .attr('y', (d, i) => i * 25)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', d => colorScale(d.value))
      .attr('rx', 2)
      .attr('ry', 2);

    legend.selectAll('text')
      .data(legendData)
      .enter()
      .append('text')
      .attr('x', 25)
      .attr('y', (d, i) => i * 25 + 12)
      .text(d => d.label)
      .style('font-size', '12px')
      .style('font-family', 'Arial')
      .style('fill', '#4a5568');

    // Add legend title
    legend.append('text')
      .attr('x', 0)
      .attr('y', -10)
      .text('Rating Legend')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('font-family', 'Arial')
      .style('fill', '#2d3748');
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="text-yellow-500">★</span>);
    }

    if (halfStar) {
      stars.push(<span key="half" className="text-yellow-500">★</span>);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">☆</span>);
    }

    return stars;
  };

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

      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-800">Top Merchants by City</h1>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="mb-6 flex justify-end space-x-4">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setSortBy('rating')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${sortBy === 'rating' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Sort by Rating
              </button>
              <button
                onClick={() => setSortBy('reviews')}
                className={`px-4 py-2 text-sm font-medium ${sortBy === 'reviews' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Sort by Reviews
              </button>
              <button
                onClick={() => setSortBy('alphabetical')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${sortBy === 'alphabetical' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Sort Alphabetically
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <div ref={chartRef} className="mt-4 overflow-x-auto"></div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-700">Detailed Merchant Data</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merchant Name</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Reviews</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortData().map((cityData, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cityData.city}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cityData.state}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cityData.topMerchants[0].name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        <div className="flex items-center justify-center">
                          {renderStars(cityData.topMerchants[0].overallRating)}
                          <span className="ml-1">({cityData.topMerchants[0].overallRating})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{cityData.topMerchants[0].totalReviews}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CityTopMerchants;
