export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance.toFixed(1);
};

export const formatPhone = (phone, countryPhone = '+263') => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  const countryCode = countryPhone.replace('+', '');
  
  // If already has full country code, just add +
  if (cleaned.startsWith(countryCode)) {
    return '+' + cleaned;
  } else {
    // Add country code
    return countryPhone + cleaned;
  }
};

export const validatePhone = (phone) => {
  // Basic validation for phone format
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10;
};

export const getInitials = (phone) => {
  return 'DR';
};
