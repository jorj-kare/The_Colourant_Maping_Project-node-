/* eslint-disable */
// SELECTORS
const sortBy = document.querySelector(".sort-by");
const tBody = document.querySelector(".table__body");
const sortCategory = document.querySelector("#sort-category");
const sortOrder = document.querySelector("#sort-order");
// FUNCTIONS
const getColourants = async (filters) => {
  const str = filters.toString();
  const url = `${window.location.origin}/api/v1/colourants/?${str}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
};
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

editEditedField = (entry) => {
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
  entries.forEach((entry) => {
    markup += `<tr class="table__row">
    <td class='table__data' data-label="Created at">${new Date(
      entry.createdAt
    ).toLocaleDateString("en-Gb")}</td>
    <td class='table__data' data-label="Pigment">${entry.pigment}</td>
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
    ${entry.location.coordinates}
    </details></td>
    <td class='table__data' data-label="Analytical techniques">${
      entry.analyticalTechniques
    }</td>
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
  const filter = new URLSearchParams({
    sortCategory: sortCategory.value,
    sortOrder: sortOrder.value,
  });
  const data = await getColourants(filter);
  displayEntries(data.colourants);
});

sortBy.addEventListener("change", async (e) => {
  const filter = new URLSearchParams({
    sortCategory: sortCategory.value,
    sortOrder: sortOrder.value,
  });
  const entries = await getColourants(filter);
  displayEntries(entries.colourants);
});
