const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const {db_pool}  = require('./db');
const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "./views"));
app.use(express.urlencoded({ extended: false }));

db_pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the database!');
        connection.release();
    }
});





const user_Mid = require('./middleware/user_Mid');

// app.get('/', user_Mid.isLogged, (req, res) => {
//     res.render("login", {});
// })
//


const systemLog = require("./routes/system");

app.use("/systemLog", systemLog);



app.listen(port, () => console.log(`Example app listening on port ${port}!`));