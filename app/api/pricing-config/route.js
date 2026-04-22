export async function GET(request) {
  try {
    // In a real app, fetch from database
    // For now, return default admin settings
    return Response.json({
      defaultRatePerKm: 1.50,
      baseFare: 2.00,
      minPrice: 0.50,
      maxPrice: 3.00,
      surgeMultiplier: 1.0,
    })
  } catch (error) {
    console.error('Error fetching pricing config:', error)
    return Response.json({
      defaultRatePerKm: 1.50,
      baseFare: 2.00,
      minPrice: 0.50,
      maxPrice: 3.00,
      surgeMultiplier: 1.0,
    })
  }
}
