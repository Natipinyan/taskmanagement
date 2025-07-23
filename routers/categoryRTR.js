const express = require('express');
const router = express.Router();


const categories_Mid = require("../middleware/category_Mid");


router.get("/Add",(req,res)=>{
    res.render('categories_add.ejs',{
        data:{},
    });
});

router.post("/Add", categories_Mid.AddCategories, (req, res) => {
    res.redirect("/categories/List");
});
router.get("/Edit/:id",categories_Mid.GetOneCategory,(req,res)=>{
    if(req.GoodOne) {
        res.render("categories_add.ejs", {
            data: req.one_Category_data,
        });
    } else{
        res.redirect("/categories/List");
    }
});
router.post("/Edit/:id", categories_Mid.UpdateCategories, (req, res) => {
    res.redirect("/categories/List");
});
router.get("/List", categories_Mid.GetAllCategories, (req, res) => {
    res.render("categories_list", {
        page_title: "רשימת הקורסים",
        categories: req.categories_data,
        page: req.page,
        total_pages: req.total_pages,
    });
});

router.post("/Delete",categories_Mid.DeleteCategory,(req,res)=>{
    res.redirect("/categories/List");
})


module.exports = router;