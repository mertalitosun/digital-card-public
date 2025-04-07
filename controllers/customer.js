const Users = require("../models/users");
const Profiles = require("../models/profiles");
const Cards = require("../models/cards");
const Sections = require('../models/sections');
const Details = require('../models/details');
const Buttons = require('../models/buttons');
const crypto = require("crypto");
const slugify = require("slugify");
const {formatName} = require("../helpers/formatName");
const {sendMail} = require("../helpers/nodemailer")

const randomId = (code) => {
    id = crypto.randomBytes(4).toString("hex").toUpperCase();

    return code + id
};
const { Op } = require("sequelize");
const {deleteFile} = require("../helpers/multer");
const QRCode = require("qrcode");
const path = require('path');
const fs = require('fs');

//buton ekle-sil-güncelle
exports.delete_button = async (req, res) => {
  const { sectionCode,buttonCode } = req.query; 
  try {
    const button = await Buttons.findOne({ where: { buttonCode } });

    if (!button) {
      return res.status(404).send("Buton Bulunamadı!");
    }
    await button.destroy();
    res.status(200).json("Silme İşlemi Başarılı");
    
  } catch (err) {
    console.error("Buton silme sırasında hata:", err);
    return res.status(500).send("Sunucu hatası: " + err.message);
  }
};
exports.get_buttons = async (req,res) => {
  try{
    res.render("user/create-button",{
      title: "Buton Ekle",
    })
  }catch(err){
    console.log(err)
    res.status(500).send('Sunucu hatası',err.message);
  }
}
exports.post_buttons = async (req,res) => {
  const { text,url,color } = req.body; 
  const { profileCode } = req.query; 
  try {
    const profile = await Profiles.findOne({
      where: { profileCode },
      include: [{ model: Users },{model:Buttons}],
    });

    if (!profile) {
      return res.status(404).send("Kullanıcı Bulunamadı!");
    }

    if(profile.buttons.length >= profile.max_special_buttons){
      return res.status(400).send(`Maksimum ${profile.max_special_buttons} buton sayısına ulaştınız.`)
    }
    const button = await Buttons.create({
      buttonCode:randomId("BTN"),
      text: text,
      url: url,
      color: color,
      profileId: profile.id,
    });

    res.redirect(`/dashboard/customer-profile-details/${profile.profileCode}`);
  } catch (err) {
    console.error("Bölüm detayı ekleme sırasında hata:", err);
    return res.status(500).send("Sunucu hatası: " + err.message);
  }
}
exports.update_button_details = async (req, res) => {
  const { profileCode, buttonCode } = req.query;
  const {text,url,color} = req.body; 
  try {
    const button = await Buttons.findOne({ where: { buttonCode } });
    if (!button) {
      return res.status(404).send("Buton bulunamadı!");
    }

    button.text = text;
    button.url = url;
    button.color = color;
    button.save();
    res.redirect(`/dashboard/customer-profile-details/${profileCode}`);
  } catch (err) {
    console.error("Güncelleme sırasında hata:", err);
    res.status(500).send("Sunucu hatası. Güncelleme işlemi başarısız.");
  }
};
exports.get_button_details = async (req,res) => {
  const {profileCode,buttonCode} = req.query;
  try{
    const profile = await Profiles.findOne({where:{profileCode},include:[{model:Users}]});
    const button = await Buttons.findOne({where:{buttonCode,profileId:profile.id}});

    if(!button){
      res.status(404).send("button Bulunamadı!")
    }
    
    res.render("user/button-details",{
      title: "Buton Düzenle",
      button,
    })
  }catch(err){
    console.log(err)
    res.status(500).send('Sunucu hatası',err.message);
  }
}

