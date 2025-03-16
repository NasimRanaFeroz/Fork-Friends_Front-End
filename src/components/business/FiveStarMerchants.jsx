import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { IoArrowBack } from "react-icons/io5";

// Fix for default marker icons in Leaflet with webpack
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// FIXED: The onBack prop should be received as a parameter to the component, not to the handleGoBack function
const FiveStarMerchants = ({ onBack }) => {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mapKey, setMapKey] = useState(0);

  // FIXED: Corrected handleGoBack function
  const handleGoBack = () => {
    // Call the onBack prop to return to the parent component
    if (onBack) onBack();
  };

  // Map container style
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.5rem',
    zIndex: 0
  };

  // Default center (will be overridden when merchants load)
  const [center, setCenter] = useState([0, 0]);

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/business/top-rated-merchants');
        setMerchants(response.data);
        
        // Set the map center to the first merchant's location
        if (response.data.length > 0) {
          setCenter([response.data[0].latitude, response.data[0].longitude]);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch merchant data');
        setLoading(false);
        console.error('Error fetching merchants:', err);
      }
    };

    fetchMerchants();
  }, []);

  // Update map center when active merchant changes
  useEffect(() => {
    if (merchants.length > 0) {
      setCenter([merchants[activeIndex].latitude, merchants[activeIndex].longitude]);
      setMapKey(prevKey => prevKey + 1);
    }
  }, [activeIndex, merchants]);

  // Helper function to parse and format hours
  const formatHours = (hoursString) => {
    if (hoursString === "0:0-0:0") return "Closed";
    
    const [start, end] = hoursString.split('-');
    
    const formatTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    };
    
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  // Helper function to format attributes
  const formatAttributeName = (name) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Helper function to determine if an attribute is "true"
  const isAttributeTrue = (value) => {
    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase();
      return lowerValue === "true" || lowerValue === "'true'" || lowerValue === "u'yes'" || lowerValue === "'yes'";
    }
    return false;
  };

  // Get positive attributes for current merchant
  const getPositiveAttributes = (merchant) => {
    if (!merchant.attributes) return [];
    
    return Object.entries(merchant.attributes)
      .filter(([, value]) => isAttributeTrue(value))
      .map(([key]) => formatAttributeName(key))
      .slice(0, 6);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="p-6 relative">
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
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 mt-10">Top-Rated Merchants</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side - List of merchants */}
        <div className="lg:w-1/2">
          {merchants.map((merchant, index) => (
            <div 
              key={merchant.business_id}
              className={`mb-4 p-4 rounded-lg cursor-pointer transition-colors duration-200 ${
                activeIndex === index 
                  ? 'bg-blue-50 border-l-4 border-blue-500 shadow-md' 
                  : 'bg-white hover:bg-gray-50 border border-gray-200'
              }`}
              onClick={() => setActiveIndex(index)}
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-800">{merchant.name}</h2>
                <div className="flex items-center bg-yellow-100 rounded-full px-3 py-1">
                  <span className="text-yellow-800 font-bold">{merchant.stars}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-2 text-sm text-gray-600">({merchant.review_count} reviews)</span>
                </div>
              </div>
              
              <p className="text-gray-600 mt-2">{merchant.address}, {merchant.city}, {merchant.state} {merchant.postal_code}</p>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {merchant.categories.split(', ').map((category, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {category}
                  </span>
                ))}
              </div>
              
              {activeIndex === index && (
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {merchant.hours && Object.entries(merchant.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="font-medium">{day}:</span>
                      <span className="text-gray-600">{formatHours(hours)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Right side - Map and details */}
        <div className="lg:w-1/2">
          {/* Leaflet Map integration */}
          {merchants.length > 0 && (
            <div style={mapContainerStyle}>
              <MapContainer 
                key={mapKey}
                center={center} 
                zoom={15} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[merchants[activeIndex].latitude, merchants[activeIndex].longitude]}>
                  <Popup>
                    <div className="p-1">
                      <h3 className="font-bold">{merchants[activeIndex].name}</h3>
                      <p className="text-sm">{merchants[activeIndex].address}</p>
                      <p className="text-sm text-yellow-600">★ {merchants[activeIndex].stars}</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          )}
          
          {/* Detailed information about the selected merchant */}
          <div className="bg-white rounded-lg shadow-md p-5 mt-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">{merchants[activeIndex].name} Details</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Business Attributes:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {getPositiveAttributes(merchants[activeIndex]).map((attribute, index) => (
                    <div key={index} className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{attribute}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Price Range:</h4>
                <div className="flex">
                  {merchants[activeIndex].attributes?.RestaurantsPriceRange2 && 
                    [...Array(parseInt(merchants[activeIndex].attributes.RestaurantsPriceRange2.replace(/['"]/g, '')) || 1)].map((_, i) => (
                      <span key={i} className="text-green-600 mr-1 font-bold">$</span>
                    ))
                  }
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Categories:</h4>
                <p className="text-gray-700">{merchants[activeIndex].categories}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Address:</h4>
                <p className="text-gray-700">
                  {merchants[activeIndex].address}<br />
                  {merchants[activeIndex].city}, {merchants[activeIndex].state} {merchants[activeIndex].postal_code}
                </p>
              </div>
              
              <div>
                <button 
                  className="mt-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    // Open in OpenStreetMap
                    window.open(`https://www.openstreetmap.org/?mlat=${merchants[activeIndex].latitude}&mlon=${merchants[activeIndex].longitude}&zoom=15`, '_blank');
                  }}
                >
                  View on OpenStreetMap
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiveStarMerchants;
