const Users = require("../models/users");
const Roles = require("../models/roles");
const Profiles = require("../models/profiles");
const Cards = require("../models/cards");
const crypto = require("crypto");
const randomId = (code) => {
    id = crypto.randomBytes(4).toString("hex").toUpperCase();

    return code + id
};


exports.admin_panel = async (req,res) => {

  try{
    const totalCustomers = await Users.count();
    const totalCards = await Cards.count();
    const activeTotalCards = await Cards.count({where:{isActive:true}});
    const inActiveTotalCards = await Cards.count({where:{isActive:false}});
    const totalProfiles = await Profiles.count();

    res.render("admin/panel",{
      title: "Admin Panel",
      totalCustomers,
      totalCards,
      activeTotalCards,
      inActiveTotalCards,
      totalProfiles
    })
  }catch(err){
    console.log(err);
    return res.status(500).render("errors/500",{
      title: "Sunucu Hatası"
    });
  }
}

exports.delete_cards = async (req,res) => {
  const {cardCode} = req.query;
  const isAdmin = req.session.isAdmin;
  try{
    const card = await Cards.findOne({where:{cardCode}});

    if(!card){
      return res.render("admin/cards",{
        title: "Kartlar",
        message: {type:"danger", text: "Kart Bulunamadı"}
      });
    }
    if(!isAdmin){
      return res.status(403).render("errors/403",{
        title:"Yetkisiz İşlem"
      })
    }
    await card.destroy();
    res.status(200).json("Silme işlemi başarılı");
  }catch(err){
    console.log(err);
    res.status(500).render("error", {
      error: "Kart silinirken bir hata oluştu.",
      msg: err.message,
    });
  }
}
exports.generate_cardCode = (req,res)=>{
  const generateCardCode = randomId("INF");
  res.status(200).json({success:true, generatedCardCode:generateCardCode })
}
exports.post_create_card = async (req, res) => {
  const { cardCode,cardType } = req.body; 
  try {

    // Kart zaten varsa, hatalı durumu kontrol et
    const existingCard = await Cards.findOne({ where: { cardCode } });
    if (existingCard) {
      req.flash('message', { type: 'danger', text: 'Bu Kart Kodu Zaten Mevcut.' });
      return res.redirect('/admin/create-card'); 
    }

    // Yeni Kartı Oluştur
    const newCard = await Cards.create({
      cardCode: cardCode,
      cardType: cardType,
      isActive: false, // Kart başlangıçta aktif değil
    });

    // Kart başarıyla eklendiğinde, yönlendirme yap
    res.redirect("/admin/cards"); // Kartlar sayfasına yönlendirilebilir
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      error: "Kart eklenirken bir hata oluştu.",
      msg: error.message,
    });
  }
};
exports.get_create_card = async (req,res) => {
  try{
    res.render("admin/create-card",{
      title:"Kart Ekle", 
    })
  }catch(error){
    console.error(error);
    res.status(500).render("error", {
      error: "Sayfa yüklenirken bir hata oluştu.",
      msg: error.message,
    });
  }
}
exports.get_cards = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const totalCards = await Cards.count();
    const totalPages = Math.ceil(totalCards / limit);

    const cards = await Cards.findAll({include:[{model:Profiles},{model:Users}],limit,offset});

    res.render("admin/cards", {
      title: "Kartlar",
      cards,
      currentPage: page,
      totalPages,
      totalCards
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", { error: "Veri alınırken bir hata oluştu", msg: error.message });
  }
};
exports.get_customer_details = async (req,res) =>{
  const {userId} = req.params;
  try{

    const customer = await Users.findByPk(userId,{
      include:[
        {
          model:Profiles 
        },
        {
          model:Cards,
          include:Profiles
        }
      ]
    });

    const totalCards = customer.cards.length;
    customer.digital_card_max_profiles = totalCards + 1;
    customer.save();
    res.render("admin/customer-details",{
      title: `${customer.name} ${customer.surname} || Detay Sayfası`,
      customer,
    })
  }catch(err){
    console.log(err)
    res.status(500).render("admin/customer-details",{title: `${customer.name} ${customer.surname} || Detay Sayfası`,
    customer,
    err: "Veri alınırken bir hata oluştu",
    msg:err.message});
  }
}
exports.get_customers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const totalUsers = await Users.count();
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await Users.findAll({
      attributes: ['id', 'name', 'surname', 'userCode',"email"],
      include:[{model:Cards},{model:Profiles},{model:Roles}]
      ,limit,offset
    });
    // 2. Tüm profilleri al
    const profiles = await Profiles.findAll({
      attributes: ['userId'],
      raw: true,
    });

    // 3. Tüm kartları al
    const cards = await Cards.findAll({
      attributes: ['userId'],
      raw: true,
    });

    // 4. Kullanıcıya ait profil sayısını hesapla
    users.forEach(user => {
      user.profileCount = profiles.filter(profile => profile.userId === user.id).length;
      user.cardCount = cards.filter(card => card.userId === user.id).length;
    });
    res.render("admin/customers", {
      title: "Müşteriler",
      users,
      currentPage: page,
      totalPages,
      totalUsers
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", { error: "Veri alınırken bir hata oluştu", msg: error.message });
  }
};


