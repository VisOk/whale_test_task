const pool = require("./connect");

async function updateTokenKeyDb(data){
    const updateToken = {
        text: `UPDATE public."Users" SET token=$1 WHERE id=$2`,
        values: [data.token, data.id],
    }
    return await pool.query(updateToken)
        .then(res => {
            return true;
        })
        .catch(err => {
            throw {message: "SQL error: " + err}
        })
}

module.exports.updateTokenKeyDb = updateTokenKeyDb;