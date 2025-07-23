const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const {db_pool}  = require('./db');
const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "./views"));
app.use(express.urlencoded({ extended: false }));


let cookieParser = require('cookie-parser');
app.use(cookieParser());
global.jwt = require('jsonwebtoken');

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
})

const systemLog = require("./routers/system");

app.use("/systemLog", systemLog);

const users = require('./routers/usersRTR');
app.use('/users',users);

const categories = require('./routers/categoryRTR');
app.use('/categories', categories);


app.listen(port, () => console.log(`Example app listening on port ${port}!`));