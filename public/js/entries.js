import { getFilteredColourant } from "./searchFilters.js";
import { displayDetails, closeDetailsWindow } from "./details.js";
/* eslint-disable */
// SELECTORS
const form = document.querySelector(".form");
const sortBy = document.querySelector(".sort-by");
const tBody = document.querySelector(".table__body");
const entriesContainer = document.querySelector(".entries");
let filteredColourants = [];
// FUNCTIONS
const editLongText = (entry) => {
  const wordsArray = entry.split(" ");
  let output;
  if (wordsArray.length > 10) {
    output = `<details><summary>${wordsArray.slice(0, 10).join(" ")}</summary>
    ${wordsArray.slice(10).join(" ")}
    </details>`;
  } else {
    output = entry;
  }
  return output;
};
const editContributorField = (contributor) => {
  let output;
  if (contributor.lastName) {
    output = `<details><summary>${contributor.username}</summary>
        <strong>First name: </strong>${contributor.firstName}<br>
        <strong>Last name: </strong>${contributor.lastName}<br>
        <strong>Affiliation: </strong> ${contributor.affiliation}<br>
        <strong>Email: </strong>${contributor.email}<br>
        </details>`;
  } else {
    output = `${contributor.username}`;
  }
  return output;
};

const editEditedField = (entry) => {
  let output;
  if (entry.length > 1) {
    let details = "";
    entry.forEach((el) => {
      details += `
            <strong>Edited from:</strong>${el.from}<br>
            <strong>Edited at:</strong>${new Date(el.at).toLocaleDateString(
              "en-Gb"
            )}<br>
            <strong>Log:</strong>${el.log}<br>
            -----------------------<br>`;
    });

    output = `<details><summary>Edited: ${entry.length} times</summary>
        ${details}
        </details>`;
  } else output = `The entry has not been edited `;

  return output;
};

const addTablesForAdmin = (entry) => {
  if (!entry.contributor.lastName) return ``;
  return `<td class="table__data" data-label="Checked">${
    entry.checked == true ? "Checked" : "Unchecked"
  }</td>
    <td class="table__data table__data--hover" data-label="Edit"><a href="/updateEntry?id=${
      entry._id
    }")>✎</td>`;
};
const displayEntries = (entries) => {
  let markup = "";
  tBody.innerHTML = "";
  if (!entries) return;
  entries.forEach((entry) => {
    markup += `<tr class="table__row">
    <td class='table__data' data-label="Created at">${new Date(
      entry.createdAt
    ).toLocaleDateString("en-Gb")}</td>
    <td id="td-colourants" class='table__data' data-id="${
      entry._id
    }" data-label="Colourant(s)">${entry.colourants.join(", ")}</td>
    <td class='table__data' data-label="Chronology">${
      entry.chronology.start
    }, ${entry.chronology.end}</td>
    <td class='table__data' data-label="Category of find">${
      entry.categoryOfFind
    }</td>
    <td class='table__data' data-label="Location"><details>
    <summary>${entry.location.address}</summary>
    -----------------<br>
    <strong>Coordinates</strong><br>
    ${entry.location.coordinates}<br>
    -----------------<br>
    <strong>Certain <br> provenance</strong><br>
    ${entry.location.certainProvenance}
    </details></td>
    <td class='table__data' data-label="Analytical techniques">${entry.analyticalTechniques.join(
      ", "
    )}</td>
    <td class='table__data' data-label="Archeological context ">${editLongText(
      entry.archeologicalContext
    )}</td>
    <td class='table__data' data-label="Notes">${editLongText(entry.notes)}</td>
    <td class='table__data' data-label="References">${editLongText(
      entry.references
    )}</td>
    <td class='table__data' data-label="Contributor">
    ${editContributorField(entry.contributor)}
    </td>
    <td class='table__data' data-label="Edited at ">
    ${editEditedField(entry.edited)}
    </td>
    ${addTablesForAdmin(entry)}
    </tr>`;
  });

  tBody.insertAdjacentHTML("afterbegin", markup);
};

// EVENTS LISTENERS
window.addEventListener("load", async (e) => {
  filteredColourants = await getFilteredColourant();
  displayEntries(filteredColourants.data);
});
form.addEventListener("change", async (e) => {
  e.preventDefault();
  filteredColourants = await getFilteredColourant();
  displayEntries(filteredColourants.data);
});

sortBy.addEventListener("change", async (e) => {
  filteredColourants = await getFilteredColourant();
  displayEntries(filteredColourants.data);
});

entriesContainer.addEventListener("click", (e) => {
  displayDetails(e, filteredColourants.data);
  closeDetailsWindow(e);
});
