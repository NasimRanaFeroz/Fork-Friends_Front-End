import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import { geoAlbersUsa, geoPath } from 'd3-geo';
import * as topojson from 'topojson-client';

const MerchantStates = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usaGeoData, setUsaGeoData] = useState(null);
  
  const barChartRef = useRef();
  const mapChartRef = useRef();
  const pieChartRef = useRef();
  const combinedChartRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch state data
        const response = await axios.get('http://localhost:5001/api/business/top-states');
        setStates(response.data);
        console.log(response.data);
        
        // Fetch USA GeoJSON data for the map with better error handling
        try {
          const geoResponse = await fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json');
          if (!geoResponse.ok) {
            throw new Error(`HTTP error! status: ${geoResponse.status}`);
          }
          const geoData = await geoResponse.json();
          setUsaGeoData(geoData);
        } catch (geoErr) {
          console.error('Error fetching map data:', geoErr);
          setError('Failed to load map data. The charts will still work without the map.');
        }
        
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
    if (states.length > 0 && !loading) {
      drawBarChart();
      drawPieChart();
      drawCombinedChart();
      
      if (usaGeoData) {
        drawMapChart();
      }
    }
  }, [states, loading, usaGeoData]);

  const drawBarChart = () => {
    // Clear previous chart
    d3.select(barChartRef.current).selectAll("*").remove();
    
    const margin = { top: 50, right: 30, bottom: 70, left: 80 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    const svg = d3.select(barChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // X scale
    const x = d3.scaleBand()
      .domain(states.map(d => d.state))
      .range([0, width])
      .padding(0.3);
    
    // Y scale
    const y = d3.scaleLinear()
      .domain([0, d3.max(states, d => d.count) * 1.1])
      .range([height, 0]);
    
    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style('font-weight', 'bold')
      .style('fill', '#000000');
    
    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y));
    
    // Add Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 20)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .text('Number of Merchants')
      .style('font-size', '14px')
      
    
    // Add title
    svg.append('text')
      .attr('x', width / 4)
      .attr('y', -margin.top /2 )
      .attr('text-anchor', 'middle')
      .text('Top States by Merchant Count')
      .style('font-size', '18px')
      .style('font-weight', 'bold');
    
    // Create a color scale
    const colorScale = d3.scaleLinear()
      .domain([d3.min(states, d => d.count), d3.max(states, d => d.count)])
      .range(['#60a5fa', '#2563eb']);
    
    // Add bars
    svg.selectAll('.bar')
      .data(states)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.state))
      .attr('width', x.bandwidth())
      .attr('y', d => y(d.count))
      .attr('height', d => height - y(d.count))
      .attr('fill', d => colorScale(d.count))
      .attr('rx', 4) // Rounded corners
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 0.8);
        
        // Create tooltip
        const tooltip = svg.append('g')
          .attr('class', 'tooltip');
        
        // Add background rectangle
        tooltip.append('rect')
          .attr('x', x(d.state) + x.bandwidth() / 2 - 70)
          .attr('y', y(d.count) - 60)
          .attr('width', 140)
          .attr('height', 50)
          .attr('fill', 'white')
          .attr('stroke', '#d1d5db')
          .attr('rx', 4);
        
        // Add state name
        tooltip.append('text')
          .attr('x', x(d.state) + x.bandwidth() / 2)
          .attr('y', y(d.count) - 40)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('font-weight', 'bold')
          .text(getStateName(d.state));
        
        // Add count
        tooltip.append('text')
          .attr('x', x(d.state) + x.bandwidth() / 2)
          .attr('y', y(d.count) - 20)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .text(`Merchants: ${d.count.toLocaleString()}`);
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 1);
        svg.selectAll('.tooltip').remove();
      });
    
    // Add count labels on top of bars
    svg.selectAll('.label')
      .data(states)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.state) + x.bandwidth() / 2)
      .attr('y', d => y(d.count) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text(d => d.count.toLocaleString());
  };

  const drawMapChart = () => {
    // Skip if no geo data is available
    if (!usaGeoData) {
      return;
    }
    
    // Clear previous chart
    d3.select(mapChartRef.current).selectAll("*").remove();
    
    const width = 800;
    const height = 500;
    
    const svg = d3.select(mapChartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    
    // Create a color scale
    const colorScale = d3.scaleLinear()
      .domain([d3.min(states, d => d.count), d3.max(states, d => d.count)])
      .range(['#bfdbfe', '#1e40af']);
    
    // Create a map of state codes to counts
    const stateDataMap = {};
    states.forEach(d => {
      stateDataMap[d.state] = d;
    });
    
    // Create a projection - Albers USA is best for US maps
    const projection = geoAlbersUsa()
      .scale(1000)
      .translate([width / 2, height / 2]);
    
    // Create a path generator
    const path = geoPath()
      .projection(projection);
    
    // Make sure we're accessing the correct object in the TopoJSON
    const statesFeature = usaGeoData.objects.states || usaGeoData.objects.state;
    
    // Convert TopoJSON to GeoJSON
    const statesGeo = topojson.feature(usaGeoData, statesFeature).features;
    
    // Add state paths
    svg.selectAll('.state')
      .data(statesGeo)
      .enter()
      .append('path')
      .attr('class', 'state')
      .attr('d', path)
      .attr('fill', d => {
        // The id in newer versions might be a string or number
        const stateCode = getStateCodeFromId(d.id.toString());
        return stateDataMap[stateCode] ? colorScale(stateDataMap[stateCode].count) : '#e5e7eb';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .on('mouseover', function(event, d) {
        const stateCode = getStateCodeFromId(d.id.toString());
        if (stateDataMap[stateCode]) {
          d3.select(this).attr('opacity', 0.8);
          
          // Create tooltip
          const [x, y] = path.centroid(d);
          
          const tooltip = svg.append('g')
            .attr('class', 'tooltip');
          
          // Add background rectangle
          tooltip.append('rect')
            .attr('x', x - 70)
            .attr('y', y - 60)
            .attr('width', 140)
            .attr('height', 50)
            .attr('fill', 'white')
            .attr('stroke', '#d1d5db')
            .attr('rx', 4);
          
          // Add state name
          tooltip.append('text')
            .attr('x', x)
            .attr('y', y - 40)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text(getStateName(stateCode));
          
          // Add count
          tooltip.append('text')
            .attr('x', x)
            .attr('y', y - 20)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .text(`Merchants: ${stateDataMap[stateCode].count.toLocaleString()}`);
        }
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 1);
        svg.selectAll('.tooltip').remove();
      });
    
    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .text('Merchant Distribution by State')
      .style('font-size', '18px')
      .style('font-weight', 'bold');
    
    // Add legend
    const legendWidth = 200;
    const legendHeight = 20;
    const legendX = width - legendWidth - 20;
    const legendY = height - 50;
    
    const legendScale = d3.scaleLinear()
      .domain([d3.min(states, d => d.count), d3.max(states, d => d.count)])
      .range([0, legendWidth]);
    
    const legendAxis = d3.axisBottom(legendScale)
      .ticks(5)
      .tickFormat(d => d.toLocaleString());
    
    // Create gradient
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'legend-gradient')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '0%');
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#bfdbfe');
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#1e40af');
    
    // Add legend rectangle
    svg.append('rect')
      .attr('x', legendX)
      .attr('y', legendY)
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#legend-gradient)');
    
    // Add legend axis
    svg.append('g')
      .attr('transform', `translate(${legendX}, ${legendY + legendHeight})`)
      .call(legendAxis);
    
    // Add legend title
    svg.append('text')
      .attr('x', legendX)
      .attr('y', legendY - 10)
      .text('Merchant Count')
      .style('font-size', '12px');
  };

  const drawPieChart = () => {
    // Clear previous chart
    d3.select(pieChartRef.current).selectAll("*").remove();
    
    const width = 500;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 40;
    
    const svg = d3.select(pieChartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
    
    // Create color scale
    const color = d3.scaleOrdinal()
      .domain(states.map(d => d.state))
      .range(['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe']);
    
    // Compute the position of each group on the pie
    const pie = d3.pie()
      .value(d => d.count)
      .sort(null);
    
    const data_ready = pie(states);
    
    // Build the pie chart
    const arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);
    
    // Add the arcs
    svg.selectAll('slices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arcGenerator)
      .attr('fill', d => color(d.data.state))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.7)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .style('opacity', 1);
        
        // Show percentage
        const percent = (d.data.count / d3.sum(states, d => d.count) * 100).toFixed(1);
        
        // Create tooltip
        const tooltip = svg.append('g')
          .attr('class', 'tooltip');
        
        // Add background rectangle
        tooltip.append('rect')
          .attr('x', -70)
          .attr('y', -60)
          .attr('width', 140)
          .attr('height', 70)
          .attr('fill', 'white')
          .attr('stroke', '#d1d5db')
          .attr('rx', 4);
        
        // Add state name
        tooltip.append('text')
          .attr('x', 0)
          .attr('y', -40)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('font-weight', 'bold')
          .text(getStateName(d.data.state));
        
        // Add count
        tooltip.append('text')
          .attr('x', 0)
          .attr('y', -20)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .text(`Merchants: ${d.data.count.toLocaleString()}`);
        
        // Add percentage
        tooltip.append('text')
          .attr('x', 0)
          .attr('y', 0)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .text(`${percent}% of total`);
      })
      .on('mouseout', function() {
        d3.select(this)
          .style('opacity', 0.7);
        svg.selectAll('.tooltip').remove();
      });
    
    // Add labels
    const arcLabel = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.6);
    
    svg.selectAll('labels')
      .data(data_ready)
      .enter()
      .append('text')
      .text(d => d.data.state)
      .attr('transform', d => `translate(${arcLabel.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#1f2937');
    
    // Add title
    svg.append('text')
      .attr('x', 0)
      .attr('y', -height / 2 + 20)
      .attr('text-anchor', 'middle')
      .text('Merchant Distribution by State')
      .style('font-size', '18px')
      .style('font-weight', 'bold');
  };

  const drawCombinedChart = () => {
    // Clear previous chart
    d3.select(combinedChartRef.current).selectAll("*").remove();
    
    const margin = { top: 50, right: 120, bottom: 70, left: 80 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    const svg = d3.select(combinedChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // X scale
    const x = d3.scaleBand()
      .domain(states.map(d => d.state))
      .range([0, width])
      .padding(0.3);
    
    // Y scales for count and rating
    const yCount = d3.scaleLinear()
      .domain([0, d3.max(states, d => d.count) * 1.1])
      .range([height, 0]);
    
    const yRating = d3.scaleLinear()
      .domain([3, 5])
      .range([height, 0]);
    
    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "14px")
      .style("font-weight", "bold");
    
    // Add Y axis for count
    svg.append('g')
      .call(d3.axisLeft(yCount));
    
    // Add Y axis for rating
    svg.append('g')
      .attr('transform', `translate(${width}, 0)`)
      .call(d3.axisRight(yRating));
    
    // Add Y axis label for count
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 20)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .text('Number of Merchants')
      .style('font-size', '14px')
      .style('fill', '#2563eb');
    
    // Add Y axis label for rating
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', width + margin.right - 20)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .text('Average Rating')
      .style('font-size', '14px')
      .style('fill', '#dc2626');
    
    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .attr('text-anchor', 'middle')
      .text('Merchant Count vs. Average Rating by State')
      .style('font-size', '18px')
      .style('font-weight', 'bold');
    
    // Add bars for count
    svg.selectAll('.bar')
      .data(states)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.state))
      .attr('width', x.bandwidth())
      .attr('y', d => yCount(d.count))
      .attr('height', d => height - yCount(d.count))
      .attr('fill', '#3b82f6')
      .attr('opacity', 0.7)
      .attr('rx', 4) // Rounded corners
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 1);
        
        // Create tooltip
        const tooltip = svg.append('g')
          .attr('class', 'tooltip');
        
        // Add background rectangle
        tooltip.append('rect')
          .attr('x', x(d.state) + x.bandwidth() / 2 - 70)
          .attr('y', yCount(d.count) - 60)
          .attr('width', 140)
          .attr('height', 50)
          .attr('fill', 'white')
          .attr('stroke', '#d1d5db')
          .attr('rx', 4);
        
        // Add state name
        tooltip.append('text')
          .attr('x', x(d.state) + x.bandwidth() / 2)
          .attr('y', yCount(d.count) - 40)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('font-weight', 'bold')
          .text(getStateName(d.state));
        
        // Add count
        tooltip.append('text')
          .attr('x', x(d.state) + x.bandwidth() / 2)
          .attr('y', yCount(d.count) - 20)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .text(`Merchants: ${d.count.toLocaleString()}`);
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 0.7);
        svg.selectAll('.tooltip').remove();
      });
    
    // Add line for rating
    const line = d3.line()
      .x(d => x(d.state) + x.bandwidth() / 2)
      .y(d => yRating(d.averageRating))
      .curve(d3.curveMonotoneX);
    
    svg.append('path')
      .datum(states)
      .attr('fill', 'none')
      .attr('stroke', '#dc2626')
      .attr('stroke-width', 3)
      .attr('d', line);
    
    // Add dots for rating
    svg.selectAll('.dot')
      .data(states)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d.state) + x.bandwidth() / 2)
      .attr('cy', d => yRating(d.averageRating))
      .attr('r', 6)
      .attr('fill', '#dc2626')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('r', 8);
        
        // Create tooltip
        const tooltip = svg.append('g')
          .attr('class', 'tooltip');
        
        // Add background rectangle
        tooltip.append('rect')
          .attr('x', x(d.state) + x.bandwidth() / 2 - 70)
          .attr('y', yRating(d.averageRating) - 60)
          .attr('width', 140)
          .attr('height', 50)
          .attr('fill', 'white')
          .attr('stroke', '#d1d5db')
          .attr('rx', 4);
        
        // Add state name
        tooltip.append('text')
          .attr('x', x(d.state) + x.bandwidth() / 2)
          .attr('y', yRating(d.averageRating) - 40)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('font-weight', 'bold')
          .text(getStateName(d.state));
        
        // Add rating
        tooltip.append('text')
          .attr('x', x(d.state) + x.bandwidth() / 2)
          .attr('y', yRating(d.averageRating) - 20)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .text(`Rating: ${d.averageRating.toFixed(1)}`);
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 6);
        svg.selectAll('.tooltip').remove();
      });
    
    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 0)`);
    
    legend.append('rect')
      .attr('x', 0)
      .attr('y', 20)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', '#3b82f6')
      .attr('opacity', 0.7);
    
    legend.append('text')
      .attr('x', 20)
      .attr('y', 30)
      .text('Merchant Count')
      .style('font-size', '12px');
    
    legend.append('circle')
      .attr('cx', 7)
      .attr('cy', 50)
      .attr('r', 6)
      .attr('fill', '#dc2626');
    
    legend.append('text')
      .attr('x', 20)
      .attr('y', 55)
      .text('Average Rating')
      .style('font-size', '12px');
  };

  // Helper function to get full state name from abbreviation
  const getStateName = (abbr) => {
    const stateNames = {
      'AL': 'Alabama',
      'AK': 'Alaska',
      'AZ': 'Arizona',
      'AR': 'Arkansas',
      'CA': 'California',
      'CO': 'Colorado',
      'CT': 'Connecticut',
      'DE': 'Delaware',
      'DC': 'District of Columbia',
      'FL': 'Florida',
      'GA': 'Georgia',
      'HI': 'Hawaii',
      'ID': 'Idaho',
      'IL': 'Illinois',
      'IN': 'Indiana',
      'IA': 'Iowa',
      'KS': 'Kansas',
      'KY': 'Kentucky',
      'LA': 'Louisiana',
      'ME': 'Maine',
      'MD': 'Maryland',
      'MA': 'Massachusetts',
      'MI': 'Michigan',
      'MN': 'Minnesota',
      'MS': 'Mississippi',
      'MO': 'Missouri',
      'MT': 'Montana',
      'NE': 'Nebraska',
      'NV': 'Nevada',
      'NH': 'New Hampshire',
      'NJ': 'New Jersey',
      'NM': 'New Mexico',
      'NY': 'New York',
      'NC': 'North Carolina',
      'ND': 'North Dakota',
      'OH': 'Ohio',
      'OK': 'Oklahoma',
      'OR': 'Oregon',
      'PA': 'Pennsylvania',
      'RI': 'Rhode Island',
      'SC': 'South Carolina',
      'SD': 'South Dakota',
      'TN': 'Tennessee',
      'TX': 'Texas',
      'UT': 'Utah',
      'VT': 'Vermont',
      'VA': 'Virginia',
      'WA': 'Washington',
      'WV': 'West Virginia',
      'WI': 'Wisconsin',
      'WY': 'Wyoming',
      'PR': 'Puerto Rico'
    };
    return stateNames[abbr] || abbr;
  };

    // Helper function to get state code from FIPS id
    const getStateCodeFromId = (id) => {
        const stateCodes = {
          '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA',
          '08': 'CO', '09': 'CT', '10': 'DE', '11': 'DC', '12': 'FL',
          '13': 'GA', '15': 'HI', '16': 'ID', '17': 'IL', '18': 'IN',
          '19': 'IA', '20': 'KS', '21': 'KY', '22': 'LA', '23': 'ME',
          '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN', '28': 'MS',
          '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH',
          '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND',
          '39': 'OH', '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI',
          '45': 'SC', '46': 'SD', '47': 'TN', '48': 'TX', '49': 'UT',
          '50': 'VT', '51': 'VA', '53': 'WA', '54': 'WV', '55': 'WI',
          '56': 'WY', '72': 'PR'
        };
        return stateCodes[id] || null;
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
        <div className="p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Top Merchant Cities Analysis</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div ref={barChartRef}></div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div ref={pieChartRef}></div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
              <div ref={mapChartRef}>
                {!usaGeoData && (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center text-amber-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="mt-4">Map data could not be loaded. Other charts are still available.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
              <div ref={combinedChartRef}></div>
            </div>
          </div>
        </div>
      );
    };
    
    export default MerchantStates;
    