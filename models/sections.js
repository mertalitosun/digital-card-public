const sequelize = require("../data/dbConnection");
const {DataTypes} = require("sequelize");

const Sections = sequelize.define("sections",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    sectionCode:{
        type:DataTypes.STRING,
        allowNull:false
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false
    },
    max_details:{
        type:DataTypes.INTEGER,
        defaultValue: 3,
        allowNull:false
    }
})

module.exports = Sections;