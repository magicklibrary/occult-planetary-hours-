// Main containers
const hoursContainer = document.getElementById("hours");
const dayDisplay = document.getElementById("currentDay");
const view = document.getElementById("view");

// Save location in localStorage
function saveLocation(lat, lon, cityName = "") {
  localStorage.setItem("location", JSON.stringify({ lat, lon, city: cityName }));
}

// Load location from localStorage
function loadLocation() {
  const loc = localStorage.getItem("location");
  return loc ? JSON.parse(loc) : null;
}

// Prompt user for city/state/country and geocode it
async function promptLocation() {
  let input = prompt("Enter your city, state, and country (e.g., New York, NY, USA):");
  if (!input) return;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}`
    );
    const data = await response.json();
    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      saveLocation(lat, lon, input); // store city too
      render(); // refresh planetary hours and all dependent data
    } else {
      alert("Could not find location. Please try again.");
    }
  } catch (err) {
    console.error(err);
    alert("Error retrieving location. Check your internet connection.");
  }
}

// Main render loop
function render() {
  hoursContainer.innerHTML = "";

  const location = loadLocation();
  if (!location) return;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayRuler = DAY_RULERS[today.getDay()];

  dayDisplay.textContent = `Day ruler: ${dayRuler} | Location: ${location.city || "Unknown"}`;

  // Compute sunrise/sunset and planetary hours
  const sunTimes = getSunTimes(today, location.lat, location.lon);
  const hours = generatePlanetaryHours(dayRuler, sunTimes.sunrise, sunTimes.sunset);

  // Load natal data if available
  const natalRaw = localStorage.getItem("birthData");
  let natal = null;
  if (natalRaw) {
    natal = JSON.parse(natalRaw);
  }

  hours.forEach(h => {
    const div = document.createElement("div");
    div.className = "hour";

    if (now >= h.start && now < h.end) div.classList.add("active");

    div.style.borderColor = h.planet.color;

    // Zodiac for the planet
    const zodiac = getPlanetZodiac(h.planet.name, now);

    // Natal resonance
    let natalMatch = false;
    if (natal) {
      const natalDate = new Date(natal.date + "T" + natal.time);
      const natalLongs = planetLongitudes(natalDate);
      const natalZodiac = getZodiacFromLongitude(natalLongs[h.planet.name]);
      natalMatch = natalZodiac.name === zodiac.name;
    }

    // Dignity and strength
    const dignity = getDignity(h.planet
