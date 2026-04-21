// Pricing configuration and utilities
export const DEFAULT_PRICE_PER_KM = 1.50; // Default base price per km in dollars

export const PRICING_RANGE = {
  min: 0.50,
  max: 3.00,
};

// Calculate fare based on distance and driver's custom price
export const calculateFare = (distanceKm, driverPricePerKm = null) => {
  const pricePerKm = driverPricePerKm || DEFAULT_PRICE_PER_KM;
  const baseFare = 2.00; // Minimum base fare
  const distanceFare = distanceKm * pricePerKm;
  return Math.max(baseFare, distanceFare).toFixed(2);
};

// Validate price is within allowed range
export const isValidPrice = (price) => {
  return price >= PRICING_RANGE.min && price <= PRICING_RANGE.max;
};

// Format price for display
export const formatPrice = (price) => {
  return `$${parseFloat(price).toFixed(2)}`;
};
