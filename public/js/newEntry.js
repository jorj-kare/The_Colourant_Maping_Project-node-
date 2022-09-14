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
// SELECTORS
const form = document.querySelector(".form");
const userId = document.getElementById("user-id");

// FUNCTIONS

const createColourant = async (colourantData) => {
  try {
    const url = `${window.location.origin}/api/v1/colourants`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(colourantData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    if (data.status === "success") {
      showAlert("You entry has been submitted successfully!", "success", 5);
    }
  } catch (err) {
    showAlert(err.message, "error", 5);
  }
};

// EVENTS LISTENERS
mapBox.displayMap();

window.addEventListener("load", (e) => {
  setRemoveAttributes(e);
});

details.addEventListener("change", function (e) {
  setRemoveAttributes(e);
  hideCenturies(e);
});

mapBox.setLocation(cfv.lng, cfv.lat, cfv.loc, cfv.coords);

form.addEventListener("change", (e) => {
  e.preventDefault();
  // 1. Focus on the "other-input "
  // 2. Set the value of the "other-input" to empty string if the "other" checkbox is not checked
  // 3. Set the value of the 'other" checkBox to the "other-input" value
  if (e.target.id === "other") {
    const otherInput = e.target.parentElement.querySelector("#other-input");
    const other = e.target.parentElement.querySelector("#other");
    if (e.target.checked) {
      otherInput.focus();
    }
    if (!e.target.checked) {
      otherInput.value = "";
      other.value = "";
    }
  }

  if (
    e.target.type === "radio" &&
    e.target.closest(".form__group-row").id !== "checkedInputs" &&
    e.target.id !== "other"
  ) {
    const otherInput = e.target
      .closest(".form__group-row")
      .querySelector("#other-input");
    const other = e.target.closest(".form__group-row").querySelector("#other");
    otherInput.value = "";
    other.value = "";
  }

  if (e.target.id === "other-input") {
    const other = e.target.parentElement.querySelector("#other");
    other.value = e.target.value;
  }
  if (e.target.id === "certainProvenance") toggleCertainProvenance(e, mapBox);
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  // Get the checked value
  const data = getFormValues();
  data.contributor = userId ? userId.value : "";
  createColourant(data);
  window.setTimeout(() => {
    location.assign("/");
  }, 1000);
});
