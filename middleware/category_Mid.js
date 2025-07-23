const addSlashes = require('slashes').addSlashes;

async function AddCategories(req, res, next) {
    let name = addSlashes(req.body.name);
    let user = req.body.user;
    let Query = `INSERT INTO categories( name,user_id) VALUES ('${name}','${user}')`;
    console.log(`Query=${Query}`);
    const promisePool = db_pool.promise();
    let rows = [];
    try {
        [rows] = await promisePool.query(Query);
    } catch (err) {
        console.log(err);
    }
    next();
}

async function UpdateCategories(req, res, next) {
    let id = parseInt(req.params.id);
    let name = addSlashes(req.body.name);
    let user = req.user_id;
    if (id <= 0) {
        req.GoodOne = false;
        return next();
    }
    req.GoodOne = true;
    let Query = `UPDATE categories SET name='${name}' WHERE id='${id}' AND user_id='${user}'`;
    const promisePool = db_pool.promise();
    let rows = [];
    try {
        [rows] = await promisePool.query(Query);
    } catch (err) {
        console.log(err);
    }
    next();
}

async function GetAllCategories(req, res, next) {
    const id = req.user_id;
    const promisePool = db_pool.promise();

    try {
        const [rows] = await promisePool.query(
            `SELECT * FROM categories WHERE user_id = ?`, [id]
        );
        req.categories_data = rows;
    } catch (err) {
        console.log(err);
        req.categories_data = [];
    }

    next();
}

async function GetOneCategory(req, res, next) {
    let id = parseInt(req.params.id);
    let user = req.user_id;
    if ((id === NaN) || (id <= 0)) {
        req.GoodOne = false;
        return next();
    }
    req.GoodOne = true;
    let Query = `SELECT * FROM categories WHERE id='${id}' AND user_id='${user}'`;
    const promisePool = db_pool.promise();
    let rows = [];
    req.one_Category_data = [];
    try {
        [rows] = await promisePool.query(Query);
        if (rows.length > 0) {
            req.one_Category_data = rows[0];
        }
    } catch (err) {
        console.log(err);
    }
    next();
}

async function DeleteCategory(req, res, next) {
    let id = parseInt(req.body.id);
    if (id > 0) {
        let Query = `DELETE FROM categories WHERE id='${id}'`;
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

module.exports = {
    AddCategories,
    GetAllCategories,
    GetOneCategory,
    DeleteCategory,
    UpdateCategories,
};