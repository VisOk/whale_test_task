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
            // return {error: "SQL error: " + err,};
        })
}

async function dbCheckLogin(login){
    const selectLogin = {
        text: `SELECT * FROM "Users" where auth_id=$1`,
        values: [login],
    }
    return await pool.query(selectLogin)
        .then(res => {
            return res.rows[0] ? true : false;
        })
        .catch(err => {
            throw {message: "SQL error: " + err}
            // return {error: "SQL error: " + err,};
        })
}

module.exports.dbFindUser = dbFindUser;
module.exports.dbCheckLogin = dbCheckLogin;