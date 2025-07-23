
const addSlashes    = require('slashes').addSlashes;
const stripSlashes  = require('slashes').stripSlashes;

async function AddTasks(req,res,next){


    let user = req.user_id;
    let description = req.body.description;
    let date = req.body.date;
    console.log(`user=${user}, description=${description}, date=${date}`);

    let Query=`INSERT INTO tasks(user_id,description,date) VALUES ('${user}','${description}','${date}')`;
    console.log(`Query=${Query}`);
    const promisePool = db_pool.promise();
    let rows=[];
    try {
        [rows] = await promisePool.query(Query);
    } catch (err) {
        console.log(err);
    }

    next();
}



async function UpdateTask(req, res, next) {
    let id = parseInt(req.params.id);
    let user = req.user_id;

    if (id <= 0) {
        req.GoodOne = false;
        return next();
    }
    req.GoodOne = true;

    let description = addSlashes(req.body.description);
    let date = addSlashes(req.body.date);

    let Query = `UPDATE tasks SET description='${description}', date='${date}' WHERE id='${id}' AND user_id='${user}'`;
    const promisePool = db_pool.promise();
    let rows = [];
    try {
        [rows] = await promisePool.query(Query);
    } catch (err) {
        console.log(err);
    }

    next();
}

async function GetAllTasks(req, res, next) {
    let page = 0;
    let rowPerPage = 2;
    let id = req.user_id;

    if (req.query.p !== undefined) {
        page = parseInt(req.query.p);
    }

    req.page = page;

    const promisePool = db_pool.promise();

    try {
        const [countRows] = await promisePool.query("SELECT COUNT(id) AS cnt FROM tasks WHERE user_id = ?", [id]);
        const total_rows = countRows[0].cnt;
        req.total_pages = Math.floor(total_rows / rowPerPage);

        const [rows] = await promisePool.query(
            `SELECT * FROM tasks WHERE user_id = ? LIMIT ?, ?`,
            [id, page * rowPerPage, rowPerPage]
        );
        req.tasks_data = rows;
    } catch (err) {
        console.log(err);
        req.tasks_data = [];
        req.total_pages = 0;
    }

    next();
}

async function GetOneTask(req, res, next) {
    let id = parseInt(req.params.id);
    let user = req.user_id;

    if (isNaN(id) || id <= 0) {
        req.GoodOne = false;
        return next();
    }

    req.GoodOne = true;
    let Query = `SELECT * FROM tasks WHERE id = ? AND user_id = ?`;
    const promisePool = db_pool.promise();
    req.one_task_data = {};

    try {
        const [rows] = await promisePool.query(Query, [id, user]);
        if (rows.length > 0) {
            req.one_task_data = rows[0];
        }
    } catch (err) {
        console.log(err);
    }

    next();
}

async function DeleteTask(req, res, next) {
    let id = parseInt(req.params.id);
    let user = req.user_id;

    if (id > 0) {
        let Query = `DELETE FROM tasks WHERE id = ? AND user_id = ?`;
        console.log(`Query=${Query}, id=${id}, user=${user}`);
        const promisePool = db_pool.promise();
        try {
            await promisePool.query(Query, [id, user]);
        } catch (err) {
            console.log(err);
        }
    }

    next();
}


module.exports = {
    AddTasks,
    GetAllTasks,
    GetOneTask,
    DeleteTask,
    UpdateTask,
}
