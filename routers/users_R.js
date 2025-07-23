const express = require('express');
const router = express.Router();
module.exports = router;
const user_Mid = require('../middleware/user_Mid');

router.get("/Add", (req, res) => {
    res.render("user_add", {
        data: {},
    });
});
router.post("/Add", user_Mid.AddUser, (req, res) => {
    res.redirect("/Users/List");
});

router.get("/List", user_Mid.GetAllUsers, (req, res) => {
    res.render("user_list", {
        page_title: "רשימת המשתמשים",
        users: req.users_data,
        page  : req.page,
    });
    console.log(req.users_data)
});

router.get("/Edit/:id", user_Mid.GetOneUser, (req, res) => {
    if (req.GoodOne) {
        res.render("user_add", {
            data: req.one_user_data,
        });
    } else {
        res.redirect("/Users/List");
    }
});
router.post("/Edit/:id", user_Mid.UpdateUser, (req, res) => {
    res.redirect("/Users/List");
});

router.post("/Delete", user_Mid.DeleteUser, (req, res) => {
    res.redirect("/Users/List");
});