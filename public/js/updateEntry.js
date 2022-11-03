/* eslint-disable*/
import {
  setRemoveAttributes,
  hideCenturies,
  getFormValues,
  cfv,
  toggleCertainProvenance,
  editLocation,
} from "./colourantForm.js";
import { MapBox } from "./mapBox.js";
import { showAlert } from "./alert.js";
const mapBox = new MapBox();
// ELEMENTS
const form = document.querySelector("form");
const btnEditForm = document.getElementById("btn-edit-form");
const btnResetForm = document.getElementById("btn-reset-form");
const btnDeleteEntry = document.getElementById("btn-delete-entry");
const btnSubmit = document.getElementById("btn-submit");
const username = document.getElementById("username");
const log = document.getElementById("log");
const logBox = document.getElementById("logBox");
const modal = document.querySelector(".modal");
let colourantData;
// FUNCTIONS
const isEqual = (obj1, obj2) => {
  let props1 = Object.getOwnPropertyNames(obj1);
  let props2 = Object.getOwnPropertyNames(obj2);
  if (props1.length != props2.length) {
    return false;
  }
  for (let i = 0; i < props1.length; i++) {
    let prop = props1[i];
    let bothAreObjects =
      typeof obj1[prop] === "object" && typeof obj2[prop] === "object";
    if (
      (!bothAreObjects && obj1[prop] !== obj2[prop]) ||
      (bothAreObjects && !isEqual(obj1[prop], obj2[prop]))
    ) {
      return false;
    }
  }
  return true;
};

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
const deleteEntry = async () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const entryId = params.get("id");
    const url = `${window.location.origin}/api/v1/colourants/${entryId}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error(res.statusText, res.status);
    else {
      showAlert("Your entry has been deleted", "success", 3);
      window.setTimeout(() => {
        location.assign("/myAccount");
      }, 3000);
    }
  } catch (err) {
    showAlert(err, "error", 5);
  }
};

const checkInput = (elements, values) => {
  const otherCheckbox = elements[elements.length - 2];
  const otherInput = elements[elements.length - 1];
  const elIds = [];
  const otherValues = [];

  if (typeof values === "string" || typeof values === "boolean") {
    values = new Array(values.toString());
  }
  values = values.map((value) => value.toLowerCase());

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
  if (data.data.location.certainProvenance) {
    cfv.certainProvenance.selectedIndex = 0;
  } else {
    cfv.certainProvenance.selectedIndex = 1;
    cfv.uncertainProvenance.value = data.data.location.address;
  }

  cfv.references.value = data.data.references;
  cfv.notes.value = data.data.notes;
  cfv.archeologicalContext.value = data.data.archeologicalContext;
  if (data.data.chronology.start) {
    cfv.centuryStart.value = data.data.chronology.start;
    cfv.chrStart.selectedIndex = `${data.data.chronology.start}`.startsWith("-")
      ? 0
      : 1;
    cfv.chrEnd.selectedIndex = `${data.data.chronology.end}`.startsWith("-")
      ? 0
      : 1;
    cfv.centuryEnd.value = data.data.chronology.end;
  }
  cfv.lat.value = data.data.location.coordinates
    ? data.data.location.coordinates[0]
    : "";
  cfv.lng.value = data.data.location.coordinates
    ? data.data.location.coordinates[1]
    : "";
  checkInput(cfv.colourantsInputs, data.data.colourants);
  checkInput(cfv.categoryOfFindInputs, data.data.categoryOfFind);
  checkInput(cfv.analyticalTechniquesInputs, data.data.analyticalTechniques);
  if (cfv.checkedEl) {
    checkInput(cfv.checkedEl, data.data.checked);
  }
  btnSubmit.innerText = "Update entry";
};

const disableForm = () => {
  btnSubmit.setAttribute("hidden", true);
  logBox.classList.add("u-hidden");
  modal.classList.remove("u-hidden");
};

const enableForm = () => {
  logBox.classList.remove("u-hidden");
  btnSubmit.removeAttribute("hidden");
  btnSubmit.removeAttribute("disabled");
  btnResetForm.removeAttribute("hidden");
  btnEditForm.setAttribute("hidden", true);
  modal.classList.add("u-hidden");
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
  editLocation();
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

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const params = new URLSearchParams(window.location.search);
  const entryId = params.get("id");

  const updatedData = getFormValues();
  updatedData.id = entryId;
  //Check if has been any change to the data except the "Checked" field so that
  //when only the "Checked" field has been changed the entry will not appear as edited
  const updatedDataCopy = { ...updatedData };
  const data = await getColourant();
  delete updatedDataCopy.checked;
  delete data.data._id;
  delete data.data.contributor;
  delete data.data.createdAt;
  delete data.data.edited;
  delete data.data.__v;
  delete data.data.location.type;
  delete data.data.checked;

  if (!isEqual(updatedDataCopy, data.data)) {
    if (!log.value) {
      showAlert("Information in Log field is lacking", "error", 3);
      return;
    }
    updatedData.$push = {
      edited: { at: Date.now(), from: username.value, log: log.value },
    };
  }

  updateEntry(updatedData);

  window.setTimeout(() => {
    location.assign("/myAccount");
  }, 1000);
});

btnEditForm.addEventListener("click", (e) => {
  enableForm();
});

btnResetForm.addEventListener("click", (e) => {
  location.reload();
});
btnDeleteEntry.addEventListener("click", (e) => {
  if (window.confirm("Are you sure that you want to delete this entry?"))
    deleteEntry();
});
