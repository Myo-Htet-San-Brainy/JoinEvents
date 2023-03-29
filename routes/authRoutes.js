const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  sendVerificationEmailLink,
} = require("../controllers/authController");
const auth = require("../middleware/authentication");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(auth, logout);
router.route("/verifyEmail").post(verifyEmail);
router.route("/verifyEmail").post(verifyEmail);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword").post(resetPassword);
router.route("/sendVerificationEmailLink").post(sendVerificationEmailLink);

module.exports = router;
