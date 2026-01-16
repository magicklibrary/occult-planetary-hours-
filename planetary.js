// planetary.js

/**
 * Generate planetary hours for a given day
 * @param {string} dayRuler - Planet ruling the first hour of the day
 * @param {Date} sunrise - Sunrise time
 * @param {Date} sunset - Sunset time
 * @returns {Array} Array of 24 planetary hours [{ planet, start, end }]
 */
function generatePlanetaryHours(dayRuler, sunrise, sunset) {
  const hours = [];
  const dayLength = (sunset - sunrise) / 12; // Day divided into 12 hours
  const nextSunrise = new Date(sunrise.getTime() + 24 * 60 * 60 * 1000);
  const nightLength = (nextSunrise - sunset) / 12; // Night divided into 12 hours

  // Determine index of first hour planet in Chaldean order
  let startIndex = CHALDEAN_ORDER.indexOf(dayRuler);
  if (startIndex === -1) {
    console.warn(`Unknown day ruler "${dayRuler}", defaulting to ${CHALDEAN_ORDER[0]}`);
    startIndex = 0;
  }

  for (let i = 0; i < 24; i++) {
    const planetIndex = (startIndex + i) % 7;
    const planetName = CHALDEAN_ORDER[planetIndex];
    const planet = PLANET_DETAILS[planetName];

    let start, end;
    if (i < 12) {
      start = new Date(sunrise.getTime() + i * dayLength);
      end = new Date(sunrise.getTime() + (i + 1) * dayLength);
    } else {
      start = new Date(sunset.getTime() + (i - 12) * nightLength);
      end = new Date(sunset.getTime() + (i - 11) * nightLength);
    }

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
 * Get the current active planetary hour from an array
 * @param {Array} hours - Output of generatePlanetaryHours
 * @param {Date} now - Optional, defaults to current time
 * @returns {object|null} Current planetary hour or null
 */
function getCurrentPlanetaryHour(hours, now = new Date()) {
  return hours.find(h => now >= h.start && now < h.end) || null;
}
