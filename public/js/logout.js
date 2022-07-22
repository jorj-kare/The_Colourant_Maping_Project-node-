/* eslint-disable*/
import { showAlert } from "./alert.js";
const logout = async () => {
  try {
    const url = " http://127.0.0.1:3000/api/v1/users/logout";
    const res = await fetch(url);
    if (res.ok) {
      window.setTimeout(() => {
        location.assign("/");
      }, 500);
    }
  } catch (err) {
    showAlert("Something went wrong, please try again!",'error',5);
  }
};

window.addEventListener("load", async e=>{
  await logout();
});
