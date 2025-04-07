const express = require("express")
const router = express.Router();

const authController = require("../controllers/auth");
const isAuth = require("../middlewares/auth");

router.post("/password-reset",authController.post_password_reset);
router.get("/password-reset",authController.get_password_reset);

router.post("/forgot-password",authController.post_forgot_password);
router.get("/forgot-password",authController.get_forgot_password);

router.get("/password-change",isAuth, authController.get_password_change);
router.post("/password-change",isAuth, authController.post_password_change);

router.get("/register", authController.get_register);
router.post("/register", authController.post_register);

router.get("/login", authController.get_login);
router.post("/login", authController.post_login);

router.get("/logout", authController.get_logout);


module.exports = router;