/*eslint-disable */
const form = document.querySelector("form");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const token = urlParams.get("token");
let userId;



const resetPassword = async (password, passwordConfirm, userId) => {
  try {
    const url = `http://127.0.0.1:3000/api/v1/users/resetPassword`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, passwordConfirm, userId }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);
    if (data.status === "success") {
      alert( data.message );
      window.setTimeout(() => {
        location.assign("/login");
      }, 1000);
    }
  } catch (err) {
    alert(err.message);
  }
};

const isTokenValid = async (token) => {
  try {
    const url = `http://127.0.0.1:3000/api/v1/users/resetPassword`;
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
    },10 * 60 * 1000 );
  } catch (err) {
    alert(err.message);
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
