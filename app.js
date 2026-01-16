const hoursContainer = document.getElementById("hours");
const dayDisplay = document.getElementById("currentDay");

function render() {
  hoursContainer.innerHTML = "";

  const location = loadLocation();
  if (!location) return;

  const today = new Date();
  const dayRuler = DAY_RULERS[today.getDay()];
  dayDisplay.textContent = "Day ruler: " + dayRuler;

  const sunTimes = getSunTimes(today, location.lat, location.lon);
  const hours = generatePlanetaryHours(dayRuler, sunTimes.sunrise, sunTimes.sunset);

const zodiac = getPlanetZodiac(h.planet.name, now);

let natalMatch = false;
const natalRaw = localStorage.getItem("birthData");

if (natalRaw) {
  const natal = JSON.parse(natalRaw);
  const natalDate = new Date(natal.date + "T" + natal.time);
  const natalLongs = planetLongitudes(natalDate);
  const natalZodiac = getZodiacFromLongitude(natalLongs[h.planet.name]);

  natalMatch = natalZodiac.name === zodiac.name;
}
div.innerHTML = `
  <strong style="color:${h.planet.color}">
    ${h.planet.symbol} ${h.planet.name}
  </strong><br>
  ${h.start.toLocaleTimeString()} to ${h.end.toLocaleTimeString()}
  <div class="zodiac">
    ${zodiac.symbol} ${zodiac.name}
    ${natalMatch ? "<div>Resonant with natal chart</div>" : ""}
  </div>
`;
const dignity = getDignity(h.planet.name, zodiac.name);
const strength = getHourStrength(h.planet.name, zodiac.name, natalMatch);

div.innerHTML = `
  <strong style="color:${h.planet.color}">
    ${h.planet.symbol} ${h.planet.name}
  </strong><br>
  ${h.start.toLocaleTimeString()} to ${h.end.toLocaleTimeString()}
  <div class="zodiac">
    ${zodiac.symbol} ${zodiac.name}
    <div>Dignity: ${dignity}</div>
    <div>Strength: ${strength}</div>
    ${natalMatch ? "<div>Resonant with natal chart</div>" : ""}
  </div>
`;
document.getElementById("saveLocation").onclick = () => {
  const lat = parseFloat(document.getElementById("latitude").value);
  const lon = parseFloat(document.getElementById("longitude").value);
  if (!isNaN(lat) && !isNaN(lon)) {
    saveLocation(lat, lon);
   function render() {
  hoursContainer.innerHTML = "";

  const location = loadLocation();
  if (!location) return;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const dayRuler = DAY_RULERS[today.getDay()];
  dayDisplay.textContent = "Day ruler: " + dayRuler;

  const sunTimes = getSunTimes(today, location.lat, location.lon);
  const hours = generatePlanetaryHours(dayRuler, sunTimes.sunrise, sunTimes.sunset);

  const sunLongitude = getSunLongitude(now);
  const sunZodiac = getZodiacFromLongitude(sunLongitude);

  hours.forEach(h => {
    const div = document.createElement("div");
    div.className = "hour";

    if (now >= h.start && now < h.end) {
      div.classList.add("active");
    }

    div.style.borderColor = h.planet.color;

    div.innerHTML = `
      <strong style="color:${h.planet.color}">
        ${h.planet.symbol} ${h.planet.name}
      </strong><br>
      ${h.start.toLocaleTimeString()} to ${h.end.toLocaleTimeString()}
      ${div.classList.contains("active") ? `
        <div class="zodiac">
          ${sunZodiac.symbol} ${sunZodiac.name}
        </div>
      ` : ""}
    `;

    hoursContainer.appendChild(div);
  });
}
setInterval(render, 60000);
const view = document.getElementById("view");

function openMain() {
  view.src = "main.html";
}

function openSettings() {
  view.src = "settings.html";
}

function openInstructions() {
  view.src = "instructions.html";
}
function openNatal() {
  view.src = "natal.html";
}
function openGuidance() {
  view.src = "guidance.html";
}

