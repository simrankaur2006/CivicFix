import Complaint from "../models/Complaint.js";
import { DUPLICATE_RADIUS_METERS } from "../config/categories.js";

// Haversine distance in meters
const distanceMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const textSimilarity = (a = "", b = "") => {
  const setA = new Set(a.toLowerCase().split(/\W+/).filter(Boolean));
  const setB = new Set(b.toLowerCase().split(/\W+/).filter(Boolean));
  if (!setA.size || !setB.size) return 0;
  let intersection = 0;
  setA.forEach((w) => {
    if (setB.has(w)) intersection++;
  });
  return intersection / Math.max(setA.size, setB.size);
};

export const findPossibleDuplicate = async ({
  category,
  latitude,
  longitude,
  description,
}) => {
  if (latitude == null || longitude == null) return null;

  const candidates = await Complaint.find({
    category,
    status: { $nin: ["Resolved", "Rejected"] },
  }).limit(50);

  let best = null;
  let bestDistance = Infinity;

  for (const c of candidates) {
    if (c.location?.latitude == null || c.location?.longitude == null) continue;
    const dist = distanceMeters(
      latitude,
      longitude,
      c.location.latitude,
      c.location.longitude
    );
    if (dist <= DUPLICATE_RADIUS_METERS) {
      const sim = textSimilarity(description, c.description);
      if (dist < bestDistance || sim > 0.3) {
        best = { complaint: c, distance: Math.round(dist), similarity: sim };
        bestDistance = dist;
      }
    }
  }

  return best;
};
