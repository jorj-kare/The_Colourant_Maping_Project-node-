/* eslint-disable*/

// SELECTORS
const form = document.querySelector(".form");
const userId = document.getElementById("user-id");
const detailsField = document.getElementById("details");

// FUNCTIONS

const createColourant = async (colourantData) => {
  try {
    const url = " http://127.0.0.1:3000/api/v1/colourants";
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
      alert("You entry has been submitted successfully!");
    }
  } catch (err) {
    alert(err.message);
  }
};

// EVENTS LISTENERS
window.addEventListener("load", (e) => {
  setRemoveAttributes(e);
});

details.addEventListener("change", function (e) {
  setRemoveAttributes(e);
  hideCenturies(e);
});
let marker;

setLocation(lng, lat, loc, coords);

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
    e.target.closest(".form__group-row").id !== "checkedEl" &&
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
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  // FORM INPUTS
  // Get the checked value
  const data = getFormValues();
  data.contributor = userId ? userId.value : "";
  createColourant(data);
  window.setTimeout(() => {
    location.assign("/");
  }, 500);
});
