function saveLocation(lat, lon) {
  localStorage.setItem("lat", lat);
  localStorage.setItem("lon", lon);
}

function loadLocation() {
  const lat = localStorage.getItem("lat");
  const lon = localStorage.getItem("lon");
  if (lat && lon) {
    return { lat: parseFloat(lat), lon: parseFloat(lon) };
  }
  return null;
}
