import axios from 'axios';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export const getDistance = async (origin, destination) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    if (response.data.rows[0].elements[0].status === 'OK') {
      const distance = response.data.rows[0].elements[0].distance.text;
      const duration = response.data.rows[0].elements[0].duration.text;
      return { distance, duration };
    }
    return null;
  } catch (error) {
    console.error('Error getting distance:', error);
    return null;
  }
};

export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    if (response.data.results.length > 0) {
      return response.data.results[0].formatted_address;
    }
    return 'Unknown Location';
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return 'Unknown Location';
  }
};

export const geocodeAddress = async (address) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    if (response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    }
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};
