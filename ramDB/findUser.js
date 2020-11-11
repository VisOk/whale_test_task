const { dbFindUser, dbCheckLogin } = require("../db/check_user");
const { addUserToRamDb, userList } = require("./init");


async function findUser(user){
    for(let i of userList){
        if(i.auth_id==user.login && i.password==user.password){
            return {
                id: i.id,
                auth_id: i.auth_id,
                type_id: i.type_id,
            };
        }
    }
    
    let userFromDb;
    try{
        userFromDb = await dbFindUser(user);
    }
    catch (error){
        throw error;
    }
    
    if(!userFromDb){
        return false;
    }

    addUserToRamDb(userFromDb);

    return {
        id: userFromDb.id,
        auth_id: userFromDb.auth_id,
        type_id: userFromDb.type_id,
    };
}

async function findLogin(login){
    for(let i of userList){
        if(i.auth_id==login){
            return true;
        }
    }

    try{
        return await dbCheckLogin(login);
    }
    catch (e){
        throw e;
    } 
}

module.exports.findUser = findUser;
module.exports.findLogin = findLogin;