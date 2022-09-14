const data = {
  pigments: [
    "egyptian blue",
    "charcoal",
    "red earth",
    "green earth",
    "azurite",
    "cinnabar",
    "brown ochre",
    "calcium carbonate",
    "calcium sulfate",
    "copper salts",
    "egyptian green",
    "galena",
    "green earth",
    "Han blue",
    "Han purple",
    "huntine",
    "indigo",
    "kaolinite",
    "kermes",
    "lazurite",
    "lead white",
    "madder",
    "malachite",
    "manganese oxide",
    "Maya blue",
    "murex purple",
    "orpiment",
    "realgar",
    "red lead",
    "red earth",
    "carbon black",
    "verdigris",
    "yellow earth",
    "other",
  ],
  techniques: [
    "p-XRF",
    "NIR",
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
    "wall painting",
    "sculpture",
    "pottery",
    "dyestuff",
    "deposit",
    "unused pigment",
    "other",
  ],
  chronologies: [
    -5000, -4000, -3000, -2000, -1000, -900, -800, -700, -600, -500, -400, -300,
    -200, -100, 0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100,
    1200, 1300, 1400, 1500,
  ],
};

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
  res.status(200).render("entries", { data });
};
