const userList = [];
const blackListToken = [];

/*
[{
    id: 1,
    type_id: "phone"|"mail",
    auth_id: "+123 45 678 90 12"|"user@mail.com",
    password: md5(md5()),
    token: "secret key",
}]
*/

function addUserToRamDb(user){
    userList.push({
        id: user.id,
        auth_id: user.auth_id,
        type_id: user.type_id,
        password: user.password,
        key: user.token,
    });
}

function addToBlackList(token){
    blackListToken.push(token);
}

function checkBlackList(token){
    return blackListToken.includes(token);
}


module.exports.userList = userList;
module.exports.addToBlackList = addToBlackList;
module.exports.checkBlackList = checkBlackList;
module.exports.addUserToRamDb = addUserToRamDb;