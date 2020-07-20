const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./DB/database");
const chalk = require('chalk');
const CategoriesController = require("./categories/CategoryController");
const ArticlesController = require("./articles/ArticlesController");
const Article = require('./articles/Article');
const Category = require("./categories/Category");
const router = require("./categories/CategoryController");


//engine de construção de pagina
app.set("view engine","ejs");
//parser de Json para pagina
app.use(bodyParser.urlencoded({extend:false}));

app.use(bodyParser.json());

//node esta usando a pagina public para acessar css e Js de front-end
app.use(express.static("public"));

//conexão com banco de dados
connection.authenticate().then(()=>{
    console.log("Conexção feita com sucesso")
}).catch((error)=>{
    console.log("erro:",error)
})
//Rotas
app.use("/",CategoriesController);
app.use("/",ArticlesController);

//rota principal, chamando o index
app.get("/", (req,res)=>{
    Article.findAll({
        order:[["id","DESC"]],
        limit:4
    
    }).then(artigos=>{
        Category.findAll().then(categorias=>{
            res.render("index",{artigos:artigos, categorias:categorias});

        })


        })
    
});



app.get("/:slug",(req,res)=>{
    var slug = req.params.slug;
    Article.findOne({
        where:{
            slug:slug
        },
    }).then(artigo=>{
        if(artigo != undefined){
           Category.findAll().then(categorias=>{
                res.render("pgartigo",{artigo:artigo, categorias:categorias});
    
            })
    
        }else{
            res.redirect("/");
        }

    }).catch(err=>{
        res.redirect("/")
    })
})





app.listen(2700, ()=>{
    console.log("servidor Rodando");
})