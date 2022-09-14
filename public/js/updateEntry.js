/* eslint-disable*/
import {
  setRemoveAttributes,
  hideCenturies,
  getFormValues,
  cfv,
  toggleCertainProvenance,
} from "./colourantForm.js";
import { MapBox } from "./mapBox.js";
import { showAlert } from "./alert.js";
const mapBox = new MapBox();
// ELEMENTS
const form = document.querySelector("form");
const mapElement = document.getElementById("map");
const fieldsets = document.querySelectorAll("fieldset");
const btnEditForm = document.getElementById("btn-edit-form");
const btnResetForm = document.getElementById("btn-reset-form");
const btnSubmit = document.getElementById("btn-submit");
const username = document.getElementById("username");
const userId = document.getElementById("user-id");
const log = document.getElementById("log");
let colourantData;
// FUNCTIONS

const getColourant = async () => {
  try {
    const param = new URLSearchParams(window.location.search);
    const entryId = param.get("id");
    const url = `${window.location.origin}/api/v1/colourants/${entryId}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  } catch (err) {
    showAlert(err, "error", 5);
  }
};

const updateEntry = async (colourantData) => {
  try {
    const url = `${window.location.origin}/api/v1/colourants/`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(colourantData),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);
    if (data.status === "success") {
      showAlert("You entry has been updated!", "success", 5);
    }
  } catch (err) {
    showAlert(err, "error", 5);
  }
};

const checkInput = (elements, values) => {
  if (typeof values === "string" || typeof values === "boolean") {
    values = new Array(values.toString());
  }
  values = values.map((value) => value.toLowerCase());

  const otherCheckbox = elements[elements.length - 2];
  const otherInput = elements[elements.length - 1];
  const elIds = [];
  const otherValues = [];
  elements.forEach((el) => {
    elIds.push(el.id.toLowerCase());
    if (values.includes(el.id.toLowerCase())) el.checked = true;
  });
  values.forEach((el) => {
    if (!elIds.includes(el.toLowerCase())) {
      otherValues.push(el);
      otherCheckbox.checked = true;
      otherCheckbox.value = otherValues;
      otherInput.value = otherValues;
    }
  });
};

const initiateFormValues = (data) => {
  if (data.colourant.location.certainProvenance) {
    cfv.certainProvenance.selectedIndex = 0;
  } else {
    cfv.certainProvenance.selectedIndex = 1;
    cfv.loc.value = data.colourant.location.address;
  }

  cfv.references.value = data.colourant.references;
  cfv.notes.value = data.colourant.notes;
  cfv.archeologicalContext.value = data.colourant.archeologicalContext;
  cfv.centuryStart.value = data.colourant.chronology.start;
  cfv.chrStart.selectedIndex = `${data.colourant.chronology.start}`.startsWith(
    "-"
  )
    ? 0
    : 1;
  cfv.chrEnd.selectedIndex = `${data.colourant.chronology.end}`.startsWith("-")
    ? 0
    : 1;
  cfv.centuryEnd.value = data.colourant.chronology.end;
  cfv.lat.value = data.colourant.location.coordinates
    ? data.colourant.location.coordinates[0]
    : "";
  cfv.lng.value = data.colourant.location.coordinates
    ? data.colourant.location.coordinates[1]
    : "";
  checkInput(cfv.pigmentsInputs, data.colourant.pigment);
  checkInput(cfv.categoryOfFindInputs, data.colourant.categoryOfFind);
  checkInput(
    cfv.analyticalTechniquesInputs,
    data.colourant.analyticalTechniques
  );
  if (cfv.checkedEl) {
    checkInput(cfv.checkedEl, data.colourant.checked);
  }
  btnSubmit.innerText = "Update entry";
};

const disableForm = () => {
  fieldsets.forEach((el) => el.setAttribute("disabled", "true"));
  mapElement.style.pointerEvents = "none";
  btnSubmit.setAttribute("hidden", true);
  document.querySelector(".update-entry").style.backgroundColor = "#B1D0E0";
};

const enableForm = () => {
  fieldsets.forEach((el) => el.removeAttribute("disabled"));
  mapElement.style.pointerEvents = "auto";
  btnSubmit.removeAttribute("disabled");
  log.removeAttribute("hidden");
  log.parentElement.querySelector("label").removeAttribute("hidden");
  btnSubmit.removeAttribute("hidden");
  btnResetForm.removeAttribute("hidden");
  btnEditForm.setAttribute("hidden", true);
  document.querySelector(".update-entry").style.backgroundColor = "#eee8e8";
};

const setMarker = (lat, lng) => {
  if (!lat || !lng) return;
  mapBox.removeMarker();
  mapBox.geocoder.query(`${lat},${lng}`);
  mapBox.createMarker([lng, lat]);
};

// EVENT LISTENERS

window.addEventListener("load", async (e) => {
  mapBox.displayMap();
  colourantData = await getColourant();
  if (!colourantData) return;
  initiateFormValues(colourantData);
  toggleCertainProvenance(e, mapBox);
  disableForm();
  setRemoveAttributes(e);
  mapBox.setLocation(cfv.lng, cfv.lat, cfv.loc, cfv.coords);
  window.setTimeout(() => {
    setMarker(cfv.lat.value, cfv.lng.value);
  }, 1000);
});

form.addEventListener("change", (e) => {
  e.preventDefault();
  setRemoveAttributes(e);
  hideCenturies(e);
  if (e.target.id === "other") {
    const otherInput = e.target.parentElement.querySelector("#other-input");
    if (e.target.checked) {
      otherInput.focus();
    }
  }
  if (e.target.id === "other-input") {
    const other = e.target.parentElement.querySelector("#other");
    other.value = e.target.value;
  }
  if (e.target.id === "certainProvenance") {
    toggleCertainProvenance(e, mapBox);
  }
});

btnSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  const params = new URLSearchParams(window.location.search);
  const entryId = params.get("id");
  // Get the checked value
  const updatedData = getFormValues();
  updatedData.id = entryId;
  updatedData.$push = {
    edited: { at: Date.now(), from: username.value, log: log.value },
  };
  updateEntry(updatedData);
  window.setTimeout(() => {
    location.assign("/myAccount");
  }, 1000);
});

btnEditForm.addEventListener("click", (e) => {
  enableForm();
  toggleCertainProvenance(e, mapBox);
});

btnResetForm.addEventListener("click", (e) => {
  location.reload();
});
