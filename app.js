// Main containers
const hoursContainer = document.getElementById("hours");
const dayDisplay = document.getElementById("currentDay");
const view = document.getElementById("view");

// Main render loop
function render() {
  hoursContainer.innerHTML = "";

  const location = loadLocation();
  if (!location) return;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayRuler = DAY_RULERS[today.getDay()];

  dayDisplay.textContent = "Day ruler: " + dayRuler;

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
    const dignity = getDignity(h.planet.name, zodiac.name);
    const strength = getHourStrength(h.planet.name, zodiac.name, natalMatch);

    // Render HTML
    div.innerHTML = `
      <strong style="color:${h.planet.color}">
        ${h.planet.symbol} ${h.planet.name}
      </strong><br>
      ${h.start.toLocaleTimeString()} to ${h.end.toLocaleTimeString()}
      <div class="zodiac">
        ${zodiac.symbol} ${zodiac.name}<br>
        Dignity: ${dignity}<br>
        Strength: ${strength}<br>
        ${natalMatch ? "<div>Resonant with natal chart</div>" : ""}
      </div>
    `;

    hoursContainer.appendChild(div);
  });
}

// Save user location
document.getElementById("saveLocation").onclick = () => {
  const lat = parseFloat(document.getElementById("latitude").value);
  const lon = parseFloat(document.getElementById("longitude").value);
  if (!isNaN(lat) && !isNaN(lon)) {
    saveLocation(lat, lon);
    render(); // refresh display immediately
  }
};

// Refresh planetary hours every minute
setInterval(render, 60000);
render(); // initial render

// Navigation functions
function openMain() { view.src = "main.html"; }
function openSettings() { view.src = "settings.html"; }
function openInstructions() { view.src = "instructions.html"; }
function openNatal() { view.src = "natal.html"; }
function openGuidance() { view.src = "guidance.html"; }
function openElectional() { view.src = "electional.html"; }
function openLegend() { view.src = "legend.html"; }
