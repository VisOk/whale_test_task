const { findUserById } = require("../db/check_user");
const { addUserToRamDb, userList } = require("./init");

async function findTokenKey(id){
    for(let i of userList){
        if(i.id==id){
            return i.key;
        }
    }

    let dbFind;
    try{
        dbFind = await findUserById(id);
    }
    catch (e){
        throw e;
    }

    if(dbFind){
        addUserToRamDb(dbFind);
        return dbFind.token;
    }

    return "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed";
}

module.exports.findTokenKey = findTokenKey;