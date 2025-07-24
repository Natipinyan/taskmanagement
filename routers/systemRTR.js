const express = require('express');
const router = express.Router();
const user_Mid = require('../middleware/user_Mid');

router.get('/login', (req, res) => {
    res.render('login', {});
});

router.post('/login', user_Mid.CheckLogin, (req, res) => {});

router.get('/logout', user_Mid.LogoutUser, (req, res) => {
    res.redirect('/systemLog/login');
});


module.exports = router;