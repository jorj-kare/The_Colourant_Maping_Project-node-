const nav = document.querySelector(".nav");
const body = document.querySelector("body");
const navBtn = document.querySelector(".header__nav-icon");
const mediaQuery = window.matchMedia("(min-width: 768px)");

// Functions
const hideNavbar = (sec) => {
  nav.classList.add("u-transparent");
  window.setTimeout(() => {
    nav.classList.add("u-hidden");
  }, sec);
};
const showNavbar = (sec) => {
  nav.classList.remove("u-hidden");
  window.setTimeout(() => {
    nav.classList.remove("u-transparent");
  }, sec);
};

// Events Listeners
const events = ["load", "resize"];
events.forEach((event) => {
  window.addEventListener(event, (e) => {
    if (window.getComputedStyle(navBtn).display === "none") showNavbar();
    else hideNavbar();
  });
});

body.addEventListener("click", (e) => {
  if (window.getComputedStyle(navBtn).display === "none") return;
  if (!e.target.className.includes("nav")) hideNavbar(200);
  if (e.target.classList.contains("header__nav-icon")) {
    if (window.getComputedStyle(nav).display === "none") showNavbar(50);
    else hideNavbar(200);
  }
});
