/* eslint-disable */
// ELEMENTS
// Colourant from variables
export const cfv = {
  pigmentsInputs: document.getElementById("pigments")
    ? document.getElementById("pigments").querySelectorAll("input")
    : "",
  categoryOfFindInputs: document.getElementById("category-of-find")
    ? document.getElementById("category-of-find").querySelectorAll("input")
    : "",
  analyticalTechniquesInputs: document.getElementById("analytical-techniques")
    ? document.getElementById("analytical-techniques").querySelectorAll("input")
    : "",
  checkedEl: document.getElementById("checkedInputs")
    ? document.getElementById("checkedInputs").querySelectorAll("input")
    : "",
  coords: document.getElementById("coords"),
  references: document.getElementById("references"),
  notes: document.getElementById("notes"),
  archeologicalContext: document.getElementById("archeological-context"),
  centuryStart: document.getElementById("century-start"),
  centuryEnd: document.getElementById("century-end"),
  chrEnd: document.getElementById("chr-end"),
  chrStart: document.getElementById("chr-start"),
  lat: document.getElementById("latitude"),
  lng: document.getElementById("longitude"),
  loc: document.getElementById("loc"),
};
// FUNCTIONS

const trimArrValues = (arr) => {
  const trimmedArr= arr.filter((el) => el.trim() !== "").map((el) => el.trim());
  return trimmedArr;
};

export const hideCenturies = (e) => {
  if (e.target.id === "century-start" || e.target.id === "chr-start") {
    const centuries = cfv.centuryEnd.querySelectorAll("option");
    cfv.centuryEnd.selectedIndex = 0;
    centuries.forEach((el) => {
      if (el.value === "") return;
      if (+el.value <= +cfv.centuryStart.value) {
        cfv.centuryEnd.removeAttribute("disabled");
        el.setAttribute("hidden", "true");
        el.setAttribute("disabled", "true");
      }
      if (+el.value >= +cfv.centuryStart.value) {
        el.removeAttribute("hidden");
        el.removeAttribute("disabled");
      }
    });
  }
};

export const setRemoveAttributes = function (e) {
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
        cfv.chrEnd.firstElementChild.setAttribute("disabled", "true");
        cfv.chrEnd.selectedIndex = 1;
        cfv.centuryEnd
          .querySelector(".bce-optgroup")
          .setAttribute("hidden", "true");
        cfv.centuryEnd
          .querySelector(".bce-optgroup")
          .setAttribute("disabled", "true");
        cfv.centuryEnd.querySelector(".ce-optgroup").removeAttribute("hidden");
        cfv.centuryEnd
          .querySelector(".ce-optgroup")
          .removeAttribute("disabled");
      }
    }
    if (e.target.value === "BCE") {
      ceOptgroup.setAttribute("hidden", "true");
      ceOptgroup.setAttribute("disabled", "true");
      bceOptgroup.removeAttribute("hidden");
      bceOptgroup.removeAttribute("disabled");
      if (e.target.id === "chr-start") {
        cfv.chrEnd.firstElementChild.removeAttribute("disabled");
      }
    }
  }
};

export const createChronologyString = (data) => {
  const start = data.chronology.start.toString().includes("-")
    ? `${data.chronology.start.toString().replace("-", "")} BCE`
    : `${data.chronology.start} CE`;
  const end = data.chronology.end.toString().includes("-")
    ? `${data.chronology.end.toString().replace("-", "")} BCE`
    : `${data.chronology.end} CE`;
  return { start, end };
};

export const getFormValues = () => {
  let categoryOfFind = [];
  let analyticalTechniques = [];
  let pigments = [];
  let isChecked;
  if (cfv.checkedEl) {
    cfv.checkedEl.forEach((el) => {
      if (el.checked) {
        isChecked = el.value;
      }
    });
  } else {
    isChecked = false;
  }

  cfv.categoryOfFindInputs.forEach((el) => {
    if (el.checked) {
      categoryOfFind = el.value.trim();
    }
  });

  // Get the checked values and pushes them to an array
  cfv.pigmentsInputs.forEach((el) => {
    if (el.checked) {
      let value = el.value;
      if (value.includes(",")) {
        value = value.split(",");
        value = trimArrValues(value)
        pigments.push(...value);
      } else {
        pigments.push(value);
      }
    }
  });

  cfv.analyticalTechniquesInputs.forEach((el) => {
    if (el.checked) {
      let value = el.value;
      if (value.includes(",")) {
        value = value.split(",");
        value= trimArrValues(value)
        analyticalTechniques.push(...value);
      } else {
        analyticalTechniques.push(value);
      }
    }
  });

  const data = {
    location: {
      address: cfv.loc.value,
      coordinates: [cfv.lat.value * 1, cfv.lng.value * 1],
    },
    chronology: { start: +cfv.centuryStart.value, end: +cfv.centuryEnd.value },
    pigment: pigments,
    analyticalTechniques,
    categoryOfFind,
    archeologicalContext: cfv.archeologicalContext.value,
    references: cfv.references.value,
    notes: cfv.notes.value,
    checked: isChecked,
  };

  return data;
};
