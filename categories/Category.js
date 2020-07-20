const Sequelize = require("sequelize");
const connection = require("../DB/database");
const Category = connection.define('categorias',{
    titulo:{
        type:Sequelize.STRING,
        allowNull:false,
    },slug:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports= Category;