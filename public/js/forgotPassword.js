/*eslint-disable */
import { showAlert } from "./alert.js";
const form = document.querySelector("form");
const forgotPassword = async (email) => {
  try {
    const url = " http://127.0.0.1:3000/api/v1/users/forgotPassword";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    if (data.status === "success") {
      showAlert(data.message,'success',3);
      window.setTimeout(() => {
        location.assign("/");
      }, 1000);
    }
  } catch (err) {
    console.log(err);
    showAlert(err.message,'error',5);
  }
};
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  forgotPassword(email);
});