//Profile Görüntülüme - kartvizit
exports.get_digitalCard = async (req,res) => {
  const {slug} = req.params;
  try{
    const profile = await Profiles.findOne({where:{slug,},include:[{model:Users},{model:Sections,include:{model:Details}},{
      model: Cards,
      where: { profileId: { [Op.not]: null }, isActive:true }, 
    },{model:Buttons}]});
    
    if (!profile) {
      return res.status(404).redirect("/");
    }
    res.render("user/profileView",{
      title: profile.name + " " + profile.surname,
      profile
    })
  }catch(err){
    console.log(err);
  }
}
exports.get_digitalCardCode = async (req,res) => {
  const {cardCode} = req.params;
  try{
    const card = await Cards.findOne({where:{cardCode, isActive:true,  profileId: { [Op.not]: null }},include:[{model:Users},{model:Profiles}]});
    if(!card){
      return res.status(404).redirect("/")
    }
    const slug = card.profile.slug;
    res.redirect(`/tag/${slug}`);
  }catch(err){
    console.log(err);
  }
}

// slug kontrolü
exports.get_check_slug = async (req, res) => {
  const { slug } = req.params;
  try {
      const existingProfile = await Profiles.findOne({ where: { slug } });
      if (existingProfile) {
        return res.json({ isAvailable: false });
      }
      return res.json({ isAvailable: true });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Bir hata oluştu.' });
  }
};

//Alan detayı ekle-sil-güncelle
exports.delete_section_details = async (req,res) => {
  const { sectionCode,profileCode,detailCode } = req.query; 
  try {
    const detail = await Details.findOne({ where: { detailCode } });

    if (!detail) {
      return res.status(404).send("Bölüm Bulunamadı!");
    }
    await detail.destroy();
    res.status(200).json("Silme İşlemi Başarılı");
    
  } catch (err) {
    console.error("Detay silme sırasında hata:", err);
    return res.status(500).send("Sunucu hatası: " + err.message);
  }
}
exports.update_section_details = async (req, res) => {
  const { profileCode, sectionCode } = req.query;
  const {details} = req.body; 

  try {
    const section = await Sections.findOne({ where: { sectionCode } });
    if (!section) {
      return res.status(404).send("Bölüm bulunamadı!");
    }

    const updatePromises = Object.entries(details).map(async ([originalName, detailData]) => {
      const { name, value, url } = detailData; 

      await Details.update(
        { name, value, url }, 
        { where: { name: originalName, sectionId: section.id } }
      );
    });

    await Promise.all(updatePromises);

    res.redirect(`/dashboard/customer-profile-details/${profileCode}`);
  } catch (err) {
    console.error("Güncelleme sırasında hata:", err);
    res.status(500).send("Sunucu hatası. Güncelleme işlemi başarısız.");
  }
};
exports.get_section_details = async (req,res) => {
  const {profileCode,sectionCode} = req.query;
  try{
    const profile = await Profiles.findOne({where:{profileCode},include:[{model:Users}]});
    const section = await Sections.findOne({where:{sectionCode},include:[{model:Details}]});
    console.log(section.details.length)
    if(!profile){
      res.status(404).send("Kullanıcı Bulunamadı!")
    }
    
    res.render("user/section-detail-details",{
      title: "Alan Detayı Düzenle",
      profile,
      section
    })
  }catch(err){
    console.log(err)
    res.status(500).send('Sunucu hatası',err.message);
  }
}
exports.post_create_section_detail = async (req,res) => {
  const { sectionDetailName,sectionDetailLink,sectionDetailValue } = req.body; 
  const { profileCode,sectionCode } = req.query; 
  try {

    const profile = await Profiles.findOne({
      where: { profileCode },
      include: [{ model: Users }],
    });

    const section = await Sections.findOne({
      where: { sectionCode }, include:{model:Details}
    });

    if (!profile) {
      return res.status(404).send("Kullanıcı Bulunamadı!");
    }

    if (!section) {
      return res.status(404).send("Böyle bir alan bulunamadı!");
    }

    if(section.details.length >= section.max_details){
      return res.status(400).send(`Maksimum ${section.max_details} detay sayısına ulaştınız.`)
    }

    const newSectionDetail = await Details.create({
      detailCode:randomId("DTL"),
      name: sectionDetailName,
      url: sectionDetailLink,
      value: sectionDetailValue,
      sectionId: section.id,
    });

    res.redirect(`/dashboard/customer-profile-details/${profile.profileCode}`);
  } catch (err) {
    console.error("Bölüm detayı ekleme sırasında hata:", err);
    return res.status(500).send("Sunucu hatası: " + err.message);
  }
}
exports.get_create_section_detail = async (req,res) => {
  const {profileCode,sectionCode} = req.query;
  try{
    const profile = await Profiles.findOne({where:{profileCode},include:[{model:Users}]});
    const section = await Sections.findOne({where:{sectionCode}});
    
    if(!profile){
      res.status(404).send("Kullanıcı Bulunamadı!")
    }
    
    res.render("user/create-section-detail",{
      title: "Yeni Alan Detayı",
      profile,
      section
    })
  }catch(err){
    console.log(err)
    res.status(500).send('Sunucu hatası',err.message);
  }
}


