const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer");

const isAuth = require("../middlewares/auth");

const {upload} = require("../helpers/multer");

// ekstra buton işlemleri
router.delete("/dashboard/delete-button",isAuth,customerController.delete_button);
router.post("/dashboard/create-button",isAuth,customerController.post_buttons);
router.get("/dashboard/create-button",isAuth,customerController.get_buttons);
router.post("/dashboard/edit-button",isAuth,customerController.update_button_details);
router.get("/dashboard/edit-button",isAuth,customerController.get_button_details);

//resim silme
router.post("/dashboard/delete-images",isAuth,customerController.delete_profile_images);


//alan detay işlemleri
router.delete("/dashboard/delete-section-detail",isAuth,customerController.delete_section_details);
router.post("/dashboard/edit-section-detail",isAuth,customerController.update_section_details);
router.get("/dashboard/edit-section-detail",isAuth,customerController.get_section_details);
router.post("/dashboard/create-section-detail",isAuth,customerController.post_create_section_detail);
router.get("/dashboard/create-section-detail",isAuth,customerController.get_create_section_detail);


//alan işlemleri
router.post("/dashboard/edit-section",isAuth,customerController.update_section_title);
router.get("/dashboard/edit-section",isAuth,customerController.get_section_title);
router.delete("/dashboard/delete-section",isAuth,customerController.delete_section);
router.post("/dashboard/create-section",isAuth,customerController.post_create_section);
router.get("/dashboard/create-section",isAuth,customerController.get_create_section);

router.post("/dashboard/customer-card-details/:cardCode",isAuth,customerController.post_card_details);
router.get("/dashboard/customer-card-details/:cardCode",isAuth,customerController.get_card_details);

router.post("/dashboard/create-profile",isAuth,upload.fields([{name:"profileImage",maxCount:1},{name:"backgroundImage",maxCount:1}]),customerController.post_create_profile); //Profil Oluşturma
router.get("/dashboard/create-profile",isAuth,customerController.get_create_profile); //Profil Oluşturma

router.get("/dashboard/check-slug/:slug",isAuth,customerController.get_check_slug); //slug kontrolü 

router.post('/dashboard/activation-card',isAuth,customerController.post_activation_card); //Kart Aktivasyon
router.get('/dashboard/activation-card',isAuth,customerController.get_activation_card); //Kart Aktivasyon

router.post('/dashboard/customer-profile-details/:profileCode/edit',isAuth,upload.fields([{name:"profileImage",maxCount:1},{name:"backgroundImage",maxCount:1}]),customerController.update_profile_details); //Profil Güncelleme

router.get('/dashboard/customer-profile-details/:profileCode',isAuth,customerController.get_profile_details); //Profil Detay

router.post("/dashboard/customer-details/:profileCode",isAuth,customerController.delete_profile); //Profil Sil



router.get("/tag/:slug",customerController.get_digitalCard);
router.get("/cardCode/:cardCode",customerController.get_digitalCardCode);


module.exports = router;
