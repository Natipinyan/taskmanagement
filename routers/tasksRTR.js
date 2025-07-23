const express = require('express');
const router = express.Router();
const user_Mid = require('../middleware/user_Mid');


const tasks_Mid = require("../middleware/tasks_Mid");
const categories_Mid = require("../middleware/category_Mid");


router.get("/Add",user_Mid.isLogged,categories_Mid.GetAllCategories,(req,res)=>{
    res.render('tasks_add.ejs',{
        data:{
            user: req.user_id,
            categories: req.categories_data,
        },
    });
});

router.post("/Add",user_Mid.isLogged,tasks_Mid.AddTasks, (req, res) => {
    res.redirect("/tasks/List");
});


router.get("/Edit/:id", user_Mid.isLogged, categories_Mid.GetAllCategories, tasks_Mid.GetOneTask, (req, res) => {
    if (req.GoodOne) {
        res.render("tasks_add.ejs", {
            data: {
                ...req.one_task_data,
                categories: req.categories_data,
                user: req.user_id
            }
        });
    } else {
        res.redirect("/tasks/List");
    }
});

router.post("/Edit/:id",user_Mid.isLogged, tasks_Mid.UpdateTask, (req, res) => {
    res.redirect("/tasks/List");
});



router.get("/List", user_Mid.isLogged, categories_Mid.GetAllCategories,tasks_Mid.GetAllTasks, (req, res) => {
        res.render("tasks_list", {
            page_title: "רשימת המטלות",
            categories: req.categories_data,
            tasks: req.tasks_data,
            page: req.page,
            total_pages: req.total_pages,
            filters: req.filters,
            user: req.user_id,
        });
    }
);

router.post("/Delete/:id",user_Mid.isLogged,tasks_Mid.DeleteTask,(req,res)=>{
    res.redirect("/tasks/List");
})
router.post("/toggle/:id", user_Mid.isLogged, tasks_Mid.ToggleTaskDone, (req, res) => {
    res.redirect("/tasks/List");
});


module.exports = router;