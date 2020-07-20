const Sequelize = require("sequelize");
const connection = require("../DB/database");
const Category = require("../categories/Category");

//o metodo defin
const Article = connection.define('artigo',{
    titulo:{
        type:Sequelize.STRING,
        allowNull:false,
    },slug:{
        type:Sequelize.STRING,
        allowNull:false
    },
    autor:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    descricao:{
        type:Sequelize.TEXT,
        allowNull:false
    },    
    body:{
        type:Sequelize.TEXT,
        allowNull:false
    }
})

//1-p-M um para muitos
Category.hasMany(Article);

//meu artigo pertence a uma categoria
//relacionamento 1-p-1
Article.belongsTo(Category);
//sync com o banco de dados




module.exports= Article;