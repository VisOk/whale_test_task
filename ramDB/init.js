const { dbFindUser, dbCheckLogin, findUserById } = require("../db/check_user");
const { updateTokenKeyDb } = require("../db/delete_token");
const { v4: uuidv4 } = require("uuid");
const addUserDb = require("../db/new_user");

const userList = [];
const blackListToken = [];

/*
[{
    id: 1,
    type_id: "phone"|"mail",
    auth_id: "user",
    password: md5(md5()),
    token: "",
}]
*/

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

function addUserToRamDb(user){
    userList.push({
        id: user.id,
        auth_id: user.auth_id,
        type_id: user.type_id,
        password: user.password,
        // key: uuidv4(),
        key: user.token,
    });
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

async function addNewUser(user){
    try{
        let newUser = await addUserDb(user);
        addUserToRamDb(newUser);
        return newUser;
    }
    catch (e){
        throw e;
    }
}

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

function addToBlackList(token){
    blackListToken.push(token);
}

function checkBlackList(token){
    return blackListToken.includes(token);
}

async function updateKey(data){
    let key = uuidv4();
    for(let i of userList){
        if(i.id==data.id){
            i.key = key;
            break;
        }
    }

    try{
        await updateTokenKeyDb({id:data.id, token: key, });
    }
    catch(e){
        throw e;
    }
}

module.exports.userList = userList;
module.exports.findUser = findUser;
// module.exports.addUser = addUser;
module.exports.findTokenKey = findTokenKey;
module.exports.addToBlackList = addToBlackList;
module.exports.checkBlackList = checkBlackList;
module.exports.updateKey = updateKey;
module.exports.findLogin = findLogin;
module.exports.addNewUser = addNewUser;