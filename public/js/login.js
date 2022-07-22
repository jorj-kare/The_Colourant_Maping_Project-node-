/* eslint-disable*/
import { showAlert } from "./alert.js";
const form = document.querySelector(".form");

const login = async (username, password) => {
  try {
    const url = " http://127.0.0.1:3000/api/v1/users/login";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    
    if (data.status === "success") {
      showAlert("Login successfully!",'success',5);
      window.setTimeout(() => {
        location.assign("/");
      }, 500);
    }
  } catch (err) {
    showAlert(err.message,'error',5);
  }
};


form.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  login(username, password);
});