//Alan ekle-sil-gücelle
exports.update_section_title = async (req,res) => {
  const { profileCode, sectionCode } = req.query;
  const {sectionTitle} = req.body; 

  try {
    const section = await Sections.findOne({ where: { sectionCode } });
    if (!section) {
      return res.status(404).send("Bölüm bulunamadı!");
    }

    section.title = sectionTitle;
    await section.save();
    res.redirect(`/dashboard/customer-profile-details/${profileCode}`);
  } catch (err) {
    console.error("Güncelleme sırasında hata:", err);
    res.status(500).send("Sunucu hatası. Güncelleme işlemi başarısız.");
  }
}
exports.get_section_title = async (req,res) => {
  const {sectionCode,profileCode} = req.query;
  try{
    const section = await Sections.findOne({where:{sectionCode}});
    if(!section){
      res.status(404).send("Kullanıcı Bulunamadı!")
    }
    res.render("user/section-details",{
      title: "Alan Adı Düzenle",
      section,
    })
  }catch(err){
    console.log(err)
    res.status(500).send('Sunucu hatası',err.message);
  }
}
exports.delete_section = async (req, res) => {
  const { sectionCode,profileCode } = req.query; 
  try {
    const section = await Sections.findOne({ where: { sectionCode } });

    if (!section) {
      return res.status(404).send("Bölüm Bulunamadı!");
    }
    await section.destroy();
    res.status(200).json("Silme İşlemi Başarılı");
    
  } catch (err) {
    console.error("Bölüm silme sırasında hata:", err);
    return res.status(500).send("Sunucu hatası: " + err.message);
  }
};
exports.post_create_section = async (req, res) => {
  const { sectionName } = req.body; 
  const { profileCode } = req.query; 
  try {
    const profile = await Profiles.findOne({
      where: { profileCode },
      include: [{ model: Users },{model:Sections}],
    });

    if (!profile) {
      return res.status(404).send("Kullanıcı Bulunamadı!");
    }

    if(profile.sections.length >= profile.max_sections){
      return res.status(400).send(`Maksimum ${profile.max_sections} bölüm ekleme sayısına ulaştınız.`)
    }

    const newSection = await Sections.create({
      sectionCode:randomId("SCTN"),
      title: sectionName,
      profileId: profile.id,
    });

    res.redirect(`/dashboard/customer-profile-details/${profile.profileCode}`);
  } catch (err) {
    console.error("Bölüm ekleme sırasında hata:", err);
    return res.status(500).send("Sunucu hatası: " + err.message);
  }
};
exports.get_create_section = async (req,res) => {
  const {profileCode} = req.query;
  try{
    const profile = await Profiles.findOne({where:{profileCode},include:[{model:Users}]});
    
    if(!profile){
      res.status(404).send("Kullanıcı Bulunamadı!")
    }
    
    res.render("user/create-section",{
      title: "Yeni Alan",
      profile,
    })
  }catch(err){
    console.log(err)
    res.status(500).send('Sunucu hatası',err.message);
  }
}


