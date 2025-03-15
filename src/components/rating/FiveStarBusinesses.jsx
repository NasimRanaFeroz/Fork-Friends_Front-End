import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

const FiveStarBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/rating/top-five-star');
        setBusinesses(response.data);
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
    if (businesses.length > 0 && chartRef.current) {
      createBarChart();
    }
  }, [businesses]);

  const createBarChart = () => {
    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();

    const margin = { top: 40, right: 30, bottom: 90, left: 80 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Define scales
    const x = d3.scaleBand()
      .domain(businesses.map(d => d.businessName))
      .range([0, width])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(businesses, d => d.fiveStarCount) * 1.1])
      .range([height, 0]);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '12px');

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('font-size', '12px');

    // Add Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -60)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .text('Number of Five-Star Reviews')
      .style('font-size', '14px')
      .style('font-weight', 'bold');

    // Create a color scale
    const colorScale = d3.scaleLinear()
      .domain([d3.min(businesses, d => d.fiveStarCount), d3.max(businesses, d => d.fiveStarCount)])
      .range(['#60a5fa', '#3730a3']);

    // Add bars
    svg.selectAll('.bar')
      .data(businesses)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.businessName))
      .attr('width', x.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('fill', d => colorScale(d.fiveStarCount))
      .attr('rx', 4)
      .attr('ry', 4)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 0.8);
        setSelectedBusiness(d);
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 1);
        setSelectedBusiness(null);
      })
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .attr('y', d => y(d.fiveStarCount))
      .attr('height', d => height - y(d.fiveStarCount));

    // Add values on top of bars
    svg.selectAll('.label')
      .data(businesses)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.businessName) + x.bandwidth() / 2)
      .attr('y', d => y(d.fiveStarCount) - 10)
      .attr('text-anchor', 'middle')
      .text(d => d.fiveStarCount)
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#4b5563')
      .style('opacity', 0)
      .transition()
      .duration(800)
      .delay((d, i) => i * 100 + 300)
      .style('opacity', 1);
  };

  // Calculate percentage of five-star reviews
  const calculatePercentage = (business) => {
    return ((business.fiveStarCount / business.totalReviews) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        ></motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-extrabold text-indigo-800 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Top Businesses with Most Five-Star Ratings
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Explore the restaurants and businesses that have received the highest number of five-star reviews
          </motion.p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-6 mb-10">
          <div ref={chartRef} className="w-full overflow-x-auto"></div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {businesses.map((business, index) => (
            <motion.div
              key={business.businessId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
              className={`bg-white rounded-lg shadow-lg overflow-hidden ${selectedBusiness?.businessId === business.businessId ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{business.businessName}</h3>
                  <div className="flex items-center bg-indigo-100 px-3 py-1 rounded-full">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 font-bold text-indigo-800">{business.totalStars}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Five-Star Reviews:</span>
                    <span className="font-bold text-indigo-700">{business.fiveStarCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Reviews:</span>
                    <span className="font-medium">{business.totalReviews.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Five-Star Percentage:</span>
                    <span className="font-medium text-green-600">{calculatePercentage(business)}%</span>
                  </div>

                  <div className="pt-2">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                            Five-Star Ratio
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${calculatePercentage(business)}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                        ></motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FiveStarBusinesses;
