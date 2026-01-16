// planetary.js

/**
 * Generate planetary hours for a given day
 * @param {string} dayRuler - Name of the planet ruling the first hour of the day
 * @param {Date} sunrise - Sunrise time
 * @param {Date} sunset - Sunset time
 * @returns {Array} Array of 24 planetary hours [{ planet, start, end }]
 */
function generatePlanetaryHours(dayRuler, sunrise, sunset) {
  const hours = [];
  const dayLength = (sunset - sunrise) / 12; // Day divided into 12 daylight hours
  const nightLength = ((sunrise.getTime() + 24*60*60*1000) - sunset.getTime()) / 12; // Night divided into 12 night hours

  // Determine index of first hour planet in Chaldean order
  let startIndex = CHALDEAN_ORDER.indexOf(dayRuler);
  if (startIndex === -1) startIndex = 3; // default to Sun if unknown

  // Generate 24 planetary hours
  for (let i = 0; i < 24; i++) {
    let planetIndex = (startIndex + i) % 7;
    const planetName = CHALDEAN_ORDER[planetIndex];
    const planet = PLANET_DETAILS[planetName];

    let start, end;
    if (i < 12) { // Daytime hours
      start = new Date(sunrise.getTime() + i * dayLength);
      end = new Date(sunrise.getTime() + (i + 1) * dayLength);
    } else { // Nighttime hours
      start = new Date(sunset.getTime() + (i - 12) * nightLength);
      end = new Date(sunset.getTime() + (i - 11) * nightLength);
    }

    hours.push({ planet: { name: planetName, symbol: planet.symbol, color: planet.color }, start, end });
  }

  return hours;
}

/**
 * Get the zodiac sign for a planet at a specific time
 * @param {string} planetName
 * @param {Date} date
 * @returns {object} { name, symbol }
 */
function getPlanetZodiac(planetName, date) {
  const longs = planetLongitudes(date);
  const longitude = longs[planetName];
  return getZodiacFromLongitude(longitude);
}

/**
 * Optional: Get the current active planetary hour
 * @param {Array} hours - from generatePlanetaryHours
 * @param {Date} now - current time
 * @returns {object|null} active hour or null
 */
function getCurrentPlanetaryHour(hours, now = new Date()) {
  return hours.find(h => now >= h.start && now < h.end) || null;
}
