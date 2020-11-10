const pool = require("./connect");

async function addUserDb(user){
    const insertUser = {
        text: `INSERT INTO public."Users"(
            auth_id, type_id, password, token, create_date, last_signin)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
        values: [user.auth_id, user.type_id, user.password, user.token, user.create_date, user.last_signin],
    }
    return await pool.query(insertUser)
    .then(res => {
        console.log(res.rows[0]);
        return res.rows[0];
    })
    .catch(err => {
        throw {message: "SQL error: " + err}
        // return {error: "SQL error: " + err,};
    })
}

module.exports = addUserDb;