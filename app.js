// ======== app.js ========

// ---- Main containers ----
const hoursContainer = document.getElementById("hours");
const dayDisplay = document.getElementById("currentDay");
const view = document.getElementById("view");

// ---- Chaldean day rulers ----
const DAY_RULERS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

// ---- Save/load location ----
function saveLocation(lat, lon, city = "") {
  localStorage.setItem("location", JSON.stringify({ lat, lon, city }));
}

function loadLocation() {
  const loc = localStorage.getItem("location");
  return loc ? JSON.parse(loc) : null;
}

// ---- Prompt user for location ----
async function promptLocation() {
  const input = prompt("Enter your city, state, and country (e.g., New York, NY, USA):");
  if (!input) return;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}`,
      {
        headers: {
          "User-Agent": "PlanetaryHoursApp/1.0 (contact@yourdomain.com)",
          "Accept": "application/json"
        }
      }
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    if (!data || data.length === 0) {
      alert("Location not found. Please try again.");
      return;
    }

    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);
    saveLocation(lat, lon, input);
    render();
  } catch (err) {
    console.error("Location fetch failed:", err);
    alert("Error retrieving location. Check your internet connection.");
  }
}

// ---- Render planetary hours ----
function render() {
  hoursContainer.innerHTML = "";

  const location = loadLocation();
  if (!location) {
    dayDisplay.textContent = "No location set. Click 'Update Location'.";
    return;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayRuler = DAY_RULERS[today.getDay()];

  dayDisplay.textContent = `Day ruler: ${dayRuler} | Location: ${location.city || "Unknown"}`;

  const sunTimes = getSunTimes(today, location.lat, location.lon);
  const hours = generatePlanetaryHours(dayRuler, sunTimes.sunrise, sunTimes.sunset);

  // Load natal data
  let natal = null;
  try {
    const natalRaw = localStorage.getItem("birthData");
    if (natalRaw) natal = JSON.parse(natalRaw);
  } catch (e) {
    console.warn("Invalid birthData:", e);
  }

  hours.forEach(h => {
    const div = document.createElement("div");
    div.className = "hour";

    if (now >= h.start && now < h.end) div.classList.add("active");

    div.style.borderColor = h.planet.color;

    const zodiac = getPlanetZodiac(h.planet.name, now);

    let natalMatch = false;
    if (natal && natal.date && natal.time) {
      const natalDate = new Date(`${natal.date}T${natal.time}`);
      const natalLongs = planetLongitudes(natalDate);
      const natalZodiac = getZodiacFromLongitude(natalLongs[h.planet.name]);
      natalMatch = natalZodiac.name === zodiac.name;
    }

    const dignity = getDignity(h.planet.name, zodiac.name);
    const strength = getHourStrength(h.planet.name, zodiac.name, natalMatch);

    div.innerHTML = `
      <strong style="color:${h.planet.color}">${h.planet.symbol} ${h.planet.name}</strong><br>
      ${h.start.toLocaleTimeString()} - ${h.end.toLocaleTimeString()}<br>
      <span class="zodiac">
        ${zodiac.symbol} ${zodiac.name}<br>
        Dignity: ${dignity}<br>
        Strength: ${strength}${natalMatch ? "<br>Resonant with natal chart" : ""}
      </span>
    `;

    hoursContainer.appendChild(div);
  });
}

// ---- Navigation buttons ----
function setupNavigation() {
  const navMap = {
    btnMain: "main.html",
    btnSettings: "settings.html",
    btnInstructions: "instructions.html",
    btnNatal: "natal.html",
    btnGuidance: "guidance.html",
    btnElectional: "electional.html",
    btnLegend: "legend.html"
  };

  Object.keys(navMap).forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", () => { view.src = navMap[id]; });
  });

  const updateBtn = document.getElementById("updateLocationBtn");
  if (updateBtn) updateBtn.addEventListener("click", promptLocation);
}

// ---- Initialize ----
setupNavigation();
render();

// Only prompt user if no location is saved
if (!loadLocation()) {
  // Prompt after short timeout to avoid popup block
  setTimeout(promptLocation, 500);
}

// Refresh every minute
setInterval(render, 60000);
