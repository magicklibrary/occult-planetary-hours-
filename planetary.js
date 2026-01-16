const CHALDEAN_ORDER = [
  { name: "Saturn", symbol: "♄", color: "#4b0082", rulers: ["Capricorn", "Aquarius"] },
  { name: "Jupiter", symbol: "♃", color: "#1e90ff", rulers: ["Sagittarius", "Pisces"] },
  { name: "Mars", symbol: "♂", color: "#ff0000", rulers: ["Aries", "Scorpio"] },
  { name: "Sun", symbol: "☉", color: "#ffd700", rulers: ["Leo"] },
  { name: "Venus", symbol: "♀", color: "#00aa00", rulers: ["Taurus", "Libra"] },
  { name: "Mercury", symbol: "☿", color: "#ffff00", rulers: ["Gemini", "Virgo"] },
  { name: "Moon", symbol: "☾", color: "#dddddd", rulers: ["Cancer"] }
];

const DAY_RULERS = {
  0: "Sun",
  1: "Moon",
  2: "Mars",
  3: "Mercury",
  4: "Jupiter",
  5: "Venus",
  6: "Saturn"
};

function getPlanetByName(name) {
  return CHALDEAN_ORDER.find(p => p.name === name);
}

function generatePlanetaryHours(dayRuler, sunrise, sunset) {
  const hours = [];

  const dayLength = sunset.getTime() - sunrise.getTime();
  const nightLength = (sunrise.getTime() + 86400000) - sunset.getTime();

  const dayHourLength = dayLength / 12;
  const nightHourLength = nightLength / 12;

  let currentPlanetIndex = CHALDEAN_ORDER.findIndex(p => p.name === dayRuler);

  let currentTime = new Date(sunrise);

  for (let i = 0; i < 12; i++) {
    hours.push({
      start: new Date(currentTime),
      end: new Date(currentTime.getTime() + dayHourLength),
      planet: CHALDEAN_ORDER[currentPlanetIndex]
    });

    currentTime = new Date(currentTime.getTime() + dayHourLength);
    currentPlanetIndex = (currentPlanetIndex + 1) % 7;
  }

  for (let i = 0; i < 12; i++) {
    hours.push({
      start: new Date(currentTime),
      end: new Date(currentTime.getTime() + nightHourLength),
      planet: CHALDEAN_ORDER[currentPlanetIndex]
    });

    currentTime = new Date(currentTime.getTime() + nightHourLength);
    currentPlanetIndex = (currentPlanetIndex + 1) % 7;
  }

  return hours;
}
function getPlanetZodiac(planetName, date) {
  const longs = planetLongitudes(date);
  const lon = longs[planetName];
  return getZodiacFromLongitude(lon);
}
const PLANET_SEALS = {
  Sun: "☉",
  Moon: "☽",
  Mercury: "☿",
  Venus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturn: "♄"
};
