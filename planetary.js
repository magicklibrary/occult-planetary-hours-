// planetary.js

/**
 * Generate 24 planetary hours for a given day.
 * @param {string} dayRuler - Planet ruling the first hour of the day
 * @param {Date} sunrise - Sunrise time
 * @param {Date} sunset - Sunset time
 * @returns {Array} Array of 24 planetary hours [{ planet, start, end }]
 */
function generatePlanetaryHours(dayRuler, sunrise, sunset) {
  const hours = [];

  // Day and night hour durations
  const dayLength = (sunset - sunrise) / 12;
  const nextSunrise = new Date(sunrise.getTime() + 24 * 60 * 60 * 1000);
  const nightLength = (nextSunrise - sunset) / 12;

  // Start index in Chaldean order
  let startIndex = CHALDEAN_ORDER.indexOf(dayRuler);
  if (startIndex === -1) {
    console.warn(`Unknown day ruler "${dayRuler}", defaulting to Sun`);
    startIndex = CHALDEAN_ORDER.indexOf("Sun") || 0;
  }

  for (let i = 0; i < 24; i++) {
    const planetIndex = (startIndex + i) % 7;
    const planetName = CHALDEAN_ORDER[planetIndex];
    const planet = PLANET_DETAILS[planetName] || {};

    // Calculate hour start and end
    const start = new Date(
      i < 12
        ? sunrise.getTime() + i * dayLength
        : sunset.getTime() + (i - 12) * nightLength
    );
    const end = new Date(
      i < 12
        ? sunrise.getTime() + (i + 1) * dayLength
        : sunset.getTime() + (i - 11) * nightLength
    );

    hours.push({
      planet: {
        name: planetName,
        symbol: planet.symbol || "",
        color: planet.color || "#fff"
      },
      start,
      end
    });
  }

  return hours;
}

/**
 * Get zodiac sign for a planet at a specific date/time
 * @param {string} planetName
 * @param {Date} date
 * @returns {object} { name, symbol }
 */
function getPlanetZodiac(planetName, date) {
  const longitudes = planetLongitudes(date);
  const longitude = longitudes[planetName];
  return getZodiacFromLongitude(longitude);
}

/**
 * Get the currently active planetary hour from an array
 * @param {Array} hours - Output of generatePlanetaryHours
 * @param {Date} now - Optional, defaults to current time
 * @returns {object|null} Active planetary hour
 */
function getCurrentPlanetaryHour(hours, now = new Date()) {
  return hours.find(h => now >= h.start && now < h.end) || null;
}
