/* eslint-disable*/
import { MapBox } from "./mapBox.js";
import {
  createChronologyString,
  hideCenturies,
  setRemoveAttributes,
} from "./colourantForm.js";

// ELEMENTS
const mapContainer = document.querySelector(".map");
const form = document.querySelector(".form");
const pigment = document.getElementById("pigment");
const analyticalTechniques = document.getElementById("techniques");
const categoryOfFind = document.getElementById("category-of-find");
const centuryStart = document.getElementById("century-start");
const centuryEnd = document.getElementById("century-end");
const checked = document.getElementById("checked")
  ? document.getElementById("checked")
  : "";
const sortBy = document.querySelector(".sort-by");
const sortCategory = document.querySelector("#sort-category");
const sortOrder = document.querySelector("#sort-order");
const resultCounter = document.querySelector("#counter");
const resultsList = document.querySelector(".list");
const mapBox = new MapBox();
let filteredColourants;
let geoData = { type: "FeatureCollection", features: [] };

// FUNCTIONS
const randomNumber = (max) => Math.random() * max;

const closeDetailsWindow = (e) => {
  if (e.target.id === "btnClose" || e.target.className === "details") {
    const el = document.querySelector(".details");
    if (el) {
      el.classList.add("u-fade-out");
      window.setTimeout(() => {
        el.parentElement.removeChild(el);
      }, 1000);
    }
  }
};

const displayResults = (data) => {
  let markup = "";
  resultsList.innerHTML = "";
  if (data.length > 0) {
    data.forEach((el) => {
      const chr = createChronologyString(el);
      const str = `${new Date(el.createdAt).toLocaleDateString(
        "en-Gb"
      )}, ${el.pigment}, (${chr.start}, ${chr.end}), ${el.categoryOfFind}, (${el.location.address})`;
      markup += `<li data-id="${el._id}" data-pigment="${el.pigment}" class="list__item">${str}</li>`;
    });
  }
  resultsList.insertAdjacentHTML("afterbegin", markup);
  resultCounter.textContent = `${data.length} colourants found`;
};

const createGeoJson = (data) => {
  geoData.features = [];
  filteredColourants.colourants.forEach((el) => {
    // If two entries have the exact same coordinates change slightly the coordinates of one so both they will be visible on the map
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
        pigment: el.pigment,
      },
    });
  });
};

const getColourant = async (filter) => {
  const str = filter.toString();
  const url = ` http://127.0.0.1:3000/api/v1/colourants/?${str}`;
  const res = await fetch(url);
  const data = await res.json();

  return data;
};

const getAndDisplayColourants = async () => {
  const filter = new URLSearchParams({
    pigment: pigment.value,
    analyticalTechniques: analyticalTechniques.value,
    categoryOfFind: categoryOfFind.value,
    centuryStart: centuryStart.value,
    centuryEnd: centuryEnd.value,
    checked: checked.value,
    sortCategory: sortCategory.value,
    sortOrder: sortOrder.value,
  });
  filteredColourants = [];
  filteredColourants = await getColourant(filter);
  displayResults(filteredColourants.colourants);
  createGeoJson(filteredColourants.colourants);
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
        "#D82148",
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
      "circle-radius": 6,
    },
  });
});

mapBox.map.on("click", "unclustered-point", (e) => {
  new mapboxgl.Popup()
    .setLngLat([e.lngLat.lng, e.lngLat.lat])
    .setHTML(
      `<li class="list__item list__item--small" data-id="${
        e.features[0].properties.id
      }" data-pigment="${
        e.features[0].properties.pigment
      }" >${e.features[0].properties.pigment
        .replace("[", "")
        .replace("]", "")
        .replaceAll('"', "")}</li>`
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

window.addEventListener("load", getAndDisplayColourants);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  getAndDisplayColourants();
});
form.addEventListener("change", (e) => {
  e.preventDefault();
  hideCenturies(e);
  setRemoveAttributes(e);
  const otherInput = e.target.parentElement.querySelector(".input-other");
  const selectEl = e.target.parentElement.querySelector("select");

  if (selectEl.selectedOptions[0].id !== "other" && otherInput) {
    otherInput.setAttribute("hidden", "true");
    selectEl.style.width = "100%";
  }
  if (selectEl.selectedOptions[0].id === "other") {
    selectEl.style.width = "35%";
    otherInput.removeAttribute("hidden");
    if (otherInput.value) selectEl.lastChild.value = otherInput.value;
  }
});

sortBy.addEventListener("change", async (e) => {
  const filter = new URLSearchParams({
    pigment: pigment.value,
    analyticalTechniques: analyticalTechniques.value,
    categoryOfFind: categoryOfFind.value,
    centuryStart: centuryStart.value,
    centuryEnd: centuryEnd.value,
    checked: checked.value,
    sortCategory: sortCategory.value,
    sortOrder: sortOrder.value,
  });
  filteredColourants = [];
  filteredColourants = await getColourant(filter);
  displayResults(filteredColourants.colourants);
});

mapContainer.addEventListener("click", (e) => {
  if (e.target.className.includes("list__item")) {
    const colourant = filteredColourants.colourants.filter(
      (el) => el._id === e.target.dataset.id
    );

    const chr = createChronologyString(colourant[0]);
    const markup = `<div class="details">
  <ul class="details__list">
  <button id="btnClose" class="btn btn--small btn--close">⇽</button>
  <li class="details__item"><span  class="details__icon">&#9677;</span><span class="details__header">  Pigment: </span>${colourant[0].pigment}</li>
  <li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Chronology: </span>${chr.start}, ${chr.end}</li>
  <li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Category of find: </span>${colourant[0].categoryOfFind}</li>
  <li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Archeological context: </span>${colourant[0].archeologicalContext}</li>
  <li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Notes: </span>${colourant[0].notes}</li>
  <li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Analytical techniques: </span>${colourant[0].analyticalTechniques}</li>
  <li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> References: </span>${colourant[0].references}</li>
  <li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Address: </span>${colourant[0].location.address}</li>
  <li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Coordinates: </span>${colourant[0].location.coordinates}</li>
  <li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Contributor: </span>${colourant[0].contributor.firstName} ${colourant[0].contributor.lastName}</li>
  <li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Affiliation: </span>${colourant[0].contributor.affiliation}</li>
  </ul>
  </div>`;
    mapContainer.insertAdjacentHTML("afterbegin", markup);
    const details = document.querySelector(".details");
    details.classList.add("u-fade-in");
   
  }
  closeDetailsWindow(e);
});
