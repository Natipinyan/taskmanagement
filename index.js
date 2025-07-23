const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const { db_pool } = require('./db');
const path = require('path');
const cookieParser = require('cookie-parser');
global.jwt = require('jsonwebtoken');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

db_pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the database!');
        connection.release();
    }
});

const user_Mid = require('./middleware/user_Mid');
app.get('/', user_Mid.isLogged, (req, res) => {
    res.render('main');
});

const systemLog = require('./routers/system');
app.use('/systemLog', systemLog);

const users = require('./routers/usersRTR');
app.use('/users', users);

const categories = require('./routers/categoryRTR');
app.use('/categories', categories);

const tasks = require('./routers/tasksRTR');
app.use('/tasks', tasks);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));