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

  hours.forEach(h => {
    const div = document.createElement("div");
    div.className = "hour";
    div.style.borderColor = h.planet.color;

    div.innerHTML = `
      <strong style="color:${h.planet.color}">
        ${h.planet.symbol} ${h.planet.name}
      </strong><br>
      ${h.start.toLocaleTimeString()} to ${h.end.toLocaleTimeString()}
    `;

    hoursContainer.appendChild(div);
  });
}

document.getElementById("saveLocation").onclick = () => {
  const lat = parseFloat(document.getElementById("latitude").value);
  const lon = parseFloat(document.getElementById("longitude").value);
  if (!isNaN(lat) && !isNaN(lon)) {
    saveLocation(lat, lon);
    render();
  }
};

render();
