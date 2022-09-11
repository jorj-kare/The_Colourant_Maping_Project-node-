/* eslint-disable*/
import { showAlert } from "./alert.js";
class MapBox {
  marker;
  map;
  geocoder;
  constructor(marker, map, geocoder) {
    this.marker = marker;
    this.map = map;
    this.geocoder = geocoder;
  }
  displayMap() {
    const token =
      "pk.eyJ1Ijoiam9yai1rYXJlIiwiYSI6ImNrcXNiOG10bDFvMGwydXN0cHh1ZHRzdGMifQ.bu0r3TdOtm7oMEYfK1JzhQ";
    const bounds = [
      [-180, -90], // Southwest coordinates
      [180, 90], // Northeast coordinates
    ];
    mapboxgl.accessToken = token;
    this.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/jorj-kare/cl2z58ucx003214qg4jgwyuxv",
      center: [8.6992782, 48.4740928],
      zoom: 2,
      maxBounds: bounds,
      // projection: 'globe'
    });
    // displayMap();
    this.geocoder = new MapboxGeocoder({
      // Initialize the geocoder
      accessToken: mapboxgl.accessToken, // Set the access token
      mapboxgl: mapboxgl, // Set the mapbox-gl instance
      marker: false, // Do not use the default marker style
      reverseGeocode: true,
    });
    this.map.addControl(this.geocoder);
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(new mapboxgl.ScaleControl());
    // Set layers for mapbox
    const layerList = document.getElementById("menu");
    const inputs = layerList.querySelectorAll("option");

    inputs.forEach((input) => {
      input.onclick = (layer) => {
        const layerId = layer.target.id;
        this.map.setStyle("mapbox://styles/" + layerId);
      };
    });

    return this.map;
  }

  createMarker(coordinates, popupMarkup = ``) {
    this.marker = new mapboxgl.Marker()
      .setLngLat(coordinates)
      .setPopup(new mapboxgl.Popup().setText(popupMarkup))
      .addTo(this.map);
  }

  removeMarker() {
    if (this.marker) this.marker.remove();
  }

  setLocation(lngEl, latEl, locEl, coordsEl) {
    this.map.on("click", (e) => {
      this.removeMarker();
      lngEl.value = e.lngLat.lng;
      latEl.value = e.lngLat.lat;
      this.createMarker(e.lngLat);
      this.geocoder.query(`${e.lngLat.lat},${e.lngLat.lng}`);
    }),
      this.geocoder.on("result", (e) => {
        this.removeMarker();
        this.createMarker(e.result.center);
        lngEl.value = e.result.center[0];
        latEl.value = e.result.center[1];
        locEl.value = e.result.place_name;
      });

    coordsEl.addEventListener("change", (e) => {
      if (!e.target.id === "latitude" || !e.target.id === "longitude") return;
      if (latEl.value === "" || lngEl.value === "") return;

      const latValue = latEl.value * 1;
      const lngValue = lngEl.value * 1;
      this.removeMarker();
      if (
        latValue >= -90 &&
        latValue <= 90 &&
        lngValue >= -180 &&
        lngValue <= 180
      ) {
        this.geocoder.query(`${latValue},${lngValue}`);
        this.createMarker([lngValue, latValue]);
      } else {
        const err = new Error(
          "Invalid coordinates, the latitude must be a number between -90 and 90 and the longitude between -180 and 180."
        );
        showAlert(err.message, "error", 5);
      }
    });
  }
}
export { MapBox };
