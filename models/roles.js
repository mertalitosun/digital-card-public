const sequelize = require("../data/dbConnection")
const {DataTypes} = require("sequelize");

const Roles = sequelize.define("roles",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull: false
    }
},{
    timestamps:false
})

module.exports = Roles;