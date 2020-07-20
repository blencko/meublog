const express = require("express");
const router = express.Router();
const Category = require('./Category');
const Slugify = require("slugify");

router.post("/categories/save", (req,res)=>{
    var titulo =req.body.titulo;
    if(titulo !=undefined){
        Category.create({
            titulo:titulo,
            slug:Slugify(titulo)
        }).then(()=>{res.redirect("/admin/categories")})
    }else{
       res.redirect('/admin/categories/new'); 
    }

});


router.get("/admin/categories/new", (req,res)=>{
    res.render("./admin/categories/new");
});

router.get("/admin/categories", (req,res)=>{
    Category.findAll().then(categories=>{
        res.render("./admin/categories/index.ejs",{categories:categories})
    });
    
});

router.post("/categories/delete", (req,res)=>{
    var id = req.body.id;
    
    if(id!=undefined){

        if(!isNaN(id)){
            Category.destroy({where:{
                id:id
            }}).then(()=>{res.redirect('/admin/categories')});

        }else{
            res.redirect('/admin/categories');
        }
    }else{
        res.redirect('/admin/categories');
    }


    
    
});


router.get("/admin/categories/editor/:id",(req,res)=>{
    var id = req.params.id;
   
    if(isNaN(id)){
        res.redirect('/admin/categories');
    }

    Category.findByPk(id).then(categoria=>{

        if(categoria!=undefined){
            res.render("./admin/categories/editor",{categoria:categoria});

        }else{
            res.redirect('/admin/categories');
        }
    }).catch(erro=>{
        res.redirect('/admin/categories');
    })
})
router.post("/categories/update",(req,res)=>{
    var id = req.body.id;
    var titulo = req.body.titulo;
    Category.update(
        {
            titulo:titulo,
            slug:Slugify(titulo)
        },
        {
            where:{id:id}
        }
        ).then(()=>{
        res.redirect('/admin/categories');
    })

   
})




module.exports =router;