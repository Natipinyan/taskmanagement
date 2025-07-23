const express = require('express');
const router = express.Router();
const user_Mid = require('../middleware/user_Mid');

router.get('/register', (req, res) => {
    res.render('register', {});
});

router.post('/register', user_Mid.AddUser, (req, res) => {});

router.get('/login', (req, res) => {
    res.render('login', {});
});

router.post('/login', user_Mid.CheckLogin, (req, res) => {});

module.exports = router;