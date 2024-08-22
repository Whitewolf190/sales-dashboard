import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import axios from 'axios';

const CustomerMap = () => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Initialize the map only if it hasn't been initialized
    if (!map) {
      const mapInstance = L.map('map').setView([51.505, -0.09], 2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(mapInstance);

      setMap(mapInstance);
    }
  }, [map]);

  useEffect(() => {
    if (map) {
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/charts/customer-geography`)
        .then(response => {
          const data = response.data.map(location => ({
            city: location._id,
            count: location.count,
            // Dummy coordinates for demonstration
            lat: Math.random() * 180 - 90, // Replace with real lat
            lon: Math.random() * 360 - 180 // Replace with real lon
          }));

          // Define color scale based on count
          const colorScale = d3.scaleLinear()
            .domain([0, Math.max(...data.map(d => d.count))])
            .range(['#ffeda0', '#f03b20']);

          data.forEach(location => {
            L.circle([location.lat, location.lon], {
              color: colorScale(location.count),
              fillColor: colorScale(location.count),
              fillOpacity: 0.5,
              radius: location.count * 1000 // Adjust radius based on count
            }).addTo(map)
              .bindPopup(`<b>${location.city}</b><br>Count: ${location.count}`);
          });
        })
        .catch(error => console.error('Error fetching map data:', error));
    }
  }, [map]);

  return (
    <div id="map" style={{ height: '600px' }}></div>
  );
};

export default CustomerMap;
