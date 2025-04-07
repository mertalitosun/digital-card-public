const sequelize = require("../data/dbConnection");
const {DataTypes} = require("sequelize");

const Cards = sequelize.define("cards",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    cardCode:{
        type:DataTypes.STRING,
        allowNull:false
    },
    isActive:{
        type:DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    cardType:{
        type:DataTypes.STRING,
        allowNull:false
    }
})

module.exports = Cards;