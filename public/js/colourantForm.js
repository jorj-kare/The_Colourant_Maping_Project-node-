/* eslint-disable */

// ELEMENTS
const pigmentsInputs = document.getElementById("pigments")
  ? document.getElementById("pigments").querySelectorAll("input")
  : "";
const categoryOfFindInputs = document.getElementById("category-of-find")
  ? document.getElementById("category-of-find").querySelectorAll("input")
  : "";
const analyticalTechniquesInputs = document.getElementById(
  "analytical-techniques"
)
  ? document.getElementById("analytical-techniques").querySelectorAll("input")
  : "";
const checkedEl = document.getElementById("checkedEl")
  ? document.getElementById("checkedEl").querySelectorAll("input")
  : "";
const coords = document.getElementById("coords");
const references = document.getElementById("references");
const notes = document.getElementById("notes");
const archeologicalContext = document.getElementById("archeological-context");
const centuryStart = document.getElementById("century-start");
const centuryEnd = document.getElementById("century-end");
const chrEnd = document.getElementById("chr-end");
const chrStart = document.getElementById("chr-start");
const lat = document.getElementById("latitude");
const lng = document.getElementById("longitude");
const loc = document.getElementById("loc");

// FUNCTIONS
const hideCenturies = (e) => {
  if (e.target.id === "century-start" || e.target.id === "chr-start") {
    const centuries = centuryEnd.querySelectorAll("option");
    centuryEnd.selectedIndex = 0;
    centuries.forEach((el) => {
      if (el.value === "") return;
      if (+el.value <= +centuryStart.value) {
        centuryEnd.removeAttribute("disabled");
        el.setAttribute("hidden", "true");
        el.setAttribute("disabled", "true");
      }
      if (+el.value >= +centuryStart.value) {
        el.removeAttribute("hidden");
        el.removeAttribute("disabled");
      }
    });
  }
};

const setRemoveAttributes = function (e) {
  if (e.target.className === "form__dropdown chr") {
    e.target.parentElement.querySelector(".century").selectedIndex = 0;
    const bceOptgroup = e.target.parentElement.querySelector(".bce-optgroup");
    const ceOptgroup = e.target.parentElement.querySelector(".ce-optgroup");
    if (e.target.value === "CE") {
      bceOptgroup.setAttribute("hidden", "true");
      bceOptgroup.setAttribute("disabled", "true");
      ceOptgroup.removeAttribute("hidden");
      ceOptgroup.removeAttribute("disabled");
      if (e.target.id === "chr-start") {
        chrEnd.firstElementChild.setAttribute("disabled", "true");
        chrEnd.selectedIndex = 1;
        centuryEnd
          .querySelector(".bce-optgroup")
          .setAttribute("hidden", "true");
        centuryEnd
          .querySelector(".bce-optgroup")
          .setAttribute("disabled", "true");
        centuryEnd.querySelector(".ce-optgroup").removeAttribute("hidden");
        centuryEnd.querySelector(".ce-optgroup").removeAttribute("disabled");
      }
    }
    if (e.target.value === "BCE") {
      ceOptgroup.setAttribute("hidden", "true");
      ceOptgroup.setAttribute("disabled", "true");
      bceOptgroup.removeAttribute("hidden");
      bceOptgroup.removeAttribute("disabled");
      if (e.target.id === "chr-start") {
        chrEnd.firstElementChild.removeAttribute("disabled");
      }
    }
  }
};

const getFormValues = () => {
  let categoryOfFind = [];
  let analyticalTechniques = [];
  let pigments = [];
  let isChecked ;
  if (checkedEl) {
    checkedEl.forEach((el) => {
      if (el.checked) {
        isChecked= el.value;
      }
    });
  } else {
    isChecked = false;
  }

  categoryOfFindInputs.forEach((el) => {
    if (el.checked) {
      categoryOfFind = el.value;
    }
  });

  // Get the checked values and pushes them to an array
  pigmentsInputs.forEach((el) => {
    if (el.checked) {
      let value = el.value;
      if (value.includes(",")) {
        value = value.split(",");
        pigments.push(...value);
      } else {
        pigments.push(value);
      }
    }
  });

  analyticalTechniquesInputs.forEach((el) => {
    if (el.checked) {
      let value = el.value;
      if (value.includes(",")) {
        value = value.split(",");
        analyticalTechniques.push(...value);
      } else {
        analyticalTechniques.push(value);
      }
    }
  });
  
  const data = {
    location: {
      address: loc.value,
      coordinates: [lat.value * 1, lng.value * 1],
    },
    chronology: { start: +centuryStart.value, end: +centuryEnd.value },
    pigment: pigments,
    analyticalTechniques,
    categoryOfFind,
    archeologicalContext: archeologicalContext.value,
    references: references.value,
    notes: notes.value,
    checked: isChecked,
  };
  
  return data
};
