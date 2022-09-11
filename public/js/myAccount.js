/* eslint-disable */
import { showAlert } from "./alert.js";

// ELEMENTS
const btnDeleteAccount = document.getElementById("deleteAccount");
const btnUpdateAccount = document.getElementById("updateAccount");
const btnChangePassword = document.getElementById("changePassword");
const accountBox = document.querySelector(".account");
const background = document.querySelector(".background");
const accountForm = document.querySelector(".account__form");
const btnEdit = document.querySelectorAll(".btn--small");
const inputsFields = document.querySelectorAll(".form__input");

// FUNCTIONS
const editInput = () => {
  btnEdit.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const currentInput = btn.previousElementSibling;
      const value = currentInput.value;
      currentInput.value = "";
      currentInput.value = value;
      currentInput.disabled = false;
      currentInput.focus();
    })
  );

  inputsFields.forEach((input) =>
    input.addEventListener("focusout", (e) => {
      input.disabled = true;
    })
  );
};
const updateAccount = async (userData) => {
  try {
    const url = `${window.location.origin}/api/v1/users/myAccount`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }
    if (data.status === "success") {
      showAlert("Your account have been updated.", "success", 3);
      setTimeout(() => {
        location.reload();
      }, 3000);
    }
  } catch (err) {
    showAlert(err, "error", 5);
  }
};

const updatePassword = async (
  currentPassword,
  newPassword,
  passwordConfirm
) => {
  try {
    const url = `${window.location.origin}/api/v1/users/updateMyPassword`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        passwordConfirm,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    } else if (data.status === "success")
      showAlert("Your password have been updated.", "success", 3);
    setTimeout(() => {
      location.reload();
    }, 3000);
  } catch (err) {
    showAlert(err, "error", 5);
  }
};
const hideShowForm = (...elements) => {
  elements.forEach((el) => el.classList.toggle("u-hidden"));
};
const passwordFade = (accountForm, passwordForm) => {
  accountForm.classList.add("u-fade-in");
  accountForm.classList.remove("u-fade-out");
  passwordForm.classList.add("u-fade-out");
  passwordForm.classList.remove("u-fade-in");
};
const accountFade = (accountForm, passwordForm) => {
  passwordForm.classList.add("u-fade-in");
  passwordForm.classList.remove("u-fade-out");
  accountForm.classList.add("u-fade-out");
  accountForm.classList.remove("u-fade-in");
};

editInput();

// const deleteAccount = async () => {
//   try {
//     const url = "http://127.0.0.1:3000/api/v1/users/myAccount";
//     const res = await fetch(url, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!res.ok) {
//       throw new Error(data.message);
//     } else showAlert("Your account have been deleted.",'success,3);
//   } catch (err) {
//     showAlert(err,'error',5);
//   }
// };

// EVENTS LISTENERS

// Update account
btnUpdateAccount.addEventListener("click", (e) => {
  e.preventDefault();
  const userData = {
    email: document.getElementById("email").value,
    username: document.getElementById("username").value,
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    affiliation: document.getElementById("affiliation").value,
  };
  updateAccount(userData);
});

// Show form Change password
btnChangePassword.addEventListener("click", (e) => {
  e.preventDefault();
  const markup = `<div class="password__form form-box u-hidden">
  <button class="btn btn--small btn--close">⇽</button>
  <h2 class="h2" >My password</h2> 
  <h3 class="h3"> Here you can change your password.</h3>
  <form class='form '>  
    <div class='form__group'>
      <label class='form__label' for='currentPassword'> Current password</label>
      <input class='form__input form__input--validate' id="currentPassword" minlength="5" required placeholder="••••••••" type="password">
    </div>
    <div class='form__group'>
    <label class='form__label' for='newPassword'> New password</label>
      <input class='form__input form__input--validate' id="newPassword" minlength="5" required placeholder="••••••••" type="password">
    </div>
    <div class='form__group'>
    <label class='form__label' for='passwordConfirm'> Confirm password</label>
      <input class='form__input form__input--validate' id="passwordConfirm" minlength="5" required placeholder="••••••••" type="password">
    </div>
    <button class="btn btn--animate u-mrg-top-s" id='updatePassword' type="submit"> Update password</button>
  </form> </div>
`;

  accountBox.insertAdjacentHTML("afterbegin", markup);
  const btnUpdatePassword = document.getElementById("updatePassword");
  const btnClose = document.querySelector(".btn--close");
  const passwordForm = document.querySelector(".password__form");

  accountFade(accountForm, passwordForm);
  hideShowForm(passwordForm, accountForm);

  // Update password
  btnUpdatePassword.addEventListener("click", (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;

    updatePassword(currentPassword, newPassword, passwordConfirm);
  });

  btnClose.addEventListener("click", function (e) {
    passwordFade(accountForm, passwordForm);
    hideShowForm(accountForm, passwordForm);
  });
});

// // Delete account
// btnDeleteAccount.addEventListener("click", (e) => {
//   if (confirm("Are you sure that you wont delete your account?")) {
//     deleteAccount();
//     window.setTimeout(() => {
//       location.assign("/");
//     }, 1000);
//   }
// });
