const express = require("express");
const authController = require("../controllers/authController");
const usersController = require("../controllers/usersController");

const router = express.Router();

router.route("/signUp").post(authController.signUp);
router.route("/login").post(authController.login);
router.route("/logout").get(authController.logout);
router.route("/forgotPassword").post(authController.forgotPassword);
router
  .route("/resetPassword")
  .patch(authController.resetPassword)
  .post(authController.isTokenValid);
router.use(authController.restrict);
router.route("/myAccount").patch(usersController.updateMyAccount);
router.route("/updateMyPassword").patch(authController.updateMyPassword);
module.exports = router;
