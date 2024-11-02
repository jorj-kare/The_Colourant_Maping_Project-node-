import { createChronologyString } from "./colourantForm.js";
import { showAlert } from "./alert.js";

let colourantData;

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

const createMarkup = (colourant) => {
  const main = document.querySelector("main");

  const chr = createChronologyString(colourant);
  const markup = `<div id="details" class="details u-fade-in">
<ul class="details__list">
<li class="details__item" id="url-box"><span class="details__header"id="url-header" >  URL </span><span id="url">${window.location.href}</span> <span id="url-icon"><ion-icon name="clipboard-outline"></ion-icon></span></li>
<li class="details__item"><span  class="details__icon">&#9677;</span><span class="details__header">  unique Id: </span>${colourant.uniqueId}</li>
<li class="details__item"><span  class="details__icon">&#9677;</span><span class="details__header">  Colourant(s): </span>${colourant.colourants}</li>
<li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Chronology: </span>${chr.start}, ${chr.end}</li>
<li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Category of find: </span>${colourant.categoryOfFind}</li>
<li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Archeological context: </span>${colourant.archeologicalContext}</li>
<li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Notes: </span>${colourant.notes}</li>
<li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Analytical techniques: </span>${colourant.analyticalTechniques}</li>
<li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> References: </span>${colourant.references}</li>
<li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Address: </span>${colourant.location.address}</li>
<li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Coordinates: </span>${colourant.location.coordinates}</li>
<li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Certain provenance: </span>${colourant.location.certainProvenance}</li>
<li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Contributor: </span>${colourant.contributor.firstName} ${colourant.contributor.lastName}</li>
<li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Affiliation: </span>${colourant.contributor.affiliation}</li>
</ul>
</div>`;
  main.insertAdjacentHTML("afterbegin", markup);
};

window.addEventListener("load", async (e) => {
  colourantData = await getColourant();
  if (!colourantData) return;

  createMarkup(colourantData.data);
});

document.addEventListener("click", (e) => {
  const urlEl = document.querySelector("#url");
  const target = e.target.closest("#url-box");

  if (target) {
    urlEl.classList.add("flying-text-animation");
    navigator.clipboard.writeText(`${window.location.href}`);
  }
  urlEl.addEventListener("animationend", (e) => {
    urlEl.classList.remove("flying-text-animation");
  });
});
