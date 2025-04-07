const sequelize = require("../data/dbConnection");
const {DataTypes} = require("sequelize");

const Details = sequelize.define("details",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    detailCode:{
        type:DataTypes.STRING,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    value:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    url:{
        type:DataTypes.STRING,
        defaultValue: "#"
    },
})

module.exports = Details;