import { createChronologyString } from "./colourantForm.js";
const closeDetailsWindow = (e) => {
  if (e.target.id === "btnClose" || e.target.id === "details") {
    const el = document.querySelector(".details");
    if (el) {
      el.classList.add("u-fade-out");
      window.setTimeout(() => {
        el.parentElement.removeChild(el);
      }, 1000);
    }
  }
};

const displayDetails = (e, data) => {
  const main = document.querySelector("main");
  if (!e.target.dataset.id) return;
  const colourant = data.filter((el) => el._id === e.target.dataset.id);

  const chr = createChronologyString(colourant[0]);
  const markup = `<div id="details" class="details u-fade-in">
<ul class="details__list">
<button id="btnClose" class="btn btn--small btn--close">⇽</button>
<li class="details__item"><span  class="details__icon">&#9677;</span><span class="details__header">  Colourant(s): </span>${colourant[0].colourants}</li>
<li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Chronology: </span>${chr.start}, ${chr.end}</li>
<li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Category of find: </span>${colourant[0].categoryOfFind}</li>
<li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Archeological context: </span>${colourant[0].archeologicalContext}</li>
<li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Notes: </span>${colourant[0].notes}</li>
<li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Analytical techniques: </span>${colourant[0].analyticalTechniques}</li>
<li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> References: </span>${colourant[0].references}</li>
<li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Address: </span>${colourant[0].location.address}</li>
<li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Coordinates: </span>${colourant[0].location.coordinates}</li>
<li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Certain provenance: </span>${colourant[0].location.certainProvenance}</li>
<li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Contributor: </span>${colourant[0].contributor.firstName} ${colourant[0].contributor.lastName}</li>
<li class="details__item"><span class="details__icon">&#9677;</span><span class="details__header"> Affiliation: </span>${colourant[0].contributor.affiliation}</li>
</ul>
</div>`;
  main.insertAdjacentHTML("afterbegin", markup);
};

export { displayDetails, closeDetailsWindow };
