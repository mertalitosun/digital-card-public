const sequelize = require("../data/dbConnection");
const {DataTypes} = require("sequelize");

const Users = sequelize.define("users",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    userCode:{
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
    email:{
        type:DataTypes.STRING,
        allowNull: false
    },
    password:{
        type:DataTypes.STRING,
        allowNull: false
    },
    digital_card_max_profiles:{
        type:DataTypes.INTEGER,
        defaultValue: 2,
        allowNull:false
    },
    vehicle_card_max_profiles:{
        type:DataTypes.INTEGER,
        defaultValue: 2,
        allowNull:false
    },
    pet_card_max_profiles:{
        type:DataTypes.INTEGER,
        defaultValue: 2,
        allowNull:false
    },
    business_card_max_profiles:{
        type:DataTypes.INTEGER,
        defaultValue: 2,
        allowNull:false
    },
})

module.exports = Users;