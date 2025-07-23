const jwt = require('jsonwebtoken');
let md5 = require('md5');

const addSlashes    = require('slashes').addSlashes;
const stripSlashes  = require('slashes').stripSlashes;



async function isLogged(req, res,next){
    const jwtToken = req.cookies.ImLogged;
    if (jwtToken === undefined)
        return res.redirect("/systemLog/login")
    let user_id=-1;
    if (jwtToken !== "") {
        jwt.verify(jwtToken, 'myPrivateKey', async (err, decodedToken) => {
            if (err) {
                console.log("err=",err);
            } else {
                let data = decodedToken.data;
                user_id = data.split(",")[0];
                req.user_id=user_id;
            }
        })
    }
    if(user_id < 0)
        res.redirect("/systemLog/login");
    next();
}
async function CheckLogin(req, res,next) {
    let uname   = (req.body.uname  !== undefined) ? addSlashes(req.body.uname     ) : "";
    let passwd  = (req.body.passwd !== undefined) ?            req.body.passwd      : "";
    let enc_pass = md5("A"+passwd);
    let Query = `SELECT * FROM users WHERE uname = '${uname}' AND passwd = '${enc_pass}'`;

    const promisePool = db_pool.promise();
    let rows=[];
    try {
        [rows] = await promisePool.query(Query);
    } catch (err) {
        console.log(err);
    }

    if(rows.length > 0){
        req.validUser = true;
        let val = `${rows[0].id},${rows[0].name}`;
        var token = jwt.sign(
            {data: val},
            'myPrivateKey',
            { expiresIn: 31*24*60*60 // in sec
            });
        res.cookie("ImLogged", token, {
            maxAge: 31*24*60*60 * 1000, // 3hrs in ms
        });
        res.render("main")
    }
    else  {
        req.validUser = false;
        res.render("login", {error: "Invalid username or password"});
    }

    next();
}
async function AddUser(req,res,next){
    let name    = (req.body.name   !== undefined) ? addSlashes(req.body.name      ) : "";
    let uname   = (req.body.uname  !== undefined) ? addSlashes(req.body.uname     ) : "";
    let passwd  = (req.body.passwd !== undefined) ?            req.body.passwd      : "";
    let enc_pass = md5("A"+passwd);
    let email   = (req.body.email  !== undefined) ? addSlashes(req.body.email     ) : "";
    console.log(`name=${name}, uname=${uname}, passwd=${passwd}, email=${email}`);
    let Query="INSERT INTO users";
    Query +="( `name`, `uname`, `passwd`, `email`)";
    Query +=" VALUES ";
    Query +=`( '${name}', '${uname}', '${enc_pass}', '${email}' )`;
    const promisePool = db_pool.promise();
    let rows=[];
    try {
        [rows] = await promisePool.query(Query);
    } catch (err) {
        console.log(err);
    }

    next();
}
async function UpdateUser(req,res,next){
    let id = parseInt(req.params.id);
    let name    = (req.body.name   !== undefined) ? addSlashes(req.body.name      ) : "";
    let uname   = (req.body.uname  !== undefined) ? addSlashes(req.body.uname     ) : "";
    // let passwd  = (req.body.passwd !== undefined) ? addSlashes(req.body.passwd    ) : "";
    let email   = (req.body.email  !== undefined) ? addSlashes(req.body.email     ) : "";
    let type_id = (req.body.type_id!== undefined) ?     Number(req.body.type_id   ) : -1;
    let tz      = (req.body.tz     !== undefined) ? addSlashes(req.body.tz        ) : "";
    if(id <= 0){
        req.GoodOne=false;
        return next();
    }
    req.GoodOne=true;

    let Query=`UPDATE users SET `;
    Query +=`name   ='${name   }' ,`;
    Query +=`uname  ='${uname  }' ,`;
    // Query +=`passwd ='${passwd }' ,`;
    Query +=`email  ='${email  }' ,`;
    Query +=`type_id='${type_id}' ,`;
    Query +=`tz     ='${tz     }'  `;
    Query +=` WHERE id='${id}'`;
    const promisePool = db_pool.promise();
    let rows=[];
    try {
        [rows] = await promisePool.query(Query);
    } catch (err) {
        console.log(err);
    }

    next();
}
async function GetAllUsers(req,res,next){
    let page=0;
    let rowPerPage=2;
    if(req.query.p !== undefined){
        page=parseInt(req.query.p);
    }
    req.page = page;

    let rows=[];
    //--- count pages---
    let Query = "SELECT COUNT(id) AS cnt FROM users";
    const promisePool = db_pool.promise();
    let total_rows=0;
    try {
        [rows] = await promisePool.query(Query);
        total_rows=rows[0].cnt;
    } catch (err) {
        console.log(err);
    }
    req.total_pages = Math.floor(total_rows/rowPerPage);
    //--- get current page ---
    Query="SELECT * FROM users";
    Query += ` LIMIT ${page*rowPerPage},${rowPerPage} `;
    req.users_data=[];
    try {
        [rows] = await promisePool.query(Query);
        req.users_data=rows;
    } catch (err) {
        console.log(err);
    }

    next();
}
async function DeleteUser(req,res,next){
    let id = parseInt(req.body.id);
    console.log(`DeleteUser id=${id}`);
    if(id > 0) {
        let Query = `DELETE FROM users WHERE id='${id}' `;
        const promisePool = db_pool.promise();
        let rows = [];
        try {
            [rows] = await promisePool.query(Query);
        } catch (err) {
            console.log(err);
        }
    }

    next();

}
async function GetOneUser(req, res, next) {
    let id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
        req.GoodOne = false;
        return next();
    }

    req.GoodOne = true;

    let Query = `SELECT * FROM users WHERE id=${id}`;
    const promisePool = db_pool.promise();

    try {
        const [rows] = await promisePool.query(Query);
        req.one_user_data = rows.length > 0 ? rows[0] : {};
    } catch (err) {
        console.log(err);
    }

    next();
}

module.exports = {
    AddUser,
    GetAllUsers,
    DeleteUser,
    UpdateUser,
    CheckLogin,
    isLogged,
    GetOneUser,
}