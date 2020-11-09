const { dbFindUser } = require("../db/check_user");
const { v4: uuidv4 } = require("uuid");

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
    for(let i in userList){
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
        throw {message: error.message};
    }
    
    if(!userFromDb){
        return false;
    }

    addUser(userFromDb);

    return {
        id: userFromDb.id,
        auth_id: userFromDb.auth_id,
        type_id: userFromDb.type_id,
    };
}

function addUser(user){
    userList.push({
        id: user.id,
        auth_id: user.auth_id,
        type_id: user.type_id,
        password: user.password,
        key: uuidv4(),
    });
}

function findTokenKey(id){
    for(let i of userList){
        if(i.id==id){
            return i.key;
        }
    }
    return "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed";
}

function addToBlackList(token){
    blackListToken.push(token);
}

function checkBlackList(token){
    return blackListToken.includes(token);
}

function updateKey(data){
    for(let i of userList){
        if(i.id==data.id){
            i.key = uuidv4();
            return;
        }
    }
}

module.exports.userList = userList;
module.exports.findUser = findUser;
// module.exports.addUser = addUser;
module.exports.findTokenKey = findTokenKey;
module.exports.addToBlackList = addToBlackList;
module.exports.checkBlackList = checkBlackList;
module.exports.updateKey = updateKey;