// storage.js - Safe handling for location and natal/birth data

/**
 * Save location with optional city name
 * @param {number} lat - Latitude in decimal degrees
 * @param {number} lon - Longitude in decimal degrees
 * @param {string} cityName - Optional city name
 */
function saveLocation(lat, lon, cityName = "") {
  if (typeof lat !== "number" || typeof lon !== "number") {
    console.warn("Invalid lat/lon values for saveLocation");
    return;
  }
  const data = { lat, lon, city: cityName };
  try {
    localStorage.setItem("location", JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save location to localStorage:", err);
  }
}

/**
 * Load location from localStorage
 * @returns {{lat: number, lon: number, city: string}|null}
 */
function loadLocation() {
  const raw = localStorage.getItem("location");
  if (!raw) return null;

  try {
    const data = JSON.parse(raw);
    if (
      typeof data === "object" &&
      data !== null &&
      !isNaN(parseFloat(data.lat)) &&
      !isNaN(parseFloat(data.lon))
    ) {
      return {
        lat: parseFloat(data.lat),
        lon: parseFloat(data.lon),
        city: typeof data.city === "string" ? data.city : ""
      };
    }
  } catch (err) {
    console.error("Error parsing location from localStorage:", err);
  }

  return null;
}

/**
 * Save natal/birth data
 * @param {string} date - Format: YYYY-MM-DD
 * @param {string} time - Format: HH:MM (24-hour)
 */
function saveNatal(date, time) {
  if (typeof date !== "string" || typeof time !== "string") {
    console.warn("Invalid date/time for saveNatal");
    return;
  }
  try {
    localStorage.setItem("birthData", JSON.stringify({ date, time }));
  } catch (err) {
    console.error("Failed to save natal data:", err);
  }
}

/**
 * Load natal/birth data
 * @returns {{date: string, time: string}|null}
 */
function loadNatal() {
  const raw = localStorage.getItem("birthData");
  if (!raw) return null;

  try {
    const data = JSON.parse(raw);
    if (
      typeof data === "object" &&
      data !== null &&
      typeof data.date === "string" &&
      typeof data.time === "string"
    ) {
      return { date: data.date, time: data.time };
    }
  } catch (err) {
    console.error("Error parsing natal data:", err);
  }

  return null;
}

/**
 * Clear stored location and natal data (optional utility)
 */
function clearStorage() {
  localStorage.removeItem("location");
  localStorage.removeItem("birthData");
}
