/* eslint-disable*/
import { MapBox } from "./mapBox.js";
import { createChronologyString } from "./colourantForm.js";
import { getFilteredColourant } from "./searchFilters.js";
import { displayDetails, closeDetailsWindow } from "./details.js";
// ELEMENTS
const mapContainer = document.querySelector(".map");
const form = document.querySelector(".form");
const sortBy = document.querySelector(".sort-by");
const resultCounter = document.querySelector("#counter");
const resultsList = document.querySelector(".list");
const mapBox = new MapBox();
let filteredColourants;
let geoData = { type: "FeatureCollection", features: [] };

// FUNCTIONS
const randomNumber = (max) => Math.random() * max;

const displayResults = (data) => {
  let markup = "";
  resultsList.innerHTML = "";
  if (data.length > 0) {
    data.forEach((el) => {
      const chr = createChronologyString(el);
      const str = `${new Date(el.createdAt).toLocaleDateString("en-Gb")}, ${
        el.colourants
      }, (${chr.start}, ${chr.end}), ${el.categoryOfFind}, ${
        el.location.address
      }, <strong>${
        el.location.certainProvenance === true ? "" : "Uncertain provenance"
      }</strong>`;
      markup += `<li data-id="${el._id}" data-colourants="${el.colourants}" class="list__item">${str}</li>`;
    });
  }
  resultsList.insertAdjacentHTML("afterbegin", markup);
  resultCounter.textContent = `${data.length} colourants found`;
};

const createGeoJson = (data) => {
  geoData.features = [];
  filteredColourants.data.forEach((el) => {
    // If two entries have the exact same coordinates change slightly the coordinates of one so both they will be visible on the map
    if (el.location.coordinates === null) return;
    let x = 0;
    geoData.features.forEach((f) => {
      if (
        JSON.stringify([
          f.geometry.coordinates[1],
          f.geometry.coordinates[0],
        ]) == JSON.stringify(el.location.coordinates)
      ) {
        x = randomNumber(0.0001);
      }
    });
    geoData.features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [
          el.location.coordinates[1] + x,
          el.location.coordinates[0] + x,
        ],
      },
      properties: {
        id: el._id,
        colourants: el.colourants,
        address: el.location.address,
      },
    });
  });
};

const displayColourants = async () => {
  filteredColourants = [];
  filteredColourants = await getFilteredColourant();
  displayResults(filteredColourants.data);
  createGeoJson(filteredColourants.data);
  if (mapBox.map.getSource("colourants"))
    mapBox.map.getSource("colourants").setData(geoData);
};

// EVENT LISTENERS

mapBox.displayMap();
mapBox.map.on("load", () => {
  mapBox.map.addSource("colourants", {
    type: "geojson",
    data: geoData,
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
  });
  mapBox.map.addLayer({
    id: "clusters",
    type: "circle",
    source: "colourants",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#65C18C",
        10,
        "#ffc107",
        20,
        "#f28cb1",
        40,
        "#A460ED",
      ],
      "circle-radius": ["step", ["get", "point_count"], 17, 10, 25, 40, 30],
    },
  });

  mapBox.map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "colourants",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
  });

  mapBox.map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "colourants",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#4fe5ff",
      "circle-radius": 7,
    },
  });
});

mapBox.map.on("click", "unclustered-point", (e) => {
  new mapboxgl.Popup()
    .setLngLat([e.lngLat.lng, e.lngLat.lat])
    .setHTML(
      `<li class="list__item list__item--small" data-id="${
        e.features[0].properties.id
      }" 
       >
       ${e.features[0].properties.colourants
         .replace("[", "")
         .replace("]", "")
         .replaceAll('"', "")} <br>
         ${e.features[0].properties.address.split(",")[0]}
      </li>`
    )
    .addTo(mapBox.map);
});
mapBox.map.on("click", "clusters", (e) => {
  const features = mapBox.map.queryRenderedFeatures(e.point, {
    layers: ["clusters"],
  });

  const clusterId = features[0].properties.cluster_id;
  mapBox.map
    .getSource("colourants")
    .getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) return;

      mapBox.map.flyTo({
        center: features[0].geometry.coordinates,
        zoom: zoom,
      });
    });
});
mapBox.map.on("mouseenter", ["clusters", "unclustered-point"], () => {
  mapBox.map.getCanvas().style.cursor = "pointer";
});
mapBox.map.on("mouseleave", "clusters", () => {
  mapBox.map.getCanvas().style.cursor = "";
});

window.addEventListener("load", displayColourants);

form.addEventListener("change", (e) => {
  e.preventDefault();
  displayColourants();
});

sortBy.addEventListener("change", async (e) => {
  filteredColourants = [];
  filteredColourants = await getFilteredColourant();
  displayResults(filteredColourants.data);
});

mapContainer.addEventListener("click", (e) => {
  displayDetails(e, filteredColourants.data);
  closeDetailsWindow(e);
});
