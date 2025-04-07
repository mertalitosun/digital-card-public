const sequelize = require("../data/dbConnection")
const {DataTypes} = require("sequelize");

const Buttons = sequelize.define("buttons",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true
    },
    buttonCode:{
        type:DataTypes.STRING,
        allowNull:false
    },
    text:{
        type:DataTypes.STRING,
        allowNull: false
    },
    url:{
        type:DataTypes.STRING,
        allowNull: false
    },
    color:{
        type:DataTypes.STRING,
        allowNull: false,
        defaultValue: "#6f6d69"
    }
},{
    timestamps:false
})

module.exports = Buttons;