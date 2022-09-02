/*eslint-disable */
import { showAlert } from "./alert.js";
const form = document.querySelector("form");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const token = urlParams.get("token");
let userId;

const resetPassword = async (password, passwordConfirm, userId) => {
  try {
    const url = `${window.location.origin}/api/v1/users/resetPassword`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, passwordConfirm, userId }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);
    if (data.status === "success") {
      showAlert(data.message, "success", 3);
      window.setTimeout(() => {
        location.assign("/login");
      }, 1000);
    }
  } catch (err) {
    showAlert(err.message, "error", 5);
  }
};

const isTokenValid = async (token) => {
  try {
    const url = `${window.location.origin}/api/v1/users/resetPassword`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    userId = data.userId;
    window.setTimeout(() => {
      userId = undefined;
    }, 10 * 60 * 1000);
  } catch (err) {
    showAlert(err.message, "error", 5);
    window.setTimeout(() => {
      location.assign("/");
    }, 1000);
  }
};

window.addEventListener("load", (e) => {
  isTokenValid(token);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const password = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("password-confirm").value;
  resetPassword(password, passwordConfirm, userId);
});
