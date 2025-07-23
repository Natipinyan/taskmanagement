const addSlashes = require('slashes').addSlashes;

async function AddTasks(req, res, next) {
    let user = req.user_id;
    let description = req.body.description;
    let date = req.body.date;
    let category = req.body.category_id;
    let Query = "INSERT INTO tasks (user_id, category_id, description, date) VALUES (?, ?, ?, ?)";
    const promisePool = db_pool.promise();
    try {
        await promisePool.query(Query, [user, category, description, date]);
    } catch (err) {
        console.log(err);
    }
    next();
}

async function UpdateTask(req, res, next) {
    let id = parseInt(req.params.id);
    let user = req.user_id;
    let description = addSlashes(req.body.description);
    let date = addSlashes(req.body.date);
    if (id <= 0) {
        req.GoodOne = false;
        return next();
    }
    req.GoodOne = true;
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
    const promisePool = db_pool.promise();
    const user_id = req.user_id;
    const rowPerPage = 10;
    const page = parseInt(req.query.p || "0");
    const status = req.query.status || "all";
    const category = req.query.category || "all";
    req.page = page;
    req.filters = { status, category };
    let conditions = [`tasks.user_id = ?`];
    let params = [user_id];
    if (status === "completed") {
        conditions.push(`tasks.done = 1`);
    } else if (status === "pending") {
        conditions.push(`tasks.done = 0`);
    }
    if (category !== "all") {
        conditions.push(`tasks.category_id = ?`);
        params.push(category);
    }
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : "";
    try {
        const [countRows] = await promisePool.query(
            `SELECT COUNT(tasks.id) AS cnt FROM tasks ${whereClause}`, params
        );
        const total_rows = countRows[0].cnt;
        req.total_pages = Math.ceil(total_rows / rowPerPage);
        const [rows] = await promisePool.query(
            `SELECT tasks.*, categories.name AS category_name FROM tasks LEFT JOIN categories ON tasks.category_id = categories.id ${whereClause} ORDER BY tasks.date ASC LIMIT ?, ?`,
            [...params, page * rowPerPage, rowPerPage]
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

async function ToggleTaskDone(req, res, next) {
    const id = parseInt(req.params.id);
    const user = req.user_id;
    if (isNaN(id) || id <= 0) return next();
    const promisePool = db_pool.promise();
    try {
        const [rows] = await promisePool.query(
            `SELECT done FROM tasks WHERE id = ? AND user_id = ?`, [id, user]
        );
        if (rows.length === 0) return next();
        const currentStatus = rows[0].done;
        const newStatus = currentStatus ? 0 : 1;
        await promisePool.query(
            `UPDATE tasks SET done = ? WHERE id = ? AND user_id = ?`,
            [newStatus, id, user]
        );
    } catch (err) {
        console.log(err);
    }
    next();
}

module.exports = {
    AddTasks,
    GetAllTasks,
    GetOneTask,
    DeleteTask,
    UpdateTask,
    ToggleTaskDone,
};
