const data = {
  pigments: [
    "egyptian-blue",
    "charcoal",
    "red-earth",
    "green-earth",
    "azurite",
    "cinnabar",
    "other",
  ],
  techniques: [
    "p-XRF",
    "NIRR",
    "XRF",
    "OM",
    "MSI",
    "Raman",
    "SEM",
    "SEM-EDS",
    "FTIR",
    "FORS",
    "HSI",
    "other",
  ],
  categoryOfFind: [
    "wall-painting",
    "sculpture",
    "pottery",
    "dyestuff",
    "deposit",
    "unused-pigment",
    "other",
  ],
  chronologies: [
    -5000, -4000, -3000, -2000, -1000, -900, -800, -700, -600, -500, -400, -300,
    -200, -100, 0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000,
  ],
};
const Colourant = require("../models/colourantModel");

exports.getView = (req, res) => {
  res.status(200).render("overview");
};

exports.getLoginForm = (req, res) => {
  res.status(200).render("login");
};
exports.getLogoutPage = (req, res) => {
  res.status(200).render("logout");
};

exports.getSignupForm = (req, res) => {
  res.status(200).render("signUp");
};

exports.getForgotPasswordForm = (req, res) => {
  res.status(200).render("forgotPassword");
};
exports.getResetPasswordForm = (req, res) => {
  res.status(200).render("resetPassword");
};
exports.getMyAccount = (req, res) => {
  res.status(200).render("myAccount");
};
exports.getNewEntryForm = (req, res) => {
  res.status(200).render("newEntry", { data });
};

exports.getMapPage = async (req, res) => {
  res.status(200).render("map", { data });
};

exports.getUpdateEntryForm = (req, res) => {
  res.status(200).render("updateEntry", { data });
};

exports.getContactPage = (req, res) => {
  res.status(200).render("contact");
};

exports.getEntriesTable = async (req, res) => {
  const filters = [{}];
  if (!req.user || (req.user && req.user.role !== "admin")) {
    filters.push = { checked: true };
  }
  const entries = await Colourant.aggregate([
    { $unwind: "$pigment" },
    { $match: { $and: filters } },
    { $sort: { createdAt: -1 } },
  ]);
  await Colourant.populate(entries, {
    path: "contributor",
  });
  // console.log(entries);
  res.status(200).render("entries", { entries });
};
