const express = require("express");
const colourantsController = require("../controllers/colourantsController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(authController.restrict, colourantsController.createColourant)
  .get(authController.isUserLoggedIn, colourantsController.getColourants)
  .patch(authController.restrict, colourantsController.updateColourant);

router
  .route("/exportData")
  .get(authController.isUserLoggedIn, colourantsController.exportDataToCsv);

router.route("/:id").get(colourantsController.getColourant);

module.exports = router;
