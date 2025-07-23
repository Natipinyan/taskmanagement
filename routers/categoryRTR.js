const express = require('express');
const router = express.Router();
const user_Mid = require('../middleware/user_Mid');
const categories_Mid = require('../middleware/category_Mid');

router.get('/Add', user_Mid.isLogged, (req, res) => {
    res.render('categories_add.ejs', {
        data: {
            user: req.user_id,
        },
    });
});

router.post('/Add', user_Mid.isLogged, categories_Mid.AddCategories, (req, res) => {
    res.redirect('/categories/List');
});

router.get('/Edit/:id', user_Mid.isLogged, categories_Mid.GetOneCategory, (req, res) => {
    if (req.GoodOne) {
        res.render('categories_add.ejs', {
            data: req.one_Category_data,
        });
    } else {
        res.redirect('/categories/List');
    }
});

router.post('/Edit/:id', user_Mid.isLogged, categories_Mid.UpdateCategories, (req, res) => {
    res.redirect('/categories/List');
});

router.get('/List', user_Mid.isLogged, categories_Mid.GetAllCategories, (req, res) => {
    res.render('categories_list', {
        page_title: "קטגוריות",
        categories: req.categories_data,
        page: req.page,
        total_pages: req.total_pages,
        user: req.user_id,
    });
});

router.post('/Delete', categories_Mid.DeleteCategory, (req, res) => {
    res.redirect('/categories/List');
});

module.exports = router;