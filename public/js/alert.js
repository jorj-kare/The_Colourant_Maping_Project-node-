export const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};

export const showAlert = (msg, type, sec) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(() => hideAlert(), 1000 * sec);
};

const hideConfirm = () => {
  const el = document.querySelector(".confirm");
  if (el) el.parentElement.removeChild(el);
};
export const showConfirm = (msg, cancelBtn = false) => {
  hideConfirm();
  const body = document.querySelector("body");
  body.style.overflow = "hidden";
  const markup = `<div class="confirm"><div class = "confirm__wrapper">
  ${msg}
  <div class="confirm__btn"> 
  <button class="btn btn--dark btn--animate" id="btn-ok" type="button"> ok </button>
  </div>
  </div></div>`;
  body.insertAdjacentHTML("afterbegin", markup);
  if (cancelBtn) {
    const btnEl = ` <button class="btn btn--dark btn--animate" id="btn-cancel" type="button"> cancel </button>`;
    document
      .querySelector(".confirm__btn")
      .insertAdjacentHTML("afterbegin", btnEl);
  }
  return new Promise((resolve, reject) => {
    document.querySelector(".confirm").addEventListener("click", (e) => {
      if (e.target.id === "btn-ok") {
        hideConfirm();
        body.removeAttribute("style");
        resolve(true);
      }
      if (e.target.id === "btn-cancel") {
        hideConfirm();
        body.removeAttribute("style");
        resolve(false);
      }
    });
  });
};
