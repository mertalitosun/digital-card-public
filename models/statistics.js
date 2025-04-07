const sequelize = require("../data/dbConnection");
const {DataTypes} = require("sequelize");

const Statistics = sequelize.define("statistics",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    actionType:{
        type:DataTypes.STRING,
        allowNull:false
    },
})

module.exports = Statistics;