const sequelize = require("../data/dbConnection");
const {DataTypes} = require("sequelize");

const Profiles = sequelize.define("profiles",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    profileCode:{
        type:DataTypes.STRING,
        allowNull:false
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    surname:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    slug:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    biography:{
        type:DataTypes.STRING(100),
    },
    company:{
        type:DataTypes.STRING,
    },
    companyUrl:{
        type:DataTypes.STRING,
    },
    career:{
        type:DataTypes.STRING,
    },
    backgroundImage:{
        type:DataTypes.STRING,
    },
    profileImage:{
        type:DataTypes.STRING,
    },
    phone:{
        type:DataTypes.STRING,
    },
    whatsapp:{
        type:DataTypes.STRING,
    },
    qrCodePath:{
        type:DataTypes.STRING,
    },
    vCardPath:{
        type:DataTypes.STRING,
    },
    max_special_buttons:{
        type:DataTypes.INTEGER,
        defaultValue: 2,
        allowNull:false
    },
    max_sections:{
        type:DataTypes.INTEGER,
        defaultValue: 2,
        allowNull:false
    },
})

module.exports = Profiles;