/* eslint-disable*/
import { showAlert } from "./alert.js";
const logout = async () => {
  try {
    const url = `${window.location.origin}/api/v1/users/logout`;
    const res = await fetch(url);
    if (res.ok) {
      showAlert("You have successfully logged out", "success", 1);
      window.setTimeout(() => {
        location.assign("/");
      }, 1000);
    }
  } catch (err) {
    showAlert("Something went wrong, please try again!", "error", 5);
  }
};

window.addEventListener("load", async (e) => {
  await logout();
});
