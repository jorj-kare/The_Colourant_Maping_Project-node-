/* eslint-disable */
import { showAlert } from "./alert.js";

const form = document.querySelector("form");
const tokenBox = document.querySelector(".form-box");
const createResetUrl = async (email) => {
  try {
    const url = `${window.location.origin}/api/v1/users/createResetUrl`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    console.log(data.token);

    if (!res.ok) throw new Error(data.message);

    if (data.status === "success") {
      const markup = `<textarea class="form__input form__input--border" rows=2>${data.token}</textarea>`;
      tokenBox.insertAdjacentHTML("beforeend", markup);
      showAlert(data.message, "success", 3);
    }
  } catch (err) {
    showAlert(err.message, "error", 5);
  }
};
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  createResetUrl(email);
});
