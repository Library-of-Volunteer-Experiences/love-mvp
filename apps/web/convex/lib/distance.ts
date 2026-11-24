type Coordinates = { lat: number; lng: number };

const EARTH_RADIUS_MILES = 3958.8;

export function milesBetween(a: Coordinates, b: Coordinates): number {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const deltaLat = lat2 - lat1;
  const deltaLng = toRadians(b.lng - a.lng);
  const haversine =
    Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;

  // Example: (0°, 0°) to (0°, 1°) is 3958.8 × π/180 ≈ 69.1 miles.
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(Math.min(1, haversine)));
}
