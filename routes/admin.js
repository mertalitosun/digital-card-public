const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");

const isAuth = require("../middlewares/auth");
const {isAdmin} = require("../middlewares/isAccess");



router.get("/admin/panel",isAuth,isAdmin,adminController.admin_panel);

router.delete("/admin/cards",isAuth,isAdmin,adminController.delete_cards); //Kart Sil

router.get("/admin/generate-cardCode",isAuth,isAdmin,adminController.generate_cardCode); //Kart Kodu Oluştur

router.post("/admin/create-card",isAuth,isAdmin,adminController.post_create_card); //Kart Oluştur
router.get("/admin/create-card",isAuth,isAdmin,adminController.get_create_card); //Kart Oluştur

router.get("/admin/cards",isAuth,isAdmin,adminController.get_cards); //Kart Listele

router.get("/admin/customer-details/:userId",isAuth,isAdmin,adminController.get_customer_details); //Kullanıcı Detay
router.get("/admin/customers",isAuth,isAdmin,adminController.get_customers); //Müşteriler Listesi

module.exports = router;