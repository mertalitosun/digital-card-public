const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");


router.get("/dijital-arac-etiketi",homeController.get_digital_car_ticket);
router.get("/evcil-hayvan-tag",homeController.get_pet_tag);
router.get("/dijital-kartvizit",homeController.get_dijital_kartvizit);
router.get("/sitemap.xml",homeController.get_sitemap);
router.get("/",homeController.index);
module.exports = router;
