/*eslint-disable */
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");
import { showAlert } from "./alert.js";

const verifyAccount = async (token) => {
  try {
    const url = `${window.location.origin}/api/v1/users/verifyAccount`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    else {
      showAlert("Your account is verified, you can now login", "success", 2);
      window.setTimeout(() => {
        location.assign("/login");
      }, 2000);
    }
  } catch (err) {
    showAlert(err.message, "error", 5);
    window.setTimeout(() => {
      location.assign("/");
    }, 5000);
  }
};

window.addEventListener("load", async (e) => {
  await verifyAccount(token);
  document.querySelector(".header").style.display = "none";
  document.querySelector(".footer").style.display = "none";
});
