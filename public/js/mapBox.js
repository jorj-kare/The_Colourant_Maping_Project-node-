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
    const s = sessionStorage.getItem("mapStyle");
    const i = sessionStorage.getItem("mapStyleIndex");
    const styleMenu = document.getElementById("menu");
    let styleId = s ? s : "mapbox/satellite-v9";
    let styleIndex = i ? i : 0;

    mapboxgl.accessToken = token;
    this.map = new mapboxgl.Map({
      container: "map",
      style: `mapbox://styles/${styleId}`,
      center: [8.6992782, 48.4740928],
      zoom: 2,
      maxBounds: bounds,
      projection: "mercator",
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
    // Set style for the map
    styleMenu.querySelector("select").selectedIndex = styleIndex;
    styleMenu.querySelector("select").addEventListener("change", (e) => {
      styleId = styleMenu.querySelector("select").value;
      styleIndex = styleMenu.querySelector("select").selectedIndex;
      sessionStorage.setItem("mapStyle", styleId);
      sessionStorage.setItem("mapStyleIndex", styleIndex);
      location.reload();
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
      lngEl.value = e.lngLat.lng.toFixed(8);
      latEl.value = e.lngLat.lat.toFixed(8);
      this.createMarker([lngEl.value, latEl.value]);
      this.geocoder.query(`${latEl.value},${lngEl.value}`);
    }),
      this.geocoder.on("result", (e) => {
        // this.removeMarker();
        // this.createMarker([
        //   e.result.center[0].toFixed(8),
        //   e.result.center[1].toFixed(8),
        // ]);
        // lngEl.value = e.result.center[0];
        // latEl.value = e.result.center[1];
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
