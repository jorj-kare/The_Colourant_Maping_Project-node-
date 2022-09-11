import { hideCenturies, setRemoveAttributes } from "./colourantForm.js";
const pigment = document.getElementById("pigment");
const analyticalTechniques = document.getElementById("techniques");
const categoryOfFind = document.getElementById("category-of-find");
const centuryStart = document.getElementById("century-start");
const centuryEnd = document.getElementById("century-end");
const checked = document.getElementById("checked")
  ? document.getElementById("checked")
  : "";
const sortCategory = document.querySelector("#sort-category");
const sortOrder = document.querySelector("#sort-order");
const form = document.querySelector(".form");
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
    selectEl.style.width = "37%";
    otherInput.removeAttribute("hidden");
    if (otherInput.value) selectEl.lastChild.value = otherInput.value;
  }
});

export const getFilteredColourant = async () => {
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
  const str = filter.toString();
  const url = ` ${window.location.origin}/api/v1/colourants/?${str}`;
  const res = await fetch(url);
  const data = await res.json();

  return data;
};
