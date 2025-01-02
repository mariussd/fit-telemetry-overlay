export function calculateDistanceInKilometers(
  lon1: number,
  lat1: number,
  lon2: number,
  lat2: number
) {
  const R = 6371; // Radius of the Earth in kilometers

  // Convert degrees to radians
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
}

export function getMiddleOfCoordinates(coordinates: number[][]): [number, number] {
  const [start, end] = coordinates;

  return [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
}