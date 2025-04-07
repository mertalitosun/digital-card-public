const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

const isAuth = require("../middlewares/auth");
const {isCustomer} = require("../middlewares/isAccess");


router.get("/dashboard/my-account",isAuth,isCustomer,userController.get_my_account);


module.exports = router;