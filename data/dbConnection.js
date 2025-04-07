const { Sequelize } = require('sequelize');
const config = require("../config");

const sequelize = new Sequelize(config.db.database,config.db.user,config.db.password,{
    host: config.db.host,
    dialect: "mysql",
    timezone: '+03:00',
});


const connection = async () =>{

    try {
        await sequelize.authenticate();
        console.log(config.db.database, "veritabanına bağlandı.");
    } 
    catch (error) {
        console.error('Veritabanı bağlantı hatası', error.message);
    }
}
  
connection();

module.exports = sequelize;