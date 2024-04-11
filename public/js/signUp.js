/* eslint-disable*/
import { showAlert, showConfirm } from "./alert.js";
const form = document.querySelector(".form");

const signUp = async (userData) => {
  try {
    const url = `${window.location.origin}/api/v1/users/signUp`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    if (data.status === "success") {
      await showConfirm("Congratulations, you have now created an account!");
      location.assign("/");
    }
  } catch (err) {
    showAlert(err.message, "error", 5);
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {
    email: document.getElementById("email").value,
    username: document.getElementById("username").value,
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    affiliation: document.getElementById("affiliation").value,
    password: document.getElementById("password").value,
    passwordConfirm: document.getElementById("passwordConfirm").value,
  };

  signUp(data);
});