//kart detay
exports.post_card_details = async (req, res) => {
  const { cardCode } = req.params;
  const { customerCode } = req.query;
  const { profileCode } = req.body;

  try {
    const user = await Users.findOne({ where: { userCode: customerCode }, include: [{ model: Profiles }] });
    const card = await Cards.findOne({ where: { cardCode, userId: user.id } });

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    if (!card) {
      return res.status(404).json({ message: "Kart bulunamadı." });
    }

    if (profileCode === null) {
      await Cards.update(
        { profileId: null },
        { where: { cardCode, userId: user.id } }
      );
      return res.status(200).json({ message: "Profil başarıyla kaldırıldı." });
    }

    const profile = await Profiles.findOne({ where: { profileCode } });
    if (!profile) {
      return res.status(404).json({ message: "Profil bulunamadı." });
    }

    await Cards.update(
      { profileId: profile.id },
      { where: { cardCode, userId: user.id } }
    );

    res.status(200).json({ message: "Profil başarıyla atandı." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası oluştu." });
  }
};
exports.get_card_details = async (req,res) => {
  const {cardCode} = req.params;
  const {customerCode} = req.query;
  try{
    const card = await Cards.findOne({where:{cardCode},include:[{model:Users},{model:Profiles}]});
    const user = await Users.findOne({where:{userCode:customerCode},include:[{model:Profiles}]});
    if(!card){
      res.status(404).send("Kart Bulunamadı!")
    }
    if(!user){
      res.status(404).send("Kullanıcı Bulunamadı!")

    }
    if(card.userId !== user.id ){
      res.status(403).send("Yetkisiz İşlem")
    }
    res.render("user/card-details",{
      title: "Kart Detayı",
      card,
      user
    })
  }catch(err){
    console.log(err)
    res.status(500).send('Sunucu hatası',err.message);
  }
}

//profil oluştur
exports.post_create_profile = async (req, res) => {
  const { title, name, surname, slug, phone, whatsapp,company,companyUrl,career,biography} = req.body;
  const profileImage = req.files.profileImage[0].path || null; 
  const backgroundImage = req.files.backgroundImage[0].path || null;
  const {customerCode} = req.query;
  try {
    const existingProfile = await Profiles.findOne({ where: { slug } });
    if (existingProfile) {
      req.flash('message', { type: 'danger', text: 'Bu slug zaten kullanılıyor.' });
      return res.redirect('/dashboard/create-profile');
    }

    const user = await Users.findOne({where:{userCode:customerCode}, include:{model:Profiles}});

    if(user.profiles.length >= user.digital_card_max_profiles){
      if (req.session.roles.includes("Admin")) {
        return res.redirect(`/admin/customer-details/${user.id}`);
      } else if (req.session.roles.includes("Müşteri")) {
        return res.redirect(`/dashboard/my-account`);
      } else {
        return res.status(403).send('Yetkisiz İşlem');
      }
    }
    const newProfile = await Profiles.create({
      profileCode: randomId('PRF'), 
      title,
      name,
      surname,
      slug: slugify(slug,{remove:/[*+~.()'"!:@]/g}),
      phone:"+90"+phone,
      whatsapp:"+90"+whatsapp,
      profileImage,
      backgroundImage,
      userId:user.id,
      company,
      companyUrl,
      career,
      biography
    });

    //QRCODE
    const qrText = `${req.protocol}://${req.get("host")}/tag/${slug}`;
    const qrCodePath = path.join(__dirname, '..', 'public', 'assets', 'qrcodes', `${newProfile.profileCode}.png`);
    await QRCode.toFile(qrCodePath, qrText);
    newProfile.qrCodePath = `/static/assets/qrcodes/${newProfile.profileCode}.png`;

    //VCARD
    const vCardContent = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${name} ${surname}`,
      `TEL:${phone}`,
      "END:VCARD"
    ].join("\n"); // Dizi elemanlarını birleştirirken her satırda boşluk olmayacak
    

    const vCardPath = path.join(__dirname,"..","public","assets","contact",`${newProfile.profileCode}.vcf`);
    fs.writeFileSync(vCardPath, vCardContent);
    newProfile.vCardPath = `/static/assets/contact/${newProfile.profileCode}.vcf`;
    await newProfile.save();
  
    req.flash('message', { type: 'success', text: 'Profil başarıyla oluşturuldu.' });
    if (req.session.roles.includes("Admin")) {
      return res.redirect(`/admin/customer-details/${user.id}`);
    } else if (req.session.roles.includes("Müşteri")) {
      return res.redirect(`/dashboard/my-account`);
    } else {
      return res.status(403).send('Yetkisiz İşlem');
    }
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      error: 'Profil oluşturulurken bir hata oluştu.',
      msg: error.message,
    });
  }
};
exports.get_create_profile  = async (req,res) => {
  try{
    res.render("user/create-profile",{
      title:"Yeni Profil"
    })
  }catch(error){
    console.error(error);
    res.status(500).send('Sunucu hatası');
  }
}

//kart aktivasyon
exports.post_activation_card = async (req,res) => {
  const { activationCode } = req.body; 
  const {userCode} = req.query
  try {

    // Kart zaten varsa, hatalı durumu kontrol et
    const card = await Cards.findOne({ where: { cardCode:activationCode }, include:[{model:Users}] });
    const user = await Users.findOne({where:{userCode},include:{model:Cards}});

    if(!card){
      return res.render("user/activation-card",{
        title: "Kart Aktivasyon",
        message: {type:"danger", text: "Aktivasyon kodu yanlış!"}
      });
    }
    if (card.userId) {
      return res.render("user/activation-card",{
        title: "Kart Aktivasyon",
        message: {type:"danger", text: "Bu kart zaten aktif!"}
      });
    }

    if(!card.isActive && !card.userId ){
      card.isActive = true;
      card.userId = user.id;
      await card.save();
        (async () => {
          const type = "info"
          const to = user.email
          const subject = "Ürün Aktifleştirildi";
          const templateName = "product-activation";
          const variables = {
              EMAIL_SUBJECT: subject,
              EMAIL_CONTENT : `Ürününüz başarılı bir şekilde aktifleştirildi.`,
              resetLink: `mailto:support@infinitetag.com`,
              resetText : "Destek"
          };
          await sendMail(type, to, subject, templateName, variables);
      })();
    }

    // Kart başarıyla eklendiğinde, yönlendirme yap
    if (req.session.roles.includes("Admin")) {
      res.redirect(`/admin/customer-details/${user.id}`);
    } else if (req.session.roles.includes("Müşteri")) {
      return res.redirect(`/dashboard/my-account`);
    } else {
      return  res.status(403).send('Yetkisiz İşlem');
    }
  } catch (error) {
    console.error(error);
    res.status(500).render("errors/500", {
      title: "Sunucu Hatası",
      error: "Kart eklenirken bir hata oluştu.",
      msg: error.message,
    });
  }
}
exports.get_activation_card = async (req,res) => {

  try{
    res.render("user/activation-card",{
      title:"Kart Aktivasyon"
    })
  }catch(error){
    console.error(error);
    res.status(500).send('Sunucu hatası');
  }
}

//profilde resim sil
exports.delete_profile_images = async (req,res) => {
  const {profileImage,backgroundImage,profileCode} = req.body
  try {
    if (profileImage) {
      const profile = await Profiles.findOne({ where: { profileCode, profileImage } });
      deleteFile(profileImage);
      profile.profileImage = null;
      profile.save();
    }
    if (backgroundImage) {
      const profile = await Profiles.findOne({ where: { profileCode, backgroundImage } });
      deleteFile(backgroundImage);
      profile.backgroundImage = null;
      profile.save();
    }
    return res.status(200).send("Silme işlemi başarılı.");
    
  } catch (err) {
      console.error(err);
      res.status(500).send("Görsel silinirken bir hata oluştu.");
  }
}
//profil güncelle
exports.update_profile_details = async (req, res) => {
  const { profileCode } = req.params;
  const { title, name, surname, phone, whatsapp, company, companyUrl, career, biography} = req.body;
  
  let profileImage;
  let backgroundImage;

  try {
      const user = await Profiles.findOne({ where: { profileCode }, include: { model: Users } });

      if (req.files && req.files.profileImage && req.files.profileImage[0]) {
        profileImage = req.files.profileImage[0].path;
      } else {
        profileImage = user.profileImage; 
      }

      if (req.files && req.files.backgroundImage && req.files.backgroundImage[0]) {
        backgroundImage = req.files.backgroundImage[0].path;
      } else {
        backgroundImage = user.backgroundImage; 
      }

      await Profiles.update(
        { title, name, surname, phone : phone != user.phone ? "+90" + phone : user.phone , whatsapp:whatsapp != user.whatsapp ? "+90" + whatsapp : user.whatsapp , profileImage, backgroundImage, company, companyUrl, career,biography },
        { where: { profileCode } }
      );

      try {
        fs.unlinkSync(user.vCardPath);  
      } catch (err) {
        console.error("VCard silinemedi:", err);
      }
      
      //VCARD
      const vCardContent = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${name} ${surname}`,
        `TEL:${phone}`,
        "END:VCARD"
      ].join("\n"); // Dizi elemanlarını birleştirirken her satırda boşluk olmayacak
      
      const vCardPath = path.join(__dirname,"..","public","assets","contact",`${user.profileCode}.vcf`);
      fs.writeFileSync(vCardPath, vCardContent);
      user.vCardPath = `/static/assets/contact/${user.profileCode}.vcf`;
      await user.save();

      try {
        fs.unlinkSync(user.qrCodePath);  
      } catch (err) {
        console.error("qrCode silinemedi:", err);
      }
      
      //QRCODE
      const qrText = `${req.protocol}://${req.get("host")}/tag/${user.slug}`;
      const qrCodePath = path.join(__dirname, '..', 'public', 'assets', 'qrcodes', `${user.profileCode}.png`);
      await QRCode.toFile(qrCodePath, qrText);
      user.qrCodePath = `/static/assets/qrcodes/${user.profileCode}.png`;
      await user.save();


      if (req.session.roles.includes("Admin")) {
        res.redirect(`/admin/customer-details/${user.user.id}`);
      } else if (req.session.roles.includes("Müşteri")) {
        return res.redirect(`/dashboard/my-account`);
      } else {
        return res.status(403).send("Yetkisiz İşlem");
      }
  } catch (error) {
      console.error(error);
      res.status(500).send("Sunucu hatası");
  }
};

exports.get_profile_details = async (req, res) => {
  const { profileCode } = req.params;
  try {
      const profile = await Profiles.findOne({
          where: { profileCode },
          include: [
              {
                  model: Sections,
                  include: Details,
              },
              {
                model:Users
              },
              {
                model:Buttons
              }
          ],
      });

      if (!profile) {
          return res.status(404).render('404', { message: 'Profil bulunamadı!' });
      }

      res.render('admin/profile-details', {
        title: "Profil Detay",
        profile
      });
  } catch (error) {
      console.error(error);
      res.status(500).send('Sunucu hatası');
  }
};

//profil sil
exports.delete_profile = async (req, res) => {
  const { profileCode } = req.params;
  const userCode = req.session.userCode;
  try {

    const profile = await Profiles.findOne({ where: { profileCode } });

    if (!profile) {
      req.session.message = { type: 'danger', text: 'Profil bulunamadı.' };
      return res.redirect('back'); 
    }

   
    await profile.destroy();
    deleteFile(profile.profileImage);
    deleteFile(profile.backgroundImage);
    deleteFile(profile.qrCodePath);
    deleteFile(profile.vCardPath);
    req.session.message = { type: 'success', text: 'Profil başarıyla silindi.' };
    res.redirect(`back`);
  } catch (err) {
    console.error(err);
    req.session.message = { type: 'danger', text: 'Profil silinirken bir hata oluştu.' };
    res.redirect('back'); 
  }
};