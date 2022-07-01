/* eslint-disable*/

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
// const checkedInputs = document.getElementById("checkedEl")
//   ? document.getElementById("checkedEl").querySelectorAll("input")
//   : "";
let colourantData;
// FUNCTIONS

const getColourant = async () => {
  try {
    const param = new URLSearchParams(window.location.search);
    const entryId = param.get("id");
    const url = `http://127.0.0.1:3000/api/v1/colourants/${entryId}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  } catch (err) {
    alert(err);
  }
};

const updateEntry = async (colourantData) => {
  try {
    const url = `http://127.0.0.1:3000/api/v1/colourants/`;
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
      alert("You entry has been updated!");
    }
  } catch (err) {
    alert(err);
  }
};

const initiateFormValues = (data) => {
  references.value = data.colourant.references;
  notes.value = data.colourant.notes;
  archeologicalContext.value = data.colourant.archeologicalContext;
  centuryStart.value = data.colourant.chronology.start;
  chrStart.selectedIndex = `${data.colourant.chronology.start}`.startsWith("-")
    ? 0
    : 1;
  chrEnd.selectedIndex = `${data.colourant.chronology.end}`.startsWith("-")
    ? 0
    : 1;
  centuryEnd.value = data.colourant.chronology.end;
  lat.value = data.colourant.location.coordinates[0];
  lng.value = data.colourant.location.coordinates[1];
  checkInput(pigmentsInputs, data.colourant.pigment);
  checkInput(categoryOfFindInputs, data.colourant.categoryOfFind);
  checkInput(analyticalTechniquesInputs, data.colourant.analyticalTechniques);
  if (checkedEl) checkInput(checkedEl, data.colourant.checked);
  btnSubmit.innerText = "Update entry";
};

const checkInput = (elements, values) => {
  if (typeof values === "string" || typeof values === "boolean")
    values = new Array(values);
  const otherCheckbox = elements[elements.length - 2];
  const otherInput = elements[elements.length - 1];
  const elIds = [];
  const otherValues = [];
  elements.forEach((el) => {
    elIds.push(el.id);
    if (values.includes(el.id)) el.checked = true;
  });
  values.forEach((el) => {
    if (!elIds.includes(el)) {
      otherValues.push(el);
      otherCheckbox.checked = true;
      otherCheckbox.value = otherValues;
      otherInput.value = otherValues;
    }
  });
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
  if (marker) marker.remove();
  geocoder.query(`${lat},${lng}`);
  marker = createMarker([lng, lat]);
};

// EVENT LISTENERS
let marker;

form.addEventListener("change", function (e) {
  setRemoveAttributes(e);
  hideCenturies(e);
});

window.addEventListener("load", async (e) => {
  disableForm();
  setRemoveAttributes(e);
  colourantData = await getColourant();
  if (!colourantData) return;
  initiateFormValues(colourantData);
  setLocation(lng, lat, loc, coords);
  window.setTimeout(() => {
    setMarker(lat.value, lng.value);
  }, 1000);
});

btnEditForm.addEventListener("click", enableForm);

btnResetForm.addEventListener("click", (e) => {
  location.reload();
});

form.addEventListener("change", (e) => {
  e.preventDefault();
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
  }, 500);
});
