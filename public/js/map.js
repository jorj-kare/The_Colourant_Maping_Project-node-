/* eslint-disable*/
// ELEMENTS
const resultsList = document.querySelector(".list");
const mapContainer = document.querySelector(".map");
const form = document.querySelector(".form");
let filteredColourants;
let geoData = { type: "FeatureCollection", features: [] };

const randomNumber = (max) => Math.random() * max;

const createChronologyString = (data) => {
  const start = data.chronology.start.toString().includes("-")
    ? `${data.chronology.start.toString().replace("-", "")} BCE`
    : `${data.chronology.start} CE`;
  const end = data.chronology.end.toString().includes("-")
    ? `${data.chronology.end.toString().replace("-", "")} BCE`
    : `${data.chronology.end} CE`;
  return { start, end };
};

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

const displayResults = function (el) {
  const chr = createChronologyString(el);
  const str = `${el.pigment}, (${chr.start}, ${chr.end}), ${el.categoryOfFind}, (${el.location.address})`;
  const markup = `<li data-id="${el._id}" data-pigment="${el.pigment}" class="list__item">${str}</li>`;
  resultsList.insertAdjacentHTML("afterbegin", markup);
};

const getColourant = async (filter) => {
  const str = filter.toString();

  const url = ` http://127.0.0.1:3000/api/v1/colourants/?${str}`;
  const res = await fetch(url);
  filteredColourants = await res.json();
  if (filteredColourants.colourants.length === 0) {
    const markup = `<li class="list__empty">No colourant found for those filters: ${str}</li>`;
    resultsList.insertAdjacentHTML("afterbegin", markup);
  }
  filteredColourants.colourants.forEach((el) => {
    displayResults(el);

    geoData.features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [
          el.location.coordinates[1] + randomNumber(0.0001),
          el.location.coordinates[0] + randomNumber(0.0001),
        ],
      },
      properties: {
        id: el._id,
        pigment: el.pigment,
      },
    });
  });
};

map.on("load", () => {
  map.addSource("colourants", {
    type: "geojson",
    data: geoData,
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
  });
  // map.loadImage("../img/pin.png", (error, image) => {
  //   if (error) throw error;

  //   // Add the image to the map style.
  //   map.addImage("pin", image);
  // });
  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "colourants",
    filter: ["has", "point_count"],
    paint: {
      // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
      // with three steps to implement three types of circles:
      //   * Blue, 20px circles when point count is less than 100
      //   * Yellow, 30px circles when point count is between 100 and 750
      //   * Pink, 40px circles when point count is greater than or equal to 750
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#51bbd6",
        100,
        "#f1f075",
        750,
        "#f28cb1",
      ],
      "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
    },
  });

  map.addLayer({
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

  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "colourants",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#fff",
      "circle-radius": 4,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#11b4da",
    },
    // layout: {
    //   "icon-image": "pin", // reference the image
    //   "icon-size": 0.05,
    // },
  });
});

map.on("click", "unclustered-point", (e) => {
  console.log(e);
  new mapboxgl.Popup()
    .setLngLat([e.lngLat.lng, e.lngLat.lat])
    .setHTML(
      `<li class="list__item list__item--small" data-id="${e.features[0].properties.id}" data-pigment="${e.features[0].properties.pigment}" >${e.features[0].properties.pigment}</li>`
    )
    .addTo(map);
});
map.on("click", "clusters", (e) => {
  const features = map.queryRenderedFeatures(e.point, {
    layers: ["clusters"],
  });

  const clusterId = features[0].properties.cluster_id;
  map
    .getSource("colourants")
    .getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) return;

      map.flyTo({
        center: features[0].geometry.coordinates,
        zoom: zoom,
      });
    });
});
map.on("mouseenter", ["clusters", "unclustered-point"], () => {
  map.getCanvas().style.cursor = "pointer";
});
map.on("mouseleave", "clusters", () => {
  map.getCanvas().style.cursor = "";
});
const events = ["submit", "load"];
events.forEach((event) => {
  window.addEventListener(event, async (e) => {
    e.preventDefault();
    const pigment = document.getElementById("pigment").value;
    const analyticalTechniques = document.getElementById("techniques").value;
    const categoryOfFind = document.getElementById("category-of-find").value;
    const centuryStart = document.getElementById("century-start").value;
    const centuryEnd = document.getElementById("century-end").value;
    const checked = document.getElementById("checked")
      ? document.getElementById("checked").value
      : "";

    const filter = new URLSearchParams({
      pigment,
      analyticalTechniques,
      categoryOfFind,
      centuryStart,
      centuryEnd,
      checked,
    });

    geoData.features = [];
    resultsList.innerHTML = "";
    await getColourant(filter);
    if (map.getSource("colourants"))
      map.getSource("colourants").setData(geoData);
  });
});

mapContainer.addEventListener("click", (e) => {
  if (e.target.className.includes("list__item")) {
    const colourant = filteredColourants.colourants.filter((el) => {
      if (
        el._id === e.target.dataset.id &&
        el.pigment === e.target.dataset.pigment
      ) {
        return el;
      }
    });
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
  }
  closeDetailsWindow(e);
});

form.addEventListener("change", (e) => {
  e.preventDefault();
  const otherInput = document.getElementById("other-pigment");
  if (e.target.value === "other") {
    otherInput.removeAttribute("hidden");
  } else {
    otherInput.setAttribute("hidden", "true");
  }
  setRemoveAttributes(e);
});
