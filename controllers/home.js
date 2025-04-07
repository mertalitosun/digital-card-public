const path = require("path");


exports.get_digital_business_card = (req,res) => {
    res.render("home/digital-business-card",{
        title: "Dijital İşletme Kart | Infinitetag - Dijital İşletme Kart"
    })
}
exports.get_digital_car_ticket = (req,res) => {
    res.render("home/digital-car-ticket",{
        title: "Dijital Araç Etiketi | Infinitetag - Dijital Araç Etiketi"
    })
}
exports.get_pet_tag = (req,res) => {
    res.render("home/pet-tag",{
        title: "Evcil Hayvan Tag | Infinitetag - Evcil Hayvan Tag"
    })
}
exports.get_dijital_kartvizit = (req,res) => {
    res.render("home/digital-card",{
        title: "Dijital Kartvizit | Infinitetag - Dijital Kartvizit"
    })
}
exports.get_sitemap = async (req, res) => {
    const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');  
    res.sendFile(sitemapPath);
  }
exports.index = async(req,res)=>{
    try{
    res.render("home/index",{
        title:"Dijital Kartvizit | Infinitetag - Dijital Kartvizit",
    })
    }catch(err){
    console.log(err)
    }
}