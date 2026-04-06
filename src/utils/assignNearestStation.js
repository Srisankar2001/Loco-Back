import model from "../models/index.js";

const Station = model.Station;

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const assignNearestStation = async (restaurant) => {
  const stations = await Station.findAll({ raw: true });
  let nearestStation = null;
  let minDistance = Infinity;

  for (const station of stations) {
    const distance = haversineDistance(
      parseFloat(restaurant.locationLatitude),
      parseFloat(restaurant.locationLongitude),
      parseFloat(station.locationLatitude),
      parseFloat(station.locationLongitude),
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearestStation = station;
    }
  }

  if (nearestStation) {
    restaurant.stationId = nearestStation.id;
  }
  console.log("Assigned station:", nearestStation);
};
