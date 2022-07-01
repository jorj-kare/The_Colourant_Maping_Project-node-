/* eslint-disable*/
const form = document.querySelector(".form");
const signUp = async (
userData
) => {
  try {
    const url = " http://127.0.0.1:3000/api/v1/users/signUp";
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
      alert("Congratulations you have now an account!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1000);
    }
  } catch (err) {
    alert(err.message);
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
