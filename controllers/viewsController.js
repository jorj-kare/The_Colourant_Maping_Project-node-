const data = {
  colourants: [
    "azurite",
    "brown ochre",
    "charcoal",
    "calcium carbonate",
    "calcium sulfate",
    "green earth",
    "carbon black",
    "cinnabar",
    "copper salts",
    "Egyptian blue",
    "Egyptian green",
    "galena",
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
    "verdigris",
    "yellow earth",
    "other",
  ],
  techniques: [
    ["CT", "computed tomography"],
    ["FORS", "fiber optics reflectance spectroscopy"],
    ["FTIR", "Fourier transform infrared spectroscopy"],
    ["HSI", "Hyperspectral imaging"],
    ["ICP-MS", "inductively coupled plasma mass spectrometry"],
    ["IRR", "infrared reflectography"],
    [
      "MC-ICP-MS",
      "multicollector-Inductively Coupled Plasma Mass Spectrometer",
    ],
    ["Microprobe", ""],
    ["Mass spectrometry imaging", ""],
    ["MSI", "Multispectral imaging"],
    ["NIR", "near-infrared spectroscopy"],
    ["OM", "optical microscopy"],
    ["p-XRF", "portable X-ray fluorescence spectroscopy"],
    ["Raman spectroscopy", ""],
    ["SEM", "scanning electron microscopy"],
    [
      "SEM-EDS",
      "scanning electron microscopy-energy dispersive X-ray spectroscopy",
    ],
    ["SERS", "surface enhanced Raman spectroscopy"],
    ["XRD", "X-ray diffraction"],
    ["XRF", "X-ray fluorescence spectroscopy (laboratory)"],
    ["other", ""],
  ],

  categoryOfFind: [
    "Wall painting (secco)",
    "Wall painting (fresco)",
    "Wall painting (mezzo fresco)",
    "Sculpture",
    "Figurine",
    "Textile",
    "Rock art",
    "Panel painting",
    "Manuscript",
    "glass",
    "humans remains",
    "Unused colourant",
    "Raw material",
    "other",
  ],
  chronologies: [
    -5000, -4500, -4000, -3500, -3000, -2900, -2800, -2700, -2600, -2500, -2400,
    -2300, -2200, -2100, -2000, -1900, -1800, -1700, -1600, -1500, -1400, -1300,
    -1200, -1100, -1000, -900, -800, -700, -600, -500, -400, -300, -200, -100,
    0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300,
    1400, 1500, 1600, 1700, 1800,
  ],
  tooltipText: {
    provenience:
      " Have the colourants been excavated and is the archaeological context or provenance known with certainty? Then you can select the exact location on the map. The coordinates are filled out automatically.In cases of uncertain origin, please select “uncertain provenance” from the drop down menu. Now the coordinates are disactivated and a text field appears where details about the possible provenance can be entered. Has provenance research been carried out? If the possible sources of colourants have been identified, the relevant details can be provided in the “notes” section below. ",

    categoryOfFind:
      "In which category of finds does the identified colourant fall into? ",

    colourants:
      "Select the identified colourant(s). Please consult “colourant glossary” section for coherent descriptions of each term. If your colourants are not included among the pre-defined selections, click on other. A free text field will appear, where you can enter the name of the colourant. If more than one colourants shall be included in “other”, separate each entry with a comma. ",
    chronology:
      "Please provide dating for the colourants based on archaeological or other evidence. Select the earliest (from) and latest (to) possible dates. In the case of more precise dating than centuries, please provide the relevant information in the “archaeological context” field below. ",

    analyticalTechniques:
      "Select the analytical technique(s) used to characterise the colourant(s). Hover over the abbreviations for the full name of the technique.If other techniques were used, please specify. More than one techniques can be added in the “other” field, separated by comma. ",
    archeologicalContext:
      "Please provide a description of the archaeological context and any further relevant information.",
    references:
      "We recommend using the APA 7th Edition reference style. Please include:For books: Author(s) last name, first name initial. (YEAR). Title. Publishing house. Doi (if available)For journal articles: Author(s) last name, first name initial. (YEAR). Title. Journal, volume (issue), pages, DOI. Please consult https://apastyle.apa.org/style-grammar-guidelines/references/examples for further information.",
    notes: "Additional information or clarifications can be added here.",
    log: " Please, briefly describe the changes made during the edit (e.g., updated references, corrected coordinates, etc.)",
  },
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
