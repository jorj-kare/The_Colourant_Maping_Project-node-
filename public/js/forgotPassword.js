/*eslint-disable */
import { showAlert } from "./alert.js";
const form = document.querySelector("form");
const forgotPassword = async (email) => {
  try {
    const url = `${window.location.origin}/api/v1/users/forgotPassword`;
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
      showAlert(data.message, "success", 3);
      window.setTimeout(() => {
        location.assign("/");
      }, 3000);
    }
  } catch (err) {
    showAlert(err.message, "error", 5);
  }
};
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  forgotPassword(email);
});
