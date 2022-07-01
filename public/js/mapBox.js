/* eslint-disable*/
const token =
  "pk.eyJ1Ijoiam9yai1rYXJlIiwiYSI6ImNrcXNiOG10bDFvMGwydXN0cHh1ZHRzdGMifQ.bu0r3TdOtm7oMEYfK1JzhQ";
let map;
let markers = [];

const displayMap = () => {
  const bounds = [
    [-180, -90], // Southwest coordinates
    [180, 90], // Northeast coordinates
  ];
  mapboxgl.accessToken = token;
  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/jorj-kare/cl2z58ucx003214qg4jgwyuxv",
    center: [8.6992782, 48.4740928],
    zoom: 2,
    maxBounds:bounds
  });

 
};
displayMap();
const geocoder = new MapboxGeocoder({
  // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
  reverseGeocode: true,
});
map.addControl(geocoder);

const createMarker = (coordinates, popupMarkup = ``) => {
  return (marker = new mapboxgl.Marker()
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup().setText(popupMarkup))
    .addTo(map));
};

const removeMarkers = (markers) => {
  if (markers) markers.forEach((marker) => marker.remove());
};

const setLocation = (lngEl, latEl, locEl, coordsEl) => {
  map.on("click", (e) => {
    if (marker) marker.remove();
    lngEl.value = e.lngLat.lng.toFixed(7);
    latEl.value = e.lngLat.lat.toFixed(7);
    marker = createMarker(e.lngLat);
    geocoder.query(`${e.lngLat.lat},${e.lngLat.lng}`);
  });

  geocoder.on("result", (e) => {
    if (marker) marker.remove();
    marker = createMarker(e.result.center);
    lngEl.value = e.result.center[0].toFixed(7);
    latEl.value = e.result.center[1].toFixed(7);
    locEl.value = e.result.place_name;
  });

  coordsEl.addEventListener("change", (e) => {
    if (!e.target.id === "latitude" || !e.target.id === "longitude") return;
    if (lat.value === "" || lng.value === "") return;
    const latValue = lat.value * 1;
    const lngValue = lng.value * 1;
    if (marker) marker.remove();
    if (
      latValue >= -90 &&
      latValue <= 90 &&
      lngValue >= -180 &&
      lngValue <= 180
    ) {
      geocoder.query(`${latEl.value},${lngEl.value}`);
      marker = createMarker([lngEl.value, latEl.value]);
    } else {
      const err = new Error(
        "Invalid coordinates, the latitude must be a number between -90 and 90 and the longitude between -180 and 180."
      );
      alert(err.message);
    }
  });
};
