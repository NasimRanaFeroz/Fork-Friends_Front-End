import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import { IoArrowBack } from "react-icons/io5";

const HighestRatedCities = ({ onBack }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const barChartRef = useRef();

  const handleGoBack = () => {
    if (onBack) onBack();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://192.168.37.177:5001/api/business/top-rated-cities');
        setCities(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (cities.length > 0 && !loading) {
      drawBarChart();
    }
  }, [cities, loading]);

  const drawBarChart = () => {
    // Clear previous chart
    d3.select(barChartRef.current).selectAll("*").remove();

    const margin = { top: 50, right: 30, bottom: 100, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(barChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Sort cities by rating
    const sortedCities = [...cities].sort((a, b) => b.averageRating - a.averageRating);

    // X scale
    const x = d3.scaleBand()
      .domain(sortedCities.map(d => `${d.city}, ${d.state}`))
      .range([0, width])
      .padding(0.3);

    // Y scale
    const y = d3.scaleLinear()
      .domain([3.5, 5])  // Start from 3.5 to make differences more visible
      .range([height, 0]);

    // Add X axis with black text
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "12px")
      .style("fill", "black"); // Set text color to black

    // Add Y axis with black text
    svg.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => d.toFixed(1)))
      .selectAll("text")
      .style("fill", "black"); // Set text color to black

    // Add Y axis label with black text
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 20)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .text('Average Rating')
      .style('font-size', '14px')
      .style('fill', 'black'); // Set text color to black

    // Add title with black text
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .attr('text-anchor', 'middle')
      .text('Highest Rated Cities by Average Rating')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', 'black'); // Set text color to black

    // Create a color scale based on rating
    const colorScale = d3.scaleLinear()
      .domain([d3.min(cities, d => d.averageRating), d3.max(cities, d => d.averageRating)])
      .range(['#60a5fa', '#2563eb']);

    // Add bars
    svg.selectAll('.bar')
      .data(sortedCities)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(`${d.city}, ${d.state}`))
      .attr('width', x.bandwidth())
      .attr('y', d => y(d.averageRating))
      .attr('height', d => height - y(d.averageRating))
      .attr('fill', d => colorScale(d.averageRating))
      .attr('rx', 4) // Rounded corners
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 0.8);

        // Create tooltip
        const tooltip = svg.append('g')
          .attr('class', 'tooltip');

        // Add background rectangle
        tooltip.append('rect')
          .attr('x', x(`${d.city}, ${d.state}`) + x.bandwidth() / 2 - 80)
          .attr('y', y(d.averageRating) - 70)
          .attr('width', 160)
          .attr('height', 60)
          .attr('fill', 'white')
          .attr('stroke', '#d1d5db')
          .attr('rx', 4);

        // Add city name
        tooltip.append('text')
          .attr('x', x(`${d.city}, ${d.state}`) + x.bandwidth() / 2)
          .attr('y', y(d.averageRating) - 50)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('font-weight', 'bold')
          .style('fill', 'black') // Set text color to black
          .text(`${d.city}, ${d.state}`);

        // Add rating
        tooltip.append('text')
          .attr('x', x(`${d.city}, ${d.state}`) + x.bandwidth() / 2)
          .attr('y', y(d.averageRating) - 30)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('fill', 'black') // Set text color to black
          .text(`Rating: ${d.averageRating.toFixed(1)}`);

        // Add business count
        tooltip.append('text')
          .attr('x', x(`${d.city}, ${d.state}`) + x.bandwidth() / 2)
          .attr('y', y(d.averageRating) - 10)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('fill', 'black') // Set text color to black
          .text(`Businesses: ${d.businessCount}`);
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 1);
        svg.selectAll('.tooltip').remove();
      });

    // Add rating labels on top of bars
    svg.selectAll('.label')
      .data(sortedCities)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => x(`${d.city}, ${d.state}`) + x.bandwidth() / 2)
      .attr('y', d => y(d.averageRating) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .style('fill', 'black') // Set text color to black
      .text(d => d.averageRating.toFixed(1));
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 relative">
      {/* Back button with animation */}
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

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 mt-10">Highest Rated Cities</h1>

      {/* Data Table */}
      <div className="mb-8 overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                City
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                State
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Average Rating
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Business Count
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cities.map((city, index) => (
              <tr key={`${city.city}-${city.state}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {city.city}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {city.state}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <span className="font-medium">{city.averageRating.toFixed(1)}</span>
                    <div className="ml-2 flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < Math.floor(city.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {city.businessCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <div ref={barChartRef}></div>
      </div>
    </div>
  );
};

export default HighestRatedCities;
