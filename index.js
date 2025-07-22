const port = 7070;
const express = require('express');
const app = express();
app.use(express.json());

require('dotenv').config();


const bodyParser = require('body-parser');
const path = require("path");
app.use(bodyParser.urlencoded({extended: false}));


app.listen(port, () => {
    console.log(`Now listening on port http://localhost:${port}`);
});

const { db_pool } = require('./db');

db_pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the database!');
        connection.release();
    }
});



app.get('/', (req, res) => {
    res.render("login", {});
})