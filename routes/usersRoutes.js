const express = require("express");
const authController = require("../controllers/authController");
const usersController = require("../controllers/usersController");

const router = express.Router();

// using nodmailer and sendgrid
// router.route("/verifyAccount").post(authController.verifyAccount);
// router.route("/forgotPassword").post(authController.forgotPassword);

router.route("/signUp").post(authController.signUp);
router.route("/login").post(authController.login);
router.route("/logout").get(authController.logout);
router
  .route("/resetPassword")
  .patch(authController.resetPassword)
  .post(authController.isTokenValid);
router.use(authController.restrict);
router.route("/myAccount").patch(usersController.updateMyAccount);
router.route("/updateMyPassword").patch(authController.updateMyPassword);
router
  .route("/createResetUrl")
  .post(authController.restrictTo("admin"), authController.createResetUrl);
module.exports = router;
