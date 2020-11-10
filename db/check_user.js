const pool = require("./connect");

async function dbFindUser(user){
    const selectUserAndPassword = {
        text: `SELECT * FROM "Users" where auth_id=$1 and password=$2`,
        values: [user.login, user.password],
    }
    return await pool.query(selectUserAndPassword)
        .then(res => {
            return res.rows[0];
        })
        .catch(err => {
            throw {message: "SQL error: " + err}
        })
}

//True если логин найден
async function dbCheckLogin(login){
    const selectLogin = {
        text: `SELECT * FROM "Users" where auth_id=$1`,
        values: [login],
    }
    return await pool.query(selectLogin)
        .then(res => {
            return !!res.rows[0];
        })
        .catch(err => {
            throw {message: "SQL error: " + err}
        })
}

async function findUserById(id){
    const selectId = {
        text: `SELECT * FROM "Users" where id=$1`,
        values: [id],
    }
    return await pool.query(selectId)
        .then(res => {
            return res.rows[0];
        })
        .catch(err => {
            throw {message: "SQL error: " + err, errno: 2, }
        })
}

module.exports.dbFindUser = dbFindUser;
module.exports.dbCheckLogin = dbCheckLogin;
module.exports.findUserById = findUserById;