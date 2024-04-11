const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");
const router = express.Router();
router.use(authController.isUserLoggedIn);
router.route("/").get(viewsController.getView);
router.route("/login").get(viewsController.getLoginForm);
router.route("/logout").get(viewsController.getLogoutPage);
router.route("/signUp").get(viewsController.getSignupForm);
router.route("/forgotPassword").get(viewsController.getForgotPasswordForm);
router.route("/resetPassword").get(viewsController.getResetPasswordForm);
router.route("/map").get(viewsController.getMapPage);
router.route("/contact").get(viewsController.getContactPage);
router.route("/newEntry").get(viewsController.getNewEntryForm);
router.route("/glossary").get(viewsController.getGlossary);
router
  .route("/myAccount")
  .get(authController.restrict, viewsController.getMyAccount);
router
  .route("/updateEntry")
  .get(authController.restrict, viewsController.getUpdateEntryForm);
router
  .route("/entries")
  .get(authController.isUserLoggedIn, viewsController.getEntriesTable);
router
  .route("/createResetUrl")
  .get(authController.restrict, viewsController.getCreateResetUrl);
module.exports = router;

// using nodmailer and sendgrid
// router.route("/verifyAccount").get(viewsController.getVerifyAccountPage);
