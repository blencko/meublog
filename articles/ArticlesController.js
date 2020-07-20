const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const Slugfy = require("slugify");


router.get("/admin/articles", (req,res)=>{
    Article.findAll({include:[{
        model:Category
    }]}).then(artigos=>{
        res.render("admin/articles/index",{arigos:artigos});
    })
   
});

router.post("/articles/save", (req,res)=>{
    var titulo = req.body.titulo;
    var autor = req.body.autor;
    var descricao = req.body.descricao;
    var texto = req.body.texto;
    var categoria =req.body.categoria;

    Article.create({
        titulo:titulo,
        slug:Slugfy(titulo),
        autor:autor,
        descricao:descricao,
        categoriaId:categoria,
        body:texto
    }).then(()=>{
        res.redirect("/admin/articles");
    })


});


router.get("/admin/articles/new", (req,res)=>{
    Category.findAll().then(categorias=>{
        res.render("admin/articles/new",{categorias:categorias});
    })
    
});

router.get("/admin/articles/edit/:id",(req,res)=>{
    var id = req.params.id;

    Article.findByPk(id).then(artigo=>{
        if(artigo != undefined){
            Category.findAll().then(
                categorias=>{
                    res.render("admin/articles/edit",{categorias:categorias,artigo:artigo});})
            
        }else{
            res.render("/")
        }


    }).catch(err=>{
            res.send("erro: ",err)
        })


})




router.post("/articles/update",(req,res)=>{
   var id = req.body.id
    var titulo = req.body.titulo;
    var autor = req.body.autor;
    var descricao = req.body.descricao;
    var texto = req.body.texto;
    var categoria =req.body.categoria;

    Article.update({
        titulo:titulo,
        slug:Slugfy(titulo),
        autor:autor,
        descricao:descricao,
        categoriaId:categoria,
        body:texto
        },
        {
            where:{id:id}
        }
        ).then(()=>{
        res.redirect('/admin/articles');
    }).catch(err=>{
        console.error(err);
    })

   
})



router.post("/article/delete", (req,res)=>{
    var id = req.body.id;
    
    if(id!=undefined){

        if(!isNaN(id)){
            Article.destroy({where:{
                id:id
            }}).then(()=>{res.redirect('/admin/articles')});

        }else{
            res.redirect('/admin/articles');
        }
    }else{
        res.redirect('/admin/articles');
    }


    
    
});

router.get("/articles/page/:num",(req,res)=>{
    var page = req.params.num;
    var offset = 0;

    if(isNaN(page)|| page==1){
        offset=0;
    }else{
        offset = parseInt(page)*1;
    }
    Article.findAndCountAll({
        order:[["id","DESC"]],
        limit:4,
        offset:offset
    }).then(artigos=>{
        console.log(JSON(artigos));
        var next;
        if(offset + 4 >= artigos.count){
            next = false;
        }else{
            next = true
        }

        var result = {
            next:next,
            artigos:artigos
        }

        Category.findAll().then(categorias=>{
            res.render('admin/articles/page',{result:result,categorias:categorias})
        })


    })

})





module.exports =router;