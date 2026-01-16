// ======== app.js ========

// ---- Main containers ----
const hoursContainer = document.getElementById("hours");
const dayDisplay = document.getElementById("currentDay");
const view = document.getElementById("view");

// ---- Chaldean day rulers (Sunday=0) ----
const DAY_RULERS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

// ---- Save/load location ----
function saveLocation(lat, lon, city = "") {
  localStorage.setItem("location", JSON.stringify({ lat, lon, city }));
}

function loadLocation() {
  const loc = localStorage.getItem("location");
  if (!loc) return null;
  try {
    const data = JSON.parse(loc);
    if (data.lat != null && data.lon != null) return { lat: parseFloat(data.lat), lon: parseFloat(data.lon), city: data.city || "" };
  } catch (err) {
    console.error("Error parsing location:", err);
  }
  return null;
}

// ---- Prompt user for location (with safe USA assumption) ----
async function promptLocation() {
  let input = prompt("Enter your city and state (and optionally country), e.g., 'New York, NY' or 'London, UK':");
  if (!input) return;

  // If user only types city/state, assume USA
  if (!input.match(/,.*$/)) input += ", USA";

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

    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();
    if (!data || data.length === 0) {
      alert("Location not found. Try a more specific city/state.");
      return;
    }

    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);
    const cityName = data[0].display_name || input;
    saveLocation(lat, lon, cityName);

    render();
  } catch (err) {
    console.error("Location fetch error:", err);
    alert("Error retrieving location. Check your internet connection or try again later.");
  }
}

// ---- Render planetary hours ----
function render() {
  if (!hoursContainer) return;
  hoursContainer.innerHTML = "";

  const location = loadLocation();
  if (!location) {
    if (dayDisplay) dayDisplay.textContent = "No location set. Click 'Update Location'.";
    return;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayRuler = DAY_RULERS[today.getDay()];

  if (dayDisplay) dayDisplay.textContent = `Day ruler: ${dayRuler} | Location: ${location.city || "Unknown"}`;

  let sunTimes;
  try {
    sunTimes = getSunTimes(today, location.lat, location.lon);
  } catch (e) {
    console.error("Error calculating sunrise/sunset:", e);
    alert("Could not calculate sunrise/sunset for this location.");
    return;
  }

  const hours = generatePlanetaryHours(dayRuler, sunTimes.sunrise, sunTimes.sunset);

  // Load natal data safely
  let natal = null;
  try {
    const natalRaw = localStorage.getItem("birthData");
    if (natalRaw) natal = JSON.parse(natalRaw);
  } catch (e) {
    console.warn("Invalid natal data:", e);
  }

  hours.forEach(h => {
    const div = document.createElement("div");
    div.className = "hour";

    if (now >= h.start && now < h.end) div.classList.add("active");

    div.style.borderColor = h.planet.color;

    // Zodiac
    let zodiac = { name: "Unknown", symbol: "" };
    try {
      zodiac = getPlanetZodiac(h.planet.name, now);
    } catch (e) {
      console.warn(`Could not get zodiac for ${h.planet.name}:`, e);
    }

    // Natal resonance
    let natalMatch = false;
    if (natal && natal.date && natal.time) {
      try {
        const natalDate = new Date(`${natal.date}T${natal.time}`);
        const natalLongs = planetLongitudes(natalDate);
        const natalZodiac = getZodiacFromLongitude(natalLongs[h.planet.name]);
        natalMatch = natalZodiac.name === zodiac.name;
      } catch (e) {
        console.warn("Error computing natal resonance:", e);
      }
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

// ---- Navigation ----
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

if (!loadLocation()) {
  // Slight delay to avoid popup block
  setTimeout(promptLocation, 500);
}

// Refresh planetary hours every minute
setInterval(render, 60000);
