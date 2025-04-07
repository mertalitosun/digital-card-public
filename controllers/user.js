const Users = require("../models/users");
const Profiles = require("../models/profiles");
const Cards = require("../models/cards");

exports.get_my_account = async (req,res) => {
    const userId = req.session.userId;
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
  
      
      res.render("user/my-accounts",{
        title: `${customer.name} ${customer.surname} || Detay Sayfası`,
        customer
      })
    }catch(err){
      console.log(err)
      res.status(500).render("admin/customer-details",{title: `${customer.name} ${customer.surname} || Detay Sayfası`,
      customer,
      err: "Veri alınırken bir hata oluştu",
      msg:err.message});
    }
}
